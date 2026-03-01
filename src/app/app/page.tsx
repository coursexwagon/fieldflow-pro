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
} from 'lucide-react';
import { useDashboard } from '@/hooks/useApi';

// Time-based suggestions
function getTimeContext() {
  const hour = new Date().getHours();
  if (hour < 6) return { greeting: 'Early start', icon: Coffee };
  if (hour < 9) return { greeting: 'Morning run', icon: Truck };
  if (hour < 12) return { greeting: 'Mid-morning', icon: Wrench };
  if (hour < 14) return { greeting: 'Midday', icon: Clock };
  if (hour < 17) return { greeting: 'Afternoon push', icon: Wrench };
  if (hour < 20) return { greeting: 'Evening wrap', icon: Clock };
  return { greeting: 'Late shift', icon: Coffee };
}

// Format time as simple HH:MM
function formatTime(date: string | Date | null): string {
  if (!date) return '--:--';
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data, isLoading, error } = useDashboard();
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
            className="w-8 h-8 border-2 border-[#ffb800] border-t-transparent mx-auto mb-3"
          />
          <p className="text-[#666] text-sm font-mono">Loading your day...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center">
        <div className="w-12 h-12 bg-[#ff4444]/10 border border-[#ff4444]/30 mx-auto mb-4 flex items-center justify-center">
          <span className="text-[#ff4444]">!</span>
        </div>
        <p className="text-[#888] mb-4">Something went wrong loading your day.</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-[#ffb800] text-sm font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  const { stats, recentJobs, upcomingJobs } = data;
  const userName = session?.user?.name?.split(' ')[0] || 'there';

  // Build a timeline from jobs
  const timeline: Array<{ time: string; label: string; type: 'system' | 'job'; status?: string; id?: string; customer?: string }> = [
    { time: '6:00 AM', label: 'Load truck', type: 'system' },
    ...((recentJobs || []).slice(0, 3).map((job: any) => ({
      time: formatTime(job.scheduledAt),
      label: job.title,
      customer: job.customer?.name,
      id: job.id,
      type: 'job' as const,
      status: job.status,
    }))),
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header - Simple, time-based */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <p className="text-[#888] text-sm font-mono">{timeContext.greeting}</p>
          <h1 className="font-display text-2xl font-bold">{userName}</h1>
        </div>
        <div className="flex items-center gap-2 text-[#888]">
          <TimeIcon className="w-4 h-4" />
          <span className="text-sm font-mono">
            {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </span>
        </div>
      </motion.div>

      {/* Today's Run - Money-focused, goal-oriented */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#2d2d2d] border border-[#404040] p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-[#888] text-xs font-mono">TODAY'S RUN</p>
          <span className="text-[#888] text-xs font-mono">{stats.todaysJobs} jobs</span>
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <p className="font-display text-3xl font-bold tabular-nums">
              ${stats.totalRevenue?.toLocaleString() || 0}
            </p>
            <p className="text-[#666] text-xs mt-1">total earned</p>
          </div>
          
          {/* Progress bar toward a goal */}
          <div className="text-right">
            <div className="w-24 h-2 bg-[#404040] mb-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((stats.totalRevenue || 0) / 10, 100)}%` }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="h-full bg-[#ffb800]"
              />
            </div>
            <p className="text-[#666] text-xs font-mono">$1000 goal</p>
          </div>
        </div>
      </motion.div>

      {/* Timeline - The core of the dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold">Your Day</h2>
          <Link href="/app/schedule" className="text-[#ffb800] text-xs font-mono flex items-center gap-1">
            Week view
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-0">
          {timeline.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="relative pl-6 pb-6 border-l-2 border-[#404040] last:border-l-[#ffb800] last:pb-0"
            >
              {/* Timeline dot */}
              <div className={`absolute left-[-5px] top-1 w-2 h-2 ${
                item.type === 'system' ? 'bg-[#404040]' :
                item.status === 'COMPLETED' ? 'bg-[#22c55e]' :
                item.status === 'IN_PROGRESS' ? 'bg-[#ffb800]' :
                'bg-[#666]'
              }`} />
              
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-xs text-[#888]">{item.time}</p>
                  {item.type === 'job' && item.id ? (
                    <Link href={`/app/jobs/${item.id}`}>
                      <p className="font-medium hover:text-[#ffb800] transition-colors">{item.label}</p>
                      {item.customer && (
                        <p className="text-sm text-[#666]">{item.customer}</p>
                      )}
                    </Link>
                  ) : (
                    <p className="text-[#888] text-sm">{item.label}</p>
                  )}
                </div>
                
                {item.type === 'job' && item.id && (
                  <Link href={`/app/jobs/${item.id}`} className="text-[#666] hover:text-[#ffb800]">
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Up Next - If there's an upcoming job */}
      {upcomingJobs && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#ffb800]/5 border border-[#ffb800]/30 p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#ffb800] text-xs font-mono">UP NEXT</span>
            <span className="font-mono text-sm">{formatTime(upcomingJobs.scheduledAt)}</span>
          </div>
          <p className="font-display font-semibold text-lg">{upcomingJobs.title}</p>
          <p className="text-[#888] text-sm">{upcomingJobs.customer?.name}</p>
          {upcomingJobs.customer?.address && (
            <p className="text-[#666] text-xs flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {upcomingJobs.customer.address}
            </p>
          )}
          <div className="flex gap-2 mt-4">
            <Link href={`/app/jobs/${upcomingJobs.id}`} className="flex-1">
              <button className="w-full border border-[#404040] py-2 text-sm font-medium hover:border-[#ffb800] transition-colors">
                Details
              </button>
            </Link>
            <Link href={`/app/jobs/${upcomingJobs.id}`} className="flex-1">
              <button className="w-full bg-[#ffb800] text-[#1a1a1a] py-2 text-sm font-display font-semibold">
                Start
              </button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!upcomingJobs && recentJobs?.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-[#2d2d2d] border border-[#404040] mx-auto mb-4 flex items-center justify-center">
            <Coffee className="w-8 h-8 text-[#666]" />
          </div>
          <p className="font-display font-semibold mb-1">Territory is clear</p>
          <p className="text-[#666] text-sm mb-4">Time for maintenance or coffee?</p>
          <Link href="/app/jobs/new">
            <button className="inline-flex items-center gap-2 bg-[#ffb800] text-[#1a1a1a] px-4 py-2 font-display font-semibold text-sm">
              <Plus className="w-4 h-4" />
              Add a job
            </button>
          </Link>
        </motion.div>
      )}

      {/* Recent Jobs List - Compact */}
      {recentJobs && recentJobs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold">Recent</h2>
            <Link href="/app/jobs" className="text-[#888] text-xs font-mono">
              View all
            </Link>
          </div>
          
          <div className="space-y-1">
            {recentJobs.slice(0, 5).map((job: any) => (
              <Link
                key={job.id}
                href={`/app/jobs/${job.id}`}
                className="flex items-center gap-3 p-3 bg-[#2d2d2d] border border-[#404040] hover:border-[#505050] transition-colors"
              >
                <div className={`w-2 h-2 ${
                  job.status === 'COMPLETED' ? 'bg-[#22c55e]' :
                  job.status === 'IN_PROGRESS' ? 'bg-[#ffb800]' :
                  'bg-[#666]'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{job.title}</p>
                  <p className="text-xs text-[#666]">{job.customer?.name}</p>
                </div>
                {job.price && (
                  <p className="font-mono text-sm text-[#ffb800]">${job.price}</p>
                )}
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Welcome Modal for first-time users */}
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#1a1a1a]/95 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-sm w-full text-center"
          >
            <div className="w-16 h-16 bg-[#ffb800] mx-auto mb-6 flex items-center justify-center">
              <Wrench className="w-8 h-8 text-[#1a1a1a]" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">Your truck is running.</h2>
            <p className="text-[#888] mb-6">
              This is your day view. Jobs, money, and your timeline—all in one place.
            </p>
            <button
              onClick={() => setShowWelcome(false)}
              className="bg-[#ffb800] text-[#1a1a1a] px-8 py-3 font-display font-semibold"
            >
              Let&apos;s go
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
