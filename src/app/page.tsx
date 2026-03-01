'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
  Star,
  Shield,
  Clock,
  TrendingUp,
  Users,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { Logo } from '@/components/shared/Logo';
import { TutorialOverlay } from '@/components/tutorial/TutorialOverlay';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Feature data with proper icons
const features = [
  {
    title: 'Your day, optimized',
    description: 'AI orders your jobs by location. No more backtracking across town.',
    badge: 'Saves 30 min/day',
    icon: Route,
    image: '/images/assets/feature-route.png',
  },
  {
    title: 'Get paid before you leave',
    description: 'Auto-fill from job data. Send invoice in 10 seconds, not 10 minutes.',
    badge: '2x faster payment',
    icon: FileText,
    image: '/images/assets/feature-invoice.png',
  },
  {
    title: 'Clients always know the score',
    description: 'Automatic updates when you\'re en route, working, or done.',
    badge: 'Fewer "where are you?" calls',
    icon: MessageCircle,
    image: '/images/assets/feature-schedule.png',
  },
];

// Stats
const stats = [
  { value: '2,000+', label: 'Active Contractors' },
  { value: '50K+', label: 'Jobs Completed' },
  { value: '$2M+', label: 'Invoices Processed' },
  { value: '4.9/5', label: 'App Store Rating' },
];

// Testimonials
const testimonials = [
  {
    name: 'Mike Johnson',
    role: 'HVAC Technician',
    location: 'Austin, TX',
    quote: 'FieldFlow cut my paperwork by 80%. I finish jobs and invoices are already sent.',
    avatar: '/images/assets/testimonial-1.png',
    rating: 5,
  },
  {
    name: 'Sarah Chen',
    role: 'Plumber',
    location: 'Denver, CO',
    quote: 'The GPS routing alone saves me an hour every day. Game changer.',
    avatar: '/images/assets/testimonial-2.png',
    rating: 5,
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
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `linear-gradient(rgba(249, 115, 22, 0.03) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(249, 115, 22, 0.03) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
          
          {/* Gradient Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[128px]"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container-main py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full"
              >
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-orange-400 font-medium">Trusted by 2,000+ contractors</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-6xl font-bold leading-tight"
              >
                <span className="text-white">The command center for</span>
                <br />
                <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  contractors who hate paperwork
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-zinc-400 max-w-lg leading-relaxed"
              >
                Schedule jobs, invoice clients, and get paid—all from your phone. No laptop required.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/signup">
                  <Button variant="primary" size="lg" className="gap-2 h-12 px-8">
                    Start free trial
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="gap-2 h-12 px-8"
                  onClick={() => setShowTutorial(true)}
                >
                  <Play className="w-4 h-4" />
                  See how it works
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-6 pt-4"
              >
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="ml-2 text-zinc-400 text-sm">4.9/5 from 500+ reviews</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative flex justify-center"
            >
              {/* Phone Frame with Real Image */}
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-blue-500/20 blur-3xl scale-110" />
                
                {/* Phone Container */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative"
                >
                  <Image
                    src="/images/assets/phone-hero.png"
                    alt="FieldFlow Pro App"
                    width={320}
                    height={560}
                    className="relative z-10 rounded-3xl shadow-2xl"
                    priority
                  />
                  
                  {/* Floating Elements */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute -right-8 top-20 bg-gradient-to-r from-green-600 to-green-500 rounded-xl px-4 py-2 shadow-xl"
                  >
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-white" />
                      <span className="text-sm text-white font-medium">Job completed!</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute -left-8 bottom-32 bg-[#141416] border border-[#27272A] rounded-xl px-4 py-3 shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">+$347</p>
                        <p className="text-xs text-zinc-400">Payment received</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 border-y border-[#27272A] bg-[#141416]/50">
        <div className="container-main">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-zinc-400 text-sm mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Logos */}
      <section className="py-16 bg-[#0A0A0B]">
        <div className="container-main">
          <p className="text-center text-sm text-zinc-500 uppercase tracking-wider mb-8">
            Trusted by professionals at
          </p>
          <div className="relative h-16 mx-auto max-w-3xl">
            <Image
              src="/images/assets/trust-logos.png"
              alt="Trusted by industry leaders"
              fill
              className="object-contain opacity-60"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding bg-gradient-to-b from-[#0A0A0B] to-[#141416]">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="orange" className="mb-4">Features</Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Built specifically for contractors working in the field
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-6 h-full group hover:border-orange-500/30 transition-all duration-300">
                    {/* Feature Image */}
                    <div className="relative w-full h-40 mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-[#1C1C1F] to-[#141416]">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-orange-400" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-zinc-400 text-sm mb-4">{feature.description}</p>
                    <Badge variant="orange" className="text-xs">{feature.badge}</Badge>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-[#0A0A0B]">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="orange" className="mb-4">How It Works</Badge>
            <h2 className="text-4xl font-bold text-white">
              From first job to final invoice
            </h2>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500 via-[#27272A] to-transparent -translate-x-1/2 hidden md:block" />

            <div className="space-y-16">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className={`relative flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <Card className="flex-1 p-6">
                    <span className="text-7xl font-bold text-orange-500/20 block mb-2">
                      {step.num}
                    </span>
                    <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-zinc-400">{step.description}</p>
                  </Card>

                  {/* Step Circle */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full border-4 border-[#0A0A0B] z-10 hidden md:block" />

                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gradient-to-b from-[#141416] to-[#0A0A0B]">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="orange" className="mb-4">Testimonials</Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              Loved by contractors everywhere
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 h-full">
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-lg text-zinc-300 mb-6 italic">&quot;{testimonial.quote}&quot;</p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-zinc-400">{testimonial.role} • {testimonial.location}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section-padding bg-[#0A0A0B]">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="orange" className="mb-4">Pricing</Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
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
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  className={`p-6 h-full ${plan.featured ? 'border-orange-500/50 bg-orange-500/5 md:scale-105' : ''}`}
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
              </motion.div>
            ))}
          </div>

          <p className="text-center text-zinc-500 text-sm mt-8">
            No credit card required for trial. Cancel anytime.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-gradient-to-b from-[#141416] to-[#0A0A0B]">
        <div className="container-main max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="orange" className="mb-4">FAQ</Badge>
            <h2 className="text-4xl font-bold text-white">Questions? Answers.</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6">
                  <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                  <p className="text-zinc-400">{faq.a}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-blue-500/20" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10"
        >
          <div className="w-full h-full rounded-full border border-orange-500" />
          <div className="absolute inset-8 rounded-full border border-orange-400" />
          <div className="absolute inset-16 rounded-full border border-orange-300" />
        </motion.div>

        <div className="container-main text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Stop juggling apps. Start finishing jobs.
            </h2>
            <p className="text-zinc-400 mb-8 max-w-lg mx-auto text-lg">
              Join 2,000+ contractors who simplified their business.
            </p>
            <Link href="/signup">
              <Button variant="primary" size="lg" className="gap-2 h-14 px-10 text-lg">
                Start your free trial
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <p className="text-zinc-500 text-sm mt-4">
              14 days free • No credit card • Cancel anytime
            </p>
          </motion.div>
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

      {/* Tutorial Overlay */}
      <TutorialOverlay
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
    </div>
  );
}
