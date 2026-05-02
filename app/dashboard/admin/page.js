'use client';

export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const usersSnap = await getDocs(collection(db, 'users'));
      const workersSnap = await getDocs(collection(db, 'workers'));
      const jobsSnap = await getDocs(collection(db, 'jobs'));
      setStats({
        totalUsers: usersSnap.size,
        totalWorkers: workersSnap.size,
        totalJobs: jobsSnap.size,
        completedJobs: jobsSnap.docs.filter(d => d.data().status === 'completed').length,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <div className="py-20"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold dark:text-white">Admin Dashboard</h1><p className="font-urdu text-primary">ایڈمن ڈیش بورڈ</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats.totalUsers },
          { label: 'Workers', value: stats.totalWorkers },
          { label: 'Total Jobs', value: stats.totalJobs },
          { label: 'Completed', value: stats.completedJobs },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold mb-4">Recent Jobs</h2>
        <p className="text-gray-500">Connect to Firestore snapshot...</p>
      </div>
    </div>
  );
}