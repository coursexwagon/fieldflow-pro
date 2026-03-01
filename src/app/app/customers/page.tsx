'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, MapPin, ChevronRight, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCustomers } from '@/hooks/useApi';

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading, error } = useCustomers(search);

  const customers = data?.customers || [];

  // Calculate stats
  const totalRevenue = customers.reduce((sum: number, c: any) => sum + (c._count?.jobs || 0), 0);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Customers</h1>
        <Link href="/app/customers/new">
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="flex-1 bg-[#141416] border border-[#27272A] rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-white">{customers.length}</p>
          <p className="text-xs text-zinc-500">Total customers</p>
        </div>
        <div className="flex-1 bg-[#141416] border border-[#27272A] rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-400">{totalRevenue}</p>
          <p className="text-xs text-zinc-500">Total jobs</p>
        </div>
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
          <p className="text-red-400">Failed to load customers</p>
        </div>
      )}

      {/* Customer List */}
      {!isLoading && !error && (
        <div className="space-y-2">
          {customers.length > 0 ? customers.map((customer: any) => (
            <Card key={customer.id} className="p-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarFallback className="bg-orange-500/20 text-orange-400 text-sm">
                    {customer.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">{customer.name}</p>
                  <p className="text-zinc-500 text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {customer.address}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-zinc-400">{customer._count?.jobs || 0} jobs</p>
                  <p className="text-xs text-zinc-500">
                    {customer.createdAt 
                      ? new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : '-'}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 flex-shrink-0" />
              </div>
            </Card>
          )) : (
            <Card className="p-8 text-center">
              <p className="text-zinc-500 mb-4">No customers yet</p>
              <Link href="/app/customers/new">
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4" />
                  Add your first customer
                </Button>
              </Link>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
