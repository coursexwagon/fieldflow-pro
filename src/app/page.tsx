'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  Play,
  ArrowRight,
  Check,
  X,
  Calendar,
  Route,
  FileText,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Navbar } from '@/components/layout/Navbar';
import { Logo } from '@/components/shared/Logo';

// Feature data with proper icons
const features = [
  {
    title: 'Your day, optimized',
    description: 'AI orders your jobs by location. No more backtracking across town.',
    badge: 'Saves 30 min/day',
    icon: Route,
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-400',
  },
  {
    title: 'Get paid before you leave',
    description: 'Auto-fill from job data. Send invoice in 10 seconds, not 10 minutes.',
    badge: '2x faster payment',
    icon: FileText,
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
  },
  {
    title: 'Clients always know the score',
    description: 'Automatic updates when you\'re en route, working, or done.',
    badge: 'Fewer "where are you?" calls',
    icon: MessageCircle,
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-400',
  },
];

// How it works steps
const steps = [
  {
    num: '01',
    title: 'Book the job',
    description: 'Add job details in 30 seconds. Customer gets automatic confirmation.',
  },
  {
    num: '02',
    title: 'Focus on the work',
    description: 'Navigate with one tap. Capture photos. Mark complete.',
  },
  {
    num: '03',
    title: 'Invoice instantly',
    description: 'Job details auto-fill. Send invoice before you start the truck.',
  },
];

// Pricing plans
const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'Forever free',
    features: ['10 jobs/month', 'Basic scheduling', 'Customer database', 'Email support'],
    cta: 'Get started free',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month per user',
    features: ['Unlimited jobs', 'GPS route optimization', 'One-tap invoicing + payments', 'Photo documentation', 'Priority support'],
    cta: 'Start 14-day trial',
    featured: true,
  },
  {
    name: 'Team',
    price: '$49',
    period: '/month per user',
    features: ['Everything in Pro', 'Multi-technician dispatch', 'Team scheduling', 'Advanced reporting', 'API access'],
    cta: 'Contact sales',
    featured: false,
  },
];

// FAQ items
const faqs = [
  {
    q: 'Do I need to download an app?',
    a: 'FieldFlow works in your browser—no app store needed. Just visit app.fieldflow.com on your phone.',
  },
  {
    q: 'Can I use this offline?',
    a: 'Yes. Jobs sync when you\'re back in service. Perfect for rural areas or basements.',
  },
  {
    q: 'How do payments work?',
    a: 'We integrate with Stripe. Customers pay by card, money hits your account in 2 days.',
  },
  {
    q: 'What if I have a team?',
    a: 'Start with Pro for yourself. Upgrade to Team when you add technicians.',
  },
  {
    q: 'Can I import my existing customers?',
    a: 'Yes. Upload a CSV or import from QuickBooks.',
  },
];

// Pain points
const painPoints = [
  'One app for scheduling, another for invoices',
  'GPS routing in Maps, customer info in Notes',
  '$400/month tools built for big companies, not you',
];

// Footer links
const footerLinks = {
  Product: ['Features', 'Pricing', 'Integrations', 'Changelog'],
  Resources: ['Blog', 'Help Center', 'Community', 'Contact'],
  Company: ['About', 'Careers', 'Press', 'Partners'],
  Legal: ['Privacy', 'Terms', 'Security'],
};

