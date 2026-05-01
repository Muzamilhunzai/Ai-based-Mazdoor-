'use client';

import { motion, useScroll, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { 
  ArrowRight, Shield, Star, Users, Zap, MapPin, 
  CheckCircle, Search, Briefcase, MessageCircle, 
  TrendingUp, Award, Moon, Sun, Play,
  ChevronRight, Sparkles, Clock, Phone
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useState, useEffect, useRef } from 'react';

// Animated counter hook (JS version)
function useAnimatedCounter(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return { count, ref };
}

// Particle component for hero background
function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            scale: 0 
          }}
          animate={{ 
            y: [null, Math.random() * 100 + "%"],
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0]
          }}
          transition={{ 
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
}

// 3D Tilt Card Component
function TiltCard({ children, className = "" }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  return (
    <motion.div
      style={{ x, y, rotateX, rotateY, z: 100 }}
      className={`${className} transform-gpu`}
      whileHover={{ scale: 1.02 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

// Floating AI Chat Widget
function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div 
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 2, type: "spring" }}
    >
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute bottom-16 right-0 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-primary/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold">AI Assistant</span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="bg-primary/10 rounded-lg p-3 text-sm">
              👋 Assalam-o-Alaikum! I&apos;m your AI helper. Need a plumber in Lahore?
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ask anything..." 
                className="flex-1 px-3 py-2 rounded-lg border dark:border-slate-600 dark:bg-slate-700 text-sm"
              />
              <button className="bg-primary text-white p-2 rounded-lg">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg flex items-center justify-center text-white"
      >
        {isOpen ? <MessageCircle className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </motion.button>
    </motion.div>
  );
}

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const workersCount = useAnimatedCounter(12500);
  const jobsCount = useAnimatedCounter(8940);
  const citiesCount = useAnimatedCounter(45);
  const ratingCount = useAnimatedCounter(98);

  const steps = [
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: 'Search',
      titleUrdu: 'تلاش کریں',
      desc: 'Find skilled workers near you using AI-powered search with smart filters',
      descUrdu: 'AI-powered تلاش کے ذریعے قریب کے ماہر کارکن تلاش کریں',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Users className="w-8 h-8 text-secondary" />,
      title: 'Connect',
      titleUrdu: 'رابطہ کریں',
      desc: 'Compare profiles, ratings, and hire the best match instantly',
      descUrdu: 'پروفائلز، ریٹنگز کا موازنہ کریں اور بہترین میچ کریں',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-primary" />,
      title: 'Get Work Done',
      titleUrdu: 'کام کروائیں',
      desc: 'Track progress in real-time and pay securely after completion',
      descUrdu: 'پیش رفت کا سراغ لگائیں اور تکمیل کے بعد محفوظ طریقے سے ادائیگی کریں',
      color: 'from-emerald-500 to-teal-500'
    },
  ];

  const categories = [
    { name: 'Plumber', nameUrdu: 'پلمبر', icon: '🔧', count: '2,400+', color: 'hover:border-blue-400' },
    { name: 'Electrician', nameUrdu: 'الیکٹریشن', icon: '⚡', count: '1,800+', color: 'hover:border-yellow-400' },
    { name: 'Carpenter', nameUrdu: 'بڑھئی', icon: '🪚', count: '1,200+', color: 'hover:border-amber-600' },
    { name: 'Painter', nameUrdu: 'پینٹر', icon: '🎨', count: '3,100+', color: 'hover:border-pink-400' },
    { name: 'Driver', nameUrdu: 'ڈرائیور', icon: '🚗', count: '4,500+', color: 'hover:border-green-400' },
    { name: 'Cook', nameUrdu: 'باورچی', icon: '👨‍🍳', count: '980+', color: 'hover:border-orange-400' },
    { name: 'Maid', nameUrdu: 'نوکرانی', icon: '🧹', count: '2,200+', color: 'hover:border-purple-400' },
    { name: 'Mechanic', nameUrdu: 'میکینک', icon: '🔩', count: '1,600+', color: 'hover:border-red-400' },
  ];

  const trustFeatures = [
    { icon: <Shield className="w-8 h-8" />, title: 'Verified Workers', titleUrdu: 'تصدیق شدہ مزدور', desc: 'CNIC & biometric verified professionals', stat: '100%' },
    { icon: <Star className="w-8 h-8" />, title: 'Rated & Reviewed', titleUrdu: 'ریٹ شدہ اور جائزہ', desc: 'Transparent 5-star feedback system', stat: '4.8★' },
    { icon: <Zap className="w-8 h-8" />, title: 'AI Matching', titleUrdu: 'AI میچنگ', desc: 'Smart recommendations in 30 seconds', stat: '<30s' },
    { icon: <MapPin className="w-8 h-8" />, title: 'Hyperlocal', titleUrdu: 'ہائپرلوکل', desc: 'Find workers within 2km radius', stat: '2km' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-slate-900' : 'bg-background'}`}>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent z-50 origin-left"
        style={{ scaleX }}
      />

      <Header />
      <AIChatWidget />

      {/* Theme Toggle */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-24 right-6 z-40 w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center border border-gray-200 dark:border-slate-700"
      >
        {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
      </motion.button>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 dark:from-primary/10 dark:via-secondary/10 dark:to-accent/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <ParticleField />
        
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Seekho 2026 Hackathon Project</span>
                <span className="px-2 py-0.5 bg-primary text-white text-xs rounded-full">LIVE</span>
              </motion.div>

              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-text dark:text-white mb-4 leading-tight">
                Mazdoor
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Market
                </span>
              </h1>
              <span className="block text-4xl sm:text-5xl mt-2 font-urdu text-primary font-bold mb-6">
                مزدور مارکیٹ
              </span>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-xl mb-2 leading-relaxed">
                Pakistan&apos;s first <span className="text-primary font-bold">AI-powered</span> hyperlocal labor marketplace connecting skilled workers with opportunities
              </p>
              <p className="text-lg text-gray-500 max-w-xl mb-8 font-urdu leading-relaxed">
                پاکستان کی پہلی AI-powered ہائپرلوکل لیبر مارکیٹ — ماہر کارکنوں کو مواقع سے جوڑنا
              </p>

              <div className="flex flex-wrap gap-6 mb-10" ref={workersCount.ref}>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{workersCount.count.toLocaleString()}+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Workers</div>
                </div>
                <div className="w-px bg-gray-300 dark:bg-gray-700" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">{jobsCount.count.toLocaleString()}+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Jobs Done</div>
                </div>
                <div className="w-px bg-gray-300 dark:bg-gray-700" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">{citiesCount.count}+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Cities</div>
                </div>
                <div className="w-px bg-gray-300 dark:bg-gray-700" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">{ratingCount.count}%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Satisfaction</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="group relative px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-lg inline-flex items-center gap-2 overflow-hidden shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  <span className="relative z-10">Get Started Free</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link href="/demo" className="px-8 py-4 rounded-xl border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-bold text-lg inline-flex items-center gap-2 hover:border-primary hover:text-primary transition-all group">
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                  <span className="font-urdu text-sm">ڈیمو دیکھیں</span>
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {['Google AI Studio', 'Next.js 14', 'Framer Motion', 'Tailwind CSS'].map((tech) => (
                  <span key={tech} className="px-3 py-1 rounded-full bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 text-xs text-gray-600 dark:text-gray-400">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: 15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <motion.div
                  animate={{ y: [0, -20, 0], rotateZ: [0, 2, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-8 backdrop-blur-xl border border-white/20 shadow-2xl"
                >
                  <div className="bg-white dark:bg-slate-800 rounded-2xl h-full p-6 shadow-inner flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary" />
                      <div>
                        <div className="font-bold dark:text-white">Mazdoor Market</div>
                        <div className="text-xs text-gray-500">App Preview</div>
                      </div>
                    </div>
                    <div className="space-y-3 flex-1">
                      {[1,2,3].map((i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + i * 0.2 }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-700"
                        >
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center text-2xl">
                            {i === 1 ? '🔧' : i === 2 ? '⚡' : '🎨'}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm dark:text-white">{i === 1 ? 'Plumber Available' : i === 2 ? 'Electrician Nearby' : 'Painter Verified'}</div>
                            <div className="text-xs text-gray-500">2km away • 4.9★</div>
                          </div>
                          <div className="px-3 py-1 bg-primary text-white text-xs rounded-full">Hire</div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-primary/10 rounded-xl text-center text-sm text-primary font-medium">
                      AI Match Found! 🎯
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-sm font-medium dark:text-white">Worker Verified</div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, -10, 0], x: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <div className="text-sm font-bold dark:text-white">4.9 Rating</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
              Simple Process
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-text dark:text-white mb-3">
              How It Works
            </h2>
            <p className="font-urdu text-3xl text-primary font-bold">یہ کیسے کام کرتا ہے</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-24 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary via-secondary to-accent" />
            
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <TiltCard className="h-full">
                  <div className="glass-card p-8 text-center hover:shadow-2xl transition-all duration-500 relative overflow-hidden group h-full border-2 border-transparent hover:border-primary/20">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center relative z-10 shadow-lg">
                      {step.icon}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-1 dark:text-white">{step.title}</h3>
                    <p className="font-urdu text-xl text-primary mb-4 font-bold">{step.titleUrdu}</p>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">{step.desc}</p>
                    <p className="font-urdu text-sm text-gray-500 leading-relaxed">{step.descUrdu}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              Popular Services
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-text dark:text-white mb-2">
              Popular Categories
            </h2>
            <p className="font-urdu text-2xl text-primary font-bold">مقبول زمرے</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {categories.map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1, type: "spring" }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`glass-card p-6 text-center cursor-pointer transition-all duration-300 border-2 border-transparent ${cat.color} dark:hover:bg-slate-700/50 group`}
              >
                <motion.div 
                  className="text-5xl mb-3 group-hover:scale-110 transition-transform inline-block"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                >
                  {cat.icon}
                </motion.div>
                <h3 className="font-bold text-lg dark:text-white mb-1">{cat.name}</h3>
                <p className="font-urdu text-sm text-primary mb-2">{cat.nameUrdu}</p>
                <div className="text-xs text-gray-500 font-medium bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full inline-block">
                  {cat.count} workers
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-text dark:text-white mb-2">Why Trust Us?</h2>
            <p className="font-urdu text-2xl text-primary">ہم پر اعتماد کیوں کریں؟</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustFeatures.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="glass-card p-8 text-center group hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-slate-700"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-lg">
                  {item.icon}
                </div>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">
                  {item.stat}
                </div>
                <h3 className="font-bold text-lg mb-1 dark:text-white">{item.title}</h3>
                <p className="font-urdu text-primary text-sm mb-2">{item.titleUrdu}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Activity Feed */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card p-8 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <h3 className="text-xl font-bold dark:text-white">Live Activity</h3>
              <span className="font-urdu text-primary">لائیو سرگرمی</span>
            </div>
            <div className="space-y-4">
              {[
                { action: 'Hired a Plumber', location: 'DHA, Lahore', time: '2 min ago', icon: '🔧' },
                { action: 'Found an Electrician', location: 'Clifton, Karachi', time: '5 min ago', icon: '⚡' },
                { action: 'Completed Painting Job', location: 'F-10, Islamabad', time: '8 min ago', icon: '🎨' },
                { action: 'New Worker Registered', location: 'Gulberg, Lahore', time: '12 min ago', icon: '👤' },
              ].map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="text-2xl">{activity.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm dark:text-white">{activity.action}</div>
                    <div className="text-xs text-gray-500">{activity.location}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto glass-card p-12 text-center relative border-2 border-primary/20 shadow-2xl"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              🏆 AI Seekho 2026 Finalist
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-text dark:text-white mb-2 mt-4">
            Ready to Transform Pakistan&apos;s Labor Market?
          </h2>
          <p className="font-urdu text-3xl text-primary mb-6 font-bold">
            پاکستان کی لیبر مارکیٹ کو بدلنے کے لیے تیار ہیں؟
          </p>
          
          <p className="text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
            Join <span className="font-bold text-primary">12,500+ workers</span> and <span className="font-bold text-secondary">8,900+ employers</span> already using Mazdoor Market. Built with Google AI Studio for the AI Seekho 2026 Hackathon.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/signup?role=customer" className="group relative px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-lg inline-flex items-center gap-2 overflow-hidden shadow-lg shadow-primary/25">
              <Briefcase className="w-5 h-5" />
              <span>Hire a Worker</span>
              <span className="font-urdu text-sm">مزدور کرایہ پر لیں</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/signup?role=worker" className="px-8 py-4 rounded-xl border-2 border-primary text-primary font-bold text-lg inline-flex items-center gap-2 hover:bg-primary hover:text-white transition-all">
              <TrendingUp className="w-5 h-5" />
              <span>Find Work</span>
              <span className="font-urdu text-sm">کام تلاش کریں</span>
            </Link>
          </div>

          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Verified Only</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 relative">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Mazdoor Market</h3>
                <p className="font-urdu text-secondary text-sm">مزدور مارکیٹ</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Pakistan&apos;s trusted AI-powered labor marketplace. Built for the people, by the people.
            </p>
            <div className="flex gap-3">
              {['Google', 'Ministry of IT', 'Telenor'].map((partner) => (
                <span key={partner} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                  {partner}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-primary">Quick Links</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />About Us</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />How It Works</Link></li>
              <li><Link href="/safety" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />Safety</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-secondary">Support</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/help" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />Contact Us</Link></li>
              <li><Link href="/sos" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />Emergency SOS</Link></li>
              <li><Link href="/community" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-accent">Hackathon</h4>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-sm">AI Seekho 2026</span>
              </div>
              <p className="text-xs text-gray-400 mb-3">Google-backed nationwide AI upskilling initiative</p>
              <div className="text-xs text-primary font-medium">Phase 1: April 11 - May 3, 2026</div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Mazdoor Market. All rights reserved. Built By ❤️ in Muzamil hussain
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}