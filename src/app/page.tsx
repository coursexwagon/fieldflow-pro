'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Wrench, Clock, MapPin, DollarSign, FileText, Truck, Check, Star, Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-[#333]">
        <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#fbbf24] flex items-center justify-center">
              <Wrench className="w-5 h-5 text-[#1a1a1a]" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              FIELD<span className="text-[#fbbf24]">FLOW</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[#888] hover:text-white transition-colors text-sm">Features</a>
            <a href="#pricing" className="text-[#888] hover:text-white transition-colors text-sm">Pricing</a>
            <a href="#testimonials" className="text-[#888] hover:text-white transition-colors text-sm">Reviews</a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-[#888] hover:text-white transition-colors text-sm">
              Sign in
            </Link>
            <Link 
              href="/signup" 
              className="bg-[#fbbf24] text-[#1a1a1a] px-5 py-2 text-sm font-semibold hover:bg-[#f59e0b] transition-colors"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-[#1a1a1a] border-b border-[#333] p-6 space-y-4"
          >
            <a href="#features" className="block text-[#888] hover:text-white">Features</a>
            <a href="#pricing" className="block text-[#888] hover:text-white">Pricing</a>
            <a href="#testimonials" className="block text-[#888] hover:text-white">Reviews</a>
            <hr className="border-[#333]" />
            <Link href="/login" className="block text-[#888] hover:text-white">Sign in</Link>
            <Link href="/signup" className="block bg-[#fbbf24] text-[#1a1a1a] px-5 py-3 text-center font-semibold">
              Start Free Trial
            </Link>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-px w-8 bg-[#fbbf24]" />
                <span className="text-xs text-[#fbbf24] uppercase tracking-widest font-medium">
                  Field Service Software
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Paperwork is{' '}
                <span className="text-[#fbbf24]">killing your business.</span>
              </h1>

              <p className="text-xl text-[#888] mb-4 font-medium">
                We killed it first.
              </p>

              <p className="text-[#666] mb-8 max-w-md leading-relaxed">
                You didn&apos;t start a business to fill out forms. We built the tool that handles 
                the paperwork so you can get back to what actually makes money.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Link 
                  href="/signup" 
                  className="inline-flex items-center gap-2 bg-[#fbbf24] text-[#1a1a1a] px-6 py-3 font-semibold hover:bg-[#f59e0b] transition-colors"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="/login" 
                  className="inline-flex items-center gap-2 border border-[#444] text-[#888] px-6 py-3 hover:border-[#666] hover:text-white transition-colors"
                >
                  See How It Works
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-[#333] border-2 border-[#1a1a1a] flex items-center justify-center text-xs">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]" />
                    ))}
                  </div>
                  <p className="text-xs text-[#666]">Trusted by 2,000+ contractors</p>
                </div>
              </div>
            </div>

            {/* Right: Phone Mockup */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Phone Frame */}
                <div className="relative w-72 h-[580px] bg-[#1a1a1a] rounded-[40px] border-4 border-[#333] p-2 shadow-2xl">
                  {/* Screen */}
                  <div className="w-full h-full bg-[#0a0a0a] rounded-[32px] overflow-hidden">
                    {/* Status Bar */}
                    <div className="h-8 bg-[#1a1a1a] flex items-center justify-between px-6 text-xs text-[#666]">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-2 border border-[#666] rounded-sm">
                          <div className="w-3/4 h-full bg-[#fbbf24]" />
                        </div>
                      </div>
                    </div>
                    {/* App Content */}
                    <div className="p-4">
                      <p className="text-[#666] text-xs mb-1">Good morning</p>
                      <p className="text-white font-semibold mb-4">Today&apos;s Run</p>
                      
                      {/* Job Cards */}
                      <div className="space-y-3">
                        <div className="bg-[#1a1a1a] p-3 rounded-lg border-l-2 border-[#22c55e]">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs text-[#22c55e] font-medium">DONE</span>
                            <span className="text-xs text-[#666]">8:00 AM</span>
                          </div>
                          <p className="text-sm text-white font-medium">HVAC Repair</p>
                          <p className="text-xs text-[#666]">Johnson Residence</p>
                        </div>
                        
                        <div className="bg-[#1a1a1a] p-3 rounded-lg border-l-2 border-[#fbbf24]">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs text-[#fbbf24] font-medium">ACTIVE</span>
                            <span className="text-xs text-[#666]">11:30 AM</span>
                          </div>
                          <p className="text-sm text-white font-medium">Faucet Install</p>
                          <p className="text-xs text-[#666]">Martinez Property</p>
                        </div>
                        
                        <div className="bg-[#1a1a1a] p-3 rounded-lg border-l-2 border-[#555]">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs text-[#666] font-medium">QUEUE</span>
                            <span className="text-xs text-[#666]">2:00 PM</span>
                          </div>
                          <p className="text-sm text-white font-medium">Water Heater</p>
                          <p className="text-xs text-[#666]">Chen Business</p>
                        </div>
                      </div>

                      {/* Earnings */}
                      <div className="mt-4 p-3 bg-[#1a1a1a] rounded-lg">
                        <p className="text-xs text-[#666] mb-1">Today&apos;s Earnings</p>
                        <p className="text-2xl font-bold text-[#fbbf24]">$1,247</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Notification */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -right-4 top-20 bg-[#1a1a1a] border border-[#333] px-4 py-2 rounded-lg shadow-xl"
                >
                  <p className="text-xs text-[#22c55e]">Job completed</p>
                  <p className="text-sm font-semibold">$347 paid</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 border-t border-[#222]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-xs text-[#ef4444] uppercase tracking-widest mb-4 font-medium">The Problem</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                You&apos;re losing 2 hours every day to app switching
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-[#ef4444] mt-0.5 flex-shrink-0" />
                  <p className="text-[#888]">One app for scheduling, another for invoices</p>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-[#ef4444] mt-0.5 flex-shrink-0" />
                  <p className="text-[#888]">GPS routing in Maps, customer info in Notes</p>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-[#ef4444] mt-0.5 flex-shrink-0" />
                  <p className="text-[#888]">$400/month tools built for big companies, not you</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-[#22c55e] uppercase tracking-widest mb-4 font-medium">The Fix</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                One tool. Everything you need.
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#22c55e] mt-0.5 flex-shrink-0" />
                  <p className="text-[#888]">Jobs, customers, invoices—all in one place</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#22c55e] mt-0.5 flex-shrink-0" />
                  <p className="text-[#888]">GPS routing built for your daily run</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#22c55e] mt-0.5 flex-shrink-0" />
                  <p className="text-[#888]">Pricing that doesn&apos;t require a CFO to approve</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 border-t border-[#222]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-[#fbbf24] uppercase tracking-widest mb-4 font-medium">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="text-[#666] max-w-xl mx-auto">
              Built specifically for contractors working in the field
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#141414] border border-[#222] p-6 hover:border-[#333] transition-colors">
              <div className="w-12 h-12 bg-[#1a1a1a] border border-[#333] flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-[#fbbf24]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Scheduling</h3>
              <p className="text-[#666] text-sm mb-4">
                AI orders your jobs by location. No more backtracking across town.
              </p>
              <p className="text-xs text-[#fbbf24] font-medium">Saves 30 min/day</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#141414] border border-[#222] p-6 hover:border-[#333] transition-colors">
              <div className="w-12 h-12 bg-[#1a1a1a] border border-[#333] flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-[#fbbf24]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">One-Tap Invoicing</h3>
              <p className="text-[#666] text-sm mb-4">
                Auto-fill from job data. Send invoice in 10 seconds, not 10 minutes.
              </p>
              <p className="text-xs text-[#fbbf24] font-medium">2x faster payment</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#141414] border border-[#222] p-6 hover:border-[#333] transition-colors">
              <div className="w-12 h-12 bg-[#1a1a1a] border border-[#333] flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-[#fbbf24]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">GPS Routing</h3>
              <p className="text-[#666] text-sm mb-4">
                Navigate to your next job with one tap. No address copying.
              </p>
              <p className="text-xs text-[#fbbf24] font-medium">Less driving, more earning</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#141414] border border-[#222] p-6 hover:border-[#333] transition-colors">
              <div className="w-12 h-12 bg-[#1a1a1a] border border-[#333] flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-[#fbbf24]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Photo Documentation</h3>
              <p className="text-[#666] text-sm mb-4">
                Capture before/after shots. Stored with the job forever.
              </p>
              <p className="text-xs text-[#fbbf24] font-medium">Protect yourself</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#141414] border border-[#222] p-6 hover:border-[#333] transition-colors">
              <div className="w-12 h-12 bg-[#1a1a1a] border border-[#333] flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-[#fbbf24]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Works Anywhere</h3>
              <p className="text-[#666] text-sm mb-4">
                Basements. Rural areas. Offline mode syncs when you&apos;re back.
              </p>
              <p className="text-xs text-[#fbbf24] font-medium">No dead zones</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#141414] border border-[#222] p-6 hover:border-[#333] transition-colors">
              <div className="w-12 h-12 bg-[#1a1a1a] border border-[#333] flex items-center justify-center mb-4">
                <Wrench className="w-6 h-6 text-[#fbbf24]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Built by Contractors</h3>
              <p className="text-[#666] text-sm mb-4">
                We know what it&apos;s like. This isn&apos;t software from a cubicle.
              </p>
              <p className="text-xs text-[#fbbf24] font-medium">Real tool, real people</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 border-t border-[#222]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-[#fbbf24] uppercase tracking-widest mb-4 font-medium">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              No hidden fees. No per-user charges.
            </h2>
            <p className="text-[#666]">
              No credit card required to start.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Tier */}
            <div className="bg-[#141414] border border-[#222] p-8">
              <p className="text-xs text-[#666] uppercase tracking-widest mb-2 font-medium">Free</p>
              <p className="text-4xl font-bold mb-1">$0</p>
              <p className="text-[#666] text-sm mb-6">Forever, if that&apos;s all you need</p>

              <ul className="space-y-3 mb-8">
                {['10 jobs per month', 'Customer database', 'Basic invoicing', 'Mobile-friendly'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[#888]">
                    <Check className="w-4 h-4 text-[#22c55e]" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link 
                href="/signup" 
                className="block text-center border border-[#333] py-3 font-semibold hover:border-[#fbbf24] hover:text-[#fbbf24] transition-colors"
              >
                Start Free
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-[#141414] border-2 border-[#fbbf24] p-8 relative">
              <div className="absolute top-0 right-0 bg-[#fbbf24] text-[#1a1a1a] px-3 py-1 text-xs font-bold">
                PRO
              </div>
              <p className="text-xs text-[#fbbf24] uppercase tracking-widest mb-2 font-medium">Pro</p>
              <p className="text-4xl font-bold mb-1">$29<span className="text-lg text-[#666]">/mo</span></p>
              <p className="text-[#666] text-sm mb-6">When you&apos;re ready to scale</p>

              <ul className="space-y-3 mb-8">
                {['Unlimited jobs', 'GPS route optimization', 'Card payments (2.9% fee)', 'Photo documentation', 'Priority support'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[#888]">
                    <Check className="w-4 h-4 text-[#fbbf24]" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link 
                href="/signup" 
                className="block text-center bg-[#fbbf24] text-[#1a1a1a] py-3 font-semibold hover:bg-[#f59e0b] transition-colors"
              >
                Start 14-Day Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 border-t border-[#222]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-[#fbbf24] uppercase tracking-widest mb-4 font-medium">Reviews</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              What contractors say
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#141414] border border-[#222] p-6">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]" />
                ))}
              </div>
              <p className="text-[#888] mb-4">
                &quot;I was spending an hour every night on paperwork. Now I send invoices from the driveway. Game changer.&quot;
              </p>
              <p className="text-sm font-semibold">Mike R.</p>
              <p className="text-xs text-[#666]">Plumber, 12 years</p>
            </div>

            <div className="bg-[#141414] border border-[#222] p-6">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]" />
                ))}
              </div>
              <p className="text-[#888] mb-4">
                &quot;The GPS routing alone saves me 30 minutes a day. That&apos;s an extra job I can fit in.&quot;
              </p>
              <p className="text-sm font-semibold">Sarah T.</p>
              <p className="text-xs text-[#666]">HVAC Tech, 8 years</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 border-t border-[#222]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Your truck is running.
          </h2>
          <p className="text-[#666] text-xl mb-12">
            Stop doing paperwork in parking lots. Go make money instead.
          </p>

          <Link 
            href="/signup" 
            className="inline-flex items-center gap-2 bg-[#fbbf24] text-[#1a1a1a] px-8 py-4 font-semibold text-lg hover:bg-[#f59e0b] transition-colors"
          >
            Get Started — No Card Required
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#222]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-[#fbbf24] flex items-center justify-center">
                <Wrench className="w-4 h-4 text-[#1a1a1a]" />
              </div>
              <span className="font-bold">FIELD<span className="text-[#fbbf24]">FLOW</span></span>
            </Link>
            <p className="text-[#555] text-sm">Built by contractors. For contractors.</p>
          </div>

          <div className="flex gap-16 text-sm">
            <div>
              <p className="text-xs text-[#666] uppercase tracking-wider mb-3">Product</p>
              <a href="#features" className="block text-[#888] hover:text-[#fbbf24] mb-2 transition-colors">Features</a>
              <a href="#pricing" className="block text-[#888] hover:text-[#fbbf24] mb-2 transition-colors">Pricing</a>
              <a href="/login" className="block text-[#888] hover:text-[#fbbf24] transition-colors">Demo</a>
            </div>
            <div>
              <p className="text-xs text-[#666] uppercase tracking-wider mb-3">Support</p>
              <a href="/login" className="block text-[#888] hover:text-[#fbbf24] mb-2 transition-colors">Help Center</a>
              <a href="/login" className="block text-[#888] hover:text-[#fbbf24] mb-2 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
