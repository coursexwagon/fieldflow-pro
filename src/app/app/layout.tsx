'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Home, Calendar, Briefcase, FileText, Users, Bell, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { LogoIcon } from '@/components/shared/Logo';

const bottomNavItems = [
  { name: 'Home', href: '/app', icon: Home },
  { name: 'Schedule', href: '/app/schedule', icon: Calendar },
  { name: 'Jobs', href: '/app/jobs', icon: Briefcase },
  { name: 'Invoices', href: '/app/invoices', icon: FileText },
  { name: 'More', href: '/app/more', icon: Users },
];

function getInitials(name: string | null | undefined): string {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const userName = session?.user?.name;
  const initials = getInitials(userName);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0A0A0B]/90 backdrop-blur-md border-b border-[#27272A]">
        <div className="h-full px-4 flex items-center justify-between">
          <LogoIcon />
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-zinc-400 hover:text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
            </button>
            {status === 'loading' ? (
              <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
            ) : (
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-orange-500/20 text-orange-400 text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-14 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-[#0A0A0B] border-t border-[#27272A]">
        <div className="h-full grid grid-cols-5">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 transition-colors',
                  isActive ? 'text-orange-400' : 'text-zinc-500 hover:text-zinc-300'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
