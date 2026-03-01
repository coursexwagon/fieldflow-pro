'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
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
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
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
  const [showFabMenu, setShowFabMenu] = useState(false);

  // Don't show nav on certain pages
  const hideNav = pathname?.includes('/new') || pathname?.includes('/login') || pathname?.includes('/signup');

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f5f5] font-body">
      {/* Top Bar - Minimal */}
      {!hideNav && (
        <header className="fixed top-0 left-0 right-0 z-40 h-12 bg-[#1a1a1a]/95 backdrop-blur border-b border-[#404040]">
          <div className="h-full px-4 flex items-center justify-between">
            <Link href="/app" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#ffb800] flex items-center justify-center">
                <Wrench className="w-4 h-4 text-[#1a1a1a]" />
              </div>
              <span className="font-display font-semibold text-sm">
                Field<span className="text-[#ffb800]">Flow</span>
              </span>
            </Link>
            
            <div className="flex items-center gap-3">
              {status === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#888]" />
              ) : (
                <Link href="/app/account">
                  <Avatar className="w-7 h-7 border border-[#404040]">
                    <AvatarFallback className="bg-[#2d2d2d] text-[#888] text-xs">
                      {getInitials(session?.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={!hideNav ? 'pt-12 pb-24' : ''}>
        {children}
      </main>

      {/* Floating Action Button - Wrench */}
      {!hideNav && (
        <div className="fixed bottom-6 right-6 z-50">
          <AnimatePresence>
            {showFabMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-16 right-0 flex flex-col gap-2"
              >
                <Link 
                  href="/app/jobs/new"
                  className="flex items-center gap-2 bg-[#2d2d2d] border border-[#404040] px-4 py-2 text-sm hover:border-[#ffb800] transition-colors"
                  onClick={() => setShowFabMenu(false)}
                >
                  <MapPin className="w-4 h-4" />
                  New Job
                </Link>
                <Link 
                  href="/app/invoices/new"
                  className="flex items-center gap-2 bg-[#2d2d2d] border border-[#404040] px-4 py-2 text-sm hover:border-[#ffb800] transition-colors"
                  onClick={() => setShowFabMenu(false)}
                >
                  <FileText className="w-4 h-4" />
                  New Invoice
                </Link>
                <Link 
                  href="/app/customers/new"
                  className="flex items-center gap-2 bg-[#2d2d2d] border border-[#404040] px-4 py-2 text-sm hover:border-[#ffb800] transition-colors"
                  onClick={() => setShowFabMenu(false)}
                >
                  <User className="w-4 h-4" />
                  New Customer
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFabMenu(!showFabMenu)}
            className="w-14 h-14 bg-[#ffb800] flex items-center justify-center shadow-lg shadow-[#ffb800]/30"
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

      {/* Bottom Nav - Minimal, 4 items max */}
      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#1a1a1a] border-t border-[#404040]">
          <div className="h-full grid grid-cols-4">
            {[
              { name: 'Today', href: '/app', icon: Calendar },
              { name: 'Territory', href: '/app/jobs', icon: MapPin },
              { name: 'Cash', href: '/app/invoices', icon: FileText },
              { name: 'Tools', href: '/app/more', icon: Wrench },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                    isActive ? 'text-[#ffb800]' : 'text-[#666] hover:text-[#888]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-mono">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
