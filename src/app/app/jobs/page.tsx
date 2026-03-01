'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useJobs } from '@/hooks/useApi';

const filters = ['All', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'];

export default function JobsPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const statusMap: Record<string, string | undefined> = {
    'All': undefined,
    'Scheduled': 'SCHEDULED',
    'In Progress': 'IN_PROGRESS',
    'Completed': 'COMPLETED',
    'Cancelled': 'CANCELLED',
  };

  const { data, isLoading, error } = useJobs({ 
    status: statusMap[activeFilter] || undefined
  });

  const jobs = data?.jobs || [];

  const filteredJobs = jobs.filter((job: any) =>
    job.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'scheduled';
      case 'IN_PROGRESS': return 'progress';
      case 'COMPLETED': return 'completed';
      case 'CANCELLED': return 'default';
      default: return 'default';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1).toLowerCase();
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Jobs</h1>
        <Link href="/app/jobs/new">
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4" />
            New
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <Input
          placeholder="Search jobs..."
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
          <p className="text-red-400">Failed to load jobs</p>
        </div>
      )}

      {/* Jobs List */}
      {!isLoading && !error && (
        <div className="space-y-2">
          {filteredJobs.length > 0 ? filteredJobs.map((job: any) => (
            <Link key={job.id} href={`/app/jobs/${job.id}`}>
              <Card className="p-3 hover:border-[#3F3F46] transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-medium text-sm">{job.title}</p>
                      <Badge variant={getBadgeVariant(job.status) as any} className="text-xs">
                        {formatStatus(job.status)}
                      </Badge>
                    </div>
                    <p className="text-zinc-400 text-sm">{job.customer?.name}</p>
                    {job.customer?.address && (
                      <p className="text-zinc-500 text-xs flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {job.customer.address}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {job.price && (
                      <p className="text-white font-medium">${job.price}</p>
                    )}
                    <p className="text-zinc-500 text-xs">
                      {job.scheduledAt 
                        ? new Date(job.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : '-'}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                </div>
              </Card>
            </Link>
          )) : (
            <Card className="p-8 text-center">
              <p className="text-zinc-500 mb-4">No jobs found</p>
              <Link href="/app/jobs/new">
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4" />
                  Create your first job
                </Button>
              </Link>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
