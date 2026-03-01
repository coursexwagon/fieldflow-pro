'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  FileText,
  ChevronRight,
  ExternalLink,
  Loader2,
  Send,
  CheckCircle,
} from 'lucide-react';

const faqs = [
  {
    question: 'How do I add a new job?',
    answer: 'Tap the + button in the bottom right corner, or go to Jobs > Add New Job. Fill in the customer, address, and job details.',
  },
  {
    question: 'Can I use FieldFlow offline?',
    answer: 'Yes! FieldFlow works offline. Jobs and changes sync automatically when you\'re back in service. Perfect for basements and rural areas.',
  },
  {
    question: 'How do I send an invoice?',
    answer: 'Go to Invoices > Create New. Select a customer and add line items. Tap "Send Invoice" to email it directly to your customer.',
  },
  {
    question: 'Can I accept credit card payments?',
    answer: 'Yes, with a Pro account you can accept card payments through Stripe. Customers pay by card and money hits your account in 2 days.',
  },
  {
    question: 'How do I add team members?',
    answer: 'Upgrade to the Team plan ($49/mo) to add technicians. Each team member gets their own login and you can dispatch jobs to them.',
  },
];

const contactMethods = [
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with support',
    action: 'Start Chat',
    available: true,
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'support@fieldflow.app',
    action: 'Send Email',
    available: true,
  },
  {
    icon: FileText,
    title: 'Documentation',
    description: 'Guides & tutorials',
    action: 'View Docs',
    available: true,
  },
];

export default function SupportPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setIsSending(true);
    
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSending(false);
    setSent(true);
    setMessage('');
    
    setTimeout(() => setSent(false), 3000);
  };

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
          <h1 className="font-mono text-sm tracking-wider">// SUPPORT</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6 max-w-lg mx-auto">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#222] border border-[#333] p-5 space-y-0"
        >
          <p className="text-xs font-mono text-[#666] tracking-wider mb-4">// CONTACT US</p>
          
          {contactMethods.map((method, i) => {
            const Icon = method.icon;
            const isLast = i === contactMethods.length - 1;
            return (
              <div
                key={method.title}
                className={`flex items-center justify-between py-3 ${!isLast ? 'border-b border-[#333]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-[#00c2ff]" />
                  <div>
                    <p className="text-sm font-medium">{method.title}</p>
                    <p className="text-xs text-[#666]">{method.description}</p>
                  </div>
                </div>
                <button className="text-xs font-mono text-[#888] hover:text-[#00c2ff] flex items-center gap-1">
                  {method.action}
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </motion.div>

        {/* Send Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#222] border border-[#333] p-5 space-y-4"
        >
          <p className="text-xs font-mono text-[#666] tracking-wider">// SEND MESSAGE</p>
          
          {sent ? (
            <div className="flex items-center gap-2 bg-[#22c55e]/10 border border-[#22c55e]/30 px-4 py-4">
              <CheckCircle className="w-5 h-5 text-[#22c55e]" />
              <span className="text-[#22c55e] text-sm">Message sent! We'll get back to you soon.</span>
            </div>
          ) : (
            <>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or question..."
                rows={4}
                className="w-full bg-[#1a1a1a] border border-[#333] p-4 text-[#f5f5f5] placeholder:text-[#666] resize-none focus:border-[#00c2ff] focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={isSending || !message.trim()}
                className="w-full bg-[#00c2ff] text-[#1a1a1a] py-3 font-mono font-semibold tracking-wider hover:bg-[#00a8e0] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    SENDING...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    SEND MESSAGE
                  </>
                )}
              </button>
            </>
          )}
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xs font-mono text-[#666] tracking-wider mb-3">// FAQ</p>
          
          <div className="bg-[#222] border border-[#333] divide-y divide-[#333]">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[#2a2a2a] transition-colors"
                >
                  <span className="text-sm font-medium pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: expandedFaq === i ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-4 h-4 text-[#666]" />
                  </motion.div>
                </button>
                
                {expandedFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pb-4"
                  >
                    <p className="text-sm text-[#888] leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Version */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center text-[#444] text-xs font-mono"
        >
          <p>FieldFlow Pro v1.0.0</p>
          <p className="mt-1">Built with care for contractors everywhere</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
