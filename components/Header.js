// components/Header.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, LogOut, User } from "lucide-react";

export default function Header() {
  const { user, profile, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-outline-variant/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold text-primary tracking-tight">
          Mazdoor<span className="text-secondary">Market</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/dashboard/customer" className="hover:text-primary transition-colors">Find Workers</Link>
          <Link href="/dashboard/worker" className="hover:text-primary transition-colors">Find Work</Link>
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <button onClick={logout} className="flex items-center gap-1 text-sm text-outline hover:text-error transition-colors">
                <LogOut size={16} /> Sign out
              </button>
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
                {profile?.name?.[0] || user.email?.[0] || <User size={16} />}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-primary hover:underline">Log in</Link>
              <Link href="/signup" className="px-4 py-2 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary-container transition-colors shadow-md">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-background border-t border-outline-variant/20 p-4 space-y-3">
          <Link href="/dashboard/customer" className="block text-sm font-medium hover:text-primary" onClick={() => setOpen(false)}>Find Workers</Link>
          <Link href="/dashboard/worker" className="block text-sm font-medium hover:text-primary" onClick={() => setOpen(false)}>Find Work</Link>
          {user ? (
            <button onClick={() => { logout(); setOpen(false); }} className="text-sm text-error flex items-center gap-1">
              <LogOut size={14} /> Sign out
            </button>
          ) : (
            <Link href="/login" className="block text-sm font-medium hover:text-primary" onClick={() => setOpen(false)}>Log in</Link>
          )}
        </div>
      )}
    </header>
  );
}