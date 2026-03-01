'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Mail, Lock, User, Building2, Phone, ChevronDown, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/shared/Logo';

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
      setError('Please agree to the Terms of Service and Privacy Policy');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Create the account
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

      // 2. Sign in automatically
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        // Redirect to login if auto-signin fails
        router.push('/login?message=Account created! Please sign in.');
      } else {
        // Success - go to app
        window.location.href = '/app';
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:col-span-2 bg-[#141416] flex flex-col justify-center items-center p-8 overflow-y-auto">
      <div className="w-full max-w-sm">
        <Logo size="md" className="mb-8" />
        <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
        <p className="text-zinc-500 mb-6">Get started in under 2 minutes</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Full name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input 
                  name="name"
                  placeholder="Mike Johnson" 
                  className="pl-9 text-sm" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Business</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input 
                  name="businessName"
                  placeholder="Company" 
                  className="pl-9 text-sm" 
                  value={formData.businessName}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input 
                type="email"
                name="email"
                placeholder="you@example.com" 
                className="pl-9" 
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input 
                type="tel"
                name="phone"
                placeholder="(555) 000-0000" 
                className="pl-9" 
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input 
                type="password"
                name="password"
                placeholder="••••••••" 
                className="pl-9" 
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
            <p className="text-xs text-zinc-600 mt-1">Min 6 characters</p>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Type of work</label>
            <div className="relative">
              <select
                value={selectedTrade}
                onChange={(e) => setSelectedTrade(e.target.value)}
                className="w-full bg-[#1C1C1F] border border-[#27272A] rounded-lg px-4 py-3 text-white appearance-none cursor-pointer focus:border-orange-500 focus:outline-none"
              >
                <option value="">Select trade</option>
                {tradeTypes.map((trade) => (
                  <option key={trade} value={trade}>{trade}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="terms"
              checked={formData.agreeToTerms}
              onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
              className="w-4 h-4 mt-0.5 rounded accent-orange-500"
            />
            <label htmlFor="terms" className="text-sm text-zinc-400">
              I agree to the{' '}
              <Link href="#" className="text-orange-400 hover:text-orange-300">Terms</Link>
              {' '}and{' '}
              <Link href="#" className="text-orange-400 hover:text-orange-300">Privacy Policy</Link>
            </label>
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create account'}
          </Button>
        </form>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-orange-400 hover:text-orange-300">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-5">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:col-span-3 bg-[#0A0A0B] flex-col justify-center items-center p-12 relative">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl font-bold text-white mb-4">Start your 14-day free trial</h2>
          <p className="text-zinc-400 text-lg mb-8">No credit card required. Cancel anytime.</p>
          
          <div className="space-y-4">
            {['Schedule jobs from your phone', 'Send invoices in 10 seconds', 'Get paid 2x faster', 'Save 2+ hours every day'].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-white">{benefit}</span>
              </div>
            ))}
          </div>
          
          <div className="flex gap-8 mt-12 pt-8 border-t border-[#27272A]">
            <div>
              <p className="text-3xl font-bold text-white">2,000+</p>
              <p className="text-zinc-500 text-sm">contractors</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">4.9/5</p>
              <p className="text-zinc-500 text-sm">rating</p>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="lg:col-span-2 flex items-center justify-center"><Loader2 className="w-8 h-8 text-orange-400 animate-spin" /></div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
