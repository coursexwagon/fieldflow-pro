'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Search, 
  ChevronRight, 
  MessageCircle, 
  Mail, 
  Phone,
  HelpCircle,
  FileText,
  Zap,
  CreditCard,
  Users,
  Calendar,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const faqCategories = [
  {
    category: 'Getting Started',
    icon: Zap,
    articles: [
      { title: 'How to create your first job', href: '#' },
      { title: 'Setting up your profile', href: '#' },
      { title: 'Understanding the dashboard', href: '#' },
    ],
  },
  {
    category: 'Jobs & Scheduling',
    icon: Calendar,
    articles: [
      { title: 'Creating and managing jobs', href: '#' },
      { title: 'GPS route optimization', href: '#' },
      { title: 'Job status updates', href: '#' },
    ],
  },
  {
    category: 'Invoices & Payments',
    icon: CreditCard,
    articles: [
      { title: 'Creating invoices', href: '#' },
      { title: 'Accepting payments', href: '#' },
      { title: 'Connecting Stripe', href: '#' },
    ],
  },
  {
    category: 'Customers',
    icon: Users,
    articles: [
      { title: 'Adding customers', href: '#' },
      { title: 'Customer database management', href: '#' },
      { title: 'Importing from CSV', href: '#' },
    ],
  },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');

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
          <h1 className="text-lg font-semibold">Help Center</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          <Card className="p-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-white font-medium">Live Chat</p>
            <p className="text-zinc-500 text-xs mt-1">Chat with support</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-green-500/20 flex items-center justify-center mb-3">
              <Mail className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-white font-medium">Email Us</p>
            <p className="text-zinc-500 text-xs mt-1">support@fieldflow.com</p>
          </Card>
        </motion.div>

        {/* FAQ Categories */}
        {faqCategories.map((cat, catIndex) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (catIndex + 2) }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-medium text-zinc-400">{cat.category}</h3>
              </div>
              <Card className="overflow-hidden">
                {cat.articles.map((article, index) => (
                  <Link
                    key={article.title}
                    href={article.href}
                    className={`flex items-center justify-between p-4 hover:bg-[#1C1C1F] transition-colors ${
                      index !== cat.articles.length - 1 ? 'border-b border-[#27272A]' : ''
                    }`}
                  >
                    <p className="text-white">{article.title}</p>
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                  </Link>
                ))}
              </Card>
            </motion.div>
          );
        })}

        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Phone className="w-6 h-6 text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Need more help?</p>
                <p className="text-zinc-400 text-sm">Call us at 1-800-FIELD-FLOW</p>
              </div>
              <Button variant="primary" size="sm">
                Call
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
