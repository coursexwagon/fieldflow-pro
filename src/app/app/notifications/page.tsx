'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, Bell, Mail, Smartphone, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface NotificationSettings {
  jobReminders: boolean;
  invoiceAlerts: boolean;
  paymentNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    jobReminders: true,
    invoiceAlerts: true,
    paymentNotifications: true,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('fieldflow_notification_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load notification settings:', e);
      }
    }
  }, []);

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Save to localStorage
    localStorage.setItem('fieldflow_notification_settings', JSON.stringify(settings));
    
    setIsLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 transition-colors ${
        enabled ? 'bg-[#00c2ff]' : 'bg-[#444]'
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white"
      />
    </button>
  );

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
          <h1 className="font-mono text-sm tracking-wider">// NOTIFICATIONS</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6 max-w-lg mx-auto">
        {/* Success Message */}
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-[#22c55e]/10 border border-[#22c55e]/30 px-4 py-3"
          >
            <CheckCircle className="w-5 h-5 text-[#22c55e]" />
            <span className="text-[#22c55e] text-sm font-mono">Settings saved</span>
          </motion.div>
        )}

        {/* Alert Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#222] border border-[#333] p-5 space-y-4"
        >
          <p className="text-xs font-mono text-[#666] tracking-wider">// ALERT TYPES</p>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#00c2ff]" />
              <div>
                <p className="text-sm font-medium">Job Reminders</p>
                <p className="text-xs text-[#666]">Get reminded before jobs</p>
              </div>
            </div>
            <ToggleSwitch 
              enabled={settings.jobReminders} 
              onChange={() => handleToggle('jobReminders')} 
            />
          </div>

          <div className="border-t border-[#333]" />

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#00c2ff]" />
              <div>
                <p className="text-sm font-medium">Invoice Alerts</p>
                <p className="text-xs text-[#666]">When invoices are sent/viewed</p>
              </div>
            </div>
            <ToggleSwitch 
              enabled={settings.invoiceAlerts} 
              onChange={() => handleToggle('invoiceAlerts')} 
            />
          </div>

          <div className="border-t border-[#333]" />

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#00c2ff]" />
              <div>
                <p className="text-sm font-medium">Payment Notifications</p>
                <p className="text-xs text-[#666]">When payments come in</p>
              </div>
            </div>
            <ToggleSwitch 
              enabled={settings.paymentNotifications} 
              onChange={() => handleToggle('paymentNotifications')} 
            />
          </div>
        </motion.div>

        {/* Delivery Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#222] border border-[#333] p-5 space-y-4"
        >
          <p className="text-xs font-mono text-[#666] tracking-wider">// DELIVERY METHODS</p>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#888]" />
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-[#666]">Receive via email</p>
              </div>
            </div>
            <ToggleSwitch 
              enabled={settings.emailNotifications} 
              onChange={() => handleToggle('emailNotifications')} 
            />
          </div>

          <div className="border-t border-[#333]" />

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#888]" />
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-[#666]">Browser notifications</p>
              </div>
            </div>
            <ToggleSwitch 
              enabled={settings.pushNotifications} 
              onChange={() => handleToggle('pushNotifications')} 
            />
          </div>

          <div className="border-t border-[#333]" />

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-[#888]" />
              <div>
                <p className="text-sm font-medium">SMS Notifications</p>
                <p className="text-xs text-[#666]">Text message alerts</p>
              </div>
            </div>
            <ToggleSwitch 
              enabled={settings.smsNotifications} 
              onChange={() => handleToggle('smsNotifications')} 
            />
          </div>
        </motion.div>

        {/* Quiet Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#222] border border-[#333] p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono text-[#666] tracking-wider">// QUIET HOURS</p>
            <ToggleSwitch 
              enabled={settings.quietHoursEnabled} 
              onChange={() => handleToggle('quietHoursEnabled')} 
            />
          </div>
          
          {settings.quietHoursEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-4 pt-2"
            >
              <div className="flex-1">
                <label className="text-xs font-mono text-[#888] block mb-2 uppercase">Start</label>
                <input
                  type="time"
                  value={settings.quietHoursStart}
                  onChange={(e) => setSettings(prev => ({ ...prev, quietHoursStart: e.target.value }))}
                  className="w-full h-10 px-3 bg-[#1a1a1a] border border-[#333] text-[#f5f5f5]"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-mono text-[#888] block mb-2 uppercase">End</label>
                <input
                  type="time"
                  value={settings.quietHoursEnd}
                  onChange={(e) => setSettings(prev => ({ ...prev, quietHoursEnd: e.target.value }))}
                  className="w-full h-10 px-3 bg-[#1a1a1a] border border-[#333] text-[#f5f5f5]"
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full bg-[#00c2ff] text-[#1a1a1a] py-4 font-mono font-semibold tracking-wider hover:bg-[#00a8e0] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'SAVING...' : 'SAVE SETTINGS'}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
