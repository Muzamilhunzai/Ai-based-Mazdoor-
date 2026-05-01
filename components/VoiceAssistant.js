'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceAssistant({ onResult }) {
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'ur-PK'; // Default to Urdu for Pakistan
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        if (event.results[0].isFinal) {
          handleFinalTranscript(result);
        }
      };

      recognitionRef.current.onend = () => {
        setListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);
      };
    }
  }, []);

  const handleFinalTranscript = (text) => {
    setProcessing(true);
    if (onResult) {
      onResult(text);
    }
    setTimeout(() => {
      setProcessing(false);
      setTranscript('');
    }, 2000);
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      alert('Voice search is not supported in your browser.');
      return;
    }
    setTranscript('');
    recognitionRef.current.start();
    setListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  };

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {(listening || transcript) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-primary/20 max-w-[250px] overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${listening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-xs font-bold text-outline uppercase tracking-wider">
                {listening ? 'Listening...' : 'Processing...'}
              </span>
            </div>
            <p className="text-sm font-urdu leading-relaxed">
              {transcript || 'بولیں، ہم سن رہے ہیں...' }
            </p>
            {processing && (
              <div className="mt-2 flex items-center gap-2 text-primary text-xs font-bold">
                <Loader2 className="w-3 h-3 animate-spin" />
                Searching for workers...
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={listening ? stopListening : startListening}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all ${
          listening 
            ? 'bg-red-500 text-white ring-4 ring-red-500/20' 
            : 'bg-primary text-white hover:bg-primary-container'
        }`}
      >
        {listening ? (
          <MicOff className="w-7 h-7" />
        ) : (
          <div className="relative">
            <Mic className="w-7 h-7" />
            {!listening && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-white/20 rounded-full -z-10" 
              />
            )}
          </div>
        )}
      </motion.button>
    </div>
  );
}