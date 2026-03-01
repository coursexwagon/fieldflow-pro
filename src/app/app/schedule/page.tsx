'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Calendar, List, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useJobs } from '@/hooks/useApi';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function SchedulePage() {
  const router = useRouter();
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const { data, isLoading, error } = useJobs();
  const jobs = data?.jobs || [];

  // Generate calendar days
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startPadding = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const getJobsForDay = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return jobs.filter((job: any) => {
      if (!job.scheduledAt) return false;
      const jobDate = new Date(job.scheduledAt);
      const jobDateStr = `${jobDate.getFullYear()}-${String(jobDate.getMonth() + 1).padStart(2, '0')}-${String(jobDate.getDate()).padStart(2, '0')}`;
      return jobDateStr === dateStr;
    });
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1).toLowerCase();
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'scheduled';
      case 'IN_PROGRESS': return 'progress';
      case 'COMPLETED': return 'completed';
      default: return 'default';
    }
  };

  // Get today's date for highlighting
  const today = new Date();
  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === currentMonth.getMonth() && 
           today.getFullYear() === currentMonth.getFullYear();
  };

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
      </div>
    );
  }

  // Handle auth error - redirect to login
  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load schedule';
    
    // Check if it's an auth error
    if (errorMessage.includes('Unauthorized') || errorMessage.includes('Not authenticated')) {
      router.push('/login');
      return null;
    }
    
    return (
      <div className="p-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <p className="text-red-400 mb-4">{errorMessage}</p>
        <Button variant="primary" size="sm" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Schedule</h1>
        <div className="flex bg-[#141416] rounded-lg p-1">
          <button
            onClick={() => setView('calendar')}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm transition-colors',
              view === 'calendar' ? 'bg-[#27272A] text-white' : 'text-zinc-500'
            )}
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm transition-colors',
              view === 'list' ? 'bg-[#27272A] text-white' : 'text-zinc-500'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {view === 'calendar' ? (
        <>
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
              className="p-2 text-zinc-400 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-white">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              className="p-2 text-zinc-400 hover:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <Card className="p-3">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {days.map((day) => (
                <div key={day} className="text-center text-xs text-zinc-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
              {/* Padding for start of month */}
              {Array.from({ length: startPadding }).map((_, i) => (
                <div key={`pad-${i}`} className="aspect-square" />
              ))}

              {/* Actual days */}
              {Array.from({ length: totalDays }).map((_, i) => {
                const day = i + 1;
                const dayJobs = getJobsForDay(day);
                const todayClass = isToday(day);

                return (
                  <button
                    key={day}
                    className={cn(
                      'aspect-square rounded-lg flex flex-col items-center justify-center text-sm relative',
                      todayClass ? 'bg-orange-500/20 text-orange-400' : 'text-zinc-400 hover:bg-[#27272A]'
                    )}
                  >
                    <span>{day}</span>
                    {dayJobs.length > 0 && (
                      <div className="flex gap-0.5 mt-1">
                        {dayJobs.slice(0, 3).map((_: any, idx: number) => (
                          <div key={idx} className="w-1 h-1 rounded-full bg-orange-400" />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Today's Jobs */}
          <div>
            <h3 className="text-sm font-medium text-zinc-400 mb-2">
              {today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </h3>
            <div className="space-y-2">
              {getJobsForDay(today.getDate()).length > 0 ? (
                getJobsForDay(today.getDate()).map((job: any) => (
                  <Link key={job.id} href={`/app/jobs/${job.id}`}>
                    <Card className="p-3 flex items-center gap-3 hover:border-[#3F3F46] transition-colors cursor-pointer">
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{job.title}</p>
                        <p className="text-zinc-500 text-xs">{job.customer?.name}</p>
                      </div>
                      <span className="text-zinc-400 text-sm">
                        {job.scheduledAt 
                          ? new Date(job.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                          : '-'}
                      </span>
                    </Card>
                  </Link>
                ))
              ) : (
                <Card className="p-6 text-center">
                  <p className="text-zinc-500 mb-3">No jobs scheduled for today</p>
                  <Link href="/app/jobs/new">
                    <Button variant="primary" size="sm">
                      Schedule a Job
                    </Button>
                  </Link>
                </Card>
              )}
            </div>
          </div>
        </>
      ) : (
        /* List View */
        <div className="space-y-4">
          {jobs.filter((job: any) => job.scheduledAt).length > 0 ? (
            jobs
              .filter((job: any) => job.scheduledAt)
              .sort((a: any, b: any) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
              .slice(0, 10)
              .map((job: any) => (
                <Link key={job.id} href={`/app/jobs/${job.id}`}>
                  <Card className="p-3 flex items-center gap-3 hover:border-[#3F3F46] transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-[#1C1C1F] flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{job.title}</p>
                      <p className="text-zinc-500 text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.customer?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-zinc-400">
                        {job.scheduledAt 
                          ? new Date(job.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : '-'}
                      </p>
                      <Badge variant={getBadgeVariant(job.status) as any} className="text-xs">
                        {formatStatus(job.status)}
                      </Badge>
                    </div>
                  </Card>
                </Link>
              ))
          ) : (
            <Card className="p-8 text-center">
              <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-500 mb-4">No scheduled jobs</p>
              <Link href="/app/jobs/new">
                <Button variant="primary" size="sm">
                  Schedule your first job
                </Button>
              </Link>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
