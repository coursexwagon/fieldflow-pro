'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  ChevronRight,
  Loader2,
  Wrench,
  Coffee,
  Truck,
  Sun,
  Sunset,
  Moon,
  CheckCircle2,
  Circle,
  Timer,
  AlertCircle,
} from 'lucide-react';
import { useDashboard } from '@/hooks/useApi';

// Time-based greeting
function getTimeContext() {
  const hour = new Date().getHours();
  if (hour < 6) return { greeting: 'Early shift', sub: 'The grind never stops', icon: Moon };
  if (hour < 9) return { greeting: 'Morning run', sub: 'Truck loaded and ready', icon: Sun };
  if (hour < 12) return { greeting: 'Mid-morning push', sub: 'Stay on schedule', icon: Wrench };
  if (hour < 14) return { greeting: 'Midday grind', sub: 'Halfway there', icon: Clock };
  if (hour < 17) return { greeting: 'Afternoon push', sub: 'Finish strong', icon: Wrench };
  if (hour < 20) return { greeting: 'Evening wrap', sub: 'Wrap up the day', icon: Sunset };
  return { greeting: 'Late shift', sub: 'One more for the road', icon: Moon };
}

// Format time as simple HH:MM AM/PM
function formatTime(date: string | Date | null): string {
  if (!date) return '--:--';
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// Format date
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data, isLoading, error, refetch } = useDashboard();
  const [showWelcome, setShowWelcome] = useState(false);

  const timeContext = getTimeContext();
  const TimeIcon = timeContext.icon;

  useEffect(() => {
    const seen = localStorage.getItem('fieldflow_seen');
    if (!seen) {
      setShowWelcome(true);
      localStorage.setItem('fieldflow_seen', 'true');
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 border-2 border-[#fbbf24] border-t-transparent mx-auto mb-4"
          />
          <p className="text-[#666] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 lg:p-8 text-center">
        <div className="w-14 h-14 bg-[#ef4444]/10 border border-[#ef4444]/30 mx-auto mb-4 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-[#ef4444]" />
        </div>
        <p className="text-sm text-[#888] mb-2">Something went wrong</p>
        <p className="text-[#666] mb-6">Couldn&apos;t load your dispatch data.</p>
        <button 
          onClick={() => refetch()}
          className="text-[#fbbf24] text-sm font-medium hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  const { stats, recentJobs, upcomingJobs } = data;
  const upcomingJob = upcomingJobs;
  const userName = session?.user?.name?.split(' ')[0] || 'Operator';
  const todayJobs = recentJobs?.filter((job: any) => {
    const jobDate = new Date(job.scheduledAt).toDateString();
    return jobDate === new Date().toDateString();
  }) || [];

  // Calculate today's earnings from completed jobs
  const todayEarnings = todayJobs
    .filter((job: any) => job.status === 'COMPLETED')
    .reduce((sum: number, job: any) => sum + (job.price || 0), 0);

  const hasJobs = todayJobs.length > 0 || upcomingJob;

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <div className="flex items-center gap-2 text-[#666] mb-1">
            <TimeIcon className="w-4 h-4" />
            <span className="text-xs uppercase">{formatDate(new Date())}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold">
            {timeContext.greeting}, <span className="text-[#fbbf24]">{userName}</span>
          </h1>
          <p className="text-[#666] text-sm mt-1">{timeContext.sub}</p>
        </div>
        
        <div className="text-right">
          <p className="text-2xl lg:text-3xl font-mono font-bold tabular-nums text-[#fbbf24]">
            {formatTime(new Date())}
          </p>
        </div>
      </motion.div>

      {/* Today's Run Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden"
      >
        <div className="bg-[#222] border border-[#333] relative">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#fbbf24] via-[#fbbf24]/50 to-transparent" />
          
          <div className="p-5 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#fbbf24] animate-pulse" />
                <p className="text-[#666] text-xs uppercase tracking-wide">Today&apos;s Run</p>
              </div>
              <span className="text-[#666] text-xs">
                {todayJobs.length} {todayJobs.length === 1 ? 'job' : 'jobs'}
              </span>
            </div>
            
            {hasJobs ? (
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl lg:text-5xl font-bold tabular-nums">
                    ${todayEarnings.toLocaleString()}
                  </p>
                  <p className="text-[#666] text-sm mt-1">collected today</p>
                </div>
                
                {/* Job status indicators */}
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-xl font-mono font-bold text-[#22c55e]">
                      {todayJobs.filter((j: any) => j.status === 'COMPLETED').length}
                    </p>
                    <p className="text-[10px] text-[#666] uppercase">Done</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-mono font-bold text-[#fbbf24]">
                      {todayJobs.filter((j: any) => j.status === 'IN_PROGRESS').length}
                    </p>
                    <p className="text-[10px] text-[#666] uppercase">Active</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-mono font-bold text-[#666]">
                      {todayJobs.filter((j: any) => j.status === 'SCHEDULED').length}
                    </p>
                    <p className="text-[10px] text-[#666] uppercase">Queue</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-[#666] text-sm">No jobs scheduled</p>
                <p className="text-[#444] text-xs mt-1">Territory is clear</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Timeline Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs tracking-wide text-[#666] uppercase">Today&apos;s Timeline</h2>
          <Link href="/app/schedule" className="text-[#fbbf24] text-xs flex items-center gap-1 hover:underline">
            Week View
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {hasJobs ? (
          <div className="space-y-0">
            {todayJobs.slice(0, 6).map((job: any, i: number) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="relative pl-8 pb-6 last:pb-0"
                style={{
                  borderLeft: '2px solid #333',
                }}
              >
                {/* Timeline dot */}
                <div 
                  className={`absolute left-[-7px] top-1 w-3 h-3 border-2 ${
                    job.status === 'COMPLETED' 
                      ? 'bg-[#22c55e] border-[#22c55e]' 
                      : job.status === 'IN_PROGRESS' 
                        ? 'bg-[#fbbf24] border-[#fbbf24] animate-pulse' 
                        : 'bg-[#1a1a1a] border-[#444]'
                  }`}
                />
                
                <Link href={`/app/jobs/${job.id}`}>
                  <div className="group flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs text-[#666]">{formatTime(job.scheduledAt)}</p>
                        {job.status === 'COMPLETED' && (
                          <span className="text-[10px] text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5">DONE</span>
                        )}
                        {job.status === 'IN_PROGRESS' && (
                          <span className="text-[10px] text-[#fbbf24] bg-[#fbbf24]/10 px-2 py-0.5 flex items-center gap-1">
                            <Timer className="w-3 h-3" /> ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="font-medium group-hover:text-[#fbbf24] transition-colors">{job.title}</p>
                      {job.customer?.name && (
                        <p className="text-sm text-[#666]">{job.customer.name}</p>
                      )}
                      {job.customer?.address && (
                        <p className="text-xs text-[#444] flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {job.customer.address}
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      {job.price && (
                        <p className="font-mono text-lg text-[#fbbf24]">${job.price}</p>
                      )}
                      <ChevronRight className="w-4 h-4 text-[#444] group-hover:text-[#fbbf24] transition-colors mt-2" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-[#222] border border-[#333] p-8 text-center">
            <div className="w-16 h-16 bg-[#2a2a2a] border border-[#333] mx-auto mb-4 flex items-center justify-center">
              <Coffee className="w-8 h-8 text-[#444]" />
            </div>
            <p className="font-semibold text-lg mb-1">Territory is clear</p>
            <p className="text-[#666] text-sm mb-6">Time for maintenance or coffee?</p>
            <Link href="/app/jobs/new">
              <button className="inline-flex items-center gap-2 bg-[#fbbf24] text-[#1a1a1a] px-6 py-3 text-sm font-semibold hover:bg-[#f59e0b] transition-colors">
                <Plus className="w-4 h-4" />
                Add Job
              </button>
            </Link>
          </div>
        )}
      </motion.div>

      {/* Up Next Card */}
      {upcomingJob && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <div className="absolute -inset-[1px] bg-gradient-to-r from-[#fbbf24]/50 via-[#fbbf24] to-[#fbbf24]/50 opacity-50" />
          <div className="relative bg-[#1a1a1a] border border-[#fbbf24]/30 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#fbbf24] animate-pulse" />
                <span className="text-[#fbbf24] text-xs uppercase tracking-wide">Up Next</span>
              </div>
              <span className="text-sm text-[#666]">{formatTime(upcomingJob.scheduledAt)}</span>
            </div>
            
            <p className="font-semibold text-xl mb-1">{upcomingJob.title}</p>
            {upcomingJob.customer?.name && (
              <p className="text-[#888]">{upcomingJob.customer.name}</p>
            )}
            {upcomingJob.customer?.address && (
              <p className="text-[#666] text-sm flex items-center gap-1 mt-2">
                <MapPin className="w-4 h-4" />
                {upcomingJob.customer.address}
              </p>
            )}
            
            <div className="flex gap-3 mt-5">
              <Link href={`/app/jobs/${upcomingJob.id}`} className="flex-1">
                <button className="w-full border border-[#444] py-3 text-sm font-medium hover:border-[#fbbf24] hover:text-[#fbbf24] transition-colors">
                  Details
                </button>
              </Link>
              <Link href={`/app/jobs/${upcomingJob.id}`} className="flex-1">
                <button className="w-full bg-[#fbbf24] text-[#1a1a1a] py-3 text-sm font-semibold hover:bg-[#f59e0b] transition-colors">
                  Start Job
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Jobs */}
      {recentJobs && recentJobs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs tracking-wide text-[#666] uppercase">Recent Activity</h2>
            <Link href="/app/jobs" className="text-[#666] text-xs hover:text-[#fbbf24]">
              View All
            </Link>
          </div>
          
          <div className="space-y-1">
            {recentJobs.slice(0, 4).map((job: any) => (
              <Link
                key={job.id}
                href={`/app/jobs/${job.id}`}
                className="flex items-center gap-4 p-4 bg-[#222] border border-[#333] hover:border-[#444] hover:bg-[#252525] transition-all group"
              >
                <div className={`w-3 h-3 ${
                  job.status === 'COMPLETED' ? 'bg-[#22c55e]' :
                  job.status === 'IN_PROGRESS' ? 'bg-[#fbbf24]' :
                  'bg-[#444]'
                }`} />
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-[#fbbf24] transition-colors">{job.title}</p>
                  <p className="text-xs text-[#666]">{job.customer?.name || 'No customer'}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  {job.price && (
                    <p className="font-mono text-sm text-[#fbbf24]">${job.price}</p>
                  )}
                  <ChevronRight className="w-4 h-4 text-[#444] group-hover:text-[#fbbf24] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Welcome Modal */}
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#1a1a1a]/98 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full text-center"
          >
            <div className="w-20 h-20 bg-[#fbbf24] mx-auto mb-8 flex items-center justify-center shadow-lg shadow-[#fbbf24]/30">
              <Wrench className="w-10 h-10 text-[#1a1a1a]" />
            </div>
            
            <h2 className="text-3xl font-bold mb-3">
              Your truck is <span className="text-[#fbbf24]">running</span>.
            </h2>
            <p className="text-[#888] mb-8 text-lg">
              This is your dispatch view. Jobs, money, and your timeline—all in one place.
            </p>
            
            <button
              onClick={() => setShowWelcome(false)}
              className="bg-[#fbbf24] text-[#1a1a1a] px-10 py-4 font-semibold hover:bg-[#f59e0b] transition-colors"
            >
              Let&apos;s Go
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
