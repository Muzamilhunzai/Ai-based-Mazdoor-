'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Search, Briefcase, MessageSquare, User, PlusCircle, ClipboardList } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { isCustomer } = useAuth();

  const customerLinks = [
    { href: '/customer', icon: Home, label: 'Home', labelUrdu: 'ہوم' },
    { href: '/customer/job-post', icon: PlusCircle, label: 'Post Job', labelUrdu: 'نوکری ڈالیں' },
    { href: '/customer/hires', icon: ClipboardList, label: 'My Jobs', labelUrdu: 'میری نوکریاں' },
    { href: '/customer/messages', icon: MessageSquare, label: 'Chat', labelUrdu: 'چیٹ' },
    { href: '/customer/profile', icon: User, label: 'Profile', labelUrdu: 'پروفائل' },
  ];

  const workerLinks = [
    { href: '/worker', icon: Home, label: 'Home', labelUrdu: 'ہوم' },
    { href: '/worker/incoming', icon: Briefcase, label: 'Jobs', labelUrdu: 'نوکریاں' },
    { href: '/worker/active', icon: ClipboardList, label: 'Active', labelUrdu: 'فعال' },
    { href: '/worker/messages', icon: MessageSquare, label: 'Chat', labelUrdu: 'چیٹ' },
    { href: '/worker/profile', icon: User, label: 'Profile', labelUrdu: 'پروفائل' },
  ];

  const links = isCustomer ? customerLinks : workerLinks;
  if (links.length === 0) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-slate-800 lg:hidden pb-safe">
      <div className="flex items-center justify-around h-16">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <button
              key={link.href}
              onClick={() => router.push(link.href)}
              className={`relative flex flex-col items-center justify-center w-full h-full gap-0.5 ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`}
            >
              {isActive && (
                <motion.div layoutId="bottomNavIndicator" className="absolute -top-px left-1/4 right-1/4 h-0.5 bg-primary rounded-full" />
              )}
              <link.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{link.label}</span>
              <span className="font-urdu text-[8px] opacity-70">{link.labelUrdu}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}