'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Plus, 
  Users,
  Settings,
  Truck,
  X,
  Menu,
  LogOut,
  Bell,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Navigation - 4 items only, no decoration
const navItems = [
  { name: 'Dispatch', href: '/app', icon: Truck },
  { name: 'Customers', href: '/app/customers', icon: Users },
  { name: 'Tools', href: '/app/tools', icon: Wrench },
  { name: 'Settings', href: '/app/settings', icon: Settings },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Hide nav on certain pages
  const hideNav = pathname?.includes('/new') || pathname?.includes('/login') || pathname?.includes('/signup');

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa] font-sans">
      {/* Top Header - Always visible */}
      {!hideNav && (
        <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#27272a]">
          <div className="h-full px-4 flex items-center justify-between">
            {/* Hamburger Menu */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-[#a1a1aa] hover:text-[#fafafa] transition-colors touch-target flex items-center justify-center cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Logo */}
            <Link href="/app" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#f59e0b] flex items-center justify-center">
                <Wrench className="w-4 h-4 text-[#0a0a0a]" />
              </div>
              <span className="font-semibold text-sm tracking-tight">
                FIELD<span className="text-[#f59e0b]">FLOW</span>
              </span>
            </Link>
            
            {/* Notifications */}
            <button 
              className="p-2 text-[#a1a1aa] hover:text-[#fafafa] transition-colors touch-target flex items-center justify-center relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#f59e0b] rounded-full" />
            </button>
          </div>
        </header>
      )}

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {!hideNav && sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-black/80"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 flex flex-col bg-[#141414]"
            >
              {/* Close button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 text-[#71717a] hover:text-[#fafafa] touch-target flex items-center justify-center cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Logo */}
              <div className="p-6 border-b border-[#27272a]">
                <Link href="/app" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                  <div className="w-10 h-10 bg-[#f59e0b] flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-[#0a0a0a]" />
                  </div>
                  <div>
                    <span className="font-bold text-lg tracking-tight">
                      FIELD<span className="text-[#f59e0b]">FLOW</span>
                    </span>
                    <p className="text-[10px] text-[#71717a] uppercase tracking-wider">Pro</p>
                  </div>
                </Link>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || 
                      (item.href !== '/app' && pathname?.startsWith(item.href));
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-4 px-4 py-4 touch-target-lg cursor-pointer transition-colors ${
                          isActive 
                            ? 'text-[#f59e0b] bg-[#f59e0b]/10' 
                            : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#1f1f1f]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* User Section */}
              <div className="p-4 border-t border-[#27272a]">
                <div className="flex items-center gap-3 px-4 py-3">
                  <Avatar className="w-10 h-10 border border-[#3f3f46]">
                    <AvatarFallback className="bg-[#27272a] text-[#a1a1aa] text-sm">
                      {getInitials(session?.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{session?.user?.name || 'User'}</p>
                    <p className="text-xs text-[#71717a] truncate">{session?.user?.email}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full mt-2 flex items-center gap-4 px-4 py-4 text-[#71717a] hover:text-[#ef4444] transition-colors touch-target-lg cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">Log out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`${!hideNav ? 'pt-14 pb-24' : ''}`}>
        {children}
      </main>

      {/* Single FAB - Add Job */}
      {!hideNav && (
        <Link 
          href="/app/jobs/new"
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#f59e0b] flex items-center justify-center shadow-lg shadow-[#f59e0b]/20 hover:bg-[#d97706] transition-colors touch-target-lg cursor-pointer"
          aria-label="Add new job"
        >
          <Plus className="w-6 h-6 text-[#0a0a0a]" />
        </Link>
      )}
    </div>
  );
}
