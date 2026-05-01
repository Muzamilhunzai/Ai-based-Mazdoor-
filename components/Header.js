"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Menu, X, LogOut, User, Bell, Search,
  MapPin, ChevronDown, Sparkles, Briefcase,
  Home, Shield, Heart, Settings, TrendingUp,
  Zap, MessageCircle, Crown, Star, Clock,
  LogIn, UserPlus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ---------- ANIMATED NOTIFICATION BELL ----------
const NotificationBell = ({ count }) => {
  const [ringing, setRinging] = useState(false);

  useEffect(() => {
    if (count > 0) {
      setRinging(true);
      const timer = setTimeout(() => setRinging(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative p-2.5 rounded-xl hover:bg-primary-container/30 transition-colors group"
    >
      <motion.div
        animate={ringing ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
        transition={{ duration: 0.6 }}
      >
        <Bell
          size={22}
          className="text-outline group-hover:text-primary transition-colors"
        />
      </motion.div>
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-gradient-to-r from-error to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-error/30 border-2 border-background"
          >
            <span className="text-[10px] font-black text-white px-1">
              {count > 9 ? "9+" : count}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// ---------- PREMIUM USER DROPDOWN ----------
const UserDropdown = ({ user, profile, logout }) => {
  const [open, setOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { icon: User, label: "Profile", labelUrdu: "پروفائل", href: "/profile", color: "text-primary" },
    { icon: Briefcase, label: "My Jobs", labelUrdu: "میرے کام", href: "/jobs", color: "text-secondary" },
    { icon: Heart, label: "Saved", labelUrdu: "محفوظ", href: "/saved", color: "text-error" },
    { icon: Star, label: "Reviews", labelUrdu: "جائزے", href: "/reviews", color: "text-yellow-500" },
    { icon: Settings, label: "Settings", labelUrdu: "ترتیبات", href: "/settings", color: "text-outline" },
  ];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-2xl transition-all duration-300 border ${
          open
            ? "bg-primary-container/40 border-primary/30 shadow-lg shadow-primary/10"
            : "bg-surface-variant/40 border-outline-variant/20 hover:bg-primary-container/20 hover:border-primary/20"
        }`}
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary/20">
            {profile?.name?.[0]?.toUpperCase() ||
              user?.email?.[0]?.toUpperCase() || <User size={18} />}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background" />
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-sm font-bold text-on-primary-container leading-tight">
            {profile?.name || user?.email?.split("@")[0]}
          </p>
          <p className="text-[10px] text-outline font-medium">
            {profile?.role === "worker" ? "Verified Worker" : "Premium Customer"}
          </p>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={16} className="text-outline" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(10px)" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 top-full mt-3 w-80 bg-background/95 backdrop-blur-3xl rounded-3xl border border-outline-variant/30 shadow-2xl shadow-black/20 z-50 overflow-hidden"
            >
              {/* User Header */}
              <div className="relative p-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-container/40 via-primary-container/20 to-secondary/10" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                <div className="relative flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-primary/20"
                  >
                    {profile?.name?.[0]?.toUpperCase() ||
                      user?.email?.[0]?.toUpperCase()}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-black text-on-primary-container text-base truncate">
                        {profile?.name || "User"}
                      </p>
                      <Crown size={14} className="text-yellow-500 flex-shrink-0" />
                    </div>
                    <p className="text-xs text-outline truncate">{user?.email}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">
                        Online
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-3 mt-4">
                  {[
                    { value: "4.9", label: "Rating", icon: Star },
                    { value: "12", label: "Jobs", icon: Briefcase },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-background/60 backdrop-blur-sm rounded-xl p-2.5 border border-outline-variant/20"
                    >
                      <div className="flex items-center gap-1.5">
                        <stat.icon size={12} className="text-primary" />
                        <span className="text-lg font-black text-on-background">
                          {stat.value}
                        </span>
                      </div>
                      <span className="text-[10px] text-outline">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-3 space-y-1">
                {menuItems.map((item, i) => (
                  <motion.div
                    key={i}
                    onMouseEnter={() => setHoveredItem(i)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all relative overflow-hidden group"
                    >
                      <AnimatePresence>
                        {hoveredItem === i && (
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="absolute inset-0 bg-primary-container/20 rounded-xl"
                          />
                        )}
                      </AnimatePresence>
                      <div className="relative w-9 h-9 rounded-lg bg-surface-variant flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <item.icon size={16} className={item.color} />
                      </div>
                      <div className="relative flex-1">
                        <span className="text-sm font-bold text-on-background">
                          {item.label}
                        </span>
                        <span className="text-xs text-outline ml-1.5 font-urdu">
                          {item.labelUrdu}
                        </span>
                      </div>
                      <ChevronDown
                        size={14}
                        className="text-outline -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </Link>
                  </motion.div>
                ))}

                <div className="h-px bg-outline-variant/20 mx-3 my-2" />

                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl hover:bg-error/10 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-error/10 flex items-center justify-center">
                    <LogOut size={16} className="text-error" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-error">Sign Out</span>
                    <span className="text-xs text-error/70 ml-1.5 font-urdu">
                      سائن آؤٹ
                    </span>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------- EXPANDING SEARCH BAR ----------
const SearchBar = () => {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");

  const suggestions = [
    { text: "Plumber in Lahore", icon: "🔧", category: "Popular" },
    { text: "Electrician near me", icon: "⚡", category: "Popular" },
    { text: "Carpenter DHA", icon: "🪚", category: "Recent" },
    { text: "Painter Karachi", icon: "🎨", category: "Recent" },
    { text: "Driver available", icon: "🚗", category: "Trending" },
  ];

  return (
    <div className="hidden xl:block relative">
      <motion.div
        animate={{
          width: focused ? 380 : 280,
          boxShadow: focused
            ? "0 0 0 3px rgba(46, 107, 46, 0.15), 0 8px 32px rgba(0,0,0,0.1)"
            : "0 0 0 0px rgba(46, 107, 46, 0)",
        }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative"
      >
        <Search
          size={18}
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-10 ${
            focused ? "text-primary" : "text-outline"
          }`}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search workers, jobs..."
          className="w-full pl-11 pr-10 py-3 bg-surface-variant/60 border border-outline-variant/30 rounded-2xl text-sm text-on-background placeholder:text-outline/50 outline-none focus:bg-background transition-all"
        />
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-outline/10 flex items-center justify-center hover:bg-error/10 transition-colors"
          >
            <X size={12} className="text-outline" />
          </motion.button>
        )}
        {!query && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-surface-variant rounded-md border border-outline-variant/20">
            <span className="text-[10px] text-outline font-medium">⌘K</span>
          </div>
        )}
      </motion.div>

      {/* Search Dropdown */}
      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute top-full left-0 right-0 mt-3 bg-background/95 backdrop-blur-3xl rounded-2xl border border-outline-variant/30 shadow-2xl shadow-black/15 z-50 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={14} className="text-primary" />
                <span className="text-[10px] font-black text-outline uppercase tracking-widest">
                  Quick Search
                </span>
              </div>
              {suggestions.map((s, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setQuery(s.text)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary-container/20 transition-all text-left group"
                >
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-sm text-on-background flex-1">
                    {s.text}
                  </span>
                  <span className="text-[10px] text-outline bg-surface-variant px-2 py-0.5 rounded-full">
                    {s.category}
                  </span>
                </motion.button>
              ))}
            </div>
            <div className="px-4 py-2.5 bg-surface-variant/30 border-t border-outline-variant/20 flex items-center justify-between">
              <span className="text-[10px] text-outline">
                Press <kbd className="px-1.5 py-0.5 bg-background rounded border border-outline-variant/30 text-[10px]">Enter</kbd> to search
              </span>
              <span className="font-urdu text-[10px] text-outline">تلاش کریں</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------- MOBILE MENU ----------
const MobileMenu = ({ open, setOpen, user, profile, logout }) => {
  const menuSections = [
    {
      title: "Menu",
      items: [
        { icon: Home, label: "Home", labelUrdu: "ہوم", href: "/" },
        { icon: Search, label: "Find Workers", labelUrdu: "مزدور تلاش", href: "/dashboard/customer" },
        { icon: Briefcase, label: "Find Work", labelUrdu: "کام تلاش", href: "/dashboard/worker" },
        { icon: TrendingUp, label: "Top Rated", labelUrdu: "بہترین", href: "/top-rated" },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: Shield, label: "Safety Center", labelUrdu: "حفاظت", href: "/safety" },
        { icon: MessageCircle, label: "Help & Support", labelUrdu: "مدد", href: "/help" },
        { icon: Sparkles, label: "About AI", labelUrdu: "AI کے بارے", href: "/about" },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 md:hidden"
          />
          <motion.div
            initial={{ x: "-100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-[88%] max-w-sm bg-background z-50 md:hidden overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="relative p-6 pb-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-container/30 via-primary-container/10 to-secondary/5" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

              <div className="relative flex items-center justify-between mb-8">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                    <Briefcase size={20} className="text-white" />
                  </div>
                  <span className="text-xl font-extrabold">
                    <span className="text-primary">Mazdoor</span>
                    <span className="text-secondary">Market</span>
                  </span>
                </Link>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setOpen(false)}
                  className="p-2.5 rounded-xl bg-surface-variant hover:bg-primary-container/30 transition-colors"
                >
                  <X size={20} className="text-on-background" />
                </motion.button>
              </div>

              {user ? (
                <div className="relative flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                      {profile?.name?.[0]?.toUpperCase() ||
                        user?.email?.[0]?.toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-[3px] border-background" />
                  </div>
                  <div>
                    <p className="font-black text-on-primary-container text-lg">
                      {profile?.name || "User"}
                    </p>
                    <p className="text-xs text-outline">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2.5 py-1 bg-primary-container/50 rounded-full text-[10px] font-bold text-primary border border-primary/20">
                        Verified
                      </span>
                      <span className="px-2.5 py-1 bg-yellow-500/10 rounded-full text-[10px] font-bold text-yellow-600 border border-yellow-500/20">
                        ⭐ 4.9
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative space-y-3">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block w-full py-3.5 text-center border-2 border-outline-variant/30 rounded-2xl text-sm font-bold text-on-background hover:bg-surface-variant transition-all"
                  >
                    Log In / <span className="font-urdu">سائن ان</span>
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="block w-full py-3.5 text-center bg-gradient-to-r from-primary to-secondary text-white rounded-2xl text-sm font-black hover:shadow-xl hover:shadow-primary/20 transition-all"
                  >
                    Get Started / <span className="font-urdu">شروع کریں</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Menu Sections */}
            {menuSections.map((section, si) => (
              <div key={si} className="px-4 py-2">
                <p className="text-[10px] font-black text-outline uppercase tracking-widest px-4 mb-2">
                  {section.title}
                </p>
                <div className="space-y-1">
                  {section.items.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-primary-container/20 transition-all group"
                      >
                        <div className="w-11 h-11 rounded-xl bg-surface-variant flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <item.icon
                            size={20}
                            className="text-outline group-hover:text-primary transition-colors"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-on-background text-sm">
                            {item.label}
                          </span>
                          <span className="block text-xs text-outline font-urdu">
                            {item.labelUrdu}
                          </span>
                        </div>
                        <ChevronDown
                          size={16}
                          className="text-outline ml-auto -rotate-90"
                        />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}

            {/* Location */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-primary-container/10 border border-outline-variant/20">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] text-outline uppercase font-bold tracking-wider">
                    Current Location
                  </span>
                  <p className="text-sm font-bold text-on-primary-container">
                    Lahore, Pakistan
                  </p>
                </div>
                <ChevronDown size={16} className="text-outline" />
              </div>
            </div>

            {/* Logout */}
            {user && (
              <div className="px-4 py-3 border-t border-outline-variant/20">
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-error/10 transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-error/10 flex items-center justify-center">
                    <LogOut size={20} className="text-error" />
                  </div>
                  <div>
                    <span className="font-bold text-error text-sm">Sign Out</span>
                    <span className="block text-xs text-error/70 font-urdu">
                      سائن آؤٹ
                    </span>
                  </div>
                </button>
              </div>
            )}

            {/* Footer */}
            <div className="p-6 border-t border-outline-variant/20">
              <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary-container/10">
                <Sparkles size={14} className="text-primary" />
                <span className="text-xs font-bold text-primary">
                  AI Seekho 2026 Hackathon
                </span>
              </div>
              <p className="text-center text-[10px] text-outline mt-3">
                Mazdoor Market v1.0 — Built with ❤️ in Pakistan
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================
// MAIN HEADER
// ============================================
export default function Header() {
  const { user, profile, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  // Smart scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 30);
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    {
      href: "/dashboard/customer",
      label: "Find Workers",
      labelUrdu: "مزدور تلاش",
      icon: Search,
    },
    {
      href: "/dashboard/worker",
      label: "Find Work",
      labelUrdu: "کام تلاش",
      icon: Briefcase,
    },
    {
      href: "/about",
      label: "About",
      labelUrdu: "ہمارے بارے",
      icon: Sparkles,
    },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -120 }}
        animate={{
          y: hidden ? -120 : 0,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/90 backdrop-blur-2xl shadow-xl shadow-black/5 border-b border-outline-variant/30"
            : "bg-background/70 backdrop-blur-xl border-b border-outline-variant/10"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8 h-[80px] lg:h-[88px]">
          
          {/* LEFT: Logo + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2.5 -ml-2 rounded-xl hover:bg-surface-variant transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={24} className="text-on-background" />
            </motion.button>

            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 12, scale: 1.15 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25"
              >
                <Briefcase size={24} className="text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-xl lg:text-2xl font-black tracking-tight leading-none">
                  <span className="text-primary">Mazdoor</span>
                  <span className="text-secondary">Market</span>
                </span>
                <p className="text-[9px] text-outline font-bold uppercase tracking-[0.2em] mt-1">
                  AI Seekho 2026
                </p>
              </div>
            </Link>
          </div>

          {/* CENTER: Desktop Nav + Search */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href} className="relative px-4 lg:px-5 py-2.5 rounded-2xl group">
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 bg-primary-container/40 rounded-2xl border border-primary/20"
                        transition={{
                          type: "spring",
                          bounce: 0.15,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <div className="relative flex items-center gap-2">
                      <link.icon
                        size={16}
                        className={`transition-colors ${
                          isActive ? "text-primary" : "text-outline group-hover:text-primary"
                        }`}
                      />
                      <span
                        className={`text-sm font-bold transition-colors ${
                          isActive
                            ? "text-on-primary-container"
                            : "text-on-background group-hover:text-primary"
                        }`}
                      >
                        {link.label}
                      </span>
                      <span className="hidden xl:inline text-[10px] text-outline font-urdu">
                        {link.labelUrdu}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            <SearchBar />
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Location (Desktop) */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hidden xl:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-variant/50 border border-outline-variant/20 hover:bg-primary-container/20 hover:border-primary/20 transition-all cursor-pointer group"
            >
              <MapPin size={15} className="text-primary" />
              <span className="text-sm font-bold text-on-background">
                Lahore
              </span>
              <ChevronDown
                size={14}
                className="text-outline group-hover:text-primary transition-colors"
              />
            </motion.div>

            {/* Messages */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="hidden sm:flex p-2.5 rounded-xl hover:bg-primary-container/30 transition-colors relative"
            >
              <MessageCircle
                size={22}
                className="text-outline hover:text-primary transition-colors"
              />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </motion.button>

            {/* Notifications */}
            <div className="hidden sm:block">
              <NotificationBell count={3} />
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-8 bg-outline-variant/30 mx-1" />

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-2.5">
              {user ? (
                <UserDropdown
                  user={user}
                  profile={profile}
                  logout={logout}
                />
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/login"
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary-container/20 rounded-2xl transition-all border border-transparent hover:border-primary/20"
                    >
                      <LogIn size={16} />
                      <span>Log in</span>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/signup"
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl text-sm font-black hover:shadow-xl hover:shadow-primary/25 transition-all shadow-lg shadow-primary/15"
                    >
                      <UserPlus size={16} />
                      <span>Sign up</span>
                    </Link>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile: Compact Avatar or Sign In */}
            <div className="md:hidden">
              {user ? (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {profile?.name?.[0]?.toUpperCase() || <User size={18} />}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-black"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-primary origin-left"
          style={{ scaleX: 0 }}
          animate={{ scaleX: scrolled ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Bottom Glow on Scroll */}
        <AnimatePresence>
          {scrolled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -bottom-6 left-0 right-0 h-6 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"
            />
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-[80px] lg:h-[88px]" />

      {/* Mobile Menu */}
      <MobileMenu
        open={mobileOpen}
        setOpen={setMobileOpen}
        user={user}
        profile={profile}
        logout={logout}
      />
    </>
  );
}