'use client';

export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Search } from 'lucide-react';
import ChatModal from '@/components/ChatModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';

export default function MessagesPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError(null);

    // Fetch all chats where the current user is a participant.
    // Note: In a production app you'd likely have a `participants` array on the chat document.
    // For simplicity, we fetch all chats and filter by checking if job.customerId or job.workerId matches.
    // Alternatively, you could create a composite query with `array-contains`.
    // We'll use a two‑part approach: get all jobs for the user, then get chats for those jobs.
    const unsubscribeJobs = onSnapshot(
      query(
        collection(db, 'jobs'),
        orderBy('createdAt', 'desc')
      ),
      async (jobsSnapshot) => {
        try {
          // Collect job IDs where user is customer or worker
          const userJobIds = [];
          jobsSnapshot.forEach((doc) => {
            const job = doc.data();
            if (job.customerId === user.uid || job.workerId === user.uid) {
              userJobIds.push(doc.id);
            }
          });

          if (userJobIds.length === 0) {
            setChats([]);
            setLoading(false);
            return;
          }

          // Fetch chats for these job IDs
          // Since Firestore doesn't support 'in' + 'orderBy' easily, we'll listen to all chats and filter
          // For better performance, you could loop and create individual listeners, but for demo we filter globally.
          const unsubChats = onSnapshot(
            query(
              collection(db, 'chats'),
              orderBy('lastMessageAt', 'desc')
            ),
            (chatsSnapshot) => {
              const allChats = [];
              chatsSnapshot.forEach((doc) => {
                const chat = doc.data();
                if (userJobIds.includes(chat.jobId)) {
                  allChats.push({ id: doc.id, ...chat });
                }
              });
              setChats(allChats);
              setLoading(false);
            },
            (err) => {
              console.error('Chats listener error:', err);
              setError('Failed to load chats');
              setLoading(false);
            }
          );

          return () => unsubChats();
        } catch (err) {
          console.error('Error fetching user jobs:', err);
          setError('Something went wrong');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Jobs listener error:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribeJobs === 'function') unsubscribeJobs();
    };
  }, [user]);

  // Filter chats based on search term (job title or last message)
  const filteredChats = chats.filter((chat) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      chat.lastMessage?.toLowerCase().includes(term) ||
      chat.jobTitle?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="Error loading messages"
        titleUrdu="پیغامات لوڈ کرنے میں خرابی"
        description={error}
        action={
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Messages</h1>
          <p className="font-urdu text-primary">پیغامات</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search conversations..."
          className="input-field pl-12"
        />
      </div>

      {/* Chats List */}
      {filteredChats.length === 0 ? (
        <EmptyState
          icon="💬"
          title="No messages yet"
          titleUrdu="کوئی پیغام نہیں"
          description="Your conversations with workers or customers will appear here"
          descriptionUrdu="کارکنوں یا گاہکوں کے ساتھ آپ کی گفتگو یہاں ظاہر ہوگی"
          action={
            <Link href="/customer/job-post" className="btn-primary">
              Post a Job
            </Link>
          }
        />
      ) : (
        <div className="space-y-2">
          {filteredChats.map((chat) => (
            <motion.button
              key={chat.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedChat(chat)}
              className="w-full glass-card p-4 text-left hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate dark:text-white">
                    {chat.jobTitle || 'Job Conversation'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                    {chat.lastMessage || 'No messages yet'}
                  </p>
                </div>
                <div className="flex flex-col items-end ml-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {chat.lastMessageAt?.toDate
                      ? new Date(chat.lastMessageAt.toDate()).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1 group-hover:bg-primary/20 transition-colors">
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Chat Modal */}
      <AnimatePresence>
        {selectedChat && (
          <ChatModal
            job={{
              id: selectedChat.jobId,
              chatId: selectedChat.id,
              title: selectedChat.jobTitle || 'Chat',
            }}
            senderId={user.uid}
            senderName={user.displayName || 'You'}
            onClose={() => setSelectedChat(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}