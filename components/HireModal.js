import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export default function HireModal({ worker, isOpen, onClose }) {
  const { user, profile } = useAuth();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [negotiate, setNegotiate] = useState(false);
  const [offerPrice, setOfferPrice] = useState(worker?.hourlyRate || 0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleHire = async () => {
    if (!user) {
      toast.error('Please login to hire a worker');
      return;
    }

    if (!date || !offerPrice) {
      toast.error('Please fill in the date and budget');
      return;
    }

    setLoading(true);
    try {
      const jobData = {
        customerId: user.uid,
        customerName: profile?.name || 'Customer',
        workerId: worker.uid,
        workerName: worker.name,
        skill: worker.skill,
        status: 'pending',
        scheduledDate: date,
        scheduledTime: time || 'Flexible',
        price: Number(offerPrice),
        budget: Number(offerPrice),
        description: message,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        location: profile?.location || 'Unknown',
        address: profile?.address || '',
      };

      await addDoc(collection(db, 'jobs'), jobData);
      
      toast.success('Hiring request sent successfully!');
      onClose();
    } catch (error) {
      console.error('Hiring error:', error);
      toast.error('Failed to send request. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!worker) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold">Hire {worker.name}</h2>
                  <p className="font-urdu text-sm text-primary">{worker.skill}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Schedule Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field pl-12" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="time" value={time} onChange={e => setTime(e.target.value)} className="input-field pl-12" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Budget (Rs)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="number" value={offerPrice} onChange={e => setOfferPrice(e.target.value)} className="input-field pl-12" />
                  </div>
                  <button onClick={() => setNegotiate(!negotiate)} className="text-xs text-primary mt-1">Request negotiation</button>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Message (optional)</label>
                  <textarea rows={2} value={message} onChange={e => setMessage(e.target.value)} className="input-field" />
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button onClick={onClose} className="flex-1 glass-card py-3 font-medium">Cancel</button>
                <button onClick={handleHire} className="flex-1 btn-primary">Confirm Hire</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}