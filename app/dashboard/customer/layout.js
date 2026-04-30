// app/customer/layout.jsx
"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  User,
  LogOut,
} from "lucide-react";

export default function CustomerLayout({ children }) {
  const { user, profile, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return null;
  }

  // force role check (if you have a role field)
  if (profile?.role && profile.role !== "customer") {
    router.push("/dashboard/worker");
    return null;
  }

  return (
    <div className="flex min-h-screen pb-16 lg:pb-0">
{/* Sidebar (desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white/80 backdrop-blur-md border-r border-outline-variant/20 p-4">
        <div className="text-2xl font-black text-primary mb-8">
          Mazdoor<span className="text-secondary">Market</span>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          <SidebarLink href="/dashboard/customer" icon={<LayoutDashboard size={18} />}>
            Dashboard
          </SidebarLink>
          <SidebarLink href="/dashboard/customer/job-post" icon={<Briefcase size={18} />}>
            Post a Job
          </SidebarLink>
          <SidebarLink href="/dashboard/customer/messages" icon={<MessageSquare size={18} />}>
            Messages
          </SidebarLink>
          <SidebarLink href="/dashboard/profile" icon={<User size={18} />}>
            Profile
          </SidebarLink>
        </nav>
        <button
          onClick={() => logout()}
          className="flex items-center gap-2 text-sm text-outline hover:text-error transition mt-4"
        >
          <LogOut size={16} /> Sign out
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-background overflow-y-auto">
        {children}
      </main>

      {/* Bottom Nav (mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-outline-variant/20 flex justify-around py-3">
        <MobileNav href="/dashboard/customer" icon={<LayoutDashboard size={20} />} label="Home" />
        <MobileNav href="/dashboard/customer/job-post" icon={<Briefcase size={20} />} label="Post" />
        <MobileNav href="/dashboard/customer/messages" icon={<MessageSquare size={20} />} label="Chats" />
        <MobileNav href="/dashboard/profile" icon={<User size={20} />} label="Profile" />
      </nav>
    </div>
  );
}

function SidebarLink({ href, icon, children }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-primary/5 hover:text-primary transition"
    >
      {icon}
      {children}
    </Link>
  );
}

function MobileNav({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1 text-xs text-outline hover:text-primary transition"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}