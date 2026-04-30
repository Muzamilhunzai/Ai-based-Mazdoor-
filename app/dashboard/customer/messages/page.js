'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import ChatModal from '@/components/ChatModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';

export default function MessagesPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'chats'),
      orderBy('lastMessageAt', 'desc')
      // In production add where filter for participant
    );
    const unsub = onSnapshot(q, snap => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setChats(all);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  if (loading) return <div className="py-20"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold dark:text-white">Messages</h1><p className="font-urdu text-primary">پیغامات</p></div>
      {chats.length === 0 ? (
        <EmptyState icon="💬" title="No messages yet" titleUrdu="کوئی پیغام نہیں" description="Your conversations will appear here" />
      ) : (
        <div className="space-y-2">
          {chats.map(chat => (
            <button key={chat.id} onClick={() => setSelectedJob({ id: chat.jobId, chatId: chat.id })} className="w-full glass-card p-4 text-left hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{chat.lastMessage?.substring(0, 50)}...</p>
                  <p className="text-sm text-gray-500">{chat.lastMessageAt?.toDate?.()?.toLocaleTimeString()}</p>
                </div>
                <span className="text-sm text-primary">Open</span>
              </div>
            </button>
          ))}
        </div>
      )}
      {selectedJob && (
        <ChatModal 
          job={selectedJob}
          senderId={user.uid}
          senderName={user.displayName}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}