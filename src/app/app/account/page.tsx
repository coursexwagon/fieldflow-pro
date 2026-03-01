'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { ChevronLeft, Camera, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
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
  const { data: session, status } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: session?.user?.phone || '',
    businessName: session?.user?.businessName || '',
    tradeType: session?.user?.tradeType || '',
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0A0A0B] text-white"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0A0A0B]/90 backdrop-blur-md border-b border-[#27272A]">
        <div className="h-14 px-4 flex items-center justify-between">
          <Link href="/app/settings" className="p-2 -ml-2 text-zinc-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold">Account Settings</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="bg-orange-500/20 text-orange-400 text-3xl">
                {status === 'loading' ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  getInitials(session?.user?.name)
                )}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-zinc-500 text-sm mt-3">Tap to change photo</p>
        </motion.div>

        {/* Form Fields */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 space-y-4">
            <div>
              <label className="text-sm text-zinc-400 block mb-2">Full Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 block mb-2">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 block mb-2">Phone</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
          </Card>
        </motion.div>

        {/* Business Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-medium text-zinc-400 mb-3">Business Information</h3>
          <Card className="p-4 space-y-4">
            <div>
              <label className="text-sm text-zinc-400 block mb-2">Business Name</label>
              <Input
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="Your Business LLC"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 block mb-2">Trade Type</label>
              <select
                value={formData.tradeType}
                onChange={(e) => setFormData({ ...formData, tradeType: e.target.value })}
                className="w-full h-11 px-3 bg-[#1C1C1F] border border-[#27272A] rounded-lg text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="">Select trade...</option>
                <option value="HVAC">HVAC</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="General Contractor">General Contractor</option>
                <option value="Landscaping">Landscaping</option>
                <option value="Painting">Painting</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </Card>
        </motion.div>

        {/* Save Button */}
        <Button
          variant="primary"
          className="w-full"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </motion.div>
  );
}
