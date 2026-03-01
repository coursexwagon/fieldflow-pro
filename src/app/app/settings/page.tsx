'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Bell, 
  CreditCard, 
  User, 
  Shield, 
  HelpCircle,
  ChevronRight,
  Moon,
  Globe,
  Wrench,
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

const settingsGroups = [
  {
    title: 'Account',
    items: [
      { name: 'Profile', href: '/app/account', icon: User, description: 'Name, email, business' },
      { name: 'Payment', href: '/app/payments', icon: CreditCard, description: 'Payment methods' },
      { name: 'Notifications', href: '/app/notifications', icon: Bell, description: 'Alert settings' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { name: 'Appearance', href: '#', icon: Moon, description: 'Dark mode' },
      { name: 'Language', href: '#', icon: Globe, description: 'English' },
    ],
  },
  {
    title: 'Support',
    items: [
      { name: 'Help Center', href: '/app/support', icon: HelpCircle, description: 'FAQs & support' },
      { name: 'Privacy', href: '/app/privacy', icon: Shield, description: 'Security settings' },
    ],
  },
];

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl font-bold mb-1">Settings</h1>
        <p className="text-[#71717a] text-sm mb-6">Account and preferences</p>

        {/* User Card */}
        <div className="bg-[#141414] border border-[#27272a] p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1f1f1f] border border-[#27272a] flex items-center justify-center">
              <User className="w-6 h-6 text-[#71717a]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{session?.user?.name || 'User'}</p>
              <p className="text-sm text-[#71717a] truncate">{session?.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Settings Groups */}
        <div className="space-y-6">
          {settingsGroups.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.05 }}
            >
              <h3 className="text-xs text-[#71717a] uppercase tracking-wide mb-2">
                {group.title}
              </h3>
              <div className="bg-[#141414] border border-[#27272a]">
                {group.items.map((item, index) => {
                  const Icon = item.icon;
                  const isLast = index === group.items.length - 1;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-4 p-4 hover:bg-[#1f1f1f] transition-colors cursor-pointer ${
                        !isLast ? 'border-b border-[#27272a]' : ''
                      }`}
                    >
                      <div className="w-10 h-10 bg-[#1f1f1f] border border-[#27272a] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#f59e0b]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-[#71717a]">{item.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#3f3f46]" />
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Log Out */}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full mt-6 p-4 bg-[#141414] border border-[#27272a] text-[#ef4444] font-medium hover:border-[#ef4444]/50 transition-colors cursor-pointer"
        >
          Log Out
        </button>

        {/* Version */}
        <div className="flex items-center justify-center gap-2 pt-8">
          <div className="w-5 h-5 bg-[#f59e0b] flex items-center justify-center">
            <Wrench className="w-3 h-3 text-[#0a0a0a]" />
          </div>
          <span className="text-xs text-[#52525b]">FieldFlow Pro v1.0</span>
        </div>
      </motion.div>
    </div>
  );
}
