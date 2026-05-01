// app/dashboard/worker/incoming/page.js
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  MessageSquare,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";

export default function WorkerIncomingJobs() {
  const { user, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // track which job is being accepted/rejected

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    // Handle Demo Mode
    if (user.isDemo && false) { // Removed bypass to allow real interaction
      setJobs([]); 
      setLoading(false);
      return;
    }

    // Query jobs where THIS worker is assigned and status is "pending"
    const q = query(
      collection(db, "jobs"),
      where("workerId", "==", user.uid),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const jobList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJobs(jobList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching incoming jobs:", error);
        toast.error("Failed to load jobs.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  const handleAccept = async (jobId) => {
    setActionLoading(jobId);
    try {
      await updateDoc(doc(db, "jobs", jobId), {
        status: "accepted",
        acceptedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success("Job accepted! You can now coordinate with the customer.");
    } catch (error) {
      toast.error("Could not accept job: " + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (jobId) => {
    setActionLoading(jobId);
    try {
      await updateDoc(doc(db, "jobs", jobId), {
        status: "rejected",
        updatedAt: serverTimestamp(),
      });
      toast.success("Job rejected.");
    } catch (error) {
      toast.error("Could not reject job: " + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const openChat = (job) => {
    // Placeholder – you can wire up a ChatModal later
    console.log("Open chat for job", job.id);
    toast("Chat coming soon!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner label="Loading incoming requests..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-on-surface">
          Incoming Requests
        </h1>
        <p className="text-lg text-primary font-urdu mt-1">
          آنے والی درخواستیں
        </p>
      </div>

      {/* Empty State */}
      {jobs.length === 0 ? (
        <EmptyState
          title="No pending requests"
          description="When a customer hires you, their job will show up here."
          icon="inbox"
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card p-5 md:p-6 rounded-xl border border-white/40"
            >
              {/* Job Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-on-surface">
                    {job.title || job.description || "Job Request"}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-outline">
                    <User className="w-3.5 h-3.5" />
                    <span>{job.customerName || "Customer"}</span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-yellow-100/80 text-yellow-800 rounded-full text-xs font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                  Pending
                </span>
              </div>

              {/* Job Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm text-on-surface-variant">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-outline shrink-0" />
                  <span className="truncate">{job.address || job.location || "—"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-outline shrink-0" />
                  <span>Rs. {job.price || job.budget || "—"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-outline shrink-0" />
                  <span>{job.scheduledDate || "Flexible"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-outline shrink-0" />
                  <span>{job.scheduledTime || "Flexible"}</span>
                </div>
              </div>

              {/* Description (if any) */}
              {job.description && (
                <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">
                  {job.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleAccept(job.id)}
                  disabled={actionLoading === job.id}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-full text-sm font-bold hover:bg-primary-container transition disabled:opacity-60 disabled:cursor-wait"
                >
                  <CheckCircle className="w-4 h-4" />
                  {actionLoading === job.id ? "Accepting..." : "Accept"}
                </button>
                <button
                  onClick={() => handleReject(job.id)}
                  disabled={actionLoading === job.id}
                  className="flex items-center gap-2 bg-error text-white px-4 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-wait"
                >
                  <XCircle className="w-4 h-4" />
                  {actionLoading === job.id ? "Rejecting..." : "Reject"}
                </button>
                <button
                  onClick={() => openChat(job)}
                  className="flex items-center gap-2 border border-outline-variant text-on-surface-variant px-4 py-2.5 rounded-full text-sm font-medium hover:bg-surface-container-low transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}