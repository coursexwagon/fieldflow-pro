'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Wrench, Clock, MapPin, DollarSign, FileText, Truck } from 'lucide-react';

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [activeNav, setActiveNav] = useState('DISPATCH');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['DISPATCH', 'PROJECT', 'INVOICE', 'SETTINGS'];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f5f5] font-body overflow-x-hidden">
      {/* Gritty noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.025]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
        }}
      />
      
      {/* Workshop texture background */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 80%, rgba(0, 194, 255, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(0, 194, 255, 0.02) 0%, transparent 40%),
            linear-gradient(180deg, #1a1a1a 0%, #141414 50%, #1a1a1a 100%)
          `
        }}
      />

      {/* Metal Sidebar Navigation */}
      <nav className="fixed left-0 top-0 bottom-0 w-20 lg:w-64 z-40 flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #252525 0%, #1d1d1d 50%, #252525 100%)',
          borderRight: '1px solid #3a3a3a',
          boxShadow: 'inset -1px 0 0 0 rgba(255,255,255,0.05), 2px 0 8px rgba(0,0,0,0.3)'
        }}
      >
        {/* Logo */}
        <div className="p-4 lg:p-6 border-b border-[#3a3a3a]">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Brushed metal logo plate */}
            <div 
              className="w-10 h-10 flex items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 50%, #3a3a3a 100%)',
                border: '1px solid #4a4a4a',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {/* Brushed metal texture lines */}
              <div className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
                }}
              />
              <Wrench className="w-5 h-5 text-[#00c2ff] relative z-10" />
            </div>
            <div className="hidden lg:block">
              <span className="font-display font-bold text-lg tracking-tight">
                FIELD<span className="text-[#00c2ff]">FLOW</span>
              </span>
              <p className="text-[10px] text-[#666] font-mono tracking-wider">PRO</p>
            </div>
          </Link>
        </div>
        
        {/* Nav Items with // prefix */}
        <div className="flex-1 py-6">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              className={`w-full px-4 lg:px-6 py-3 flex items-center gap-3 text-left transition-all duration-200 ${
                activeNav === item 
                  ? 'text-[#00c2ff] bg-[#00c2ff]/5 border-r-2 border-[#00c2ff]' 
                  : 'text-[#888] hover:text-[#f5f5f5] hover:bg-white/5'
              }`}
            >
              <span className="font-mono text-xs tracking-wider">//</span>
              <span className="hidden lg:inline font-display font-medium text-sm tracking-wide">{item}</span>
            </button>
          ))}
        </div>

        {/* Bottom section */}
        <div className="p-4 lg:p-6 border-t border-[#3a3a3a]">
          <Link 
            href="/signup" 
            className="hidden lg:flex items-center justify-center gap-2 w-full py-2.5 font-display font-semibold text-sm text-[#1a1a1a] transition-all"
            style={{
              background: 'linear-gradient(180deg, #00c2ff 0%, #00a8d9 100%)',
              boxShadow: '0 2px 8px rgba(0, 194, 255, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
            }}
          >
            START TRIAL
          </Link>
          <Link 
            href="/login"
            className="lg:hidden w-10 h-10 flex items-center justify-center border border-[#3a3a3a] text-[#888] hover:text-[#00c2ff] hover:border-[#00c2ff] transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="ml-20 lg:ml-64">
        {/* Hero Section - Asymmetric, brutal */}
        <section className="relative min-h-screen flex items-center">
          {/* Industrial grid lines */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(#00c2ff 1px, transparent 1px), linear-gradient(90deg, #00c2ff 1px, transparent 1px)`,
              backgroundSize: '100px 100px'
            }}
          />
          
          {/* Diagonal accent line */}
          <div 
            className="absolute top-0 right-0 w-1/2 h-full opacity-10"
            style={{
              background: 'linear-gradient(135deg, transparent 0%, transparent 50%, #00c2ff 50%, #00c2ff 51%, transparent 51%)'
            }}
          />

          {/* Content */}
          <div className="relative z-10 px-8 lg:px-16 py-32 max-w-5xl">
            {/* Brutalist label */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-12 bg-[#00c2ff]" />
              <span className="font-mono text-[11px] text-[#00c2ff] tracking-[0.3em] uppercase">
                Field Service Software
              </span>
            </div>

            {/* MAIN HEADLINE - Huge, uppercase, brutal */}
            <h1 className="font-display font-bold text-[clamp(2.5rem,8vw,6rem)] leading-[0.9] tracking-tight mb-6">
              <span className="block uppercase">PAPERWORK IS</span>
              <span className="block uppercase">KILLING YOUR</span>
              <span className="block uppercase text-[#00c2ff]">BUSINESS.</span>
            </h1>

            {/* Subheadline */}
            <p className="font-display text-2xl md:text-3xl font-bold text-[#888] mb-12 tracking-tight">
              WE KILLED IT FIRST.
            </p>

            {/* Brief subtext */}
            <p className="text-[#666] text-lg max-w-xl mb-12 leading-relaxed">
              You didn&apos;t start a business to fill out forms. 
              We built the tool that handles the paperwork so you can 
              get back to what actually makes money.
            </p>

            {/* CTA Button */}
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/signup" 
                className="group inline-flex items-center gap-3 px-8 py-4 font-display font-bold text-sm tracking-wide text-[#1a1a1a] transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(180deg, #00c2ff 0%, #00a8d9 100%)',
                  boxShadow: '0 4px 16px rgba(0, 194, 255, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                }}
              >
                START TRIAL <span className="text-[#004466]">//</span> STOP WASTING TIME
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 px-6 py-4 border border-[#3a3a3a] font-display font-medium text-sm text-[#888] hover:text-[#f5f5f5] hover:border-[#555] transition-all"
              >
                SIGN IN
              </Link>
            </div>
          </div>

          {/* Floating work card - Polaroid style */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="absolute right-8 lg:right-16 bottom-32 hidden xl:block"
          >
            {/* Polaroid frame */}
            <div 
              className="bg-white p-3 pb-12 shadow-2xl"
              style={{
                transform: 'rotate(-3deg)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
              }}
            >
              {/* "Duct tape" corner accent */}
              <div 
                className="absolute -top-2 -left-2 w-8 h-16"
                style={{
                  background: 'linear-gradient(180deg, #888 0%, #666 50%, #888 100%)',
                  transform: 'rotate(-45deg)',
                  opacity: 0.6
                }}
              />
              
              {/* Content area */}
              <div className="w-64 h-48 bg-[#1a1a1a] p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] text-[#00c2ff] tracking-wider">TODAY&apos;S RUN</span>
                  <span className="font-mono text-[10px] text-[#666]">4 JOBS</span>
                </div>
                <div className="space-y-3">
                  <div className="border-l-2 border-[#00c2ff] pl-3">
                    <p className="text-sm font-medium text-white">8:00 AM</p>
                    <p className="text-xs text-[#888]">Johnson — HVAC repair</p>
                  </div>
                  <div className="border-l-2 border-[#3a3a3a] pl-3">
                    <p className="text-sm font-medium text-white">11:30 AM</p>
                    <p className="text-xs text-[#888]">Martinez — Faucet install</p>
                  </div>
                  <div className="border-l-2 border-[#3a3a3a] pl-3">
                    <p className="text-sm font-medium text-white">2:00 PM</p>
                    <p className="text-xs text-[#888]">Water heater — Chen</p>
                  </div>
                </div>
              </div>
              
              {/* Polaroid caption area */}
              <div className="absolute bottom-3 left-3 right-3">
                <p className="font-display text-sm text-[#1a1a1a] text-center font-semibold">
                  TODAY: <span className="text-[#00a8d9]">$1,247</span>
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* No Fluff Statement */}
        <section className="py-16 px-8 lg:px-16 border-t border-[#2a2a2a]">
          <div className="max-w-4xl">
            <p className="font-mono text-xs text-[#555] tracking-wider mb-4">WE DON&apos;T DO</p>
            <div className="flex flex-wrap gap-6 text-[#444]">
              <span className="line-through decoration-[#ff4444]/50">Trusted by 10,000+</span>
              <span className="line-through decoration-[#ff4444]/50">Award-winning platform</span>
              <span className="line-through decoration-[#ff4444]/50">AI-powered synergy</span>
            </div>
            <p className="mt-6 text-[#888] text-lg">
              Just a tool that works. Built by contractors, for contractors.
            </p>
          </div>
        </section>

        {/* The Fix Section - Direct */}
        <section className="py-20 px-8 lg:px-16 border-t border-[#2a2a2a]">
          <div className="max-w-5xl">
            <h2 className="font-display font-bold text-3xl md:text-4xl uppercase tracking-tight mb-12">
              THE PROBLEM <span className="text-[#00c2ff]">//</span> THE FIX
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="border-l-4 border-[#ff4444] pl-6">
                <p className="font-mono text-[11px] text-[#ff4444] tracking-wider mb-3">// THE PROBLEM</p>
                <p className="text-[#888] text-lg leading-relaxed">
                  Every job you jump between calendar, notes, calculator, and texts. 
                  That&apos;s <span className="text-white font-semibold">30+ minutes lost every day</span>. 
                  That&apos;s 180 hours a year. That&apos;s money walking out the door.
                </p>
              </div>
              <div className="border-l-4 border-[#00c2ff] pl-6">
                <p className="font-mono text-[11px] text-[#00c2ff] tracking-wider mb-3">// THE FIX</p>
                <p className="text-[#888] text-lg leading-relaxed">
                  One tool. Jobs, customers, invoices, routing—all in one place. 
                  Built for the way you <span className="text-white font-semibold">actually work</span>—on 
                  your feet, phone in hand, moving fast.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features - Polaroid Cards */}
        <section className="py-20 px-8 lg:px-16 border-t border-[#2a2a2a]">
          <div className="max-w-6xl">
            <div className="flex items-center gap-4 mb-16">
              <h2 className="font-display font-bold text-3xl md:text-4xl uppercase tracking-tight">
                FEATURES
              </h2>
              <div className="h-px flex-1 bg-[#2a2a2a]" />
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Card 1 - Polaroid style */}
              <div className="group">
                <div 
                  className="bg-[#fafafa] p-3 pb-16 shadow-xl transition-transform duration-300 hover:-translate-y-2 relative"
                  style={{
                    transform: 'rotate(-1deg)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Duct tape accent */}
                  <div 
                    className="absolute -top-3 right-8 w-24 h-4"
                    style={{
                      background: 'linear-gradient(90deg, #999 0%, #777 50%, #999 100%)',
                      opacity: 0.7
                    }}
                  />
                  
                  <div className="bg-[#1a1a1a] p-5 h-44">
                    <div className="w-12 h-12 border border-[#3a3a3a] flex items-center justify-center mb-4">
                      <Clock className="w-6 h-6 text-[#00c2ff]" />
                    </div>
                    <p className="font-mono text-[10px] text-[#00c2ff] tracking-wider mb-1">ROUTE OPTIMIZATION</p>
                    <p className="text-[#888] text-sm">GPS figures out the fastest route through your day.</p>
                  </div>
                  
                  <div className="absolute bottom-3 left-3 right-3 text-center">
                    <p className="font-display font-bold text-sm text-[#1a1a1a] uppercase">30 MIN BACK</p>
                    <p className="text-xs text-[#888]">EVERY DAY</p>
                  </div>
                </div>
              </div>

              {/* Feature Card 2 */}
              <div className="group">
                <div 
                  className="bg-[#fafafa] p-3 pb-16 shadow-xl transition-transform duration-300 hover:-translate-y-2 relative"
                  style={{
                    transform: 'rotate(1deg)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                >
                  <div 
                    className="absolute -top-3 left-8 w-24 h-4"
                    style={{
                      background: 'linear-gradient(90deg, #999 0%, #777 50%, #999 100%)',
                      opacity: 0.7
                    }}
                  />
                  
                  <div className="bg-[#1a1a1a] p-5 h-44">
                    <div className="w-12 h-12 border border-[#3a3a3a] flex items-center justify-center mb-4">
                      <DollarSign className="w-6 h-6 text-[#00c2ff]" />
                    </div>
                    <p className="font-mono text-[10px] text-[#00c2ff] tracking-wider mb-1">INSTANT INVOICES</p>
                    <p className="text-[#888] text-sm">Tap send before you leave the driveway.</p>
                  </div>
                  
                  <div className="absolute bottom-3 left-3 right-3 text-center">
                    <p className="font-display font-bold text-sm text-[#1a1a1a] uppercase">PAID FASTER</p>
                    <p className="text-xs text-[#888]">2 DAYS, NOT 30</p>
                  </div>
                </div>
              </div>

              {/* Feature Card 3 */}
              <div className="group">
                <div 
                  className="bg-[#fafafa] p-3 pb-16 shadow-xl transition-transform duration-300 hover:-translate-y-2 relative"
                  style={{
                    transform: 'rotate(-0.5deg)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                >
                  <div 
                    className="absolute -top-3 right-12 w-24 h-4"
                    style={{
                      background: 'linear-gradient(90deg, #999 0%, #777 50%, #999 100%)',
                      opacity: 0.7
                    }}
                  />
                  
                  <div className="bg-[#1a1a1a] p-5 h-44">
                    <div className="w-12 h-12 border border-[#3a3a3a] flex items-center justify-center mb-4">
                      <FileText className="w-6 h-6 text-[#00c2ff]" />
                    </div>
                    <p className="font-mono text-[10px] text-[#00c2ff] tracking-wider mb-1">JOB TRACKING</p>
                    <p className="text-[#888] text-sm">Every detail saved. Every customer organized.</p>
                  </div>
                  
                  <div className="absolute bottom-3 left-3 right-3 text-center">
                    <p className="font-display font-bold text-sm text-[#1a1a1a] uppercase">NOTHING LOST</p>
                    <p className="text-xs text-[#888]">EVER AGAIN</p>
                  </div>
                </div>
              </div>

              {/* Feature Card 4 */}
              <div className="group">
                <div 
                  className="bg-[#fafafa] p-3 pb-16 shadow-xl transition-transform duration-300 hover:-translate-y-2 relative"
                  style={{
                    transform: 'rotate(0.5deg)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                >
                  <div 
                    className="absolute -top-3 left-12 w-24 h-4"
                    style={{
                      background: 'linear-gradient(90deg, #999 0%, #777 50%, #999 100%)',
                      opacity: 0.7
                    }}
                  />
                  
                  <div className="bg-[#1a1a1a] p-5 h-44">
                    <div className="w-12 h-12 border border-[#3a3a3a] flex items-center justify-center mb-4">
                      <MapPin className="w-6 h-6 text-[#00c2ff]" />
                    </div>
                    <p className="font-mono text-[10px] text-[#00c2ff] tracking-wider mb-1">WORKS ANYWHERE</p>
                    <p className="text-[#888] text-sm">Basements. Rural areas. Offline mode syncs when you&apos;re back.</p>
                  </div>
                  
                  <div className="absolute bottom-3 left-3 right-3 text-center">
                    <p className="font-display font-bold text-sm text-[#1a1a1a] uppercase">NO DEAD ZONES</p>
                    <p className="text-xs text-[#888]">EVER</p>
                  </div>
                </div>
              </div>

              {/* Feature Card 5 */}
              <div className="group">
                <div 
                  className="bg-[#fafafa] p-3 pb-16 shadow-xl transition-transform duration-300 hover:-translate-y-2 relative"
                  style={{
                    transform: 'rotate(-1.5deg)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                >
                  <div 
                    className="absolute -top-3 right-6 w-24 h-4"
                    style={{
                      background: 'linear-gradient(90deg, #999 0%, #777 50%, #999 100%)',
                      opacity: 0.7
                    }}
                  />
                  
                  <div className="bg-[#1a1a1a] p-5 h-44">
                    <div className="w-12 h-12 border border-[#3a3a3a] flex items-center justify-center mb-4">
                      <Truck className="w-6 h-6 text-[#00c2ff]" />
                    </div>
                    <p className="font-mono text-[10px] text-[#00c2ff] tracking-wider mb-1">NO APP STORE</p>
                    <p className="text-[#888] text-sm">Runs in browser. No downloads. No updates.</p>
                  </div>
                  
                  <div className="absolute bottom-3 left-3 right-3 text-center">
                    <p className="font-display font-bold text-sm text-[#1a1a1a] uppercase">WORKS NOW</p>
                    <p className="text-xs text-[#888]">NOT LATER</p>
                  </div>
                </div>
              </div>

              {/* Feature Card 6 */}
              <div className="group">
                <div 
                  className="bg-[#fafafa] p-3 pb-16 shadow-xl transition-transform duration-300 hover:-translate-y-2 relative"
                  style={{
                    transform: 'rotate(1.5deg)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                >
                  <div 
                    className="absolute -top-3 left-6 w-24 h-4"
                    style={{
                      background: 'linear-gradient(90deg, #999 0%, #777 50%, #999 100%)',
                      opacity: 0.7
                    }}
                  />
                  
                  <div className="bg-[#1a1a1a] p-5 h-44">
                    <div className="w-12 h-12 border border-[#3a3a3a] flex items-center justify-center mb-4">
                      <Wrench className="w-6 h-6 text-[#00c2ff]" />
                    </div>
                    <p className="font-mono text-[10px] text-[#00c2ff] tracking-wider mb-1">BUILT BY US</p>
                    <p className="text-[#888] text-sm">Contractors who got tired of bad software.</p>
                  </div>
                  
                  <div className="absolute bottom-3 left-3 right-3 text-center">
                    <p className="font-display font-bold text-sm text-[#1a1a1a] uppercase">REAL TOOL</p>
                    <p className="text-xs text-[#888]">REAL PEOPLE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing - Direct */}
        <section className="py-20 px-8 lg:px-16 border-t border-[#2a2a2a]">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-12">
              <h2 className="font-display font-bold text-3xl md:text-4xl uppercase tracking-tight">
                PRICING
              </h2>
              <div className="h-px flex-1 bg-[#2a2a2a]" />
            </div>
            
            <p className="text-[#888] text-lg mb-12 max-w-xl">
              No hidden fees. No per-user charges. No credit card to start.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
              {/* Free tier */}
              <div className="border border-[#3a3a3a] p-8 bg-[#1a1a1a]">
                <p className="font-mono text-[11px] text-[#666] tracking-wider mb-2">// FREE</p>
                <p className="font-display text-4xl font-bold mb-1">$0</p>
                <p className="text-[#666] text-sm mb-6">Forever, if that&apos;s all you need</p>
                
                <ul className="space-y-3 mb-8">
                  {['10 jobs per month', 'Customer database', 'Basic invoicing', 'Mobile-friendly'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[#888]">
                      <div className="w-1.5 h-1.5 bg-[#00c2ff]" />
                      {item}
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href="/signup" 
                  className="block text-center border border-[#3a3a3a] py-3 font-display font-semibold text-sm hover:border-[#00c2ff] hover:text-[#00c2ff] transition-colors"
                >
                  START FREE
                </Link>
              </div>
              
              {/* Pro tier */}
              <div 
                className="p-8 relative"
                style={{
                  background: 'linear-gradient(180deg, rgba(0, 194, 255, 0.05) 0%, rgba(0, 194, 255, 0.02) 100%)',
                  border: '2px solid #00c2ff'
                }}
              >
                <div className="absolute top-0 right-0 px-3 py-1 bg-[#00c2ff] text-[#1a1a1a] font-mono text-[10px] font-bold tracking-wider">
                  PRO
                </div>
                <p className="font-mono text-[11px] text-[#00c2ff] tracking-wider mb-2">// PRO</p>
                <p className="font-display text-4xl font-bold mb-1">$29<span className="text-lg text-[#888]">/mo</span></p>
                <p className="text-[#666] text-sm mb-6">When you&apos;re ready to scale</p>
                
                <ul className="space-y-3 mb-8">
                  {['Unlimited jobs', 'GPS route optimization', 'Card payments (2.9% fee)', 'Photo documentation', 'Priority support'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[#888]">
                      <div className="w-1.5 h-1.5 bg-[#00c2ff]" />
                      {item}
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href="/signup" 
                  className="block text-center py-3 font-display font-semibold text-sm text-[#1a1a1a] hover:opacity-90 transition-opacity"
                  style={{
                    background: 'linear-gradient(180deg, #00c2ff 0%, #00a8d9 100%)'
                  }}
                >
                  START 14-DAY TRIAL
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-8 lg:px-16 border-t border-[#2a2a2a]">
          <div className="max-w-3xl">
            <h2 className="font-display font-bold text-3xl md:text-5xl uppercase tracking-tight mb-6">
              YOUR TRUCK IS RUNNING.
            </h2>
            <p className="text-[#888] text-xl mb-12 max-w-xl">
              Stop doing paperwork in parking lots. Go make money instead.
            </p>
            
            <Link 
              href="/signup" 
              className="group inline-flex items-center gap-3 px-10 py-5 font-display font-bold text-base tracking-wide text-[#1a1a1a] transition-all hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(180deg, #00c2ff 0%, #00a8d9 100%)',
                boxShadow: '0 4px 20px rgba(0, 194, 255, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
              }}
            >
              GET STARTED <span className="text-[#004466]">//</span> NO CARD REQUIRED
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-8 lg:px-16 border-t border-[#2a2a2a]">
          <div className="max-w-5xl flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#00c2ff] flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-[#1a1a1a]" />
                </div>
                <span className="font-display font-bold">FIELD<span className="text-[#00c2ff]">FLOW</span></span>
              </Link>
              <p className="text-[#555] text-sm">Built by contractors. For contractors.</p>
              <p className="text-[#444] text-xs mt-2 font-mono">No venture capital. No growth hackers. Just software.</p>
            </div>
            
            <div className="flex gap-16 text-sm">
              <div>
                <p className="font-mono text-[10px] text-[#666] tracking-wider mb-3">// PRODUCT</p>
                <Link href="/signup" className="block text-[#888] hover:text-[#00c2ff] mb-2 transition-colors">Features</Link>
                <Link href="/signup" className="block text-[#888] hover:text-[#00c2ff] mb-2 transition-colors">Pricing</Link>
                <Link href="/login" className="block text-[#888] hover:text-[#00c2ff] transition-colors">Demo</Link>
              </div>
              <div>
                <p className="font-mono text-[10px] text-[#666] tracking-wider mb-3">// SUPPORT</p>
                <Link href="/login" className="block text-[#888] hover:text-[#00c2ff] mb-2 transition-colors">Help Center</Link>
                <Link href="/login" className="block text-[#888] hover:text-[#00c2ff] mb-2 transition-colors">Contact</Link>
                <Link href="/login" className="block text-[#888] hover:text-[#00c2ff] transition-colors">Status</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
