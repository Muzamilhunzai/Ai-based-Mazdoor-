"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import {
  User, Mail, Lock, Phone, Briefcase, UserCheck,
  AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff,
  Sparkles, Shield, MapPin, CheckCircle2, ChevronRight,
  Zap, Globe, Star, Crown, CheckCircle
} from "lucide-react";

// ---------- GLASSMORPHISM BACKGROUND (matching header colors) ----------
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
  const rotateX = useTransform(y, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-6, 6]);

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
      className="relative w-full max-w-lg mx-4"
      initial={{ opacity: 0, y: 60, scale: 0.9, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1, type: "spring", bounce: 0.3 }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
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
      className="relative w-full pl-12 pr-4 py-3.5 bg-surface-variant/40 border-2 border-outline-variant/20 rounded-2xl focus:border-primary/40 focus:bg-background text-on-background outline-none transition-all placeholder:text-outline/50 text-sm font-medium"
      required={!placeholder.includes("optional")}
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

// ---------- STEP INDICATOR ----------
const StepIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex items-center gap-2 justify-center mb-6">
    {Array.from({ length: totalSteps }).map((_, i) => (
      <motion.div
        key={i}
        className={`h-2 rounded-full transition-all ${
          i < currentStep
            ? "bg-primary w-10"
            : i === currentStep
            ? "bg-primary w-10"
            : "bg-outline-variant/40 w-5"
        }`}
        initial={false}
        animate={{
          width: i < currentStep ? 40 : i === currentStep ? 40 : 20,
          backgroundColor: i <= currentStep ? "var(--primary)" : "var(--outline-variant)",
        }}
      />
    ))}
  </div>
);

// ---------- ROLE TOGGLE BUTTON ----------
const RoleToggle = ({ role, setRole }) => (
  <div className="flex p-1.5 bg-surface-variant/50 rounded-2xl border border-outline-variant/20">
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => setRole("customer")}
      className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
        role === "customer"
          ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
          : "text-outline hover:text-on-background"
      }`}
    >
      <Briefcase size={15} />
      <span>I want to hire</span>
      <span className="font-urdu text-[10px]">کرایہ پر لیں</span>
    </motion.button>
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => setRole("worker")}
      className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
        role === "worker"
          ? "bg-secondary text-on-secondary shadow-lg shadow-secondary/20"
          : "text-outline hover:text-on-background"
      }`}
    >
      <UserCheck size={15} />
      <span>I want to work</span>
      <span className="font-urdu text-[10px]">کام تلاش کریں</span>
    </motion.button>
  </div>
);

