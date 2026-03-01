'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, FileText, Send, Check, Clock, DollarSign, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useInvoices } from '@/hooks/useApi';

const filters = ['All', 'Draft', 'Sent', 'Paid', 'Overdue'];

export default function InvoicesPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const statusMap: Record<string, string | undefined> = {
    'All': undefined,
    'Draft': 'DRAFT',
    'Sent': 'SENT',
    'Paid': 'PAID',
    'Overdue': 'OVERDUE',
  };

  const { data, isLoading, error } = useInvoices({ 
    status: statusMap[activeFilter] 
  });

  const invoices = data?.invoices || [];

  const filteredInvoices = invoices.filter((invoice: any) =>
    invoice.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT': return <FileText className="w-4 h-4" />;
      case 'SENT': return <Send className="w-4 h-4" />;
      case 'PAID': return <Check className="w-4 h-4" />;
      case 'OVERDUE': return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'text-zinc-400';
      case 'SENT': return 'text-blue-400';
      case 'PAID': return 'text-green-400';
      case 'OVERDUE': return 'text-red-400';
      default: return 'text-zinc-400';
    }
  };

  // Calculate totals
  const totalOutstanding = invoices
    .filter((inv: any) => inv.status === 'SENT' || inv.status === 'OVERDUE')
    .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);
  
  const totalPaid = invoices
    .filter((inv: any) => inv.status === 'PAID')
    .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Invoices</h1>
        <Link href="/app/invoices/new">
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4" />
            Create
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="flex gap-3">
        <div className="flex-1 bg-[#141416] border border-[#27272A] rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-zinc-500">Outstanding</span>
          </div>
          <p className="text-xl font-bold text-white">${totalOutstanding.toLocaleString()}</p>
        </div>
        <div className="flex-1 bg-[#141416] border border-[#27272A] rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-xs text-zinc-500">Paid</span>
          </div>
          <p className="text-xl font-bold text-green-400">${totalPaid.toLocaleString()}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <Input
          placeholder="Search invoices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors',
              activeFilter === filter
                ? 'bg-orange-500 text-white'
                : 'bg-[#141416] text-zinc-400 border border-[#27272A]'
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-400">Failed to load invoices</p>
        </div>
      )}

      {/* Invoice List */}
      {!isLoading && !error && (
        <div className="space-y-2">
          {filteredInvoices.length > 0 ? filteredInvoices.map((invoice: any) => (
            <Card key={invoice.id} className="p-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-lg bg-[#1C1C1F] flex items-center justify-center',
                  getStatusColor(invoice.status)
                )}>
                  {getStatusIcon(invoice.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium text-sm">{invoice.invoiceNumber}</p>
                    <span className={cn('text-xs', getStatusColor(invoice.status))}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm">{invoice.customer?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">${invoice.total?.toLocaleString()}</p>
                  <p className="text-zinc-500 text-xs">
                    {invoice.createdAt 
                      ? new Date(invoice.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : '-'}
                  </p>
                </div>
              </div>
            </Card>
          )) : (
            <Card className="p-8 text-center">
              <p className="text-zinc-500 mb-4">No invoices yet</p>
              <Link href="/app/invoices/new">
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4" />
                  Create your first invoice
                </Button>
              </Link>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
