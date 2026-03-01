'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, Shield, Key, Smartphone, Eye, EyeOff, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PrivacyPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0A0A0B] text-white"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0A0A0B]/90 backdrop-blur-md border-b border-[#27272A]">
        <div className="h-14 px-4 flex items-center gap-4">
          <Link href="/app/settings" className="p-2 -ml-2 text-zinc-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold">Privacy & Security</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
            <Key className="w-4 h-4" />
            Change Password
          </h3>
          <Card className="p-4 space-y-4">
            <div className="relative">
              <label className="text-sm text-zinc-400 block mb-2">Current Password</label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="relative">
              <label className="text-sm text-zinc-400 block mb-2">New Password</label>
              <div className="relative">
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm text-zinc-400 block mb-2">Confirm New Password</label>
              <Input
                type="password"
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <Button variant="primary" className="w-full">
              Update Password
            </Button>
          </Card>
        </motion.div>

        {/* Two-Factor Auth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            Two-Factor Authentication
          </h3>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Authenticator App</p>
                <p className="text-zinc-500 text-sm">Add an extra layer of security</p>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  twoFactorEnabled ? 'bg-green-500' : 'bg-zinc-700'
                }`}
              >
                <motion.div
                  animate={{ x: twoFactorEnabled ? 22 : 2 }}
                  className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
                />
              </button>
            </div>
            {twoFactorEnabled && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">Two-factor authentication is enabled</span>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Security Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security Tips
          </h3>
          <Card className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-green-400" />
              </div>
              <p className="text-zinc-400 text-sm">Use a strong, unique password</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-green-400" />
              </div>
              <p className="text-zinc-400 text-sm">Enable two-factor authentication</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-zinc-400" />
              </div>
              <p className="text-zinc-400 text-sm">Never share your login credentials</p>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
