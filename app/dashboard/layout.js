"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (profile?.role === "worker") {
        router.push("/dashboard/worker");
      } else if (profile?.role === "customer") {
        router.push("/dashboard/customer");
      } else {
        // Default to customer if role is not set
        router.push("/dashboard/customer");
      }
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render children until we redirect
  if (!user || !profile?.role) {
    return null;
  }

  return children;
}
