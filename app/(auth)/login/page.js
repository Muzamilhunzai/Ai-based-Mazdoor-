"use client";
export const dynamic = "force-dynamic";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import {
  Mail, Lock, LogIn, AlertCircle, User, Briefcase,
  ArrowLeft, Eye, EyeOff, Fingerprint,
  ArrowRight, CheckCircle, ShieldCheck, Phone
} from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // <-- IMPORT THIS

// ---------- GLASSMORPHISM BACKGROUND ----------
const GlassBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-primary-container/30 via-background to-secondary/10" />
    <motion.div
      animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
    />
    <motion.div
      animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl"
    />
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 8, repeat: Infinity }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary-container/20 rounded-full blur-3xl"
    />
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(to right, var(--outline) 1px, transparent 1px),
                          linear-gradient(to bottom, var(--outline) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }}
    />
    {Array.from({ length: 12 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          backgroundColor: i % 3 === 0 ? "var(--primary)" : i % 3 === 1 ? "var(--secondary)" : "var(--primary-container)",
        }}
        animate={{
          y: [0, -40, 0],
          opacity: [0.1, 0.4, 0.1],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 5 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 3,
        }}
      />
    ))}
  </div>
);

// ---------- 3D TILT CARD ----------
const TiltCard = ({ children }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xVal = (e.clientX - rect.left) / rect.width - 0.5;
    const yVal = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xVal);
    y.set(yVal);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full max-w-md mx-4"
      initial={{ opacity: 0, y: 60, scale: 0.9, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1, type: "spring", bounce: 0.3 }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="relative backdrop-blur-3xl bg-background/80 border border-outline-variant/30 rounded-[2rem] shadow-2xl shadow-primary/10 overflow-hidden"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 rounded-[2rem] p-[1.5px] bg-gradient-to-r from-primary via-primary-container to-secondary opacity-40" />
        <div className="relative rounded-[2rem] bg-gradient-to-b from-background/95 to-surface-variant/30 p-8 md:p-10 h-full">
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ---------- INPUT FIELD ----------
const InputField = ({ icon: Icon, type, value, onChange, placeholder, showToggle, onToggle }) => (
  <motion.div className="relative group">
    <div className="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-focus-within:text-primary transition-colors z-10" />
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="relative w-full pl-12 pr-4 py-4 bg-surface-variant/40 border-2 border-outline-variant/20 rounded-2xl focus:border-primary/40 focus:bg-background text-on-background outline-none transition-all placeholder:text-outline/50 text-sm font-medium"
      required
    />
    {showToggle && (
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors z-10"
      >
        {type === "password" ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    )}
  </motion.div>
);

// ---------- DEMO LOGIN BUTTON ----------
const DemoButton = ({ role, active, onClick, isLoading }) => {
  const isCustomer = role === "customer";
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(role)}
      disabled={isLoading}
      className={`relative flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all overflow-hidden ${
        active
          ? isCustomer
            ? "bg-primary-container/60 border-primary/40 shadow-lg shadow-primary/10"
            : "bg-secondary/10 border-secondary/40 shadow-lg shadow-secondary/10"
          : "bg-surface-variant/30 border-outline-variant/20 hover:border-primary/20 hover:bg-primary-container/20"
      }`}
    >
      {active && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
        isCustomer ? "bg-primary/10" : "bg-secondary/10"
      }`}>
        {isCustomer ? (
          <User size={22} className={active ? "text-primary" : "text-primary/70"} />
        ) : (
          <Briefcase size={22} className={active ? "text-secondary" : "text-secondary/70"} />
        )}
      </div>
      <div className="relative text-center">
        <span className={`text-[10px] font-black uppercase tracking-wider ${
          isCustomer ? "text-primary" : "text-secondary"
        }`}>
          Demo
        </span>
        <p className="text-sm font-black text-on-background mt-0.5">
          {isCustomer ? "Customer" : "Worker"}
        </p>
        <p className="font-urdu text-[10px] text-outline mt-0.5">
          {isCustomer ? "کسٹمر" : "مزدور"}
        </p>
      </div>
      {active && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2"
        >
          <CheckCircle size={16} className="text-primary" />
        </motion.div>
      )}
    </motion.button>
  );
};

// ---------- LOGIN PAGE ----------
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeDemo, setActiveDemo] = useState(null);
  const router = useRouter();
  const { login } = useAuth(); // <-- USE AUTH CONTEXT

  const handleEmailLogin = useCallback(async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const role = await login(email, password); // <-- USE AUTH CONTEXT LOGIN
      const route = role === "worker" ? "/dashboard/worker" : "/dashboard/customer";
      router.push(route);
    } catch (err) {
      // Error already toasted in AuthContext
    } finally {
      setLoading(false);
    }
  }, [email, password, login, router]);

  const loginAsDemo = useCallback(async (role) => {
    setActiveDemo(role);
    setLoading(true);

    const demoEmail = role === "customer" ? "customer@demo.com" : "worker@demo.com";
    const demoPassword = "demo123"; // any password works for demo in your AuthContext

    try {
      const returnedRole = await login(demoEmail, demoPassword); // <-- USE AUTH CONTEXT
      const route = returnedRole === "worker" ? "/dashboard/worker" : "/dashboard/customer";
      router.push(route);
    } catch (err) {
      // Error already toasted in AuthContext
    } finally {
      setLoading(false);
      setActiveDemo(null);
    }
  }, [login, router]);

  return (
    <div className="relative w-full min-h-screen bg-background overflow-hidden flex items-center justify-center">
      <GlassBackground />

      {/* Back to Home */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <Link
          href="/"
          className="absolute top-6 left-6 z-20 flex items-center gap-2.5 px-5 py-3 bg-background/80 backdrop-blur-xl border border-outline-variant/30 rounded-2xl text-on-background text-sm font-bold hover:bg-primary-container/20 hover:border-primary/30 transition-all shadow-lg"
        >
          <ArrowLeft size={18} className="text-primary" />
          <span>Back</span>
          <span className="font-urdu text-xs text-outline">واپس</span>
        </Link>
      </motion.div>

      {/* Brand Logo Top Right */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-6 right-6 z-20 flex items-center gap-3"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
          <Briefcase size={24} className="text-on-primary" />
        </div>
        <div>
          <div className="text-on-background font-black text-base leading-tight">
            Mazdoor<span className="text-primary">Market</span>
          </div>
          <div className="text-primary text-[10px] font-black uppercase tracking-[0.15em]">
            AI Seekho 2026
          </div>
        </div>
      </motion.div>

      <TiltCard>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-container to-primary/10 border-2 border-primary/20 flex items-center justify-center shadow-xl shadow-primary/10"
            >
              <Fingerprint size={40} className="text-primary" />
            </motion.div>
            <h1 className="text-3xl font-black text-on-background">
              Welcome Back
            </h1>
            <p className="text-xs text-outline font-bold uppercase tracking-[0.2em]">
              Portal Access / <span className="font-urdu text-sm">پورٹل رسائی</span>
            </p>
          </div>

          {/* Demo Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <DemoButton
              role="customer"
              active={activeDemo === "customer"}
              onClick={loginAsDemo}
              isLoading={loading}
            />
            <DemoButton
              role="worker"
              active={activeDemo === "worker"}
              onClick={loginAsDemo}
              isLoading={loading}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-outline-variant to-transparent" />
            <span className="text-[10px] text-outline font-black uppercase tracking-[0.2em]">
              or continue
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-outline-variant to-transparent" />
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="flex items-center gap-2.5 bg-error/10 border border-error/20 text-error text-xs p-4 rounded-2xl font-medium"
              >
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <InputField
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address / ای میل"
            />
            <InputField
              icon={Lock}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password / پاس ورڈ"
              showToggle
              onToggle={() => setShowPassword(!showPassword)}
            />

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 rounded-lg border-2 border-outline-variant bg-surface-variant/50 peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                    <CheckCircle size={12} className="text-on-primary opacity-0 peer-checked:opacity-100" />
                  </div>
                </div>
                <span className="text-xs text-outline font-medium group-hover:text-on-background transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary font-bold hover:text-primary/70 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-2xl font-black flex items-center justify-center gap-2.5 hover:shadow-xl hover:shadow-primary/20 transition-all disabled:opacity-60 text-sm relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <span className="relative">Sign In</span>
                  <span className="relative font-urdu text-xs">سائن ان</span>
                  <LogIn size={18} className="relative" />
                </>
              )}
            </motion.button>
          </form>

          {/* Social Login */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-outline-variant/50 to-transparent" />
              <span className="text-[10px] text-outline font-black uppercase tracking-wider">
                Social Login
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-outline-variant/50 to-transparent" />
            </div>
            <div className="flex gap-3">
              {[
                { name: "Google", icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )},
                { name: "Phone", icon: <Phone size={16} /> }
              ].map((provider) => (
                <motion.button
                  key={provider.name}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3.5 bg-surface-variant/50 border-2 border-outline-variant/20 rounded-2xl text-outline text-xs font-bold hover:bg-primary-container/20 hover:border-primary/20 transition-all flex items-center justify-center gap-2"
                >
                  {provider.icon}
                  {provider.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center space-y-3 pt-2">
            <p className="text-sm text-outline">
              New here?{" "}
              <Link
                href="/signup"
                className="text-primary font-black hover:text-primary/70 transition-colors inline-flex items-center gap-1"
              >
                Create Account <ArrowRight size={14} />
              </Link>
            </p>
            <div className="flex items-center justify-center gap-2 text-[10px] text-outline/60">
              <ShieldCheck size={12} />
              <span>End-to-end encrypted / <span className="font-urdu">مکمل تحفظ</span></span>
            </div>
          </div>
        </div>
      </TiltCard>

      {/* Floating decorative elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-16 left-16 w-24 h-24 border border-primary/10 rounded-full hidden lg:block"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-24 right-16 w-32 h-32 border border-secondary/10 rounded-full hidden lg:block"
      />
    </div>
  );
}
