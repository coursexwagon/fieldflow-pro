'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Wrench,
  Settings,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Users,
  FileText,
  MapPin,
  ChevronRight,
} from 'lucide-react';

// Tool belt items - each is a "tool" in the belt
const tools = [
  {
    name: 'Customers',
    href: '/app/customers',
    icon: Users,
    description: 'Your client list',
    color: '#ffb800',
  },
  {
    name: 'Territory',
    href: '/app/jobs',
    icon: MapPin,
    description: 'Active jobs',
    color: '#ffb800',
  },
  {
    name: 'Cash Flow',
    href: '/app/invoices',
    icon: FileText,
    description: 'Money in/out',
    color: '#ffb800',
  },
];

const settings = [
  {
    name: 'Notifications',
    href: '/app/notifications',
    icon: Bell,
    description: 'Alert preferences',
  },
  {
    name: 'Payment Methods',
    href: '/app/payments',
    icon: CreditCard,
    description: 'Stripe & cards',
  },
  {
    name: 'Account',
    href: '/app/account',
    icon: Settings,
    description: 'Profile & business',
  },
  {
    name: 'Security',
    href: '/app/privacy',
    icon: Shield,
    description: 'Password & 2FA',
  },
];

export default function MorePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <div className="p-4 space-y-8">
      {/* Profile - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="w-14 h-14 bg-[#ffb800] flex items-center justify-center">
          <span className="font-display font-bold text-xl text-[#1a1a1a]">
            {session?.user?.name?.charAt(0) || '?'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-lg truncate">
            {session?.user?.name || 'Loading...'}
          </p>
          <p className="text-sm text-[#666] truncate">{session?.user?.email}</p>
        </div>
        <Link href="/app/account" className="text-[#666] hover:text-[#ffb800]">
          <ChevronRight className="w-5 h-5" />
        </Link>
      </motion.div>

      {/* Tool Belt - Core Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="text-xs font-mono text-[#666] mb-3">TOOL BELT</p>
        <div className="grid grid-cols-3 gap-2">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.name} href={tool.href}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="bg-[#2d2d2d] border border-[#404040] p-4 text-center hover:border-[#ffb800] transition-colors"
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: tool.color }} />
                  <p className="text-sm font-medium">{tool.name}</p>
                  <p className="text-[10px] text-[#666] mt-1">{tool.description}</p>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Settings - Wrenches */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-xs font-mono text-[#666] mb-3">WRENCH TIME</p>
        <div className="bg-[#2d2d2d] border border-[#404040]">
          {settings.map((item, i) => {
            const Icon = item.icon;
            const isLast = i === settings.length - 1;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 p-4 hover:bg-[#363636] transition-colors ${
                  !isLast ? 'border-b border-[#404040]' : ''
                }`}
              >
                <Icon className="w-5 h-5 text-[#888]" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-[#666]">{item.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#666]" />
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Help */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs font-mono text-[#666] mb-3">BACKUP</p>
        <Link href="/app/support">
          <div className="flex items-center gap-3 p-4 bg-[#2d2d2d] border border-[#404040] hover:border-[#505050] transition-colors">
            <HelpCircle className="w-5 h-5 text-[#888]" />
            <div className="flex-1">
              <p className="text-sm font-medium">Help Center</p>
              <p className="text-xs text-[#666]">FAQs & support</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#666]" />
          </div>
        </Link>
      </motion.div>

      {/* Logout - Breakdown Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 border border-[#ff4444]/30 text-[#ff4444] hover:bg-[#ff4444]/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-display font-semibold">End Shift</span>
        </button>
      </motion.div>

      {/* Version - Minimal */}
      <p className="text-center text-[#404040] text-xs font-mono">
        FieldFlow v1.0.0
      </p>
    </div>
  );
}
