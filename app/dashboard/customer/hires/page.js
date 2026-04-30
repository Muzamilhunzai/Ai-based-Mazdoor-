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
    const q = query(collection(db, 'jobs'), where('customerId', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const filtered = jobs.filter(j => filter === 'all' || j.status === filter);
  const handleComplete = async (jobId) => {
    await updateDoc(doc(db, 'jobs', jobId), { status: 'completed', completedAt: serverTimestamp() });
    toast.success('Job marked complete');
  };

  if (loading) return <div className="py-20"><LoadingSpinner size="large" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold dark:text-white">My Jobs</h1><p className="font-urdu text-primary">میرے کام</p></div>
        <Link href="/customer/job-post" className="btn-primary text-sm">Post New Job</Link>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all','pending','accepted','completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize ${filter === f ? 'bg-primary text-white' : 'bg-white dark:bg-slate-700 text-gray-600'} transition-colors`}>{f}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon="📋" title="No jobs yet" titleUrdu="ابھی تک کوئی کام نہیں" description="Post a job or hire a worker" />
      ) : (
        filtered.map(job => (
          <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <div className="flex justify-between items-start mb-3">
              <div><h3 className="font-bold text-lg">{job.title}</h3><p className="text-sm text-gray-500">{job.workerName || 'Not assigned'}</p></div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${job.status === 'completed' ? 'bg-green-100 text-green-700' : job.status === 'accepted' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{job.status}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {job.scheduledDate || 'Flexible'}</div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {job.scheduledTime || 'Flexible'}</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {job.address || job.location}</div>
              <div className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> Rs. {job.budget}</div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{job.description}</p>
            <div className="flex gap-2">
              {job.status === 'accepted' && (
                <button onClick={() => handleComplete(job.id)} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">
                  <CheckCircle className="w-4 h-4" /> Mark Complete
                </button>
              )}
              <Link href={`/customer/messages?job=${job.id}`} className="flex items-center gap-2 glass-card px-4 py-2 text-sm font-medium hover:bg-white/90">
                <MessageSquare className="w-4 h-4" /> Chat
              </Link>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}