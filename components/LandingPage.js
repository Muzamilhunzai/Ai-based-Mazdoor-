'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Search,
  Users,
  CheckCircle,
  Shield,
  Star,
  Zap,
  MapPin,
  Phone,
  Wrench,
  HardHat,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

// ============ VINTAGE TYPEWRITER EFFECT ============
const Typewriter = ({ texts, className = '' }) => {
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayed(current.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
          if (charIndex === current.length) {
            setIsDeleting(true);
            setTimeout(() => {}, 2000);
          }
        } else {
          setDisplayed(current.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
          if (charIndex === 0) {
            setIsDeleting(false);
            setIndex((index + 1) % texts.length);
          }
        }
      },
      isDeleting ? 20 : 40
    );
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, index, texts]);

  return (
    <span className={`font-courier ${className}`}>
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// ============ VINTAGE RIBBON BADGE ============
const RibbonBadge = ({ text }) => (
  <div className="relative inline-block">
    <div className="px-6 py-1 bg-[#2c5e3a] text-[#f8f5e9] font-bold text-sm tracking-wider uppercase border-2 border-[#1a3e24] shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
      {text}
    </div>
    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#2c5e3a] rotate-45 border-r-2 border-b-2 border-[#1a3e24]" />
    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-[#2c5e3a] -bottom-1.5" />
  </div>
);

// ============ OLD NOTICE BOARD CARD ============
const NoticeCard = ({ children, className = '' }) => (
  <div
    className={`relative bg-[#f8f5e9] border-4 border-[#2c5e3a] p-6 shadow-[6px_6px_0px_rgba(0,0,0,0.15)] ${className}`}
    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d4c9a8\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M0 0h40v40H0V0zm20 20L0 0v40l20-20zm0 0l20 20V0L20 20z\'/%3E%3C/g%3E%3C/svg%3E")' }}
  >
    <div className="absolute top-0 left-0 w-2 h-2 bg-[#2c5e3a]" />
    <div className="absolute top-0 right-0 w-2 h-2 bg-[#2c5e3a]" />
    <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#2c5e3a]" />
    <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#2c5e3a]" />
    {children}
  </div>
);

