'use client';

import { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser.');
      return;
    }
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'ur-PK';
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      // Optionally trigger search
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  };

  return (
    <div className="fixed top-24 right-4 z-40">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={listening ? stopListening : startListening}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
          listening ? 'bg-red-500 text-white' : 'bg-primary text-white'
        }`}
      >
        {listening ? <MicOff className="w-6 h-6 animate-pulse" /> : <Mic className="w-6 h-6" />}
      </motion.button>
      {listening && (
        <div className="mt-2 p-2 bg-white dark:bg-slate-800 rounded-xl shadow text-sm max-w-[200px]">
          <p className="truncate">{transcript || 'Listening...'}</p>
        </div>
      )}
    </div>
  );
}