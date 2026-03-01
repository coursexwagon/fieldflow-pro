'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Phone, 
  ChevronDown, 
  Loader2, 
  ArrowRight,
} from 'lucide-react';

const tradeTypes = [
  'Plumbing',
  'HVAC',
  'Electrical',
  'Landscaping',
  'Painting',
  'General Contractor',
  'Other',
];

function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    password: '',
    agreeToTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          businessName: formData.businessName,
          tradeType: selectedTrade,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setIsLoading(false);
        return;
      }

      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        router.push('/login?message=Account created! Please sign in.');
      } else {
        window.location.href = '/app';
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo/Brand */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 bg-[#ffb800] flex items-center justify-center">
            <Wrench className="w-6 h-6 text-[#1a1a1a]" />
          </div>
          <span className="font-display text-xl font-bold">
            Field<span className="text-[#ffb800]">Flow</span>
          </span>
        </div>

        <h1 className="font-display text-2xl font-bold text-center mb-1">Get started</h1>
        <p className="text-[#666] text-center text-sm mb-6">Free for 14 days. No card needed.</p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-[#ff4444]/30 bg-[#ff4444]/5 px-4 py-3 mb-4"
          >
            <p className="text-[#ff4444] text-sm">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
            <input
              name="name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-[#2d2d2d] border border-[#404040] pl-12 pr-4 py-3 text-[#f5f5f5] placeholder-[#666] focus:border-[#ffb800] focus:outline-none"
            />
          </div>

          {/* Business */}
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
            <input
              name="businessName"
              type="text"
              placeholder="Business name (optional)"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full bg-[#2d2d2d] border border-[#404040] pl-12 pr-4 py-3 text-[#f5f5f5] placeholder-[#666] focus:border-[#ffb800] focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-[#2d2d2d] border border-[#404040] pl-12 pr-4 py-3 text-[#f5f5f5] placeholder-[#666] focus:border-[#ffb800] focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
            <input
              name="phone"
              type="tel"
              placeholder="Phone (optional)"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-[#2d2d2d] border border-[#404040] pl-12 pr-4 py-3 text-[#f5f5f5] placeholder-[#666] focus:border-[#ffb800] focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
            <input
              name="password"
              type="password"
              placeholder="Password (6+ chars)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full bg-[#2d2d2d] border border-[#404040] pl-12 pr-4 py-3 text-[#f5f5f5] placeholder-[#666] focus:border-[#ffb800] focus:outline-none"
            />
          </div>

          {/* Trade Type */}
          <div className="relative">
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="w-full bg-[#2d2d2d] border border-[#404040] px-4 py-3 text-[#f5f5f5] appearance-none cursor-pointer focus:border-[#ffb800] focus:outline-none"
            >
              <option value="" className="text-[#666]">Type of work</option>
              {tradeTypes.map((trade) => (
                <option key={trade} value={trade}>{trade}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666] pointer-events-none" />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={formData.agreeToTerms}
              onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
              className="w-4 h-4 mt-0.5 accent-[#ffb800]"
            />
            <label htmlFor="terms" className="text-xs text-[#888]">
              I agree to the{' '}
              <Link href="#" className="text-[#ffb800] hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="#" className="text-[#ffb800] hover:underline">Privacy Policy</Link>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ffb800] text-[#1a1a1a] py-3 font-display font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#ffb800]/20 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[#666] text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#ffb800] hover:underline">Sign in</Link>
        </p>

        <p className="text-center mt-4">
          <Link href="/" className="text-[#666] text-xs font-mono hover:text-[#888]">
            ← Back to home
          </Link>
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 text-[#404040] text-xs font-mono"
      >
        Built for contractors who hate paperwork
      </motion.p>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#ffb800]" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
