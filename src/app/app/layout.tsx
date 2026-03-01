'use client';

import React, { useState } from 'react';
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

// Simple navigation - no decoration
const navItems = [
  { name: 'Dispatch', href: '/app', icon: Truck },
  { name: 'Jobs', href: '/app/jobs', icon: MapPin },
  { name: 'Invoices', href: '/app/invoices', icon: FileText },
  { name: 'More', href: '/app/more', icon: Wrench },
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
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f5f5] font-sans">
      {/* Mobile Header */}
      {!hideNav && (
        <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#1a1a1a]/95 backdrop-blur border-b border-[#333]">
          <div className="h-full px-4 flex items-center justify-between">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-[#888] hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <Link href="/app" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#fbbf24] flex items-center justify-center">
                <Wrench className="w-4 h-4 text-[#1a1a1a]" />
              </div>
              <span className="font-semibold text-sm">
                FIELD<span className="text-[#fbbf24]">FLOW</span>
              </span>
            </Link>
            
            <div className="w-9" />
          </div>
        </header>
      )}

      {/* Desktop Left Sidebar */}
      {!hideNav && (
        <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 z-40 flex-col bg-[#141414] border-r border-[#333]">
          {/* Logo */}
          <div className="p-6 border-b border-[#333]">
            <Link href="/app" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#fbbf24] flex items-center justify-center">
                <Wrench className="w-5 h-5 text-[#1a1a1a]" />
              </div>
              <div>
                <span className="font-bold text-lg">
                  FIELD<span className="text-[#fbbf24]">FLOW</span>
                </span>
                <p className="text-[10px] text-[#666]">Pro</p>
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
                    className={`group flex items-center gap-3 px-4 py-3 relative transition-all duration-200 ${
                      isActive 
                        ? 'text-[#fbbf24] bg-[#fbbf24]/10' 
                        : 'text-[#888] hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#fbbf24]"
                      />
                    )}
                    
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-[#333]">
            {status === 'loading' ? (
              <div className="flex items-center gap-3 px-4 py-3">
                <Loader2 className="w-5 h-5 animate-spin text-[#666]" />
              </div>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3">
                <Avatar className="w-9 h-9 border border-[#444]">
                  <AvatarFallback className="bg-[#2d2d2d] text-[#888] text-xs">
                    {getInitials(session?.user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{session?.user?.name || 'User'}</p>
                  <p className="text-xs text-[#666] truncate">{session?.user?.email}</p>
                </div>
              </div>
            )}
            
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full mt-2 flex items-center gap-3 px-4 py-3 text-[#666] hover:text-[#ef4444] transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Log out</span>
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
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 z-50 flex flex-col bg-[#141414]"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 text-[#666] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 border-b border-[#333]">
                <Link href="/app" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                  <div className="w-10 h-10 bg-[#fbbf24] flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-[#1a1a1a]" />
                  </div>
                  <span className="font-bold text-lg">
                    FIELD<span className="text-[#fbbf24]">FLOW</span>
                  </span>
                </Link>
              </div>

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
                            ? 'text-[#fbbf24] bg-[#fbbf24]/10' 
                            : 'text-[#888] hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              <div className="p-4 border-t border-[#333]">
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[#666] hover:text-[#ef4444]"
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
      <main className={`${!hideNav ? 'pt-14 lg:pt-0 lg:pl-64 pb-20 lg:pb-6' : ''}`}>
        {children}
      </main>

      {/* Single FAB Button */}
      {!hideNav && (
        <div className="fixed bottom-20 lg:bottom-8 right-6 lg:right-8 z-50">
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
                  className="flex items-center gap-3 bg-[#2d2d2d] border border-[#444] px-5 py-3 text-sm hover:border-[#fbbf24] hover:text-[#fbbf24] transition-all shadow-lg"
                  onClick={() => setShowFabMenu(false)}
                >
                  <MapPin className="w-4 h-4" />
                  <span>New Job</span>
                </Link>
                <Link 
                  href="/app/invoices/new"
                  className="flex items-center gap-3 bg-[#2d2d2d] border border-[#444] px-5 py-3 text-sm hover:border-[#fbbf24] hover:text-[#fbbf24] transition-all shadow-lg"
                  onClick={() => setShowFabMenu(false)}
                >
                  <FileText className="w-4 h-4" />
                  <span>New Invoice</span>
                </Link>
                <Link 
                  href="/app/customers/new"
                  className="flex items-center gap-3 bg-[#2d2d2d] border border-[#444] px-5 py-3 text-sm hover:border-[#fbbf24] hover:text-[#fbbf24] transition-all shadow-lg"
                  onClick={() => setShowFabMenu(false)}
                >
                  <User className="w-4 h-4" />
                  <span>New Customer</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFabMenu(!showFabMenu)}
            className="w-14 h-14 bg-[#fbbf24] flex items-center justify-center shadow-lg shadow-[#fbbf24]/30"
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

      {/* Mobile Bottom Nav */}
      {!hideNav && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#1a1a1a]/95 backdrop-blur border-t border-[#333]">
          <div className="h-full grid grid-cols-4">
            {[
              { name: 'Today', href: '/app', icon: Calendar },
              { name: 'Jobs', href: '/app/jobs', icon: MapPin },
              { name: 'Cash', href: '/app/invoices', icon: FileText },
              { name: 'More', href: '/app/more', icon: Wrench },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                (item.href !== '/app' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                    isActive ? 'text-[#fbbf24]' : 'text-[#666] hover:text-[#888]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px]">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* Tutorial Overlay */}
      {!hideNav && <DashboardTutorial />}
    </div>
  );
}
