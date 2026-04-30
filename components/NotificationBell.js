import { Bell } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import Link from 'next/link';

export default function NotificationBell() {
  const { unreadCount } = useNotifications();
  return (
    <Link href="/notifications" className="relative w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center justify-center">
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </Link>
  );
}