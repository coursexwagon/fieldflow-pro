'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, Bell, Mail, MessageSquare, Calendar, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const notificationSettings = [
  {
    category: 'Job Updates',
    icon: Calendar,
    settings: [
      { id: 'job_created', label: 'New job assigned', enabled: true },
      { id: 'job_reminder', label: 'Job reminders', enabled: true },
      { id: 'job_completed', label: 'Job completed', enabled: false },
    ],
  },
  {
    category: 'Payments',
    icon: DollarSign,
    settings: [
      { id: 'payment_received', label: 'Payment received', enabled: true },
      { id: 'invoice_sent', label: 'Invoice sent', enabled: true },
      { id: 'payment_overdue', label: 'Payment overdue alerts', enabled: true },
    ],
  },
  {
    category: 'Communication',
    icon: MessageSquare,
    settings: [
      { id: 'customer_message', label: 'Customer messages', enabled: true },
      { id: 'team_updates', label: 'Team updates', enabled: false },
    ],
  },
];

export default function NotificationsPage() {
  const [settings, setSettings] = useState(notificationSettings);

  const toggleSetting = (categoryIndex: number, settingId: string) => {
    setSettings(prev => prev.map((cat, i) => {
      if (i !== categoryIndex) return cat;
      return {
        ...cat,
        settings: cat.settings.map(s => 
          s.id === settingId ? { ...s, enabled: !s.enabled } : s
        ),
      };
    }));
  };

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
          <h1 className="text-lg font-semibold">Notifications</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {settings.map((category, catIndex) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-medium text-zinc-400">{category.category}</h3>
              </div>
              <Card className="overflow-hidden">
                {category.settings.map((setting, index) => (
                  <div
                    key={setting.id}
                    className={`flex items-center justify-between p-4 ${
                      index !== category.settings.length - 1 ? 'border-b border-[#27272A]' : ''
                    }`}
                  >
                    <p className="text-white">{setting.label}</p>
                    <button
                      onClick={() => toggleSetting(catIndex, setting.id)}
                      className={`relative w-12 h-7 rounded-full transition-colors ${
                        setting.enabled ? 'bg-orange-500' : 'bg-zinc-700'
                      }`}
                    >
                      <motion.div
                        animate={{ x: setting.enabled ? 22 : 2 }}
                        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
                      />
                    </button>
                  </div>
                ))}
              </Card>
            </motion.div>
          );
        })}

        {/* Push Notifications */}
        <Card className="p-4 mt-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Push Notifications</p>
              <p className="text-zinc-500 text-sm">Get instant alerts on your device</p>
            </div>
            <Button variant="primary" size="sm">
              Enable
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
