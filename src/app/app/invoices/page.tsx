'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Plus, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Clock,
  Check,
  Loader2,
} from 'lucide-react';
import { useInvoices } from '@/hooks/useApi';

// Last 7 days labels
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function InvoicesPage() {
  const [showAll, setShowAll] = useState(false);
  const { data, isLoading, error } = useInvoices({});

  const invoices = data?.invoices || [];

  // Calculate metrics
  const metrics = useMemo(() => {
    const outstanding = invoices
      .filter((inv: any) => inv.status === 'SENT' || inv.status === 'OVERDUE')
      .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);
    
    const paid = invoices
      .filter((inv: any) => inv.status === 'PAID')
      .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);
    
    const overdue = invoices
      .filter((inv: any) => inv.status === 'OVERDUE')
      .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);

    // Generate fake sparkline data based on invoices
    const sparkline = DAYS.map((_, i) => {
      const dayInvoices = invoices.filter((inv: any) => {
        const invDate = new Date(inv.createdAt);
        const today = new Date();
        const dayDiff = today.getDay() - invDate.getDay();
        return dayDiff === i;
      });
      return dayInvoices.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);
    });

    return { outstanding, paid, overdue, sparkline };
  }, [invoices]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return '#22c55e';
      case 'OVERDUE': return '#ff4444';
      case 'SENT': return '#ffb800';
      default: return '#666';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-[#ffb800] border-t-transparent mx-auto mb-3"
          />
          <p className="text-[#666] text-sm font-mono">Loading cash flow...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-[#ff4444] mb-2">Failed to load invoices</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-[#ffb800] text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  const maxSparkline = Math.max(...metrics.sparkline, 100);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">Cash Flow</h1>
        <Link href="/app/invoices/new">
          <button className="flex items-center gap-1 bg-[#ffb800] text-[#1a1a1a] px-3 py-1.5 text-sm font-display font-semibold">
            <Plus className="w-4 h-4" />
            Invoice
          </button>
        </Link>
      </div>

      {/* Cash Flow Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#2d2d2d] border border-[#404040] p-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#ffb800]" />
            <span className="font-mono text-xs text-[#888]">LAST 7 DAYS</span>
          </div>
          <span className="font-mono text-xs text-[#888]">
            {invoices.length} transactions
          </span>
        </div>

        {/* Sparkline Bars */}
        <div className="flex items-end justify-between h-24 mb-4 gap-1">
          {DAYS.map((day, i) => {
            const height = (metrics.sparkline[i] / maxSparkline) * 100;
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 4)}%` }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className={`w-full ${metrics.sparkline[i] > 0 ? 'bg-[#ffb800]' : 'bg-[#404040]'}`}
                  style={{ minHeight: '4px' }}
                />
                <span className="text-[10px] text-[#666] font-mono">{day}</span>
              </div>
            );
          })}
        </div>

        {/* Totals */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#404040]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ArrowUpRight className="w-4 h-4 text-[#22c55e]" />
              <span className="text-xs text-[#888] font-mono">CASH IN</span>
            </div>
            <p className="font-display text-2xl font-bold tabular-nums text-[#22c55e]">
              ${metrics.paid.toLocaleString()}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ArrowDownRight className="w-4 h-4 text-[#ff4444]" />
              <span className="text-xs text-[#888] font-mono">WAITING</span>
            </div>
            <p className="font-display text-2xl font-bold tabular-nums text-[#ff4444]">
              ${metrics.outstanding.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Overdue Alert */}
      {metrics.overdue > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#ff4444]/10 border border-[#ff4444]/30 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#ff4444]" />
              <div>
                <p className="font-medium text-[#ff4444]">${metrics.overdue.toLocaleString()} overdue</p>
                <p className="text-xs text-[#888]">Money waiting too long</p>
              </div>
            </div>
            <button className="text-[#ff4444] text-sm font-medium">
              Chase →
            </button>
          </div>
        </motion.div>
      )}

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold">Recent</h2>
          {invoices.length > 5 && (
            <button 
              onClick={() => setShowAll(!showAll)}
              className="text-[#888] text-xs font-mono"
            >
              {showAll ? 'Show less' : 'Show all'}
            </button>
          )}
        </div>

        {invoices.length > 0 ? (
          <div className="space-y-1">
            {(showAll ? invoices : invoices.slice(0, 5)).map((invoice: any, i: number) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link href={`/app/invoices/${invoice.id}`}>
                  <div className="flex items-center gap-3 p-3 bg-[#2d2d2d] border border-[#404040] hover:border-[#505050] transition-colors">
                    <div 
                      className="w-2 h-2 flex-shrink-0"
                      style={{ backgroundColor: getStatusColor(invoice.status) }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono truncate">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-[#666]">{invoice.customer?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm tabular-nums">${invoice.total?.toLocaleString()}</p>
                      <p className="text-xs text-[#666]">
                        {invoice.status === 'PAID' ? (
                          <span className="text-[#22c55e]">Paid</span>
                        ) : invoice.status === 'OVERDUE' ? (
                          <span className="text-[#ff4444]">Overdue</span>
                        ) : (
                          <span className="text-[#ffb800]">Pending</span>
                        )}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#666]" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#2d2d2d] border border-[#404040]">
            <p className="text-[#888] mb-1">Money will flow when jobs are done</p>
            <p className="text-[#666] text-xs">Complete a job, then invoice it</p>
          </div>
        )}
      </div>
    </div>
  );
}
