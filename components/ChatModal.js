'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ChatModal({ job, senderId, senderName, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!job?.id) return;
    const q = query(
      collection(db, 'chats', job.id, 'messages'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
    return unsub;
  }, [job?.id]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    await addDoc(collection(db, 'chats', job.id, 'messages'), {
      senderId,
      senderName,
      text,
      createdAt: serverTimestamp(),
      read: false,
    });
    setText('');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="bg-white dark:bg-slate-800 w-full sm:max-w-md h-[80vh] sm:h-[600px] rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col"
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold">Chat</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.senderId === senderId ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl ${msg.senderId === senderId ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-slate-700'}`}>
                  <p className="text-xs font-medium mb-1">{msg.senderId === senderId ? 'You' : msg.senderName}</p>
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-[10px] opacity-70 mt-1">{msg.createdAt?.toDate?.()?.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="p-4 border-t flex gap-2">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="input-field flex-1"
            />
            <button onClick={sendMessage} className="btn-primary p-3"><Send className="w-5 h-5" /></button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}