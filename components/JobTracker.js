'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Navigation } from 'lucide-react';

export default function JobTracker({ job, workerId, onClose }) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (job.status === 'in_progress') {
      const id = setInterval(() => {
        navigator.geolocation.getCurrentPosition(pos => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        });
      }, 5000);
      return () => clearInterval(id);
    }
  }, [job.status]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          onClick={e => e.stopPropagation()}
          className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden"
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold">Worker Tracking</h3>
            <button onClick={onClose}><X className="w-5 h-5" /></button>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <p className="font-medium">{job.title}</p>
              <p className="text-sm text-gray-500">{job.address || job.location}</p>
            </div>
            <div className="bg-gray-200 dark:bg-slate-700 rounded-xl h-48 flex items-center justify-center relative">
              <div className="text-center">
                <Navigation className="w-8 h-8 mx-auto text-primary animate-bounce" />
                <p className="text-sm mt-2">Worker is on the way</p>
              </div>
              {/* In production, integrate a real map like Leaflet */}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> ETA: 15 mins</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Near your location</div>
            </div>
            <button onClick={onClose} className="w-full mt-4 btn-primary">Close</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}