"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  MessageSquare,
  User,
  LogOut,
  Bell,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CustomerLayout({ children }) {
  const { user, profile, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (!loading && profile?.role && profile.role !== "customer") {
      router.push("/dashboard/worker");
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner label="Securing your session…" />
      </div>
    );
  }

  if (!user || (profile?.role && profile.role !== "customer")) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const navLinks = [
    { 
      href: "/dashboard/customer", 
      icon: <LayoutDashboard size={20} />, 
      label: "Home", 
      labelUrdu: "ہوم" 
    },
    { 
      href: "/dashboard/customer/hires", 
      icon: <Users size={20} />, 
      label: "My Hires", 
      labelUrdu: "میری بھرتیاں" 
    },
    { 
      href: "/dashboard/customer/job-post", 
      icon: <PlusCircle size={20} />, 
      label: "Post Job", 
      labelUrdu: "کام پوسٹ کریں" 
    },
    { 
      href: "/dashboard/customer/messages", 
      icon: <MessageSquare size={20} />, 
      label: "Messages", 
      labelUrdu: "پیغامات" 
    },
  ];

  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-outline-variant/10 p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">M</div>
          <span className="text-2xl font-black text-primary tracking-tight">
            Mazdoor<span className="text-secondary">Market</span>
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between px-4 py-3 rounded-2xl text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all group"
            >
              <div className="flex items-center gap-3">
                {link.icon}
                <span className="font-bold">{link.label}</span>
              </div>
              <span className="font-urdu text-sm opacity-0 group-hover:opacity-100 transition-opacity text-primary/70">{link.labelUrdu}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-4 pt-6 border-t border-outline-variant/10">
          <button
            onClick={() => toast.success("Profile management coming soon!")}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-on-surface-variant hover:bg-surface-container-low transition group"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:bg-primary group-hover:text-white transition-all">
               {profile?.name?.[0]?.toUpperCase() || 'C'}
            </div>
            <span className="font-bold text-sm">Account Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-error hover:bg-error/5 transition"
          >
            <LogOut size={20} />
            <span className="font-bold text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header (Mobile Only) */}
        <header className="h-16 flex lg:hidden items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b border-outline-variant/10 sticky top-0 z-30">
          <span className="text-xl font-black text-primary">
            Mazdoor<span className="text-secondary">Market</span>
          </span>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-surface-container-low rounded-full">
              <Bell size={20} className="text-outline" />
            </button>
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
              {profile?.name?.[0] || 'C'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-24 lg:pb-8 bg-[#fdfdfd]">
          {children}
        </main>
      </div>

      {/* Bottom Nav (Mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-outline-variant/20 flex justify-around items-center py-2 px-2 pb-safe">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex flex-col items-center gap-1 p-2 text-outline hover:text-primary transition-colors min-w-[64px]"
          >
            {link.icon}
            <span className="text-[10px] font-bold">{link.label}</span>
          </Link>
        ))}
        <button
          onClick={() => toast.success("Profile coming soon!")}
          className="flex flex-col items-center gap-1 p-2 text-outline hover:text-primary transition-colors min-w-[64px]"
        >
          <User size={20} />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </nav>
    </div>
  );
}
