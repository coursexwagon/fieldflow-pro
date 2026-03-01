'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Plus, 
  MapPin, 
  Calendar, 
  FileText, 
  User,
  Loader2,
  X,
  Menu,
  LogOut,
  Settings,
  ChevronRight,
  Truck,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DashboardTutorial } from '@/components/tutorial/TutorialOverlay';

function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Navigation items with // prefix for industrial look
const navItems = [
  { name: 'DISPATCH', href: '/app', icon: Truck },
  { name: 'PROJECT', href: '/app/jobs', icon: MapPin },
  { name: 'INVOICE', href: '/app/invoices', icon: FileText },
  { name: 'TOOLS', href: '/app/more', icon: Wrench },
  { name: 'PROFILE', href: '/app/account', icon: User },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't show nav on certain pages
  const hideNav = pathname?.includes('/new') || pathname?.includes('/login') || pathname?.includes('/signup');

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f5f5] font-body">
      {/* Mobile Header */}
      {!hideNav && (
        <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#1a1a1a]/95 backdrop-blur border-b border-[#333]">
          <div className="h-full px-4 flex items-center justify-between">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-[#888] hover:text-[#00c2ff] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <Link href="/app" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#00c2ff] flex items-center justify-center">
                <Wrench className="w-4 h-4 text-[#1a1a1a]" />
              </div>
              <span className="font-display font-semibold text-sm tracking-tight">
                F<span className="text-[#00c2ff]">//</span>F
              </span>
            </Link>
            
            <div className="w-9" /> {/* Spacer for balance */}
          </div>
        </header>
      )}

      {/* Desktop Left Sidebar - Brushed Metal */}
      {!hideNav && (
        <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 z-40 flex-col"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(45, 45, 50, 0.95) 0%,
                rgba(35, 35, 40, 0.95) 50%,
                rgba(45, 45, 50, 0.95) 100%
              )
            `,
            boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.05), inset 1px 0 0 rgba(0,0,0,0.3), 4px 0 20px rgba(0,0,0,0.5)',
          }}
        >
          {/* Metal texture overlay */}
          <div 
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 2px,
                  rgba(255,255,255,0.02) 2px,
                  rgba(255,255,255,0.02) 4px
                )
              `
            }}
          />
          
          {/* Logo */}
          <div className="relative p-6 border-b border-[#333]/50">
            <Link href="/app" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00c2ff] flex items-center justify-center shadow-lg shadow-[#00c2ff]/20">
                <Wrench className="w-5 h-5 text-[#1a1a1a]" />
              </div>
              <div>
                <span className="font-display font-bold text-lg tracking-tight">
                  F<span className="text-[#00c2ff]">//</span>F
                </span>
                <p className="text-[10px] text-[#666] font-mono tracking-widest uppercase">FieldFlow Pro</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="relative flex-1 p-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || 
                  (item.href !== '/app' && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center gap-3 px-4 py-3 relative transition-all duration-200 ${
                      isActive 
                        ? 'text-[#00c2ff]' 
                        : 'text-[#888] hover:text-[#f5f5f5]'
                    }`}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-[#00c2ff]"
                        style={{ boxShadow: '0 0 20px rgba(0, 194, 255, 0.5)' }}
                      />
                    )}
                    
                    <Icon className="w-5 h-5 relative z-10" />
                    <span className="font-mono text-xs tracking-wider relative z-10">
                      //{item.name}
                    </span>
                    
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-[#00c2ff]/0 group-hover:bg-[#00c2ff]/5 transition-colors" />
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Section */}
          <div className="relative p-4 border-t border-[#333]/50">
            {status === 'loading' ? (
              <div className="flex items-center gap-3 px-4 py-3">
                <Loader2 className="w-5 h-5 animate-spin text-[#666]" />
              </div>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3">
                <Avatar className="w-9 h-9 border border-[#444]">
                  <AvatarFallback className="bg-[#2d2d2d] text-[#888] text-xs font-mono">
                    {getInitials(session?.user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{session?.user?.name || 'User'}</p>
                  <p className="text-xs text-[#666] font-mono truncate">{session?.user?.email}</p>
                </div>
              </div>
            )}
            
            {/* Logout Button */}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full mt-2 flex items-center gap-3 px-4 py-3 text-[#666] hover:text-[#ff4444] transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-mono text-xs tracking-wider">// LOG OUT</span>
            </button>
          </div>
        </aside>
      )}

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {!hideNav && sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/80"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 z-50 flex flex-col"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(45, 45, 50, 0.98) 0%,
                    rgba(35, 35, 40, 0.98) 50%,
                    rgba(45, 45, 50, 0.98) 100%
                  )
                `,
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 text-[#666] hover:text-[#f5f5f5]"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Logo */}
              <div className="p-6 border-b border-[#333]/50">
                <Link href="/app" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                  <div className="w-10 h-10 bg-[#00c2ff] flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-[#1a1a1a]" />
                  </div>
                  <span className="font-display font-bold text-lg">
                    F<span className="text-[#00c2ff]">//</span>F
                  </span>
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
                        className={`flex items-center gap-3 px-4 py-3 ${
                          isActive 
                            ? 'text-[#00c2ff] bg-[#00c2ff]/10' 
                            : 'text-[#888] hover:text-[#f5f5f5]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-mono text-xs tracking-wider">//{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* User & Logout */}
              <div className="p-4 border-t border-[#333]/50">
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[#666] hover:text-[#ff4444]"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-mono text-xs tracking-wider">// LOG OUT</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`${!hideNav ? 'pt-14 lg:pt-0 lg:pl-64 pb-20 lg:pb-6' : ''}`}>
        {children}
      </main>

      {/* Floating Action Button */}
      {!hideNav && (
        <div className="fixed bottom-6 right-6 z-50 lg:bottom-8 lg:right-8">
          <AnimatePresence>
            {showFabMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className="absolute bottom-16 right-0 flex flex-col gap-2"
              >
                <Link 
                  href="/app/jobs/new"
                  className="flex items-center gap-3 bg-[#2d2d2d] border border-[#444] px-5 py-3 text-sm hover:border-[#00c2ff] hover:text-[#00c2ff] transition-all shadow-lg"
                  onClick={() => setShowFabMenu(false)}
                >
                  <MapPin className="w-4 h-4" />
                  <span className="font-mono text-xs">// NEW JOB</span>
                </Link>
                <Link 
                  href="/app/invoices/new"
                  className="flex items-center gap-3 bg-[#2d2d2d] border border-[#444] px-5 py-3 text-sm hover:border-[#00c2ff] hover:text-[#00c2ff] transition-all shadow-lg"
                  onClick={() => setShowFabMenu(false)}
                >
                  <FileText className="w-4 h-4" />
                  <span className="font-mono text-xs">// NEW INVOICE</span>
                </Link>
                <Link 
                  href="/app/customers/new"
                  className="flex items-center gap-3 bg-[#2d2d2d] border border-[#444] px-5 py-3 text-sm hover:border-[#00c2ff] hover:text-[#00c2ff] transition-all shadow-lg"
                  onClick={() => setShowFabMenu(false)}
                >
                  <User className="w-4 h-4" />
                  <span className="font-mono text-xs">// NEW CUSTOMER</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFabMenu(!showFabMenu)}
            className="w-14 h-14 bg-[#00c2ff] flex items-center justify-center shadow-lg shadow-[#00c2ff]/30"
          >
            <motion.div
              animate={{ rotate: showFabMenu ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {showFabMenu ? (
                <X className="w-6 h-6 text-[#1a1a1a]" />
              ) : (
                <Plus className="w-6 h-6 text-[#1a1a1a]" />
              )}
            </motion.div>
          </motion.button>
        </div>
      )}

      {/* Mobile Bottom Nav - Compact */}
      {!hideNav && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#1a1a1a]/95 backdrop-blur border-t border-[#333]">
          <div className="h-full grid grid-cols-4">
            {[
              { name: 'Today', href: '/app', icon: Calendar },
              { name: 'Jobs', href: '/app/jobs', icon: MapPin },
              { name: 'Cash', href: '/app/invoices', icon: FileText },
              { name: 'Tools', href: '/app/more', icon: Wrench },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                (item.href !== '/app' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                    isActive ? 'text-[#00c2ff]' : 'text-[#666] hover:text-[#888]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-mono">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* Tutorial Overlay - Shows on first login */}
      {!hideNav && <DashboardTutorial />}
    </div>
  );
}
