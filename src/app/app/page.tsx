'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  Clock,
  MapPin,
  Plus,
  ChevronRight,
  Wrench,
  Coffee,
  Sun,
  Sunset,
  Moon,
  CheckCircle2,
  Timer,
  AlertCircle,
  Phone,
  Navigation,
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

// Job status colors
const statusColors = {
  COMPLETED: { bg: 'bg-[#10b981]', text: 'text-[#10b981]', border: 'border-[#10b981]', label: 'DONE' },
  IN_PROGRESS: { bg: 'bg-[#f59e0b]', text: 'text-[#f59e0b]', border: 'border-[#f59e0b]', label: 'ACTIVE' },
  SCHEDULED: { bg: 'bg-[#52525b]', text: 'text-[#a1a1aa]', border: 'border-[#3f3f46]', label: 'QUEUE' },
};

// Skeleton component for loading
function JobSkeleton() {
  return (
    <div className="bg-[#141414] border border-[#27272a] p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="skeleton h-4 w-16 rounded mb-2" />
          <div className="skeleton h-5 w-48 rounded mb-1" />
          <div className="skeleton h-4 w-32 rounded" />
        </div>
        <div className="skeleton h-6 w-16 rounded" />
      </div>
    </div>
  );
}

export default function DispatchPage() {
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

  // Loading state with skeletons
  if (isLoading) {
    return (
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* Header skeleton */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="skeleton h-4 w-32 rounded mb-2" />
            <div className="skeleton h-8 w-48 rounded" />
          </div>
          <div className="skeleton h-8 w-20 rounded" />
        </div>
        
        {/* Stats card skeleton */}
        <div className="skeleton h-32 w-full rounded" />
        
        {/* Job list skeleton */}
        <div className="space-y-2 mt-6">
          <div className="skeleton h-4 w-24 rounded mb-2" />
          {[1, 2, 3].map((i) => (
            <JobSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state with retry
  if (error || !data) {
    return (
      <div className="p-6 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-[#ef4444]/10 border border-[#ef4444]/30 mx-auto mb-6 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-[#ef4444]" />
        </div>
        <p className="text-lg font-semibold mb-2">Connection issue</p>
        <p className="text-[#71717a] text-sm mb-6">Couldn&apos;t load your dispatch data.</p>
        <button 
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 bg-[#f59e0b] text-[#0a0a0a] px-6 py-3 font-semibold hover:bg-[#d97706] transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 rotate-90" />
          Retry
        </button>
      </div>
    );
  }

  const { recentJobs, upcomingJobs } = data;
  const upcomingJob = upcomingJobs;
  const userName = session?.user?.name?.split(' ')[0] || 'Tech';
  const todayJobs = recentJobs?.filter((job: any) => {
    const jobDate = new Date(job.scheduledAt).toDateString();
    return jobDate === new Date().toDateString();
  }) || [];

  // Calculate today's earnings from completed jobs
  const todayEarnings = todayJobs
    .filter((job: any) => job.status === 'COMPLETED')
    .reduce((sum: number, job: any) => sum + (job.price || 0), 0);

  const hasJobs = todayJobs.length > 0;

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between pt-2"
      >
        <div>
          <div className="flex items-center gap-2 text-[#71717a] mb-1">
            <TimeIcon className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wide">{formatDate(new Date())}</span>
          </div>
          <h1 className="text-2xl font-bold">
            {timeContext.greeting}, <span className="text-[#f59e0b]">{userName}</span>
          </h1>
          <p className="text-[#71717a] text-sm">{timeContext.sub}</p>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-mono font-bold tabular-nums text-[#f59e0b]">
            {formatTime(new Date())}
          </p>
        </div>
      </motion.div>

      {/* Today's Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#141414] border border-[#27272a] p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#f59e0b]" />
            <p className="text-[#71717a] text-xs uppercase tracking-wide">Today</p>
          </div>
          <span className="text-[#71717a] text-xs">
            {todayJobs.length} {todayJobs.length === 1 ? 'job' : 'jobs'}
          </span>
        </div>
        
        {hasJobs ? (
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold tabular-nums">
                ${todayEarnings.toLocaleString()}
              </p>
              <p className="text-[#71717a] text-xs mt-1">collected</p>
            </div>
            
            {/* Quick stats */}
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-lg font-mono font-bold text-[#10b981]">
                  {todayJobs.filter((j: any) => j.status === 'COMPLETED').length}
                </p>
                <p className="text-[10px] text-[#71717a] uppercase">Done</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-mono font-bold text-[#f59e0b]">
                  {todayJobs.filter((j: any) => j.status === 'IN_PROGRESS').length}
                </p>
                <p className="text-[10px] text-[#71717a] uppercase">Active</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-mono font-bold text-[#a1a1aa]">
                  {todayJobs.filter((j: any) => j.status === 'SCHEDULED').length}
                </p>
                <p className="text-[10px] text-[#71717a] uppercase">Queue</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-[#71717a]">No jobs scheduled</p>
          </div>
        )}
      </motion.div>

      {/* Job List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xs tracking-wide text-[#71717a] uppercase mb-2">Schedule</h2>
        
        {hasJobs ? (
          <div className="space-y-2">
            {todayJobs.map((job: any, i: number) => {
              const status = statusColors[job.status as keyof typeof statusColors] || statusColors.SCHEDULED;
              
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={`/app/jobs/${job.id}`}
                    className="block bg-[#141414] border border-[#27272a] p-4 hover:border-[#3f3f46] transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      {/* Time */}
                      <div className="text-center min-w-[50px]">
                        <p className="text-sm font-mono text-[#a1a1aa]">{formatTime(job.scheduledAt)}</p>
                      </div>
                      
                      {/* Status indicator */}
                      <div className={`w-1 h-14 ${status.bg} flex-shrink-0`} />
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] ${status.text} font-medium uppercase`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="font-medium truncate">{job.title}</p>
                        {job.customer?.name && (
                          <p className="text-sm text-[#71717a] truncate">{job.customer.name}</p>
                        )}
                        {job.customer?.address && (
                          <p className="text-xs text-[#52525b] flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {job.customer.address}
                          </p>
                        )}
                      </div>
                      
                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        {job.price && (
                          <p className="font-mono text-lg text-[#f59e0b]">${job.price}</p>
                        )}
                        <ChevronRight className="w-5 h-5 text-[#3f3f46] mt-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-[#141414] border border-[#27272a] p-8 text-center">
            <div className="w-14 h-14 bg-[#1f1f1f] border border-[#27272a] mx-auto mb-4 flex items-center justify-center">
              <Coffee className="w-7 h-7 text-[#52525b]" />
            </div>
            <p className="font-semibold mb-1">Clear schedule</p>
            <p className="text-[#71717a] text-sm mb-6">No jobs for today</p>
            <Link 
              href="/app/jobs/new"
              className="inline-flex items-center gap-2 bg-[#f59e0b] text-[#0a0a0a] px-6 py-3 font-semibold hover:bg-[#d97706] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Job
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
          className="border-2 border-[#f59e0b] bg-[#141414] p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#f59e0b] animate-pulse" />
              <span className="text-[#f59e0b] text-xs uppercase tracking-wide font-medium">Up Next</span>
            </div>
            <span className="text-sm text-[#71717a]">{formatTime(upcomingJob.scheduledAt)}</span>
          </div>
          
          <p className="font-semibold text-lg mb-1">{upcomingJob.title}</p>
          {upcomingJob.customer?.name && (
            <p className="text-[#a1a1aa]">{upcomingJob.customer.name}</p>
          )}
          {upcomingJob.customer?.address && (
            <p className="text-[#71717a] text-sm flex items-center gap-1 mt-2">
              <MapPin className="w-4 h-4" />
              {upcomingJob.customer.address}
            </p>
          )}
          
          <div className="flex gap-2 mt-4">
            <a 
              href={`tel:${upcomingJob.customer?.phone}`}
              className="flex-1 flex items-center justify-center gap-2 border border-[#3f3f46] py-3 text-sm font-medium hover:border-[#f59e0b] hover:text-[#f59e0b] transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              Call
            </a>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(upcomingJob.customer?.address || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 border border-[#3f3f46] py-3 text-sm font-medium hover:border-[#f59e0b] hover:text-[#f59e0b] transition-colors cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              Navigate
            </a>
            <Link href={`/app/jobs/${upcomingJob.id}`} className="flex-1">
              <button className="w-full bg-[#f59e0b] text-[#0a0a0a] py-3 text-sm font-semibold hover:bg-[#d97706] transition-colors cursor-pointer">
                Start
              </button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Welcome Modal */}
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#0a0a0a]/98 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full text-center"
          >
            <div className="w-16 h-16 bg-[#f59e0b] mx-auto mb-6 flex items-center justify-center">
              <Wrench className="w-8 h-8 text-[#0a0a0a]" />
            </div>
            
            <h2 className="text-2xl font-bold mb-3">
              Your truck is <span className="text-[#f59e0b]">running</span>.
            </h2>
            <p className="text-[#a1a1aa] mb-8">
              This is your dispatch. Jobs, earnings, and timeline—all in one place.
            </p>
            
            <button
              onClick={() => setShowWelcome(false)}
              className="bg-[#f59e0b] text-[#0a0a0a] px-10 py-4 font-semibold hover:bg-[#d97706] transition-colors cursor-pointer"
            >
              Let&apos;s Go
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
