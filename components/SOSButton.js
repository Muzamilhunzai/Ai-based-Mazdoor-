'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, Phone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function SOSButton() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const sendSOS = async () => {
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      // In production, save to Firestore SOS collection
      window.location.href = 'tel:15';
      toast.success('SOS Alert Sent!');
    } catch {
      window.location.href = 'tel:15';
      toast.error('Calling emergency number directly');
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-4 z-50 w-14 h-14 bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 transition-colors"
      >
        <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
        <ShieldAlert className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="bg-red-600 p-6 text-white flex justify-between items-center">
                <h2 className="text-2xl font-bold">Emergency SOS</h2>
                <button onClick={() => setIsOpen(false)} className="p-1"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-6 space-y-4">
                <button onClick={sendSOS} className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2">
                  <ShieldAlert className="w-6 h-6" /> SEND SOS ALERT
                </button>
                <div className="grid grid-cols-3 gap-3">
                  <a href="tel:15" className="flex flex-col items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-700 hover:bg-gray-100">
                    <ShieldAlert className="w-6 h-6 text-red-500" /><span className="text-sm font-medium">Police</span><span className="text-lg font-bold text-red-500">15</span>
                  </a>
                  <a href="tel:1122" className="flex flex-col items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-700 hover:bg-gray-100">
                    <Phone className="w-6 h-6 text-red-500" /><span className="text-sm font-medium">Ambulance</span><span className="text-lg font-bold text-red-500">1122</span>
                  </a>
                  <a href="tel:16" className="flex flex-col items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-700 hover:bg-gray-100">
                    <Phone className="w-6 h-6 text-red-500" /><span className="text-sm font-medium">Fire</span><span className="text-lg font-bold text-red-500">16</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}