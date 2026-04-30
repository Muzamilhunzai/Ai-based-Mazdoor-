'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReviewModal({ job, reviewerId, reviewerName, onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const submitReview = async () => {
    const res = await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId: job.id,
        reviewerId,
        revieweeId: job.workerId || job.customerId, // simplified
        rating,
        comment,
        role: 'customer',
      }),
    });
    if (res.ok) {
      toast.success('Review submitted!');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          onClick={e => e.stopPropagation()}
          className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Rate & Review</h3>
            <button onClick={onClose}><X className="w-5 h-5" /></button>
          </div>
          <div className="flex justify-center gap-1 mb-4">
            {[1,2,3,4,5].map(i => (
              <button key={i} onClick={() => setRating(i)}>
                <Star className={`w-8 h-8 ${i <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="input-field mb-4"
            rows={3}
          />
          <button onClick={submitReview} disabled={rating === 0} className="w-full btn-primary disabled:opacity-50">
            Submit Review
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}