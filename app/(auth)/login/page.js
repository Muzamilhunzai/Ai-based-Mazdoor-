"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, googleSignIn } = useAuth();
  const router = useRouter();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const role = await login(email, password);
      router.push(role === "worker" ? "/dashboard/worker" : "/dashboard/customer");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await googleSignIn(); 
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const loginAsDemo = async (role) => {
    setLoading(true);
    setError("");
    const demoEmail = role === 'worker' ? 'worker@demo.com' : 'customer@demo.com';
    const demoPassword = 'password123';

    try {
      const userRole = await login(demoEmail, demoPassword);
      router.push(userRole === "worker" ? "/dashboard/worker" : "/dashboard/customer");
    } catch (err) {
      setError(err.message || "Demo login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="glass-card w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-black text-primary">Mazdoor Market</h1>
          <p className="text-sm text-outline mt-1">Sign in to your account</p>
        </div>

        {/* Demo Logins */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => loginAsDemo('customer')}
            className="flex flex-col items-center gap-1 p-3 bg-primary/5 border border-primary/20 rounded-2xl hover:bg-primary/10 transition group"
          >
            <span className="text-xs font-bold text-primary uppercase">Demo</span>
            <span className="text-sm font-black text-on-surface">Customer</span>
          </button>
          <button 
            onClick={() => loginAsDemo('worker')}
            className="flex flex-col items-center gap-1 p-3 bg-secondary/5 border border-secondary/20 rounded-2xl hover:bg-secondary/10 transition group"
          >
            <span className="text-xs font-bold text-secondary uppercase">Demo</span>
            <span className="text-sm font-black text-on-surface">Worker</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-outline-variant" />
          <span className="text-xs text-outline font-medium uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-outline-variant" />
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-error/10 text-error text-sm p-3 rounded-lg">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Google Sign‑in */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
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

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-outline" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="input-field pl-10"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-outline" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-field pl-10"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? "Signing in..." : <><LogIn size={18} /> Sign in</>}
          </button>
        </form>

        <p className="text-center text-sm text-outline">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}