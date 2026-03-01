'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Calendar,
  DollarSign,
  Clock,
  MapPin,
  Plus,
  FileText,
  Users,
  Check,
  Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/hooks/useApi';

const quickActions = [
  { name: 'New Job', icon: Plus, href: '/app/jobs/new' },
  { name: 'Invoice', icon: FileText, href: '/app/invoices/new' },
  { name: 'Customer', icon: Users, href: '/app/customers/new' },
  { name: 'Schedule', icon: Calendar, href: '/app/schedule' },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data, isLoading, error } = useDashboard();

  const userName = session?.user?.name?.split(' ')[0] || 'there';

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-400">Failed to load dashboard</p>
        <Button 
          variant="primary" 
          size="sm" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  const { stats, recentJobs, upcomingJobs } = data;
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <p className="text-zinc-500 text-sm">{getGreeting()}</p>
        <h1 className="text-2xl font-bold text-white">{userName}</h1>
        <p className="text-zinc-500 text-sm">{dateStr}</p>
      </div>

      {/* Stats */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        <Card className="flex-shrink-0 w-28 p-3 text-center">
          <p className="text-xl font-bold text-white">{stats.todaysJobs}</p>
          <p className="text-xs text-zinc-500">jobs today</p>
          <p className="text-xs text-zinc-600">{stats.completedJobsToday} done</p>
        </Card>
        <Card className="flex-shrink-0 w-28 p-3 text-center">
          <p className="text-xl font-bold text-green-400">${stats.totalRevenue?.toLocaleString() || 0}</p>
          <p className="text-xs text-zinc-500">earned</p>
          <p className="text-xs text-zinc-600">total</p>
        </Card>
        <Card className="flex-shrink-0 w-28 p-3 text-center">
          <p className="text-xl font-bold text-blue-400">{stats.totalCustomers}</p>
          <p className="text-xs text-zinc-500">customers</p>
          <p className="text-xs text-zinc-600">total</p>
        </Card>
      </div>

      {/* Next Job */}
      {upcomingJobs ? (
        <Card className="p-4 border-orange-500/30">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="progress">UP NEXT</Badge>
            <span className="text-lg font-semibold text-white">
              {upcomingJobs.scheduledAt 
                ? new Date(upcomingJobs.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                : 'Scheduled'}
            </span>
          </div>
          <h3 className="text-white font-medium">{upcomingJobs.title}</h3>
          <p className="text-zinc-400 text-sm mb-1">{upcomingJobs.customer?.name}</p>
          {upcomingJobs.customer?.address && (
            <p className="text-zinc-500 text-sm flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {upcomingJobs.customer.address}
            </p>
          )}
          <div className="flex gap-2 mt-4">
            <Link href={`/app/jobs/${upcomingJobs.id}`} className="flex-1">
              <Button variant="secondary" size="sm" className="w-full">
                <MapPin className="w-4 h-4" />
                Details
              </Button>
            </Link>
            <Link href={`/app/jobs/${upcomingJobs.id}`} className="flex-1">
              <Button variant="primary" size="sm" className="w-full">
                Start Job
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="p-4 text-center">
          <p className="text-zinc-400">No upcoming jobs scheduled</p>
          <Link href="/app/jobs/new">
            <Button variant="primary" size="sm" className="mt-3">
              <Plus className="w-4 h-4" />
              Add Job
            </Button>
          </Link>
        </Card>
      )}

      {/* Recent Jobs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Recent Jobs</h2>
          <Link href="/app/jobs" className="text-sm text-orange-400 hover:text-orange-300">
            View all
          </Link>
        </div>
        <div className="space-y-2">
          {recentJobs.length > 0 ? recentJobs.map((job: any) => (
            <Link key={job.id} href={`/app/jobs/${job.id}`}>
              <Card className="p-3 flex items-center gap-3 hover:border-[#3F3F46] transition-colors cursor-pointer">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#1C1C1F] flex items-center justify-center">
                  {job.status === 'COMPLETED' ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : job.status === 'IN_PROGRESS' ? (
                    <Clock className="w-5 h-5 text-orange-400" />
                  ) : (
                    <Calendar className="w-5 h-5 text-zinc-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{job.title}</p>
                  <p className="text-zinc-500 text-xs">{job.customer?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-400">
                    {job.scheduledAt 
                      ? new Date(job.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : '-'}
                  </p>
                  {job.price && (
                    <p className="text-sm font-medium text-white">${job.price}</p>
                  )}
                </div>
              </Card>
            </Link>
          )) : (
            <Card className="p-6 text-center">
              <p className="text-zinc-500">No jobs yet</p>
              <Link href="/app/jobs/new">
                <Button variant="primary" size="sm" className="mt-3">
                  Create your first job
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                href={action.href}
                className="flex flex-col items-center gap-2 p-3 bg-[#141416] border border-[#27272A] rounded-xl hover:border-[#3F3F46] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[#1C1C1F] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-orange-400" />
                </div>
                <span className="text-xs text-zinc-400">{action.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
