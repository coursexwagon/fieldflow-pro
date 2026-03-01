'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Wrench, Clock, MapPin, DollarSign, Phone } from 'lucide-react';

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f5f5] font-body overflow-x-hidden">
      {/* Subtle noise overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.015]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
        }}
      />

      {/* Navigation - Minimal, tool-like */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between"
        style={{
          background: scrollY > 50 ? 'rgba(26, 26, 26, 0.95)' : 'transparent',
          borderBottom: scrollY > 50 ? '1px solid #404040' : 'none',
          transition: 'all 0.2s ease'
        }}
      >
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#ffb800] flex items-center justify-center">
            <Wrench className="w-5 h-5 text-[#1a1a1a]" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            Field<span className="text-[#ffb800]">Flow</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[#888] hover:text-[#f5f5f5] text-sm font-medium transition-colors">
            Sign in
          </Link>
          <Link href="/signup" className="bg-[#ffb800] text-[#1a1a1a] px-4 py-2 text-sm font-display font-semibold hover:shadow-lg hover:shadow-[#ffb800]/20 transition-all">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero - Asymmetric, gritty */}
      <section className="relative min-h-screen flex items-end pb-20 pt-32">
        {/* Background - Industrial texture */}
        <div className="absolute inset-0">
          {/* Diagonal gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#2d2d2d]" />
          
          {/* Parallax geometric shapes */}
          <motion.div
            style={{ y: scrollY * 0.1 }}
            className="absolute top-1/4 -left-20 w-[400px] h-[400px] border border-[#404040] rotate-12 opacity-20"
          />
          <motion.div
            style={{ y: scrollY * 0.05 }}
            className="absolute bottom-1/4 right-0 w-[300px] h-[300px] border border-[#ffb800]/30 rotate-[-15deg] opacity-30"
          />
          
          {/* Grid lines - subtle */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(#ffb800 1px, transparent 1px), linear-gradient(90deg, #ffb800 1px, transparent 1px)`,
              backgroundSize: '80px 80px'
            }}
          />
        </div>

        {/* Content - Left-aligned, bleeds off edge */}
        <div className="relative z-10 px-6 md:px-12 lg:px-20 max-w-5xl">
          {/* Small label - no uppercase shouting */}
          <p className="text-[#ffb800] text-sm font-mono mb-4 tracking-wide">
            Field service software
          </p>
          
          {/* Headline - Punchy, human */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight mb-6">
            <span className="block">Paperwork is killing</span>
            <span className="block">your business.</span>
            <span className="block text-[#ffb800]">We killed it first.</span>
          </h1>
          
          {/* Subtext - Brief, real */}
          <p className="text-[#888] text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
            You fix pipes. We fix the paperwork that surrounds fixing pipes. 
            Jobs, invoices, route planning—all in one tool.
          </p>
          
          {/* CTAs - Clear hierarchy */}
          <div className="flex flex-wrap gap-4">
            <Link href="/signup" className="group inline-flex items-center gap-2 bg-[#ffb800] text-[#1a1a1a] px-6 py-3 font-display font-semibold hover:shadow-lg hover:shadow-[#ffb800]/20 transition-all">
              Start free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 border border-[#404040] text-[#f5f5f5] px-6 py-3 font-display font-medium hover:border-[#ffb800] hover:text-[#ffb800] transition-colors">
              See the tool
            </Link>
          </div>
        </div>

        {/* Floating element - Not a phone mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute bottom-32 right-6 md:right-12 lg:right-20 hidden lg:block"
        >
          <div className="relative">
            {/* Abstract geometric element */}
            <div className="w-64 h-80 border-2 border-[#404040] bg-[#1a1a1a]/80 backdrop-blur p-4 rotate-3">
              <div className="h-full border border-[#505050] p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-[#ffb800]" />
                  <span className="font-mono text-xs text-[#888]">TODAY</span>
                </div>
                <div className="space-y-3 flex-1">
                  <div className="border-l-2 border-[#ffb800] pl-3 py-1">
                    <p className="text-sm font-medium">8:00 AM</p>
                    <p className="text-xs text-[#888]">Johnson HVAC</p>
                  </div>
                  <div className="border-l-2 border-[#404040] pl-3 py-1">
                    <p className="text-sm font-medium">11:00 AM</p>
                    <p className="text-xs text-[#888]">Kitchen faucet</p>
                  </div>
                  <div className="border-l-2 border-[#404040] pl-3 py-1">
                    <p className="text-sm font-medium">2:00 PM</p>
                    <p className="text-xs text-[#888]">Water heater</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#404040]">
                  <p className="font-mono text-xs text-[#888]">TODAY'S RUN</p>
                  <p className="font-display text-2xl font-bold text-[#ffb800]">$847</p>
                </div>
              </div>
            </div>
            {/* Shadow element */}
            <div className="absolute -bottom-4 -right-4 w-64 h-80 border border-[#404040] -z-10" />
          </div>
        </motion.div>
      </section>

      {/* Problem Section - Direct, no fluff */}
      <section className="py-20 px-6 md:px-12 lg:px-20 border-t border-[#404040]">
        <div className="max-w-4xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">
            You didn&apos;t start a business to do paperwork.
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-l-2 border-[#ff4444] pl-4">
              <p className="font-mono text-xs text-[#ff4444] mb-2">THE PROBLEM</p>
              <p className="text-[#888]">
                Every job you jump between your calendar, notes app, calculator, 
                and messaging app. That&apos;s 30 minutes lost every day.
              </p>
            </div>
            <div className="border-l-2 border-[#22c55e] pl-4">
              <p className="font-mono text-xs text-[#22c55e] mb-2">THE FIX</p>
              <p className="text-[#888]">
                One tool. Jobs, customers, invoices, routing. 
                Built for the way you actually work—on your feet, phone in hand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features - No 3-column grid */}
      <section className="py-20 px-6 md:px-12 lg:px-20 border-t border-[#404040]">
        <div className="max-w-5xl">
          <div className="grid gap-12">
            {/* Feature 1 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 bg-[#2d2d2d] border border-[#404040] flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-[#ffb800]" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold mb-2">30 minutes back every day</h3>
                <p className="text-[#888] max-w-lg">
                  GPS routing orders your jobs by location. No more backtracking across town. 
                  The app figures out the fastest route—you just drive.
                </p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 bg-[#2d2d2d] border border-[#404040] flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6 text-[#ffb800]" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold mb-2">Invoice before you leave</h3>
                <p className="text-[#888] max-w-lg">
                  Job details auto-fill. Tap send, done. Customer gets a professional PDF. 
                  They pay by card, money hits your account in 2 days.
                </p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 bg-[#2d2d2d] border border-[#404040] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-[#ffb800]" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold mb-2">Works where you work</h3>
                <p className="text-[#888] max-w-lg">
                  No app store needed. Runs in your browser. Works offline in basements 
                  and rural areas—syncs when you&apos;re back in service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Direct, no toggle */}
      <section className="py-20 px-6 md:px-12 lg:px-20 border-t border-[#404040]">
        <div className="max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Simple pricing.
          </h2>
          <p className="text-[#888] mb-12">
            Start free. Pay when you&apos;re ready.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="border border-[#404040] p-6 bg-[#1a1a1a]">
              <p className="font-mono text-xs text-[#888] mb-2">FREE</p>
              <p className="font-display text-3xl font-bold mb-4">$0</p>
              <ul className="space-y-2 mb-6 text-sm text-[#888]">
                <li>• 10 jobs per month</li>
                <li>• Customer database</li>
                <li>• Basic invoicing</li>
              </ul>
              <Link href="/signup" className="block text-center border border-[#404040] py-2 font-medium hover:border-[#ffb800] hover:text-[#ffb800] transition-colors">
                Start free
              </Link>
            </div>
            
            {/* Pro */}
            <div className="border-2 border-[#ffb800] p-6 bg-[#ffb800]/5">
              <p className="font-mono text-xs text-[#ffb800] mb-2">PRO</p>
              <p className="font-display text-3xl font-bold mb-4">$29<span className="text-lg text-[#888]">/mo</span></p>
              <ul className="space-y-2 mb-6 text-sm text-[#888]">
                <li>• Unlimited jobs</li>
                <li>• GPS route optimization</li>
                <li>• Card payments</li>
                <li>• Photo documentation</li>
              </ul>
              <Link href="/signup" className="block text-center bg-[#ffb800] text-[#1a1a1a] py-2 font-display font-semibold hover:shadow-lg hover:shadow-[#ffb800]/20 transition-all">
                Start 14-day trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Minimal */}
      <section className="py-20 px-6 md:px-12 lg:px-20 border-t border-[#404040]">
        <div className="max-w-2xl text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Your truck is running.
          </h2>
          <p className="text-[#888] mb-8">
            Stop doing paperwork in the parking lot.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-[#ffb800] text-[#1a1a1a] px-8 py-3 font-display font-semibold text-lg hover:shadow-lg hover:shadow-[#ffb800]/20 transition-all">
            Get started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-12 px-6 md:px-12 lg:px-20 border-t border-[#404040]">
        <div className="max-w-5xl flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-[#ffb800] flex items-center justify-center">
                <Wrench className="w-4 h-4 text-[#1a1a1a]" />
              </div>
              <span className="font-display font-bold">FieldFlow</span>
            </Link>
            <p className="text-[#666] text-sm">Built for contractors who hate paperwork.</p>
          </div>
          
          <div className="flex gap-12 text-sm">
            <div>
              <p className="text-[#888] mb-2">Product</p>
              <Link href="/signup" className="block text-[#666] hover:text-[#f5f5f5] mb-1">Features</Link>
              <Link href="/signup" className="block text-[#666] hover:text-[#f5f5f5]">Pricing</Link>
            </div>
            <div>
              <p className="text-[#888] mb-2">Support</p>
              <Link href="/login" className="block text-[#666] hover:text-[#f5f5f5] mb-1">Help</Link>
              <Link href="/login" className="block text-[#666] hover:text-[#f5f5f5]">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