export default function LandingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section with Grid Background */}
      <section className="relative min-h-screen">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-grid opacity-50" />
        
        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-hero" />
        
        {/* Content */}
        <div className="relative z-10 container-main">
          <div className="grid lg:grid-cols-5 gap-12 items-center min-h-screen pt-24 pb-16">
            {/* Left Column - 60% */}
            <div className="lg:col-span-3 space-y-8">
              <p className="label-eyebrow">
                Mobile field service software
              </p>
              
              <h1 className="heading-hero text-white">
                The command center for contractors who hate paperwork
              </h1>
              
              <p className="text-lg lg:text-xl text-zinc-400 max-w-lg leading-relaxed">
                Schedule jobs, invoice clients, and get paid—all from your phone. No laptop required.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/signup">
                  <Button variant="primary" size="lg">
                    Start free trial
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="secondary" size="lg">
                  <Play className="w-4 h-4" />
                  See how it works
                </Button>
              </div>
              
              {/* Social Proof */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {['MJ', 'SK', 'DW', 'JP', 'RC'].map((initials, i) => (
                    <Avatar key={i} className="w-8 h-8 border-2 border-[#0A0A0B]">
                      <AvatarFallback className="bg-zinc-800 text-xs text-zinc-300">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <p className="text-sm text-zinc-400">
                  Trusted by <span className="text-white font-medium">2,000+ contractors</span>
                </p>
              </div>
            </div>

            {/* Right Column - 40% - Phone Mockup */}
            <div className="lg:col-span-2 relative flex justify-center lg:justify-end">
              <div className="relative" style={{ transform: 'rotate(-5deg)' }}>
                {/* iPhone Frame */}
                <div className="relative w-[280px] h-[580px] bg-[#1C1C1F] rounded-[44px] p-[10px] shadow-2xl shadow-black/50 border border-[#27272A]">
                  {/* Dynamic Island */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-20" />
                  
                  {/* Screen */}
                  <div className="w-full h-full bg-[#0A0A0B] rounded-[36px] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="h-12 flex items-end justify-between px-6 pb-1">
                      <span className="text-xs font-medium">9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-2 border border-white rounded-sm relative">
                          <div className="absolute inset-0.5 bg-green-400 rounded-sm" style={{ width: '70%' }} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Dashboard Content */}
                    <div className="p-4 space-y-4">
                      {/* Greeting */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-zinc-500 text-xs">Good morning</p>
                          <p className="text-lg font-semibold">Mike Johnson</p>
                        </div>
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                          <span className="text-white text-sm font-medium">MJ</span>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-[#141416] rounded-xl p-3 text-center border border-[#27272A]">
                          <p className="text-xl font-bold">3</p>
                          <p className="text-xs text-zinc-500">jobs</p>
                        </div>
                        <div className="bg-[#141416] rounded-xl p-3 text-center border border-[#27272A]">
                          <p className="text-xl font-bold text-green-400">$847</p>
                          <p className="text-xs text-zinc-500">earned</p>
                        </div>
                        <div className="bg-[#141416] rounded-xl p-3 text-center border border-[#27272A]">
                          <p className="text-xl font-bold text-blue-400">1.5h</p>
                          <p className="text-xs text-zinc-500">saved</p>
                        </div>
                      </div>
                      
                      {/* Next Job */}
                      <div className="bg-[#141416] rounded-xl p-3 border border-orange-500/30">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="progress" className="text-xs">UP NEXT</Badge>
                          <span className="text-sm text-zinc-400">2:30 PM</span>
                        </div>
                        <p className="font-medium text-sm">HVAC Repair</p>
                        <p className="text-xs text-zinc-500">Johnson Residence</p>
                      </div>
                      
                      {/* Timeline */}
                      <div className="space-y-2">
                        {[
                          { time: '10:00 AM', name: 'Faucet Install', status: 'done' },
                          { time: '12:30 PM', name: 'Drain Cleaning', status: 'done' },
                          { time: '2:30 PM', name: 'HVAC Repair', status: 'next' },
                        ].map((job, i) => (
                          <div key={i} className="flex items-center gap-3 bg-[#141416] rounded-lg p-2 border border-[#27272A]">
                            <div className={`w-2 h-2 rounded-full ${job.status === 'done' ? 'bg-green-400' : 'bg-orange-400'}`} />
                            <span className="text-xs text-zinc-500 w-14">{job.time}</span>
                            <span className="text-xs flex-1">{job.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
                  </div>
                </div>
                
                {/* Floating Notification - Job Completed */}
                <div 
                  className="absolute -right-4 top-24 bg-[#141416] border border-[#27272A] rounded-xl px-3 py-2 shadow-xl animate-slideInRight"
                  style={{ animationDelay: '0.3s' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-400" />
                    </div>
                    <span className="text-sm text-white">Job completed</span>
                  </div>
                </div>
                
                {/* Floating Badge - Payment */}
                <div 
                  className="absolute -left-4 bottom-40 bg-gradient-to-r from-green-600 to-green-500 rounded-xl px-3 py-2 shadow-xl animate-bounce-subtle"
                  style={{ animationDelay: '0.5s' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium">$347 paid</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Bar */}
      <section className="bg-[#141416] border-y border-[#27272A] py-8">
        <div className="container-main">
          <p className="text-center text-xs text-zinc-500 uppercase tracking-wider mb-6">
            Trusted by pros at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
            {['PHCC', 'ACCA', 'ASA', 'NFIB', 'ABC'].map((org) => (
              <span key={org} className="text-zinc-600 font-semibold text-lg hover:text-zinc-400 transition-colors cursor-default">
                {org}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="section-padding bg-[#0A0A0B] bg-grid-dense relative">
        <div className="container-main">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Left - Sticky */}
            <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-32 lg:self-start">
              <p className="label-eyebrow">The Problem</p>
              <h2 className="heading-section text-white">
                You&apos;re losing 2 hours every day to app switching
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                Every job, you jump between three different apps just to do basic work.
              </p>
              <ul className="space-y-3">
                {painPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-red-400" />
                    </div>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Right - Cards */}
            <div className="lg:col-span-3 space-y-4">
              <Card className="p-5">
                <p className="text-xs text-zinc-500 uppercase mb-2">Calendar App</p>
                <p className="text-zinc-400 text-sm">No customer info. No addresses. Just names and times you can barely read.</p>
              </Card>
              <Card className="p-5">
                <p className="text-xs text-zinc-500 uppercase mb-2">Notes App</p>
                <p className="text-zinc-400 text-sm">Phone numbers scattered across 50 notes. Search never finds what you need.</p>
              </Card>
              <Card className="p-5">
                <p className="text-xs text-zinc-500 uppercase mb-2">Calculator</p>
                <p className="text-zinc-400 text-sm">Doing math on scraps of paper. Hoping you didn&apos;t forget materials.</p>
              </Card>
              <Card className="p-5 border-green-500/30 bg-green-500/5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="text-white font-medium">FieldFlow replaces all of these</p>
                </div>
                <p className="text-zinc-400 text-sm">One app. Everything connected. Built for the way you actually work.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section-padding bg-gradient-to-b from-[#0A0A0B] to-[#141416]">
        <div className="container-main">
          <div className="text-center mb-16">
            <p className="label-eyebrow mb-4">Features</p>
            <h2 className="heading-section text-white mb-4">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Built specifically for contractors working in the field
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card key={i} className="p-6 card-interactive">
                  <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="heading-card text-white mb-2">{feature.title}</h3>
                  <p className="text-zinc-400 text-sm mb-4">{feature.description}</p>
                  <Badge variant="orange" className="text-xs">{feature.badge}</Badge>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-[#0A0A0B]">
        <div className="container-main">
          <div className="text-center mb-16">
            <p className="label-eyebrow mb-4">How It Works</p>
            <h2 className="heading-section text-white">
              From first job to final invoice
            </h2>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/50 via-[#27272A] to-transparent md:-translate-x-px" />
            
            <div className="space-y-16">
              {steps.map((step, i) => (
                <div key={i} className="relative flex items-center gap-8 md:gap-0">
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:order-2 md:pl-12'}`}>
                    <Card className="p-6 inline-block">
                      <span 
                        className="text-7xl font-bold text-outline block mb-2"
                        style={{ WebkitTextStroke: '2px #27272A' }}
                      >
                        {step.num}
                      </span>
                      <h3 className="heading-card text-white mb-2">{step.title}</h3>
                      <p className="text-zinc-400 text-sm">{step.description}</p>
                    </Card>
                  </div>
                  
                  {/* Step Circle */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-500 rounded-full border-4 border-[#0A0A0B] z-10" />
                  
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:order-1' : 'md:order-3'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section-padding bg-gradient-to-b from-[#141416] to-[#0A0A0B]">
        <div className="container-main">
          <div className="text-center mb-12">
            <p className="label-eyebrow mb-4">Pricing</p>
            <h2 className="heading-section text-white mb-4">
              Simple pricing, no surprises
            </h2>
            <p className="text-zinc-400 mb-8">Start free. Upgrade when you&apos;re ready.</p>
            
            {/* Billing Toggle */}
            <div className="inline-flex bg-[#141416] rounded-lg p-1 border border-[#27272A]">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  billing === 'monthly' ? 'bg-[#27272A] text-white' : 'text-zinc-500'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  billing === 'yearly' ? 'bg-[#27272A] text-white' : 'text-zinc-500'
                }`}
              >
                Yearly <span className="text-orange-400 text-xs">Save 20%</span>
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <Card
                key={i}
                className={`p-6 ${plan.featured ? 'border-orange-500/50 bg-orange-500/5 md:scale-105' : ''}`}
              >
                {plan.featured && (
                  <Badge variant="orange" className="mb-4">Most Popular</Badge>
                )}
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">
                    {plan.price === '$29' && billing === 'yearly' ? '$23' : plan.price === '$49' && billing === 'yearly' ? '$39' : plan.price}
                  </span>
                  {plan.price !== '$0' && (
                    <span className="text-zinc-500">{plan.period}</span>
                  )}
                </div>
                <p className="text-zinc-500 text-sm mb-6">
                  {plan.price === '$0' ? plan.period : `Per user, billed ${billing}`}
                </p>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-zinc-300">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link href="/signup">
                  <Button
                    variant={plan.featured ? 'primary' : 'secondary'}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
          
          <p className="text-center text-zinc-500 text-sm mt-8">
            No credit card required for trial. Cancel anytime.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-[#0A0A0B]">
        <div className="container-main max-w-3xl">
          <div className="text-center mb-12">
            <p className="label-eyebrow mb-4">FAQ</p>
            <h2 className="heading-section text-white">Questions? Answers.</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-gradient-cta relative">
        <div className="container-main text-center relative z-10">
          <h2 className="heading-section text-white mb-4">
            Stop juggling apps. Start finishing jobs.
          </h2>
          <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
            Join 2,000+ contractors who simplified their business.
          </p>
          <Link href="/signup">
            <Button variant="primary" size="lg">
              Start your free trial
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <p className="text-zinc-500 text-sm mt-4">
            14 days free • No credit card • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0B] border-t border-[#27272A] py-16">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Logo size="sm" />
              <p className="text-zinc-500 text-sm mt-4">Mobile field service management</p>
            </div>
            
            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-white font-medium mb-4">{category}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-[#27272A] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-zinc-500 text-sm">
              © 2024 FieldFlow. All rights reserved.
            </p>
            <p className="text-zinc-500 text-sm">
              Made for contractors who hate paperwork
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
