'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Clock, MapPin, Calendar, CheckCircle, MessageSquare, DollarSign } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';

export default function CustomerHires() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) return;
    // Removed orderBy to prevent indexing errors
    const q = query(
      collection(db, 'jobs'), 
      where('customerId', '==', user.uid)
    );
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort in-memory
      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setJobs(data);
      setLoading(false);
    }, (error) => {
      console.error("Hires fetch error:", error);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const filtered = jobs.filter(j => filter === 'all' || j.status === filter);
  const handleComplete = async (jobId) => {
    try {
      await updateDoc(doc(db, 'jobs', jobId), { 
        status: 'completed', 
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Job marked complete');
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner label="Loading your history..." />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto pb-20 md:pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Hires & Jobs</h1>
          <p className="font-urdu text-xl text-primary mt-1">میرے کام اور بھرتیاں</p>
        </div>
        <Link href="/dashboard/customer/job-post" className="btn-primary text-sm px-6 py-3 self-start">
          Post New Job
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['all', 'pending', 'accepted', 'completed'].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)} 
            className={`px-5 py-2.5 rounded-full text-sm font-bold capitalize whitespace-nowrap transition-all ${
              filter === f 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-white text-outline border border-outline-variant hover:bg-primary/5'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState 
          icon="📋" 
          title="No jobs yet" 
          titleUrdu="ابھی تک کوئی کام نہیں" 
          description="You haven't hired anyone yet. Start by searching or posting a job." 
        />
      ) : (
        <div className="space-y-4">
          {filtered.map(job => (
            <motion.div 
              key={job.id} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="glass-card p-5 md:p-6 rounded-2xl border-l-4 border-primary"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{job.skill || job.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-primary font-medium mt-1">
                    <User className="w-4 h-4" />
                    <span>Worker: {job.workerName || 'Looking for someone...'}</span>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  job.status === 'completed' 
                    ? 'bg-green-100 text-green-700' 
                    : job.status === 'accepted' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {job.status}
                </span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5 text-sm text-outline">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {job.scheduledDate || 'Flexible'}</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {job.scheduledTime || 'Flexible'}</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {job.address || job.location || 'Lahore'}</div>
                <div className="flex items-center gap-2 font-bold text-on-surface"><DollarSign className="w-4 h-4 text-secondary" /> Rs. {job.budget}</div>
              </div>

              {job.description && (
                <p className="text-sm text-outline-variant mb-5 line-clamp-2 italic">&quot;{job.description}&quot;</p>
              )}

              <div className="flex flex-wrap gap-2 pt-4 border-t border-outline-variant/10">
                {job.status === 'accepted' && (
                  <button 
                    onClick={() => handleComplete(job.id)} 
                    className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-600 transition shadow-lg shadow-green-500/20"
                  >
                    <CheckCircle className="w-4 h-4" /> Mark as Done
                  </button>
                )}
                <Link 
                  href="/dashboard/customer/messages" 
                  className="flex items-center gap-2 glass-card px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-surface-container-low transition"
                >
                  <MessageSquare className="w-4 h-4 text-primary" /> Chat with Worker
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}