'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { ChevronLeft, Camera, Loader2, Save, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

function getInitials(name: string | null | undefined): string {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function AccountPage() {
  const { data: session, status, update } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    tradeType: '',
  });

  // Update form data when session loads
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: (session.user as any).phone || '',
        businessName: (session.user as any).businessName || '',
        tradeType: (session.user as any).tradeType || '',
      });
    }
  }, [session]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const response = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      // Update session
      await update({ name: formData.name });
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#1a1a1a] text-[#f5f5f5]"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#1a1a1a]/95 backdrop-blur border-b border-[#333]">
        <div className="h-14 px-4 flex items-center justify-between">
          <Link href="/app/more" className="p-2 -ml-2 text-[#888] hover:text-[#00c2ff] transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-mono text-sm tracking-wider">// ACCOUNT</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6 max-w-lg mx-auto">
        {/* Status Message */}
        {saveStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-[#22c55e]/10 border border-[#22c55e]/30 px-4 py-3"
          >
            <Check className="w-5 h-5 text-[#22c55e]" />
            <span className="text-[#22c55e] text-sm font-mono">Changes saved</span>
          </motion.div>
        )}
        {saveStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-[#ff4444]/10 border border-[#ff4444]/30 px-4 py-3"
          >
            <AlertCircle className="w-5 h-5 text-[#ff4444]" />
            <span className="text-[#ff4444] text-sm font-mono">Failed to save. Try again.</span>
          </motion.div>
        )}

        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center pt-4"
        >
          <div className="relative">
            <div className="w-24 h-24 bg-[#2d2d2d] border-2 border-[#444] flex items-center justify-center">
              {status === 'loading' ? (
                <Loader2 className="w-8 h-8 animate-spin text-[#666]" />
              ) : (
                <span className="font-display text-3xl font-bold text-[#00c2ff]">
                  {getInitials(session?.user?.name)}
                </span>
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#00c2ff] flex items-center justify-center shadow-lg shadow-[#00c2ff]/30 hover:bg-[#00a8e0] transition-colors">
              <Camera className="w-4 h-4 text-[#1a1a1a]" />
            </button>
          </div>
          <p className="text-[#666] text-xs font-mono mt-3">TAP TO CHANGE PHOTO</p>
        </motion.div>

        {/* Personal Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#222] border border-[#333] p-5 space-y-4"
        >
          <p className="text-xs font-mono text-[#666] tracking-wider">// PERSONAL</p>
          
          <div>
            <label className="text-xs font-mono text-[#888] block mb-2 uppercase tracking-wider">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
              className="bg-[#1a1a1a] border-[#333] focus:border-[#00c2ff] focus:ring-1 focus:ring-[#00c2ff]"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-[#888] block mb-2 uppercase tracking-wider">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              className="bg-[#1a1a1a] border-[#333] focus:border-[#00c2ff] focus:ring-1 focus:ring-[#00c2ff]"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-[#888] block mb-2 uppercase tracking-wider">Phone</label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(555) 123-4567"
              className="bg-[#1a1a1a] border-[#333] focus:border-[#00c2ff] focus:ring-1 focus:ring-[#00c2ff]"
            />
          </div>
        </motion.div>

        {/* Business Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#222] border border-[#333] p-5 space-y-4"
        >
          <p className="text-xs font-mono text-[#666] tracking-wider">// BUSINESS</p>
          
          <div>
            <label className="text-xs font-mono text-[#888] block mb-2 uppercase tracking-wider">Business Name</label>
            <Input
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="Your Business LLC"
              className="bg-[#1a1a1a] border-[#333] focus:border-[#00c2ff] focus:ring-1 focus:ring-[#00c2ff]"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-[#888] block mb-2 uppercase tracking-wider">Trade Type</label>
            <select
              value={formData.tradeType}
              onChange={(e) => setFormData({ ...formData, tradeType: e.target.value })}
              className="w-full h-11 px-4 bg-[#1a1a1a] border border-[#333] text-[#f5f5f5] focus:border-[#00c2ff] focus:outline-none"
            >
              <option value="">Select trade...</option>
              <option value="HVAC">HVAC</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="General Contractor">General Contractor</option>
              <option value="Landscaping">Landscaping</option>
              <option value="Painting">Painting</option>
              <option value="Roofing">Roofing</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 bg-[#00c2ff] text-[#1a1a1a] py-4 font-mono font-semibold tracking-wider hover:bg-[#00a8e0] transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                SAVING...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                SAVE CHANGES
              </>
            )}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
