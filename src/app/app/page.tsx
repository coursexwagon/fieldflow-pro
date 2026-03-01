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

// Time-based greeting with industrial feel
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
            className="w-10 h-10 border-2 border-[#00c2ff] border-t-transparent mx-auto mb-4"
          />
          <p className="text-[#666] text-sm font-mono tracking-wider">LOADING...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 lg:p-8 text-center">
        <div className="w-14 h-14 bg-[#ff4444]/10 border border-[#ff4444]/30 mx-auto mb-4 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-[#ff4444]" />
        </div>
        <p className="font-mono text-sm text-[#888] mb-4">SYSTEM ERROR</p>
        <p className="text-[#666] mb-6">Something went wrong loading your dispatch.</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-[#00c2ff] font-mono text-sm tracking-wider hover:underline"
        >
          RETRY
        </button>
      </div>
    );
  }

  const { stats, recentJobs, upcomingJobs } = data;
  const userName = session?.user?.name?.split(' ')[0] || 'Operator';
  const todayJobs = recentJobs?.filter((job: any) => {
    const jobDate = new Date(job.scheduledAt).toDateString();
    return jobDate === new Date().toDateString();
  }) || [];

  // Calculate today's earnings from completed jobs
  const todayEarnings = todayJobs
    .filter((job: any) => job.status === 'COMPLETED')
    .reduce((sum: number, job: any) => sum + (job.price || 0), 0);

  const hasJobs = todayJobs.length > 0 || upcomingJobs;

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header - Industrial style */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <div className="flex items-center gap-2 text-[#666] mb-1">
            <TimeIcon className="w-4 h-4" />
            <span className="text-xs font-mono tracking-wider uppercase">{formatDate(new Date())}</span>
          </div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold">
            {timeContext.greeting}, <span className="text-[#00c2ff]">{userName}</span>
          </h1>
          <p className="text-[#666] text-sm mt-1">{timeContext.sub}</p>
        </div>
        
        <div className="text-right">
          <p className="text-2xl lg:text-3xl font-mono font-bold tabular-nums text-[#00c2ff]">
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
        {/* Card with industrial borders */}
        <div className="bg-[#222] border border-[#333] relative">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00c2ff] via-[#00c2ff]/50 to-transparent" />
          
          <div className="p-5 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#00c2ff] animate-pulse" />
                <p className="text-[#666] text-xs font-mono tracking-widest uppercase">Today&apos;s Run</p>
              </div>
              <span className="text-[#666] text-xs font-mono">
                {todayJobs.length} {todayJobs.length === 1 ? 'job' : 'jobs'}
              </span>
            </div>
            
            {hasJobs ? (
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-display text-4xl lg:text-5xl font-bold tabular-nums">
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
                    <p className="text-[10px] text-[#666] font-mono uppercase">Done</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-mono font-bold text-[#00c2ff]">
                      {todayJobs.filter((j: any) => j.status === 'IN_PROGRESS').length}
                    </p>
                    <p className="text-[10px] text-[#666] font-mono uppercase">Active</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-mono font-bold text-[#666]">
                      {todayJobs.filter((j: any) => j.status === 'PENDING').length}
                    </p>
                    <p className="text-[10px] text-[#666] font-mono uppercase">Queue</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-[#666] font-mono text-sm">No jobs scheduled</p>
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
          <h2 className="font-mono text-xs tracking-widest text-[#666] uppercase">Today&apos;s Timeline</h2>
          <Link href="/app/schedule" className="text-[#00c2ff] text-xs font-mono flex items-center gap-1 hover:underline">
            WEEK VIEW
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
                        ? 'bg-[#00c2ff] border-[#00c2ff] animate-pulse' 
                        : 'bg-[#1a1a1a] border-[#444]'
                  }`}
                />
                
                <Link href={`/app/jobs/${job.id}`}>
                  <div className="group flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-mono text-xs text-[#666]">{formatTime(job.scheduledAt)}</p>
                        {job.status === 'COMPLETED' && (
                          <span className="text-[10px] font-mono text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5">DONE</span>
                        )}
                        {job.status === 'IN_PROGRESS' && (
                          <span className="text-[10px] font-mono text-[#00c2ff] bg-[#00c2ff]/10 px-2 py-0.5 flex items-center gap-1">
                            <Timer className="w-3 h-3" /> ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="font-medium group-hover:text-[#00c2ff] transition-colors">{job.title}</p>
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
                        <p className="font-mono text-lg text-[#00c2ff]">${job.price}</p>
                      )}
                      <ChevronRight className="w-4 h-4 text-[#444] group-hover:text-[#00c2ff] transition-colors mt-2" />
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
            <p className="font-display font-semibold text-lg mb-1">Territory is clear</p>
            <p className="text-[#666] text-sm mb-6">Time for maintenance or coffee?</p>
            <Link href="/app/jobs/new">
              <button className="inline-flex items-center gap-2 bg-[#00c2ff] text-[#1a1a1a] px-6 py-3 font-mono text-sm font-semibold tracking-wider hover:bg-[#00a8e0] transition-colors">
                <Plus className="w-4 h-4" />
                // ADD JOB
              </button>
            </Link>
          </div>
        )}
      </motion.div>

      {/* Up Next Card - If there's an upcoming job */}
      {upcomingJobs && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          {/* Cyan glow border */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-[#00c2ff]/50 via-[#00c2ff] to-[#00c2ff]/50 opacity-50" />
          <div className="relative bg-[#1a1a1a] border border-[#00c2ff]/30 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#00c2ff] animate-pulse" />
                <span className="text-[#00c2ff] text-xs font-mono tracking-widest">UP NEXT</span>
              </div>
              <span className="font-mono text-sm text-[#666]">{formatTime(upcomingJobs.scheduledAt)}</span>
            </div>
            
            <p className="font-display font-semibold text-xl mb-1">{upcomingJobs.title}</p>
            {upcomingJobs.customer?.name && (
              <p className="text-[#888]">{upcomingJobs.customer.name}</p>
            )}
            {upcomingJobs.customer?.address && (
              <p className="text-[#666] text-sm flex items-center gap-1 mt-2">
                <MapPin className="w-4 h-4" />
                {upcomingJobs.customer.address}
              </p>
            )}
            
            <div className="flex gap-3 mt-5">
              <Link href={`/app/jobs/${upcomingJobs.id}`} className="flex-1">
                <button className="w-full border border-[#444] py-3 text-sm font-mono tracking-wider hover:border-[#00c2ff] hover:text-[#00c2ff] transition-colors">
                  DETAILS
                </button>
              </Link>
              <Link href={`/app/jobs/${upcomingJobs.id}`} className="flex-1">
                <button className="w-full bg-[#00c2ff] text-[#1a1a1a] py-3 text-sm font-mono font-semibold tracking-wider hover:bg-[#00a8e0] transition-colors">
                  START JOB
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Jobs - Compact List */}
      {recentJobs && recentJobs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-mono text-xs tracking-widest text-[#666] uppercase">Recent Activity</h2>
            <Link href="/app/jobs" className="text-[#666] text-xs font-mono hover:text-[#00c2ff]">
              VIEW ALL
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
                  job.status === 'IN_PROGRESS' ? 'bg-[#00c2ff]' :
                  'bg-[#444]'
                }`} />
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-[#00c2ff] transition-colors">{job.title}</p>
                  <p className="text-xs text-[#666]">{job.customer?.name || 'No customer'}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  {job.price && (
                    <p className="font-mono text-sm text-[#00c2ff]">${job.price}</p>
                  )}
                  <ChevronRight className="w-4 h-4 text-[#444] group-hover:text-[#00c2ff] transition-colors" />
                </div>
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
          className="fixed inset-0 z-50 bg-[#1a1a1a]/98 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full text-center"
          >
            <div className="w-20 h-20 bg-[#00c2ff] mx-auto mb-8 flex items-center justify-center shadow-lg shadow-[#00c2ff]/30">
              <Wrench className="w-10 h-10 text-[#1a1a1a]" />
            </div>
            
            <h2 className="font-display text-3xl font-bold mb-3">
              Your truck is <span className="text-[#00c2ff]">running</span>.
            </h2>
            <p className="text-[#888] mb-8 text-lg">
              This is your dispatch view. Jobs, money, and your timeline—all in one place.
            </p>
            
            <button
              onClick={() => setShowWelcome(false)}
              className="bg-[#00c2ff] text-[#1a1a1a] px-10 py-4 font-mono font-semibold tracking-wider hover:bg-[#00a8e0] transition-colors"
            >
              LET&apos;S GO
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
