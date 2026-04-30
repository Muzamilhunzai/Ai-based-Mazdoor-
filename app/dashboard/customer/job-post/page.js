'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Banknote, Calendar, Clock, FileText, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = [
  { id: 'plumber', name: 'Plumber', nameUrdu: 'پلمبر' },
  { id: 'electrician', name: 'Electrician', nameUrdu: 'الیکٹریشن' },
  { id: 'carpenter', name: 'Carpenter', nameUrdu: 'بڑھئی' },
  { id: 'painter', name: 'Painter', nameUrdu: 'پینٹر' },
  { id: 'driver', name: 'Driver', nameUrdu: 'ڈرائیور' },
  { id: 'cleaner', name: 'Cleaner', nameUrdu: 'صاف کرنے والا' },
  { id: 'cook', name: 'Cook', nameUrdu: 'باورچی' },
  { id: 'other', name: 'Other', nameUrdu: 'دیگر' },
];

export default function JobPostPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', category: '', description: '', location: '', address: '', budget: '', date: '', time: '', urgency: 'normal' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'jobs'), {
        customerId: user.uid,
        customerName: profile?.name,
        title: form.title,
        category: form.category,
        description: form.description,
        location: form.location,
        address: form.address,
        budget: parseInt(form.budget) || 0,
        scheduledDate: form.date,
        scheduledTime: form.time,
        urgency: form.urgency,
        status: 'open',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        applicants: [],
      });
      toast.success('Job posted successfully!');
      router.push('/customer/hires');
    } catch (error) {
      toast.error('Failed to post job');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6"><h1 className="text-2xl font-bold dark:text-white">Post a Job</h1><p className="font-urdu text-primary">ایک کام پوسٹ کریں</p></div>
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Job Title</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g., Need plumber for bathroom repair" className="input-field pl-12" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Category</label>
          <select required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field">
            <option value="">Select category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name} - {c.nameUrdu}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Description</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <textarea required rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the work in detail..." className="input-field pl-12" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Area/Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" required value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g., Gulshan-e-Iqbal" className="input-field pl-12" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Full Address</label>
            <input type="text" required value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="House #, Street, Block" className="input-field" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Budget (Rs)</label>
            <div className="relative">
              <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="number" required value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} placeholder="Amount" className="input-field pl-12" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Urgency</label>
            <select value={form.urgency} onChange={e => setForm({...form, urgency: e.target.value})} className="input-field">
              <option value="low">Low / کم</option>
              <option value="normal">Normal / عام</option>
              <option value="urgent">Urgent / فوری</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Preferred Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="input-field pl-12" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Preferred Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="input-field pl-12" />
            </div>
          </div>
        </div>
        <button type="submit" disabled={submitting} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
          <Send className="w-4 h-4" /> {submitting ? 'Posting...' : 'Post Job'} <span className="font-urdu text-sm">{submitting ? '...پوسٹ ہو رہا ہے' : 'کام پوسٹ کریں'}</span>
        </button>
      </motion.form>
    </div>
  );
}