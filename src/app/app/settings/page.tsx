'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Bell, 
  CreditCard, 
  User, 
  Shield, 
  HelpCircle,
  ChevronRight,
  Moon,
  Globe,
  Smartphone,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { LogoIcon } from '@/components/shared/Logo';

const settingsGroups = [
  {
    title: 'Account',
    items: [
      { name: 'Profile Settings', href: '/app/account', icon: User, description: 'Name, email, business info' },
      { name: 'Payment Methods', href: '/app/payments', icon: CreditCard, description: 'Manage payment options' },
      { name: 'Notifications', href: '/app/notifications', icon: Bell, description: 'Alert preferences' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { name: 'Appearance', href: '#', icon: Moon, description: 'Dark mode, themes' },
      { name: 'Language', href: '#', icon: Globe, description: 'English (US)' },
      { name: 'Devices', href: '#', icon: Smartphone, description: 'Manage connected devices' },
    ],
  },
  {
    title: 'Security',
    items: [
      { name: 'Privacy & Security', href: '/app/privacy', icon: Shield, description: 'Password, 2FA' },
    ],
  },
  {
    title: 'Support',
    items: [
      { name: 'Help Center', href: '/app/support', icon: HelpCircle, description: 'FAQs, contact support' },
    ],
  },
];

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0A0A0B] text-white"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0A0A0B]/90 backdrop-blur-md border-b border-[#27272A]">
        <div className="h-14 px-4 flex items-center gap-4">
          <Link href="/app/more" className="p-2 -ml-2 text-zinc-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold">Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 px-1">
              {group.title}
            </h3>
            <Card className="overflow-hidden">
              {group.items.map((item, index) => {
                const Icon = item.icon;
                const isLast = index === group.items.length - 1;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-4 p-4 hover:bg-[#1C1C1F] transition-colors ${
                      !isLast ? 'border-b border-[#27272A]' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#1C1C1F] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-zinc-500 text-sm">{item.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-600" />
                  </Link>
                );
              })}
            </Card>
          </motion.div>
        ))}

        {/* Version Info */}
        <div className="text-center pt-8">
          <LogoIcon className="mx-auto mb-2" />
          <p className="text-zinc-600 text-xs">FieldFlow Pro v1.0.0</p>
        </div>
      </div>
    </motion.div>
  );
}
