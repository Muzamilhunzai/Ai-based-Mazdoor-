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
  const [role, setRole] = useState("customer");   
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const result = await signup(email, password, name, role, phone);
      if (result === "login_required") {
        router.push("/login");
      }
    } catch (err) {
      setError(err.message?.replace("Firebase: ", "") || "Signup failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="glass-card w-full max-w-md p-6 md:p-8 space-y-5">
        <div className="text-center">
          <h1 className="text-3xl font-black text-primary">Create Account</h1>
          <p className="text-sm text-outline mt-1">Join Mazdoor Market</p>
        </div>

        <div className="flex p-1 bg-surface-container-low rounded-full">
          <button type="button" onClick={() => setRole("customer")} className={`flex-1 py-2.5 rounded-full text-sm font-bold transition ${role === "customer" ? "bg-primary text-white shadow" : "text-outline"}`}>
            <span className="flex items-center justify-center gap-1"><Briefcase size={16} /> I want to hire</span>
          </button>
          <button type="button" onClick={() => setRole("worker")} className={`flex-1 py-2.5 rounded-full text-sm font-bold transition ${role === "worker" ? "bg-primary text-white shadow" : "text-outline"}`}>
            <span className="flex items-center justify-center gap-1"><UserCheck size={16} /> I want to work</span>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-error/10 text-error text-sm p-3 rounded-lg">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-5 h-5 text-outline" />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="input-field pl-10" required />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-outline" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="input-field pl-10" required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-outline" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="input-field pl-10" required />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 w-5 h-5 text-outline" />
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)" className="input-field pl-10" />
          </div>

          <div className="flex items-start gap-2">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 rounded" id="terms" />
            <label htmlFor="terms" className="text-sm text-outline">I agree to the <a href="#" className="text-primary hover:underline">Terms</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a></label>
          </div>

          <button type="submit" disabled={loading || !agree} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? "Creating account..." : <>Create account <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="text-center text-sm text-outline">
          Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}