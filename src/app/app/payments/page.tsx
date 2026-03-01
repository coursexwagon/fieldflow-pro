'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  CreditCard, 
  Plus, 
  Check,
  ExternalLink,
  Shield,
  AlertCircle,
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  bankName?: string;
  isDefault: boolean;
}

// Mock payment methods - in production these would come from Stripe
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    isDefault: true,
  },
];

export default function PaymentsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [showAddCard, setShowAddCard] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleRemoveCard = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const handleAddCard = async () => {
    setIsAdding(true);
    
    // Simulate adding a card
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCard: PaymentMethod = {
      id: Date.now().toString(),
      type: 'card',
      last4: Math.floor(1000 + Math.random() * 9000).toString(),
      brand: 'Mastercard',
      isDefault: paymentMethods.length === 0,
    };
    
    setPaymentMethods(prev => [...prev, newCard]);
    setShowAddCard(false);
    setIsAdding(false);
  };

  const getCardIcon = (brand?: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      default:
        return '💳';
    }
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
          <h1 className="font-mono text-sm tracking-wider">// PAYMENTS</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6 max-w-lg mx-auto">
        {/* Stripe Connect Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#00c2ff]/10 border border-[#00c2ff]/30 p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00c2ff]/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#00c2ff]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Stripe Connected</p>
              <p className="text-xs text-[#888]">Accept card payments from customers</p>
            </div>
            <button className="text-xs font-mono text-[#00c2ff] flex items-center gap-1 hover:underline">
              Manage
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#222] border border-[#333] p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono text-[#666] tracking-wider">// PAYOUT METHODS</p>
            <button 
              onClick={() => setShowAddCard(true)}
              className="text-xs font-mono text-[#00c2ff] flex items-center gap-1 hover:underline"
            >
              <Plus className="w-3 h-3" />
              ADD
            </button>
          </div>

          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-[#444] mx-auto mb-3" />
              <p className="text-[#888] text-sm">No payment methods added</p>
              <p className="text-[#666] text-xs mt-1">Add a card to receive payouts</p>
              <button
                onClick={() => setShowAddCard(true)}
                className="mt-4 bg-[#00c2ff] text-[#1a1a1a] px-6 py-2 font-mono text-sm font-semibold hover:bg-[#00a8e0] transition-colors"
              >
                ADD CARD
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`flex items-center gap-4 p-4 border ${
                    method.isDefault ? 'border-[#00c2ff]/50 bg-[#00c2ff]/5' : 'border-[#333]'
                  }`}
                >
                  <div className="text-2xl">{getCardIcon(method.brand)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {method.brand} •••• {method.last4}
                      </p>
                      {method.isDefault && (
                        <span className="text-[10px] font-mono text-[#00c2ff] bg-[#00c2ff]/10 px-2 py-0.5">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#666] mt-1">
                      {method.type === 'card' ? 'Debit card for payouts' : 'Bank account'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        className="text-xs font-mono text-[#888] hover:text-[#00c2ff] transition-colors"
                      >
                        SET DEFAULT
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Add Card Modal */}
        {showAddCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-[#1a1a1a]/95 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#222] border border-[#333] p-6 w-full max-w-sm"
            >
              <h3 className="font-mono text-sm tracking-wider mb-4">// ADD PAYMENT METHOD</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-[#888] block mb-2 uppercase">Card Number</label>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    className="w-full h-11 px-4 bg-[#1a1a1a] border border-[#333] text-[#f5f5f5] focus:border-[#00c2ff] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-[#888] block mb-2 uppercase">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full h-11 px-4 bg-[#1a1a1a] border border-[#333] text-[#f5f5f5] focus:border-[#00c2ff] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-[#888] block mb-2 uppercase">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full h-11 px-4 bg-[#1a1a1a] border border-[#333] text-[#f5f5f5] focus:border-[#00c2ff] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddCard(false)}
                  className="flex-1 py-3 border border-[#444] font-mono text-sm hover:border-[#666] transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleAddCard}
                  disabled={isAdding}
                  className="flex-1 py-3 bg-[#00c2ff] text-[#1a1a1a] font-mono text-sm font-semibold hover:bg-[#00a8e0] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAdding ? 'ADDING...' : 'ADD CARD'}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 mt-4 text-[#666]">
                <Shield className="w-4 h-4" />
                <span className="text-xs">Secured by Stripe</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#2d2d2d] border border-[#404040] p-4 flex gap-3"
        >
          <AlertCircle className="w-5 h-5 text-[#ffb800] flex-shrink-0" />
          <div className="text-sm text-[#888]">
            <p className="font-medium text-[#f5f5f5] mb-1">Payout Schedule</p>
            <p>Funds from customer payments arrive in 2 business days. Weekend/holiday payments arrive the next business day.</p>
          </div>
        </motion.div>

        {/* Fees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#222] border border-[#333] p-5"
        >
          <p className="text-xs font-mono text-[#666] tracking-wider mb-3">// PROCESSING FEES</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#888]">Card payments</span>
              <span className="font-mono">2.9% + 30¢</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#888]">ACH transfers</span>
              <span className="font-mono">0.8% (max $5)</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
