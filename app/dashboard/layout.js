"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }

      // If user exists but profile is still missing, we might be in the middle of a fetch
      // Let's give it a moment or show a loading state
      if (!profile) return;

      const role = profile?.role || "customer";
      
      // Prevent redirection loops and allow access to sub-pages
      if (role === "worker" && !pathname.startsWith("/dashboard/worker")) {
        router.replace("/dashboard/worker");
      } else if (role === "customer" && !pathname.startsWith("/dashboard/customer")) {
        router.replace("/dashboard/customer");
      } else if (role === "admin" && !pathname.startsWith("/dashboard/admin")) {
        router.replace("/dashboard/admin");
      }
    }
  }, [user, profile, loading, router, pathname]);

  if (loading || (user && !profile)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-sm text-outline animate-pulse">Setting up your dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}