// ---------- SIGNUP PAGE ----------
export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("customer");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
    cnic: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateStep = () => {
    if (step === 0) {
      if (!formData.name || !formData.email) return "Name and email are required";
      if (!formData.email.includes("@")) return "Please enter a valid email";
    }
    if (step === 1) {
      if (!formData.password || formData.password.length < 6)
        return "Password must be at least 6 characters";
      if (formData.password !== formData.confirmPassword)
        return "Passwords do not match";
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) return setError(err);
    setError("");
    if (step < 2) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) return setError("Please agree to the terms");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 2500);
  };

  const cities = [
    "Lahore", "Karachi", "Islamabad", "Rawalpindi",
    "Faisalabad", "Multan", "Peshawar", "Quetta"
  ];

  // FIX: Define step config with proper component references
  const stepConfig = [
    { title: "Personal Info", urdu: "ذاتی معلومات", Icon: User },
    { title: "Security", urdu: "سیکیورٹی", Icon: Shield },
    { title: "Location", urdu: "مقام", Icon: MapPin },
  ];

  // FIX: Get current step icon component
  const CurrentStepIcon = stepConfig[step].Icon;

  return (
    <div className="relative w-full min-h-screen bg-background overflow-hidden flex items-center justify-center py-8">
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

      {/* Brand Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-6 right-6 z-20 flex items-center gap-3"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
          <Sparkles size={24} className="text-on-primary" />
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
        <div className="space-y-5">
          {/* Header */}
          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-primary-container to-primary/10 border-2 border-primary/20 flex items-center justify-center shadow-xl shadow-primary/10"
            >
              <UserCheck size={40} className="text-primary" />
            </motion.div>
            <h1 className="text-3xl font-black text-on-background">
              Join the Market
            </h1>
            <p className="text-xs text-outline font-bold uppercase tracking-[0.2em]">
              Create your identity / <span className="font-urdu text-sm">اپنا اکاؤنٹ بنائیں</span>
            </p>
          </div>

          {/* FIX: Step Title with proper component usage */}
          <div className="flex items-center justify-center gap-2">
            <CurrentStepIcon size={16} className="text-primary" />
            <span className="text-sm font-bold text-on-background">
              {stepConfig[step].title}
            </span>
            <span className="text-xs text-outline font-urdu">
              {stepConfig[step].urdu}
            </span>
          </div>

          <StepIndicator currentStep={step} totalSteps={3} />

          {/* Role Toggle */}
          <RoleToggle role={role} setRole={setRole} />

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

          {/* Form Steps */}
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {step === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-4"
              >
                <InputField
                  icon={User}
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Full Name / پورا نام"
                />
                <InputField
                  icon={Mail}
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="Email Address / ای میل"
                />
                <InputField
                  icon={Phone}
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="Phone (optional) / فون (اختیاری)"
                />
              </motion.div>
            )}

            {/* Step 2: Password */}
            {step === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-4"
              >
                <InputField
                  icon={Lock}
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="Password / پاس ورڈ"
                  showToggle
                  onToggle={() => setShowPassword(!showPassword)}
                />
                <InputField
                  icon={Shield}
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  placeholder="Confirm Password / تصدیق پاس ورڈ"
                  showToggle
                  onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                />
                {/* Password Strength */}
                <div className="flex items-center gap-2 px-1">
                  {[0, 5, 8].map((threshold, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                        formData.password.length > threshold
                          ? "bg-primary"
                          : "bg-outline-variant/30"
                      }`}
                    />
                  ))}
                  <span className="text-[10px] text-outline font-medium ml-1">
                    {formData.password.length > 8
                      ? "Strong"
                      : formData.password.length > 5
                      ? "Medium"
                      : formData.password.length > 0
                      ? "Weak"
                      : "Strength"}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Step 3: Location & Terms */}
            {step === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-4"
              >
                {/* City Select */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-focus-within:text-primary transition-colors z-10" />
                  <select
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="relative w-full pl-12 pr-10 py-3.5 bg-surface-variant/40 border-2 border-outline-variant/20 rounded-2xl focus:border-primary/40 focus:bg-background text-on-background outline-none transition-all text-sm font-medium appearance-none"
                  >
                    <option value="" className="bg-background text-outline">
                      Select City / شہر منتخب کریں
                    </option>
                    {cities.map((city) => (
                      <option key={city} value={city} className="bg-background text-on-background">
                        {city}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline rotate-90" />
                </div>

                <InputField
                  icon={Shield}
                  type="text"
                  value={formData.cnic}
                  onChange={(e) => updateField("cnic", e.target.value)}
                  placeholder="CNIC (optional) / شناختی کارڈ"
                />

                {/* Terms Checkbox */}
                <motion.div
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    agree
                      ? "bg-primary-container/20 border-primary/30"
                      : "bg-surface-variant/30 border-outline-variant/20 hover:border-primary/20"
                  }`}
                  onClick={() => setAgree(!agree)}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all mt-0.5 ${
                      agree
                        ? "bg-primary border-primary"
                        : "border-outline-variant bg-background"
                    }`}
                  >
                    {agree && <CheckCircle size={14} className="text-on-primary" />}
                  </div>
                  <div className="text-xs text-outline leading-relaxed">
                    I agree to the{" "}
                    <span className="text-primary font-bold">Terms of Service</span>{" "}
                    and{" "}
                    <span className="text-primary font-bold">Privacy Policy</span>.
                    I confirm that I am 18+ years old.
                    <br />
                    <span className="font-urdu text-[10px]">
                      میں شرائط و ضوابط سے اتفاق کرتا ہوں
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBack}
                className="px-6 py-4 bg-surface-variant/50 border-2 border-outline-variant/20 rounded-2xl text-on-background font-bold text-sm hover:bg-primary-container/20 hover:border-primary/20 transition-all"
              >
                Back
              </motion.button>
            )}

            {step < 2 ? (
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="flex-1 py-4 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-2xl font-black flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/20 transition-all text-sm"
              >
                Continue <ArrowRight size={18} />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading || !agree}
                className="flex-1 py-4 bg-gradient-to-r from-primary via-primary-container to-secondary text-on-primary rounded-2xl font-black flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/20 transition-all text-sm disabled:opacity-50 relative overflow-hidden group"
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
                    <span className="relative">Create Account</span>
                    <span className="relative font-urdu text-xs">اکاؤنٹ بنائیں</span>
                    <Sparkles size={18} className="relative" />
                  </>
                )}
              </motion.button>
            )}
          </div>

          {/* Footer */}
          <div className="text-center space-y-3 pt-2">
            <p className="text-sm text-outline">
              Already a member?{" "}
              <Link
                href="/login"
                className="text-primary font-black hover:text-primary/70 transition-colors inline-flex items-center gap-1"
              >
                Sign In Instead <ArrowRight size={14} />
              </Link>
            </p>
            <div className="flex items-center justify-center gap-4 text-[10px] text-outline/60">
              <span className="flex items-center gap-1.5">
                <Shield size={12} /> Secure
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={12} /> Verified
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} /> AI-Powered
              </span>
            </div>
          </div>
        </div>
      </TiltCard>

      {/* Floating rings */}
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