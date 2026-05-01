'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, ExternalLink, ShieldCheck, Heart, Lightbulb, Users } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';

export default function AboutPage() {
  const values = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: 'Trust & Safety',
      desc: 'Every worker is CNIC-verified to ensure a secure environment for everyone.',
    },
    {
      icon: <Heart className="w-6 h-6 text-secondary" />,
      title: 'Dignity for Labor',
      desc: 'We are committed to making sure every skilled professional is treated with respect.',
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-primary" />,
      title: 'AI Innovation',
      desc: 'Using cutting-edge AI to simplify the process of finding and hiring experts.',
    },
    {
      icon: <Users className="w-6 h-6 text-secondary" />,
      title: 'Community First',
      desc: 'Building a stronger, more connected Pakistan by bridging the labor gap.',
    },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
          <div className="relative max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-6xl font-bold text-text dark:text-white mb-6"
            >
              About Mazdoor Market
              <span className="block text-2xl sm:text-3xl mt-2 font-urdu text-primary">
                مزدور مارکیٹ کے بارے میں
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8"
            >
              Mazdoor Market is Pakistan's first AI-powered hyperlocal labor marketplace, 
              designed to connect households and businesses with verified, skilled professionals 
              instantly.
            </motion.p>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/30 dark:bg-slate-800/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                    {value.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {value.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Me Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card overflow-hidden"
            >
              <div className="md:flex">
                <div className="md:w-1/3 bg-primary/10 p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center text-primary text-4xl font-bold mb-4 border-4 border-white dark:border-slate-700 shadow-xl">
                    M
                  </div>
                  <h3 className="text-2xl font-bold mb-1">Muzammil</h3>
                  <p className="text-primary font-medium mb-6 text-sm uppercase tracking-wider">Founder</p>
                  
                  <div className="flex gap-4">
                    <a href="mailto:muzammil@mazdoormarket.com" className="p-2 bg-white dark:bg-slate-700 rounded-lg hover:text-primary transition-colors shadow-sm" title="Email">
                      <Mail className="w-5 h-5" />
                    </a>
                    <a href="https://github.com/Muzamilhunzai" target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-slate-700 rounded-lg hover:text-primary transition-colors shadow-sm" title="GitHub">
                      <Github className="w-5 h-5" />
                    </a>
                    <a href="https://www.linkedin.com/in/muzamilhussain07/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-slate-700 rounded-lg hover:text-primary transition-colors shadow-sm" title="LinkedIn">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                
                <div className="md:w-2/3 p-8 sm:p-12 bg-white/50 dark:bg-slate-800/50">
                  <h2 className="text-3xl font-bold mb-2">About Me</h2>
                  <p className="font-urdu text-xl text-primary mb-8">میرے بارے میں</p>
                  
                  <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                    <p>
                      Hi, I’m Muzammil — the builder behind Mazdoor Market.
                    </p>
                    <p>
                      I’m a full‑stack developer and AI enthusiast from Pakistan, passionate about using technology to solve real‑world problems. Growing up, I saw how difficult it was for skilled, hard‑working labourers — electricians, plumbers, painters, carpenters — to find consistent, dignified work. At the same time, countless households and small businesses struggled to find reliable, verified workers when they needed them most.
                    </p>
                    <p className="font-bold text-primary italic">
                      That’s why I created Mazdoor Market.
                    </p>
                    <p>
                      This platform is my attempt to bridge the gap between skilled workers and the people who need them — using the power of AI. Instead of scrolling through endless classifieds or relying on unverified phone numbers, customers simply describe what they need in plain English (or Urdu), and our AI instantly matches them with the best, CNIC‑verified professionals in their area.
                    </p>
                    <p>
                      Mazdoor Market is more than just a marketplace — it’s a mission.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                      <li>It’s about restoring dignity to manual labour.</li>
                      <li>It’s about making sure a brilliant electrician in Rawalpindi gets discovered as easily as a Flutter developer in Silicon Valley.</li>
                      <li>It’s about safety, transparency, and trust — every worker on this platform is identity‑verified, and every transaction is protected.</li>
                    </ul>
                    <p>
                      I built this project from scratch: the frontend with Next.js and TailwindCSS, the backend on Firebase, and the AI engine powered by Google Gemini. It’s been a journey of late nights, endless debugging, and one big dream — to reshape how Pakistan’s informal labour market works.
                    </p>
                    <p>
                      If you’re a worker, I want this platform to help you find meaningful work and earn a fair wage. If you’re a customer, I want you to feel safe, heard, and matched with the right professional — every time.
                    </p>
                    <p className="pt-4 border-t border-gray-100 dark:border-slate-700">
                      Thank you for being part of this journey. This is just the beginning.
                    </p>
                    <div className="pt-2">
                      <p className="font-bold text-text dark:text-white">— Muzammil</p>
                      <p className="text-sm text-gray-500">Founder, Mazdoor Market</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto glass-card p-12 text-center bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <h2 className="text-3xl font-bold mb-4">Be part of the mission</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
              Join us in reshaping the labor market in Pakistan. Whether you're hiring or looking for work, Mazdoor Market is here for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn-primary">
                Join Today
              </Link>
              <Link href="/" className="btn-outline flex items-center justify-center gap-2">
                Back to Home <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-text dark:bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <h3 className="text-xl font-bold mb-2 text-primary">Mazdoor Market</h3>
            <p className="font-urdu text-secondary mb-4">مزدور مارکیٹ</p>
            <p className="text-gray-400">Pakistan's trusted labor marketplace</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-wider text-gray-300">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/safety" className="hover:text-primary transition-colors">Safety</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-wider text-gray-300">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/sos" className="hover:text-primary transition-colors text-error">Emergency SOS</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-wider text-gray-300">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> muzammil@mazdoormarket.com</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-gray-500">
          © {new Date().getFullYear()} Mazdoor Market. All rights reserved. Made with ❤️ by Muzammil.
        </div>
      </footer>
    </div>
  );
}