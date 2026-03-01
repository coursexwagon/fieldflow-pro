'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Building2,
  Mail,
  Loader2,
  CreditCard,
  Bell,
  Shield,
  FileText,
  Calendar,
  Briefcase,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

function getInitials(name: string | null | undefined): string {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function MorePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const menuItems = [
    {
      title: 'Business',
      items: [
        { name: 'Customers', href: '/app/customers', icon: Users },
        { name: 'Jobs', href: '/app/jobs', icon: Briefcase },
        { name: 'Invoices', href: '/app/invoices', icon: FileText },
        { name: 'Schedule', href: '/app/schedule', icon: Calendar },
      ],
    },
    {
      title: 'Settings',
      items: [
        { name: 'Notifications', href: '/app/notifications', icon: Bell },
        { name: 'Payment Methods', href: '/app/payments', icon: CreditCard },
        { name: 'Account Settings', href: '/app/account', icon: Settings },
        { name: 'Privacy & Security', href: '/app/privacy', icon: Shield },
      ],
    },
    {
      title: 'Support',
      items: [
        { name: 'Help Center', href: '/app/support', icon: HelpCircle },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 space-y-6"
    >
      {/* Header */}
      <h1 className="text-xl font-bold text-white">More</h1>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-4 bg-gradient-to-br from-[#1C1C1F] to-[#141416]">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-xl">
                {status === 'loading' ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  getInitials(session?.user?.name)
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-white truncate">
                {session?.user?.name || 'Loading...'}
              </h2>
              {session?.user?.businessName && (
                <p className="text-zinc-400 text-sm flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {session.user.businessName}
                </p>
              )}
              {session?.user?.email && (
                <p className="text-zinc-500 text-xs flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3" />
                  {session.user.email}
                </p>
              )}
            </div>
            <Link href="/app/account">
              <ChevronRight className="w-5 h-5 text-zinc-600" />
            </Link>
          </div>
        </Card>
      </motion.div>

      {/* Menu Items */}
      {menuItems.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * (sectionIndex + 1) }}
        >
          <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 px-1">
            {section.title}
          </h3>
          <Card className="overflow-hidden">
            {section.items.map((item, index) => {
              const Icon = item.icon;
              const isLast = index === section.items.length - 1;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 p-4 hover:bg-[#1C1C1F] transition-colors ${
                    !isLast ? 'border-b border-[#27272A]' : ''
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#1C1C1F] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-zinc-400" />
                  </div>
                  <span className="flex-1 text-white">{item.name}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                </Link>
              );
            })}
          </Card>
        </motion.div>
      ))}

      {/* Logout Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-4 bg-[#141416] border border-[#27272A] rounded-xl hover:bg-red-500/10 hover:border-red-500/30 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-red-400" />
          </div>
          <span className="text-red-400">Log Out</span>
        </button>
      </motion.div>

      {/* Version */}
      <p className="text-center text-zinc-600 text-xs">
        FieldFlow Pro v1.0.0
      </p>
    </motion.div>
  );
}
