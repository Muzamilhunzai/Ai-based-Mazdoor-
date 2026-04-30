// app/dashboard/worker/page.js
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  query,
  where,
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
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function WorkerDashboard() {
  const { user, profile } = useAuth();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    completed: 0,
    earnings: 0,
    rating: 0,
    reviews: 0,
  });

  // Fetch worker profile from Firestore in real-time
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "workers", user.uid), (snap) => {
      if (snap.exists()) {
        setWorker({ id: snap.id, ...snap.data() });
      } else {
        // Create a default worker doc if it doesn't exist
        const defaultWorker = {
          uid: user.uid,
          skill: "",
          hourlyRate: 0,
          isVerified: false,
          rating: 0,
          reviewCount: 0,
          location: "",
          isOnline: false,
          bio: "",
          categories: [],
          portfolio: [],
          experience: 0,
          jobsCompleted: 0,
          totalEarnings: 0,
        };
        setDoc(doc(db, "workers", user.uid), defaultWorker).catch(() => {});
        setWorker(defaultWorker);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  // Calculate live stats from jobs collection
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "jobs"),
      where("workerId", "==", user.uid)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      let completed = 0,
        earnings = 0,
        totalRating = 0,
        reviewCount = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === "completed") {
          completed++;
          earnings += data.price || 0;
          if (data.rating) {
            totalRating += data.rating;
            reviewCount++;
          }
        }
      });
      setStats({
        completed,
        earnings,
        rating: reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : worker?.rating || 0,
        reviews: reviewCount,
      });
    });
    return () => unsub();
  }, [user, worker]);

  // Toggle online/offline status
  const toggleOnline = async () => {
    if (!worker) return;
    const newStatus = !worker.isOnline;
    try {
      await setDoc(
        doc(db, "workers", user.uid),
        { isOnline: newStatus },
        { merge: true }
      );
      toast.success(newStatus ? "You're now online! 🟢" : "You're offline");
    } catch (err) {
      toast.error("Could not update status");
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
      {/* Header */}
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
              ? "bg-green-500 text-white shadow-lg"
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

      {/* Stats Cards */}
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

      {/* Quick Links */}
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

      {/* Profile Summary */}
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