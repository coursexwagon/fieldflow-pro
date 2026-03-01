'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Wrench, Clock, MapPin, DollarSign, FileText, Truck, Check, Star, Menu, X, Thermometer } from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa] font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#27272a]">
        <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-7 h-7 bg-[#f59e0b] flex items-center justify-center">
              <Wrench className="w-4 h-4 text-[#0a0a0a]" />
            </div>
            <span className="font-bold text-sm tracking-tight">
              FIELD<span className="text-[#f59e0b]">FLOW</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[#a1a1aa] hover:text-[#fafafa] transition-colors text-sm cursor-pointer">Features</a>
            <a href="#pricing" className="text-[#a1a1aa] hover:text-[#fafafa] transition-colors text-sm cursor-pointer">Pricing</a>
            <a href="#testimonials" className="text-[#a1a1aa] hover:text-[#fafafa] transition-colors text-sm cursor-pointer">Reviews</a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-[#a1a1aa] hover:text-[#fafafa] transition-colors text-sm cursor-pointer">
              Sign in
            </Link>
            <Link 
              href="/signup" 
              className="bg-[#f59e0b] text-[#0a0a0a] px-5 py-2 text-sm font-semibold hover:bg-[#d97706] transition-colors cursor-pointer"
            >
              Start Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 cursor-pointer touch-target flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-14 left-0 right-0 bg-[#0a0a0a] border-b border-[#27272a] p-6 space-y-4"
          >
            <a href="#features" className="block text-[#a1a1aa] hover:text-[#fafafa] cursor-pointer">Features</a>
            <a href="#pricing" className="block text-[#a1a1aa] hover:text-[#fafafa] cursor-pointer">Pricing</a>
            <a href="#testimonials" className="block text-[#a1a1aa] hover:text-[#fafafa] cursor-pointer">Reviews</a>
            <hr className="border-[#27272a]" />
            <Link href="/login" className="block text-[#a1a1aa] hover:text-[#fafafa] cursor-pointer">Sign in</Link>
            <Link href="/signup" className="block bg-[#f59e0b] text-[#0a0a0a] px-5 py-3 text-center font-semibold cursor-pointer">
              Start Free
            </Link>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-px w-8 bg-[#f59e0b]" />
                <span className="text-xs text-[#f59e0b] uppercase tracking-widest font-medium">
                  For HVAC Techs
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Paperwork is{' '}
                <span className="text-[#f59e0b]">killing your day.</span>
              </h1>

              <p className="text-xl text-[#a1a1aa] mb-4 font-medium">
                We killed it first.
              </p>

              <p className="text-[#71717a] mb-8 max-w-md leading-relaxed">
                You didn&apos;t start turning wrenches to fill out forms. FieldFlow handles 
                the paperwork so you can get back to what actually pays.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Link 
                  href="/signup" 
                  className="inline-flex items-center gap-2 bg-[#f59e0b] text-[#0a0a0a] px-6 py-3 font-semibold hover:bg-[#d97706] transition-colors cursor-pointer"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="/login" 
                  className="inline-flex items-center gap-2 border border-[#3f3f46] text-[#a1a1aa] px-6 py-3 hover:border-[#52525b] hover:text-[#fafafa] transition-colors cursor-pointer"
                >
                  See How It Works
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-[#27272a] border-2 border-[#0a0a0a] flex items-center justify-center text-xs text-[#a1a1aa]">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                    ))}
                  </div>
                  <p className="text-xs text-[#71717a]">2,000+ HVAC techs</p>
                </div>
              </div>
            </div>

            {/* Right: Phone Mockup */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Phone Frame */}
                <div className="relative w-64 h-[520px] bg-[#0a0a0a] border-2 border-[#27272a] p-2">
                  {/* Screen */}
                  <div className="w-full h-full bg-[#0a0a0a] overflow-hidden">
                    {/* Status Bar */}
                    <div className="h-7 bg-[#141414] flex items-center justify-between px-4 text-xs text-[#52525b]">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-2 border border-[#52525b]">
                          <div className="w-3/4 h-full bg-[#f59e0b]" />
                        </div>
                      </div>
                    </div>
                    {/* App Content */}
                    <div className="p-3">
                      <p className="text-[#52525b] text-xs mb-1">Good morning</p>
                      <p className="text-[#fafafa] font-semibold text-sm mb-3">Today&apos;s Run</p>
                      
                      {/* Job Cards */}
                      <div className="space-y-2">
                        <div className="bg-[#141414] border border-[#27272a] p-3">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs text-[#10b981] font-medium">DONE</span>
                            <span className="text-xs text-[#52525b]">8:00 AM</span>
                          </div>
                          <p className="text-sm text-[#fafafa] font-medium">AC Replacement</p>
                          <p className="text-xs text-[#52525b]">Johnson Residence</p>
                        </div>
                        
                        <div className="bg-[#141414] border border-[#f59e0b] p-3">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs text-[#f59e0b] font-medium">ACTIVE</span>
                            <span className="text-xs text-[#52525b]">11:30 AM</span>
                          </div>
                          <p className="text-sm text-[#fafafa] font-medium">Heat Pump Repair</p>
                          <p className="text-xs text-[#52525b]">Martinez Property</p>
                        </div>
                        
                        <div className="bg-[#141414] border border-[#27272a] p-3">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs text-[#52525b] font-medium">QUEUE</span>
                            <span className="text-xs text-[#52525b]">2:00 PM</span>
                          </div>
                          <p className="text-sm text-[#fafafa] font-medium">Ductless Mini-Split</p>
                          <p className="text-xs text-[#52525b]">Chen Business</p>
                        </div>
                      </div>

                      {/* Earnings */}
                      <div className="mt-3 p-3 bg-[#141414] border border-[#27272a]">
                        <p className="text-xs text-[#52525b] mb-1">Today&apos;s Earnings</p>
                        <p className="text-xl font-bold text-[#f59e0b]">$1,247</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Notification */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -right-2 top-16 bg-[#141414] border border-[#27272a] px-3 py-2"
                >
                  <p className="text-xs text-[#10b981]">Job completed</p>
                  <p className="text-sm font-semibold">$347 paid</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-4 border-t border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-xs text-[#ef4444] uppercase tracking-widest mb-4 font-medium">The Problem</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                You&apos;re losing 2 hours every day to paperwork
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-[#ef4444] mt-0.5 flex-shrink-0" />
                  <p className="text-[#a1a1aa]">Invoicing from the truck at 9 PM</p>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-[#ef4444] mt-0.5 flex-shrink-0" />
                  <p className="text-[#a1a1aa]">Paper work orders getting lost in the van</p>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-[#ef4444] mt-0.5 flex-shrink-0" />
                  <p className="text-[#a1a1aa]">$400/month software built for office staff</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-[#10b981] uppercase tracking-widest mb-4 font-medium">The Fix</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                One app. Everything you need.
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#10b981] mt-0.5 flex-shrink-0" />
                  <p className="text-[#a1a1aa]">Send invoices in 10 seconds from the driveway</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#10b981] mt-0.5 flex-shrink-0" />
                  <p className="text-[#a1a1aa]">GPS routing built for your daily run</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#10b981] mt-0.5 flex-shrink-0" />
                  <p className="text-[#a1a1aa]">$29/month. No per-user fees. No BS.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 border-t border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs text-[#f59e0b] uppercase tracking-widest mb-4 font-medium">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for the field, not the office
            </h2>
            <p className="text-[#71717a] max-w-xl mx-auto">
              Designed by HVAC techs who know what it&apos;s like to work in a crawlspace at 2 PM in July
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#141414] border border-[#27272a] p-6 hover:border-[#3f3f46] transition-colors">
              <div className="w-12 h-12 bg-[#1f1f1f] border border-[#27272a] flex items-center justify-center mb-4">
                <Thermometer className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">HVAC Tools</h3>
              <p className="text-[#71717a] text-sm mb-4">
                Refrigerant charts, BTU calculators, and pressure-temperature tables built right in.
              </p>
              <p className="text-xs text-[#f59e0b] font-medium">No more app switching</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#141414] border border-[#27272a] p-6 hover:border-[#3f3f46] transition-colors">
              <div className="w-12 h-12 bg-[#1f1f1f] border border-[#27272a] flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">One-Tap Invoicing</h3>
              <p className="text-[#71717a] text-sm mb-4">
                Auto-fill from job data. Send invoice in 10 seconds, not 10 minutes.
              </p>
              <p className="text-xs text-[#f59e0b] font-medium">2x faster payment</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#141414] border border-[#27272a] p-6 hover:border-[#3f3f46] transition-colors">
              <div className="w-12 h-12 bg-[#1f1f1f] border border-[#27272a] flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">GPS Routing</h3>
              <p className="text-[#71717a] text-sm mb-4">
                Navigate to your next job with one tap. No address copying.
              </p>
              <p className="text-xs text-[#f59e0b] font-medium">Less driving, more earning</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#141414] border border-[#27272a] p-6 hover:border-[#3f3f46] transition-colors">
              <div className="w-12 h-12 bg-[#1f1f1f] border border-[#27272a] flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Photo Documentation</h3>
              <p className="text-[#71717a] text-sm mb-4">
                Before/after shots. Stored with the job forever. Protect yourself.
              </p>
              <p className="text-xs text-[#f59e0b] font-medium">Never lose a dispute</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#141414] border border-[#27272a] p-6 hover:border-[#3f3f46] transition-colors">
              <div className="w-12 h-12 bg-[#1f1f1f] border border-[#27272a] flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Works Offline</h3>
              <p className="text-[#71717a] text-sm mb-4">
                Basements. Attics. Rural areas. Syncs when you&apos;re back in range.
              </p>
              <p className="text-xs text-[#f59e0b] font-medium">No dead zones</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#141414] border border-[#27272a] p-6 hover:border-[#3f3f46] transition-colors">
              <div className="w-12 h-12 bg-[#1f1f1f] border border-[#27272a] flex items-center justify-center mb-4">
                <Wrench className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Built by Techs</h3>
              <p className="text-[#71717a] text-sm mb-4">
                We know what it&apos;s like. This isn&apos;t software from a cubicle.
              </p>
              <p className="text-xs text-[#f59e0b] font-medium">Real tool, real people</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 border-t border-[#1f1f1f]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs text-[#f59e0b] uppercase tracking-widest mb-4 font-medium">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              No hidden fees. No per-user charges.
            </h2>
            <p className="text-[#71717a]">
              No credit card required to start.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Free Tier */}
            <div className="bg-[#141414] border border-[#27272a] p-6">
              <p className="text-xs text-[#71717a] uppercase tracking-widest mb-2 font-medium">Free</p>
              <p className="text-4xl font-bold mb-1">$0</p>
              <p className="text-[#71717a] text-sm mb-6">Forever, if that&apos;s all you need</p>

              <ul className="space-y-3 mb-6">
                {['10 jobs per month', 'Customer database', 'Basic invoicing', 'Mobile app'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[#a1a1aa]">
                    <Check className="w-4 h-4 text-[#10b981]" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link 
                href="/signup" 
                className="block text-center border border-[#3f3f46] py-3 font-semibold hover:border-[#f59e0b] hover:text-[#f59e0b] transition-colors cursor-pointer"
              >
                Start Free
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-[#141414] border-2 border-[#f59e0b] p-6 relative">
              <div className="absolute top-0 right-0 bg-[#f59e0b] text-[#0a0a0a] px-3 py-1 text-xs font-bold">
                PRO
              </div>
              <p className="text-xs text-[#f59e0b] uppercase tracking-widest mb-2 font-medium">Pro</p>
              <p className="text-4xl font-bold mb-1">$29<span className="text-lg text-[#71717a]">/mo</span></p>
              <p className="text-[#71717a] text-sm mb-6">When you&apos;re ready to scale</p>

              <ul className="space-y-3 mb-6">
                {['Unlimited jobs', 'GPS route optimization', 'Card payments (2.9% fee)', 'Photo documentation', 'HVAC tools & calculators'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[#a1a1aa]">
                    <Check className="w-4 h-4 text-[#f59e0b]" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link 
                href="/signup" 
                className="block text-center bg-[#f59e0b] text-[#0a0a0a] py-3 font-semibold hover:bg-[#d97706] transition-colors cursor-pointer"
              >
                Start 14-Day Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 px-4 border-t border-[#1f1f1f]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs text-[#f59e0b] uppercase tracking-widest mb-4 font-medium">Reviews</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              What HVAC techs say
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#141414] border border-[#27272a] p-6">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                ))}
              </div>
              <p className="text-[#a1a1aa] mb-4">
                &quot;I was spending an hour every night on paperwork. Now I send invoices from the driveway before I even leave. Game changer.&quot;
              </p>
              <p className="text-sm font-semibold">Mike R.</p>
              <p className="text-xs text-[#71717a]">HVAC Tech, 12 years</p>
            </div>

            <div className="bg-[#141414] border border-[#27272a] p-6">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                ))}
              </div>
              <p className="text-[#a1a1aa] mb-4">
                &quot;The refrigerant charts and PT calculators alone are worth it. No more digging through my truck for that chart.&quot;
              </p>
              <p className="text-sm font-semibold">Sarah T.</p>
              <p className="text-xs text-[#71717a]">Service Manager, 8 years</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 border-t border-[#1f1f1f]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Your truck is running.
          </h2>
          <p className="text-[#71717a] text-xl mb-12">
            Stop doing paperwork in parking lots. Go make money instead.
          </p>

          <Link 
            href="/signup" 
            className="inline-flex items-center gap-2 bg-[#f59e0b] text-[#0a0a0a] px-8 py-4 font-semibold text-lg hover:bg-[#d97706] transition-colors cursor-pointer"
          >
            Get Started — No Card Required
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3 cursor-pointer">
              <div className="w-6 h-6 bg-[#f59e0b] flex items-center justify-center">
                <Wrench className="w-3 h-3 text-[#0a0a0a]" />
              </div>
              <span className="font-bold text-sm">FIELD<span className="text-[#f59e0b]">FLOW</span></span>
            </Link>
            <p className="text-[#52525b] text-sm">Built by HVAC techs. For HVAC techs.</p>
          </div>

          <div className="flex gap-16 text-sm">
            <div>
              <p className="text-xs text-[#71717a] uppercase tracking-wider mb-3">Product</p>
              <a href="#features" className="block text-[#a1a1aa] hover:text-[#f59e0b] mb-2 transition-colors cursor-pointer">Features</a>
              <a href="#pricing" className="block text-[#a1a1aa] hover:text-[#f59e0b] mb-2 transition-colors cursor-pointer">Pricing</a>
              <a href="/login" className="block text-[#a1a1aa] hover:text-[#f59e0b] transition-colors cursor-pointer">Demo</a>
            </div>
            <div>
              <p className="text-xs text-[#71717a] uppercase tracking-wider mb-3">Support</p>
              <a href="/login" className="block text-[#a1a1aa] hover:text-[#f59e0b] mb-2 transition-colors cursor-pointer">Help Center</a>
              <a href="/login" className="block text-[#a1a1aa] hover:text-[#f59e0b] mb-2 transition-colors cursor-pointer">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
