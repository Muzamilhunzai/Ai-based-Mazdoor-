"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  MessageSquare,
  User,
  LogOut,
  Bell,
} from "lucide-react";
import toast from "react-hot-toast";

export default function WorkerLayout({ children }) {
  const { user, profile, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return null;
  }

  if (profile?.role && profile.role !== "worker") {
    router.push("/dashboard/customer");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const navLinks = [
    { href: "/dashboard/worker", icon: <LayoutDashboard size={20} />, label: "Dashboard", labelUrdu: "ڈیش بورڈ" },
    { href: "/dashboard/worker/incoming", icon: <Briefcase size={20} />, label: "Requests", labelUrdu: "درخواستیں" },
    { href: "/dashboard/worker/active", icon: <ClipboardList size={20} />, label: "Active Jobs", labelUrdu: "فعال کام" },
    { href: "/dashboard/worker/messages", icon: <MessageSquare size={20} />, label: "Messages", labelUrdu: "پیغامات" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-outline-variant/10 p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">M</div>
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
              <span className="font-urdu text-sm opacity-0 group-hover:opacity-100 transition-opacity">{link.labelUrdu}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-4 pt-6 border-t border-outline-variant/10">
          <button
            onClick={() => toast.error("Profile coming soon!")}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-on-surface-variant hover:bg-surface-container-low transition"
          >
            <User size={20} />
            <span className="font-bold text-sm">My Profile</span>
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
        {/* Top Header (Mobile & Desktop) */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b border-outline-variant/10 sticky top-0 z-30 lg:hidden">
          <span className="text-xl font-black text-primary">
            Mazdoor<span className="text-secondary">Market</span>
          </span>
          <button className="p-2 bg-surface-container-low rounded-full">
            <Bell size={20} className="text-outline" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto pb-24 lg:pb-8">
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
          onClick={() => toast.error("Profile coming soon!")}
          className="flex flex-col items-center gap-1 p-2 text-outline hover:text-primary transition-colors min-w-[64px]"
        >
          <User size={20} />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </nav>
    </div>
  );
}
