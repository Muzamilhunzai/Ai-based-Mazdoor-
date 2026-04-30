// app/(auth)/signup/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  User, Mail, Lock, Phone, Briefcase, UserCheck, AlertCircle, ArrowRight
} from "lucide-react";

export default function SignupPage() {
  const { signup, googleSignIn } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("customer");   // "customer" or "worker"
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Password strength
  const strength = (pw) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const strengthLabel = ["Weak", "Fair", "Good", "Strong"];

  // ──────────── Email/Password Signup ────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    if (!agree) {
      setError("You must agree to the Terms & Privacy Policy");
      return;
    }

    setLoading(true);
    try {
      const userRole = await signup(email, password, name, role, phone);

      // 🔥 IMMEDIATE REDIRECT to the correct dashboard
      if (userRole === "worker") {
        router.push("/dashboard/worker");
      } else {
        router.push("dashboard/customer");
      }
    } catch (err) {
      setError(err.message?.replace("Firebase: ", "") || "Signup failed");
      setLoading(false);
    }
  };

  // ──────────── Google Signup ────────────
  const handleGoogle = async () => {
    setError("");
    if (!agree) {
      setError("You must agree to the Terms & Privacy Policy");
      return;
    }
    setLoading(true);
    try {
      const userRole = await googleSignIn(role);

      // 🔥 IMMEDIATE REDIRECT after Google popup
      if (userRole === "worker") {
        router.push("/dashboard/worker");
      } else {
        router.push("/dashboard/customer/");
      }
    } catch (err) {
      setError(err.message?.replace("Firebase: ", "") || "Google signup failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="glass-card w-full max-w-md p-6 md:p-8 space-y-5">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-primary">Create Account</h1>
          <p className="text-sm text-outline mt-1">Join Mazdoor Market</p>
        </div>

        {/* Role Toggle */}
        <div className="flex p-1 bg-surface-container-low rounded-full">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`flex-1 py-2.5 rounded-full text-sm font-bold transition ${
              role === "customer" ? "bg-primary text-white shadow" : "text-outline"
            }`}
          >
            <span className="flex items-center justify-center gap-1">
              <Briefcase size={16} /> I want to hire
            </span>
          </button>
          <button
            type="button"
            onClick={() => setRole("worker")}
            className={`flex-1 py-2.5 rounded-full text-sm font-bold transition ${
              role === "worker" ? "bg-primary text-white shadow" : "text-outline"
            }`}
          >
            <span className="flex items-center justify-center gap-1">
              <UserCheck size={16} /> I want to work
            </span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-error/10 text-error text-sm p-3 rounded-lg">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={loading || !agree}
          className="w-full py-3 bg-white border border-outline-variant rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-surface-container-low transition disabled:opacity-60"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-outline-variant" />
          <span className="text-xs text-outline font-medium">or with email</span>
          <div className="flex-1 h-px bg-outline-variant" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-5 h-5 text-outline" />
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full pl-10 py-3 bg-surface-container-low rounded-full outline-none placeholder:text-outline-variant"
              required
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-outline" />
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full pl-10 py-3 bg-surface-container-low rounded-full outline-none placeholder:text-outline-variant"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-outline" />
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 py-3 bg-surface-container-low rounded-full outline-none placeholder:text-outline-variant"
              required
            />
          </div>

          {/* Strength indicator */}
          {password.length > 0 && (
            <div className="flex items-center gap-2 px-2">
              <div className="flex-1 h-2 bg-surface-container-low rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    strength(password) >= 3 ? "bg-primary" : "bg-secondary"
                  }`}
                  style={{ width: `${(strength(password) / 4) * 100}%` }}
                />
              </div>
              <span className="text-xs text-outline">
                {strengthLabel[strength(password) - 1] || "Weak"}
              </span>
            </div>
          )}

          <div className="relative">
            <Phone className="absolute left-3 top-3.5 w-5 h-5 text-outline" />
            <input
              type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (optional)"
              className="w-full pl-10 py-3 bg-surface-container-low rounded-full outline-none placeholder:text-outline-variant"
            />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)}
              className="mt-1 rounded" id="terms"
            />
            <label htmlFor="terms" className="text-sm text-outline">
              I agree to the <a href="#" className="text-primary hover:underline">Terms</a> and{" "}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !agree}
            className="w-full py-3 bg-primary text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition disabled:opacity-60"
          >
            {loading ? (
              "Creating account..."
            ) : (
              <>
                Create account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-outline">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}