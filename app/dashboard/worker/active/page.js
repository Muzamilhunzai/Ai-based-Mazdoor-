'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Phone,
  Star,
  Navigation,
  MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import ChatModal from '@/components/ChatModal';
import JobTracker from '@/components/JobTracker';
import ReviewModal from '@/components/ReviewModal';

export default function WorkerActiveJobs() {
  const { user, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatJob, setChatJob] = useState(null);
  const [trackingJob, setTrackingJob] = useState(null);
  const [reviewJob, setReviewJob] = useState(null);

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

    // Fetch jobs where this worker is accepted or in progress
    // Removed orderBy to prevent indexing errors
    const q = query(
      collection(db, 'jobs'),
      where('workerId', '==', user.uid),
      where('status', 'in', ['accepted', 'in_progress'])
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // Sort in-memory
      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setJobs(data);
      setLoading(false);
    }, (error) => {
      console.error("Active jobs snapshot error:", error);
      toast.error("Failed to load active jobs: " + error.message);
      setLoading(false);
    });

    return () => unsub();
  }, [user, authLoading]);

  const handleMarkComplete = async (job) => {
    if (!window.confirm('Mark this job as completed?')) return;
    try {
      await updateDoc(doc(db, 'jobs', job.id), {
        status: 'completed',
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success('Job marked as completed!');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCancel = async (job) => {
    const reason = prompt('Why are you canceling this job?');
    if (!reason) return;
    try {
      await updateDoc(doc(db, 'jobs', job.id), {
        status: 'cancelled',
        cancelledBy: 'worker',
        cancelReason: reason,
        updatedAt: serverTimestamp(),
      });
      toast.success('Job cancelled');
    } catch (error) {
      toast.error('Failed to cancel job');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Active Jobs</h1>
        <p className="font-urdu text-primary">فعال کام</p>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon="⚡"
          title="No active jobs"
          titleUrdu="کوئی فعال کام نہیں"
          description="Accept a job from incoming requests to get started"
          descriptionUrdu="شروع کرنے کے لیے آنے والی درخواستوں سے کوئی کام قبول کریں"
          action={
            <a href="/worker/incoming" className="btn-primary">
              View Available Jobs
            </a>
          }
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg">{job.title}</h3>
                  <p className="text-sm text-gray-500">
                    Customer: {job.customerName || 'Unknown'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  job.status === 'accepted'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                }`}>
                  {job.status === 'in_progress' ? 'In Progress' : 'Accepted'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{job.address || job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{job.scheduledDate || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{job.scheduledTime || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span>Rs. {job.budget}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={`tel:${job.customerPhone || ''}`}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Customer
                </a>
                <button
                  onClick={() => handleMarkComplete(job)}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark Complete
                </button>
                <button
                  onClick={() => setTrackingJob(job)}
                  className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Track
                </button>
                <button
                  onClick={() => setChatJob(job)}
                  className="flex items-center gap-2 glass-card dark:bg-slate-800/50 px-4 py-2 text-sm font-medium hover:bg-white/90 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </button>
                <button
                  onClick={() => handleCancel(job)}
                  className="flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </button>
                {job.status === 'completed' && (
                  <button
                    onClick={() => setReviewJob(job)}
                    className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-600 transition-colors"
                  >
                    <Star className="w-4 h-4" />
                    Review
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
      {chatJob && (
        <ChatModal
          job={chatJob}
          senderId={user.uid}
          senderName={user.displayName}
          onClose={() => setChatJob(null)}
        />
      )}
      {trackingJob && (
        <JobTracker
          job={trackingJob}
          workerId={user.uid}
          onClose={() => setTrackingJob(null)}
        />
      )}
      {reviewJob && (
        <ReviewModal
          job={reviewJob}
          reviewerId={user.uid}
          reviewerName={user.displayName}
          onClose={() => setReviewJob(null)}
        />
      )}
    </div>
  );
}