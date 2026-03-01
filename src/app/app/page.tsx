'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
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
  TrendingUp,
  Zap,
  ArrowRight,
  Sparkles,
  Briefcase,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/hooks/useApi';
import { DashboardTutorial } from '@/components/tutorial/TutorialOverlay';

const quickActions = [
  { name: 'New Job', icon: Plus, href: '/app/jobs/new', color: 'bg-orange-500/20 text-orange-400' },
  { name: 'Invoice', icon: FileText, href: '/app/invoices/new', color: 'bg-blue-500/20 text-blue-400' },
  { name: 'Customer', icon: Users, href: '/app/customers/new', color: 'bg-green-500/20 text-green-400' },
  { name: 'Schedule', icon: Calendar, href: '/app/schedule', color: 'bg-purple-500/20 text-purple-400' },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data, isLoading, error } = useDashboard();
  const [showTutorial, setShowTutorial] = useState(false);

  const userName = session?.user?.name?.split(' ')[0] || 'there';

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('fieldflow_tutorial_seen');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-8 h-8 text-orange-400" />
        </motion.div>
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-4 space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-1">
        <p className="text-zinc-500 text-sm">{getGreeting()}</p>
        <h1 className="text-2xl font-bold text-white">{userName}</h1>
        <p className="text-zinc-500 text-sm">{dateStr}</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <Card className="flex-shrink-0 w-32 p-4 bg-gradient-to-br from-orange-500/20 to-orange-500/5 border-orange-500/20">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/20 mb-3">
            <Calendar className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.todaysJobs}</p>
          <p className="text-xs text-zinc-400">jobs today</p>
          <p className="text-xs text-orange-400 mt-1">{stats.completedJobsToday} done</p>
        </Card>

        <Card className="flex-shrink-0 w-32 p-4 bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/20">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-500/20 mb-3">
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">${stats.totalRevenue?.toLocaleString() || 0}</p>
          <p className="text-xs text-zinc-400">earned</p>
          <p className="text-xs text-green-400 mt-1">total</p>
        </Card>

        <Card className="flex-shrink-0 w-32 p-4 bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/20">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/20 mb-3">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalCustomers}</p>
          <p className="text-xs text-zinc-400">customers</p>
          <p className="text-xs text-blue-400 mt-1">total</p>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={action.href}
                  className="flex flex-col items-center gap-2 p-4 bg-[#141416] border border-[#27272A] rounded-2xl hover:border-[#3F3F46] transition-all hover:scale-105"
                >
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-zinc-400">{action.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Next Job */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Up Next</h2>
        </div>
        {upcomingJobs ? (
          <Card className="p-4 border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl" />

            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="progress" className="text-xs gap-1">
                  <Zap className="w-3 h-3" />
                  UP NEXT
                </Badge>
                <span className="text-lg font-semibold text-white">
                  {upcomingJobs.scheduledAt
                    ? new Date(upcomingJobs.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                    : 'Scheduled'}
                </span>
              </div>
              <h3 className="text-white font-medium text-lg">{upcomingJobs.title}</h3>
              <p className="text-zinc-400 text-sm mb-1">{upcomingJobs.customer?.name}</p>
              {upcomingJobs.customer?.address && (
                <p className="text-zinc-500 text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {upcomingJobs.customer.address}
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <Link href={`/app/jobs/${upcomingJobs.id}`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full gap-2">
                    <MapPin className="w-4 h-4" />
                    Details
                  </Button>
                </Link>
                <Link href={`/app/jobs/${upcomingJobs.id}`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full gap-2">
                    Start Job
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-500/10 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-orange-400" />
            </div>
            <p className="text-zinc-400 mb-4">No upcoming jobs scheduled</p>
            <Link href="/app/jobs/new">
              <Button variant="primary" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Job
              </Button>
            </Link>
          </Card>
        )}
      </motion.div>

      {/* Recent Jobs */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Recent Jobs</h2>
          <Link href="/app/jobs" className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1">
            View all
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {recentJobs.length > 0 ? recentJobs.map((job: any, i: number) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/app/jobs/${job.id}`}>
                <Card className="p-4 flex items-center gap-3 hover:border-orange-500/30 transition-colors cursor-pointer">
                  <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
                    job.status === 'COMPLETED' ? 'bg-green-500/20' :
                    job.status === 'IN_PROGRESS' ? 'bg-orange-500/20' : 'bg-zinc-800'
                  }`}>
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
                      <p className="text-sm font-medium text-green-400">${job.price}</p>
                    )}
                  </div>
                </Card>
              </Link>
            </motion.div>
          )) : (
            <Card className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-zinc-500 mb-4">No jobs yet</p>
              <Link href="/app/jobs/new">
                <Button variant="primary" size="sm" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Create your first job
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </motion.div>

      {/* Tutorial */}
      <DashboardTutorial onComplete={() => setShowTutorial(false)} />
    </motion.div>
  );
}
