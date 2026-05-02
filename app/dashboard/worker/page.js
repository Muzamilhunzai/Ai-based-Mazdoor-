"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  onSnapshot,
  collection,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { motion } from "framer-motion";
import {
  ToggleLeft,
  ToggleRight,
  DollarSign,
  CheckCircle,
  Star,
  Briefcase,
  ArrowRight,
  User,
  MapPin,
  Clock,
  Edit,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function WorkerDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const [worker, setWorker] = useState(null);
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    completed: 0,
    earnings: 0,
    rating: 0,
    reviews: 0,
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(doc(db, "workers", user.uid), (snap) => {
      if (snap.exists()) {
        setWorker({ id: snap.id, ...snap.data() });
      } else if (user.isDemo) {
        setWorker(profile);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [user, authLoading, profile]);

  // Combined Stats & Active Jobs Listener
  useEffect(() => {
    if (authLoading || !user) return;

    const q = query(
      collection(db, "jobs"),
      where("workerId", "==", user.uid)
    );
    
    const unsub = onSnapshot(q, (snapshot) => {
      let completedCount = 0;
      let totalEarnings = 0;
      let totalRating = 0;
      let reviewCount = 0;
      let ongoing = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        const jobWithId = { id: doc.id, ...data };

        if (data.status === "completed") {
          completedCount++;
          totalEarnings += Number(data.price || 0);
          if (data.rating) {
            totalRating += data.rating;
            reviewCount++;
          }
        } else if (data.status === "accepted" || data.status === "in_progress") {
          ongoing.push(jobWithId);
        }
      });

      setActiveJobs(ongoing);

      // Combine with worker's base stats from their profile
      setStats({
        completed: (worker?.jobsCompleted || 0) + completedCount,
        earnings: (worker?.totalEarnings || 0) + totalEarnings,
        rating: reviewCount > 0 
          ? ((totalRating + (worker?.rating * worker?.reviewCount || 0)) / (reviewCount + (worker?.reviewCount || 0))).toFixed(1) 
          : worker?.rating || 0,
        reviews: (worker?.reviewCount || 0) + reviewCount,
      });
    }, (error) => {
      console.error("Jobs snapshot error:", error);
    });
    return () => unsub();
  }, [user, authLoading, worker]);

  const toggleOnline = async () => {
    if (!worker) return;
    const newStatus = !worker.isOnline;
    try {
      await setDoc(doc(db, "workers", user.uid), { isOnline: newStatus }, { merge: true });
      toast.success(newStatus ? "You're now online! 🟢" : "You're offline");
    } catch (err) {
      toast.error("Could not update status");
    }
  };

  const handleMarkComplete = async (jobId) => {
    try {
      await setDoc(doc(db, "jobs", jobId), { 
        status: "completed", 
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp() 
      }, { merge: true });
      toast.success("Job completed! Earnings updated.");
    } catch (err) {
      toast.error("Failed to complete job");
    }
  };

  const generateBio = async () => {
    if (!worker?.skill || !worker?.location) {
      toast.error("Please set your skill and location first!");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("/api/ai/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile?.name,
          skill: worker.skill,
          experience: worker.experience,
          location: worker.location,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const fullBio = `${data.bio.english}\n\n${data.bio.urdu}`;
        await setDoc(doc(db, "workers", user.uid), { bio: fullBio }, { merge: true });
        toast.success("AI Bio generated and saved!");
      }
    } catch (err) {
      toast.error("Failed to generate bio");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner label="Loading your dashboard…" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto pb-20 md:pb-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Assalam-o-Alaikum, {profile?.name || "Worker"}!
          </h1>
          <p className="text-sm text-outline mt-1">
            Manage your availability, jobs, and earnings
          </p>
        </div>
        <button
          onClick={toggleOnline}
          className={`self-start px-6 py-3 rounded-full font-bold flex items-center gap-2 transition ${
            worker?.isOnline
              ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
              : "bg-surface-container-low text-outline border border-outline-variant"
          }`}
        >
          {worker?.isOnline ? (
            <>
              <ToggleRight size={20} /> Online
            </>
          ) : (
            <>
              <ToggleLeft size={20} /> Offline
            </>
          )}
        </button>
      </motion.div>

      {!worker?.bio && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-primary to-secondary p-1 rounded-2xl shadow-xl"
        >
          <div className="bg-white dark:bg-slate-900 rounded-[14px] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black">Complete your Profile with AI</h3>
                <p className="text-sm text-outline">Let Gemini write a professional bio for you in English & Urdu.</p>
              </div>
            </div>
            <button 
              onClick={generateBio}
              className="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition shadow-lg shadow-primary/20"
            >
              <Sparkles size={18} /> Generate AI Bio
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<CheckCircle className="w-5 h-5 text-primary" />}
          label="Jobs Completed"
          value={stats.completed}
        />
        <StatCard
          icon={<DollarSign className="w-5 h-5 text-secondary" />}
          label="Earnings"
          value={`Rs. ${stats.earnings.toLocaleString()}`}
        />
        <StatCard
          icon={<Star className="w-5 h-5 text-yellow-500" />}
          label="Rating"
          value={stats.rating}
        />
        <StatCard
          icon={<Briefcase className="w-5 h-5 text-primary" />}
          label="Reviews"
          value={stats.reviews}
        />
      </div>

      {/* Ongoing Jobs Section */}
      {activeJobs.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="text-secondary w-5 h-5" /> Ongoing Jobs
            </h2>
            <span className="bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              {activeJobs.length} Active
            </span>
          </div>
          <div className="grid gap-4">
            {activeJobs.map((job) => (
              <div key={job.id} className="glass-card p-5 border-l-4 border-secondary flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-bold text-lg">{job.skill || "Service Request"}</h3>
                  <div className="flex items-center gap-3 text-sm text-outline mt-1">
                    <span className="flex items-center gap-1"><User size={14}/> {job.customerName}</span>
                    <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-outline uppercase font-bold">Earnings</p>
                    <p className="font-bold text-primary">Rs. {job.price}</p>
                  </div>
                  <button 
                    onClick={() => handleMarkComplete(job.id)}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} /> Mark Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/worker/incoming"
          className="glass-card p-5 rounded-xl flex items-center justify-between hover:bg-primary/5 transition group"
        >
          <div>
            <h3 className="font-bold text-lg">Incoming Requests</h3>
            <p className="text-sm text-outline">
              View and accept new job offers
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-outline group-hover:translate-x-1 transition" />
        </Link>
        <Link
          href="/dashboard/worker/active"
          className="glass-card p-5 rounded-xl flex items-center justify-between hover:bg-primary/5 transition group"
        >
          <div>
            <h3 className="font-bold text-lg">Active Jobs</h3>
            <p className="text-sm text-outline">Track your ongoing work</p>
          </div>
          <ArrowRight className="w-5 h-5 text-outline group-hover:translate-x-1 transition" />
        </Link>
      </div>

      <div className="glass-card p-6 rounded-xl">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <User size={18} /> Your Profile
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Skill:</span>{" "}
            {worker?.skill || "Not set"}
          </div>
          <div>
            <span className="font-semibold">Hourly Rate:</span> Rs.{" "}
            {worker?.hourlyRate || 0}
          </div>
          <div>
            <span className="font-semibold flex items-center gap-1">
              <MapPin size={14} /> Location:
            </span>{" "}
            {worker?.location || "Not set"}
          </div>
          <div>
            <span className="font-semibold flex items-center gap-1">
              <Clock size={14} /> Experience:
            </span>{" "}
            {worker?.experience || 0} years
          </div>
        </div>
        {worker?.bio && (
          <p className="mt-4 text-sm text-outline">{worker.bio}</p>
        )}
        <button className="mt-4 text-primary font-semibold text-sm flex items-center gap-1 hover:underline">
          <Edit size={14} /> Edit Profile (coming soon)
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="glass-card p-4 rounded-xl flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-outline">{label}</span>
      </div>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}