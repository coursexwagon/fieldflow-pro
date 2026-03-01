'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, CreditCard, Plus, Check, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const paymentMethods = [
  {
    id: '1',
    type: 'card',
    brand: 'Visa',
    last4: '4242',
    expiry: '12/25',
    isDefault: true,
  },
  {
    id: '2',
    type: 'card',
    brand: 'Mastercard',
    last4: '5555',
    expiry: '08/26',
    isDefault: false,
  },
];

export default function PaymentsPage() {
  const [cards, setCards] = useState(paymentMethods);
  const [showAddCard, setShowAddCard] = useState(false);

  const setDefault = (id: string) => {
    setCards(prev => prev.map(card => ({
      ...card,
      isDefault: card.id === id,
    })));
  };

  const removeCard = (id: string) => {
    setCards(prev => prev.filter(card => card.id !== id));
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
          <h1 className="text-lg font-semibold">Payment Methods</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-zinc-400 text-sm">
          Manage your payment methods for receiving customer payments.
        </p>

        {/* Cards List */}
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`p-4 ${card.isDefault ? 'border-orange-500/30 bg-orange-500/5' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-10 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{card.brand} •••• {card.last4}</p>
                    {card.isDefault && (
                      <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-500 text-sm">Expires {card.expiry}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!card.isDefault && (
                    <button
                      onClick={() => setDefault(card.id)}
                      className="p-2 text-zinc-400 hover:text-orange-400 transition-colors"
                      title="Set as default"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => removeCard(card.id)}
                    className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Add Card Button */}
        <Button
          variant="secondary"
          className="w-full gap-2 mt-4"
          onClick={() => setShowAddCard(true)}
        >
          <Plus className="w-4 h-4" />
          Add Payment Method
        </Button>

        {/* Stripe Connect Info */}
        <Card className="p-4 mt-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Connect with Stripe</p>
              <p className="text-zinc-400 text-sm mt-1">
                Accept payments directly from customers. Money hits your account in 2 days.
              </p>
              <Button variant="primary" size="sm" className="mt-3">
                Connect Stripe Account
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
