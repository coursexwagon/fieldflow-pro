'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
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
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
      ],
    },
    {
      title: 'Settings',
      items: [
        { name: 'Notifications', href: '#', icon: Bell },
        { name: 'Payment Methods', href: '#', icon: CreditCard },
        { name: 'Account Settings', href: '#', icon: Settings },
        { name: 'Privacy & Security', href: '#', icon: Shield },
      ],
    },
    {
      title: 'Support',
      items: [
        { name: 'Help Center', href: '#', icon: HelpCircle },
      ],
    },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <h1 className="text-xl font-bold text-white">More</h1>

      {/* Profile Card */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-orange-500/20 text-orange-400 text-xl">
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
        </div>
      </Card>

      {/* Menu Items */}
      {menuItems.map((section) => (
        <div key={section.title}>
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
                  <div className="w-9 h-9 rounded-lg bg-[#1C1C1F] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-zinc-400" />
                  </div>
                  <span className="flex-1 text-white">{item.name}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                </Link>
              );
            })}
          </Card>
        </div>
      ))}

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 p-4 bg-[#141416] border border-[#27272A] rounded-xl hover:bg-red-500/10 hover:border-red-500/30 transition-colors"
      >
        <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
          <LogOut className="w-5 h-5 text-red-400" />
        </div>
        <span className="text-red-400">Log Out</span>
      </button>

      {/* Version */}
      <p className="text-center text-zinc-600 text-xs">
        FieldFlow Pro v1.0.0
      </p>
    </div>
  );
}
