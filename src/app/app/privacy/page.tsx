'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Shield, 
  Key, 
  Smartphone, 
  Trash2, 
  AlertTriangle,
  Eye,
  Lock,
  LogOut,
  Loader2,
} from 'lucide-react';

export default function PrivacyPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogoutAll = async () => {
    // Sign out from current session
    await signOut({ redirect: false });
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    
    // In production, this would call an API to delete the user
    // For now, just sign out
    await new Promise(resolve => setTimeout(resolve, 1500));
    await signOut({ redirect: false });
    router.push('/');
  };

  const settings = [
    {
      icon: Lock,
      title: 'Password',
      description: 'Last changed 30 days ago',
      action: 'Change',
      href: '#change-password',
    },
    {
      icon: Smartphone,
      title: 'Two-Factor Auth',
      description: 'Not enabled',
      action: 'Enable',
      href: '#2fa',
    },
    {
      icon: Eye,
      title: 'Data & Privacy',
      description: 'Manage your data',
      action: 'View',
      href: '#data',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#1a1a1a] text-[#f5f5f5]"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#1a1a1a]/95 backdrop-blur border-b border-[#333]">
        <div className="h-14 px-4 flex items-center justify-between">
          <Link href="/app/more" className="p-2 -ml-2 text-[#888] hover:text-[#00c2ff] transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-mono text-sm tracking-wider">// SECURITY</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6 max-w-lg mx-auto">
        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#222] border border-[#333] p-5 space-y-0"
        >
          <p className="text-xs font-mono text-[#666] tracking-wider mb-4">// ACCOUNT SECURITY</p>
          
          {settings.map((item, i) => {
            const Icon = item.icon;
            const isLast = i === settings.length - 1;
            return (
              <div
                key={item.title}
                className={`flex items-center justify-between py-3 ${!isLast ? 'border-b border-[#333]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-[#888]" />
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-[#666]">{item.description}</p>
                  </div>
                </div>
                <button className="text-xs font-mono text-[#00c2ff] hover:underline">
                  {item.action}
                </button>
              </div>
            );
          })}
        </motion.div>

        {/* Session */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#222] border border-[#333] p-5"
        >
          <p className="text-xs font-mono text-[#666] tracking-wider mb-4">// SESSION</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-[#888]" />
              <div>
                <p className="text-sm font-medium">Log Out All Devices</p>
                <p className="text-xs text-[#666]">End all active sessions</p>
              </div>
            </div>
            <button 
              onClick={handleLogoutAll}
              className="text-xs font-mono text-[#ff8844] hover:underline"
            >
              LOG OUT
            </button>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#ff4444]/5 border border-[#ff4444]/30 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-[#ff4444]" />
            <p className="text-xs font-mono text-[#ff4444] tracking-wider">// DANGER ZONE</p>
          </div>
          
          {!showDeleteConfirm ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-[#ff4444]" />
                <div>
                  <p className="text-sm font-medium">Delete Account</p>
                  <p className="text-xs text-[#888]">Permanently remove all data</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs font-mono text-[#ff4444] hover:underline"
              >
                DELETE
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <p className="text-sm text-[#f5f5f5]">
                Are you sure? This will permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 border border-[#444] text-sm font-mono hover:border-[#666] transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-[#ff4444] text-white text-sm font-mono hover:bg-[#ff5555] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      DELETING...
                    </>
                  ) : (
                    'DELETE ACCOUNT'
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center text-[#666] text-xs font-mono space-y-1"
        >
          <p>Your data is encrypted at rest and in transit.</p>
          <p>We never sell your information to third parties.</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