// ============ PAKISTAN MINI MAP ============
const OldMap = () => {
  const cities = [
    { name: 'Karachi', x: 62, y: 78 },
    { name: 'Lahore', x: 65, y: 38 },
    { name: 'Islamabad', x: 55, y: 28 },
    { name: 'Peshawar', x: 42, y: 25 },
    { name: 'Quetta', x: 25, y: 48 },
  ];

  return (
    <div className="relative w-64 h-64 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
        <path
          d="M20,30 L30,20 L40,25 L50,15 L55,25 L65,30 L70,45 L65,60 L55,70 L45,65 L35,55 L25,45 Z"
          fill="#f8f5e9"
          stroke="#2c5e3a"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {cities.map((city, i) => (
          <g key={i}>
            <motion.circle
              cx={city.x}
              cy={city.y}
              r="2"
              fill="#2c5e3a"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.15 }}
            />
            <motion.circle
              cx={city.x}
              cy={city.y}
              r="2"
              fill="none"
              stroke="#2c5e3a"
              strokeWidth="0.8"
              animate={{ r: [2, 4, 2], opacity: [0.7, 0.3, 0.7] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            />
            <text
              x={city.x}
              y={city.y - 3}
              textAnchor="middle"
              fontSize="3.5"
              fontFamily="Courier"
              fill="#1a3e24"
              fontWeight="bold"
            >
              {city.name}
            </text>
          </g>
        ))}
      </svg>
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[#2c5e3a] font-bold font-courier text-xs tracking-widest">
        PAKISTAN GRID
      </div>
    </div>
  );
};

// ============ MAIN PAGE ============
export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const steps = [
    {
      icon: <Search className="w-7 h-7 text-[#2c5e3a]" />,
      title: 'Search',
      titleUrdu: 'تلاش کریں',
      desc: 'Find skilled workers near you via our trusted registry',
      descUrdu: 'ہمارے رجسٹر کے ذریعے قریب کے ہنر مند کارکن تلاش کریں',
    },
    {
      icon: <Users className="w-7 h-7 text-[#2c5e3a]" />,
      title: 'Connect',
      titleUrdu: 'رابطہ کریں',
      desc: 'Compare experience & ratings, then hire the best',
      descUrdu: 'تجربہ اور ریٹنگ کا موازنہ کریں، پھر بہترین کو منتخب کریں',
    },
    {
      icon: <CheckCircle className="w-7 h-7 text-[#2c5e3a]" />,
      title: 'Get Work Done',
      titleUrdu: 'کام مکمل',
      desc: 'Track progress, pay securely after job completion',
      descUrdu: 'پیش رفت دیکھیں، کام ختم ہونے پر محفوظ ادائیگی کریں',
    },
  ];

  const categories = [
    { name: 'Plumber', nameUrdu: 'پلمبر', icon: '🔧' },
    { name: 'Electrician', nameUrdu: 'الیکٹریشن', icon: '⚡' },
    { name: 'Carpenter', nameUrdu: 'بڑھئی', icon: '🪚' },
    { name: 'Painter', nameUrdu: 'پینٹر', icon: '🎨' },
    { name: 'Mechanic', nameUrdu: 'مکینک', icon: '🔩' },
    { name: 'Cleaner', nameUrdu: 'صفائی', icon: '🧹' },
  ];

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#f8f5e9] text-[#1a3e24] overflow-x-hidden"
      style={{ fontFamily: '"Courier New", Courier, monospace' }}
    >
      {/* Vintage background pattern */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232c5e3a' fill-opacity='0.4'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3Ccircle cx='13' cy='13' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* OLD HEADER */}
      <header className="relative z-20 bg-[#2c5e3a] text-[#f8f5e9] p-4 flex items-center justify-between border-b-4 border-[#1a3e24] shadow-md">
        <div className="flex items-center gap-3">
          <HardHat className="w-8 h-8" />
          <span className="text-2xl font-extrabold tracking-widest uppercase">
            Mazdoor Market
          </span>
        </div>
        <nav className="flex gap-6 text-sm font-bold tracking-wider uppercase">
          <Link href="/how-it-works" className="hover:text-[#d4c9a8] transition-colors">
            Blueprint
          </Link>
          <Link href="/safety" className="hover:text-[#d4c9a8] transition-colors">
            Safety
          </Link>
          <Link href="/login" className="hover:text-[#d4c9a8] transition-colors">
            Sign In
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl"
        >
          <RibbonBadge text="Pakistan's Trusted Labour Network" />

          <h1 className="mt-8 text-6xl md:text-8xl font-extrabold text-[#2c5e3a] tracking-tighter leading-none uppercase">
            Mazdoor
            <br />
            <span className="text-[#1a3e24]">Market</span>
          </h1>
          <p className="text-3xl md:text-4xl mt-4 font-bold text-[#2c5e3a] font-urdu">
            مزدور مارکیٹ
          </p>

          <div className="mt-8 max-w-2xl mx-auto text-lg text-[#1a3e24] border-l-4 border-[#2c5e3a] bg-[#f8f5e9] p-4 shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
            <Typewriter
              texts={[
                "Pakistan's first AI‑powered hyperlocal labour marketplace.",
                'Find skilled workers in seconds, not hours.',
                'Your work gets done. Simple.',
              ]}
            />
          </div>

          <div className="mt-12 flex flex-wrap gap-6 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-[#2c5e3a] text-[#f8f5e9] font-extrabold text-lg uppercase tracking-wider border-2 border-[#1a3e24] shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:bg-[#1a3e24] transition-colors flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-[#f8f5e9] text-[#2c5e3a] font-extrabold text-lg uppercase tracking-wider border-2 border-[#2c5e3a] shadow-[4px_4px_0px_rgba(0,0,0,0.2)] hover:bg-[#d4c9a8] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* MAIN CONTENT */}
      <div className="relative z-10 bg-[#f8f5e9] border-t-8 border-[#2c5e3a]">
        {/* How It Works Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <RibbonBadge text="How the System Works" />
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1a3e24] mt-4 uppercase tracking-wide">
              Process
            </h2>
            <p className="text-[#2c5e3a] font-bold font-urdu text-xl mt-2">
              یہ کیسے کام کرتا ہے
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
              >
                <NoticeCard className="h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#d4c9a8] rounded-full flex items-center justify-center border-2 border-[#2c5e3a]">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#1a3e24] mb-2">{step.title}</h3>
                  <p className="text-[#2c5e3a] font-bold font-urdu mb-2">{step.titleUrdu}</p>
                  <p className="text-sm text-[#1a3e24]/80 mb-1">{step.desc}</p>
                  <p className="text-xs text-[#2c5e3a]/70 font-urdu">{step.descUrdu}</p>
                </NoticeCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Categories – Old Notice Board */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <RibbonBadge text="Skilled Trades" />
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1a3e24] mt-4 uppercase tracking-wide">
              Categories
            </h2>
            <p className="text-[#2c5e3a] font-bold font-urdu text-xl mt-2">
              ہنر کی اقسام
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-[#f8f5e9] border-2 border-[#2c5e3a] p-4 text-center shadow-[4px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[2px_2px_0px_rgba(0,0,0,0.3)] hover:bg-[#d4c9a8] transition-all cursor-pointer"
              >
                <div className="text-4xl mb-3 drop-shadow-sm">{cat.icon}</div>
                <h3 className="font-extrabold text-[#1a3e24] text-sm tracking-wide uppercase">{cat.name}</h3>
                <p className="text-[#2c5e3a] font-urdu text-xs mt-1">{cat.nameUrdu}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Map & Stats Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <RibbonBadge text="Our Reach" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a3e24] mt-4 uppercase tracking-wide">
                Pakistan Grid
              </h2>
              <p className="text-[#2c5e3a] font-bold font-urdu text-xl mb-8">
                پورے پاکستان میں
              </p>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="border-2 border-[#2c5e3a] p-4 bg-[#f8f5e9] shadow-[3px_3px_0px_rgba(0,0,0,0.2)]">
                  <div className="text-3xl font-extrabold text-[#2c5e3a]">2.4K</div>
                  <div className="text-xs text-[#1a3e24] mt-1 uppercase tracking-widest font-bold">Workers</div>
                </div>
                <div className="border-2 border-[#2c5e3a] p-4 bg-[#f8f5e9] shadow-[3px_3px_0px_rgba(0,0,0,0.2)]">
                  <div className="text-3xl font-extrabold text-[#2c5e3a]">18K+</div>
                  <div className="text-xs text-[#1a3e24] mt-1 uppercase tracking-widest font-bold">Jobs Done</div>
                </div>
                <div className="border-2 border-[#2c5e3a] p-4 bg-[#f8f5e9] shadow-[3px_3px_0px_rgba(0,0,0,0.2)]">
                  <div className="text-3xl font-extrabold text-[#2c5e3a]">120</div>
                  <div className="text-xs text-[#1a3e24] mt-1 uppercase tracking-widest font-bold">Cities</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <OldMap />
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <RibbonBadge text="Why Trust Us?" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield className="w-7 h-7" />,
                title: 'ID Verified',
                titleUrdu: 'شناختی تصدیق',
                desc: 'CNIC checked',
              },
              {
                icon: <Star className="w-7 h-7" />,
                title: 'Rated & Reviewed',
                titleUrdu: 'جائزہ شدہ',
                desc: 'Public feedback',
              },
              {
                icon: <Zap className="w-7 h-7" />,
                title: 'AI Matching',
                titleUrdu: 'AI میچنگ',
                desc: 'Smart suggestions',
              },
              {
                icon: <MapPin className="w-7 h-7" />,
                title: 'Hyperlocal',
                titleUrdu: 'ہائپرلوکل',
                desc: 'Near you',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="border-2 border-[#2c5e3a] p-5 bg-[#f8f5e9] text-center shadow-[4px_4px_0px_rgba(0,0,0,0.15)] hover:bg-[#d4c9a8] transition-colors"
              >
                <div className="text-[#2c5e3a] mb-3 flex justify-center">{item.icon}</div>
                <h3 className="font-extrabold text-[#1a3e24] text-lg mb-1">{item.title}</h3>
                <p className="text-[#2c5e3a] font-bold font-urdu text-sm">{item.titleUrdu}</p>
                <p className="text-xs text-[#1a3e24]/60 mt-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 max-w-4xl mx-auto text-center">
          <div className="border-4 border-[#2c5e3a] p-8 bg-[#f8f5e9] shadow-[8px_8px_0px_rgba(0,0,0,0.2)]">
            <RibbonBadge text="Join the Network" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a3e24] uppercase mt-4 mb-4">
              Ready to Work?
            </h2>
            <p className="text-[#2c5e3a] font-bold font-urdu text-xl">
              کام شروع کرنے کے لیے تیار ہیں؟
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <Link
                href="/signup?role=customer"
                className="px-8 py-3 bg-[#2c5e3a] text-[#f8f5e9] font-extrabold text-lg uppercase tracking-wider border-2 border-[#1a3e24] shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:bg-[#1a3e24] flex items-center gap-2"
              >
                Hire Worker <Phone className="w-5 h-5" />
              </Link>
              <Link
                href="/signup?role=worker"
                className="px-8 py-3 bg-[#f8f5e9] text-[#2c5e3a] font-extrabold text-lg uppercase tracking-wider border-2 border-[#2c5e3a] shadow-[4px_4px_0px_rgba(0,0,0,0.2)] hover:bg-[#d4c9a8] flex items-center gap-2"
              >
                Find Work <Wrench className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#2c5e3a] text-[#f8f5e9] py-16 px-4 sm:px-6 lg:px-8 border-t-8 border-[#1a3e24]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-extrabold tracking-wider uppercase flex items-center gap-2">
                <HardHat className="w-6 h-6" /> Mazdoor Market
              </h3>
              <p className="mt-2 font-urdu text-lg">مزدور مارکیٹ</p>
              <p className="text-[#d4c9a8] mt-4 text-sm">Pakistan's trusted labour exchange since 2026</p>
            </div>
            <div>
              <h4 className="font-extrabold mb-3 uppercase tracking-wider">Links</h4>
              <ul className="space-y-1 text-[#d4c9a8]">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/how-it-works">How It Works</Link></li>
                <li><Link href="/safety">Safety</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-extrabold mb-3 uppercase tracking-wider">Support</h4>
              <ul className="space-y-1 text-[#d4c9a8]">
                <li><Link href="/help">Help Desk</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/sos" className="text-red-300 font-bold">Emergency SOS</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-extrabold mb-3 uppercase tracking-wider">Legal</h4>
              <ul className="space-y-1 text-[#d4c9a8]">
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-[#d4c9a8] text-xs mt-12 pt-6 border-t border-[#d4c9a8]/20">
            © {new Date().getFullYear()} Mazdoor Market · AI SEEKHO 2026 · Made with ❤️ in Pakistan
          </div>
        </footer>
      </div>

      {/* Old-school floating Contact button (like a notice pin) */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button className="w-14 h-14 bg-[#2c5e3a] text-[#f8f5e9] rounded-full border-2 border-[#1a3e24] shadow-[4px_4px_0px_rgba(0,0,0,0.3)] flex items-center justify-center hover:bg-[#1a3e24] transition-colors">
          <Phone className="w-6 h-6" />
        </button>
      </motion.div>
    </div>
  );
}