'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Shield, Star, Users, Zap, MapPin, Clock, CheckCircle, Search, Briefcase } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';

export default function LandingPage() {
  const steps = [
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: 'Search',
      titleUrdu: 'تلاش کریں',
      desc: 'Find skilled workers near you using AI-powered search',
      descUrdu: 'AI-powered تلاش کے ذریعے قریب کے ماہر کارکن تلاش کریں',
    },
    {
      icon: <Users className="w-8 h-8 text-secondary" />,
      title: 'Connect',
      titleUrdu: 'رابطہ کریں',
      desc: 'Compare profiles, ratings, and hire the best match',
      descUrdu: 'پروفائلز، ریٹنگز کا موازنہ کریں اور بہترین میچ کریں',
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-primary" />,
      title: 'Get Work Done',
      titleUrdu: 'کام کروائیں',
      desc: 'Track progress and pay securely after completion',
      descUrdu: 'پیش رفت کا سراغ لگائیں اور تکمیل کے بعد محفوظ طریقے سے ادائیگی کریں',
    },
  ];

  const categories = [
    { name: 'Plumber', nameUrdu: 'پلمبر', icon: '🔧' },
    { name: 'Electrician', nameUrdu: 'الیکٹریشن', icon: '⚡' },
    { name: 'Carpenter', nameUrdu: 'بڑھئی', icon: '🪚' },
    { name: 'Painter', nameUrdu: 'پینٹر', icon: '🎨' },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-7xl font-bold text-text dark:text-white mb-6">
              Mazdoor Market
              <span className="block text-3xl sm:text-4xl mt-4 font-urdu text-primary">
                مزدور مارکیٹ
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
              Pakistan's first AI-powered hyperlocal labor marketplace
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 font-urdu">
              پاکستان کی پہلی AI-powered ہائپرلوکل لیبر مارکیٹ
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn-primary inline-flex items-center gap-2 text-lg">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/login" className="glass-card px-6 py-3 inline-flex items-center gap-2 text-lg font-medium hover:bg-white/90 transition-all dark:hover:bg-slate-700/50">
                Sign In
                <span className="font-urdu text-sm">سائن ان</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text dark:text-white mb-2">How It Works</h2>
            <p className="font-urdu text-2xl text-primary">یہ کیسے کام کرتا ہے</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="glass-card p-8 text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                <p className="font-urdu text-lg text-primary mb-3">{step.titleUrdu}</p>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{step.desc}</p>
                <p className="font-urdu text-sm text-gray-500">{step.descUrdu}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text dark:text-white mb-2">Popular Categories</h2>
            <p className="font-urdu text-xl text-primary">مقبول زمرے</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {categories.map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 text-center hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-bold">{cat.name}</h3>
                <p className="font-urdu text-sm text-primary">{cat.nameUrdu}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Shield className="w-8 h-8" />, title: 'Verified Workers', titleUrdu: 'تصدیق شدہ مزدور', desc: 'CNIC verified professionals' },
              { icon: <Star className="w-8 h-8" />, title: 'Rated & Reviewed', titleUrdu: 'ریٹ شدہ اور جائزہ', desc: 'Transparent feedback system' },
              { icon: <Zap className="w-8 h-8" />, title: 'AI Matching', titleUrdu: 'AI میچنگ', desc: 'Smart worker recommendations' },
              { icon: <MapPin className="w-8 h-8" />, title: 'Hyperlocal', titleUrdu: 'ہائپرلوکل', desc: 'Find workers in your area' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="font-urdu text-primary text-sm mb-2">{item.titleUrdu}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto glass-card p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-text dark:text-white mb-2">Ready to get started?</h2>
          <p className="font-urdu text-2xl text-primary mb-6">شروع کرنے کے لیے تیار ہیں؟</p>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
            Join thousands of Pakistanis who are already using Mazdoor Market to find work or hire skilled professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?role=customer" className="btn-primary">
              Hire a Worker <span className="font-urdu text-sm mr-2">مزدور کرایہ پر لیں</span>
            </Link>
            <Link href="/signup?role=worker" className="btn-secondary">
              Find Work <span className="font-urdu text-sm mr-2">کام تلاش کریں</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-text dark:bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-2">Mazdoor Market</h3>
            <p className="font-urdu text-secondary">مزدور مارکیٹ</p>
            <p className="text-gray-400 mt-4 text-sm">Pakistan's trusted labor marketplace</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/how-it-works">How It Works</Link></li>
              <li><Link href="/safety">Safety</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/help">Help Center</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/sos">Emergency SOS</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Mazdoor Market. All rights reserved.
        </div>
      </footer>
    </div>
  );
}