'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin,
  Sun,
  Cloud,
  Loader2,
} from 'lucide-react';
import { useJobs } from '@/hooks/useApi';

// Time slots for the day
const TIME_SLOTS = [
  { time: '6:00', label: 'Early' },
  { time: '7:00', label: '' },
  { time: '8:00', label: 'Morning' },
  { time: '9:00', label: '' },
  { time: '10:00', label: '' },
  { time: '11:00', label: '' },
  { time: '12:00', label: 'Midday' },
  { time: '13:00', label: '' },
  { time: '14:00', label: 'Afternoon' },
  { time: '15:00', label: '' },
  { time: '16:00', label: '' },
  { time: '17:00', label: 'Evening' },
  { time: '18:00', label: '' },
];

// Get week dates
function getWeekDates(offset: number = 0) {
  const today = new Date();
  const currentDay = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay + 1 + offset * 7); // Monday
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    days.push({
      date,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: date.getDate(),
      isToday: date.toDateString() === today.toDateString(),
    });
  }
  return days;
}

export default function SchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0); // 0 = today's index in week
  const { data, isLoading, error } = useJobs();

  const jobs = data?.jobs || [];
  const weekDays = getWeekDates(weekOffset);
  const activeDay = weekDays[selectedDay];

  // Get jobs for the selected day
  const dayJobs = useMemo(() => {
    if (!activeDay) return [];
    return jobs.filter((job: any) => {
      if (!job.scheduledAt) return false;
      const jobDate = new Date(job.scheduledAt);
      return jobDate.toDateString() === activeDay.date.toDateString();
    }).sort((a: any, b: any) => 
      new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );
  }, [jobs, activeDay]);

  // Calculate drive times between jobs
  const getDriveTime = (index: number) => {
    if (index === 0) return null;
    // Simulated drive time (in real app, would use maps API)
    const driveTimes = ['12 min', '8 min', '15 min', '5 min', '20 min'];
    return driveTimes[index % driveTimes.length];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-[#ffb800]" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      {/* Week Navigation */}
      <div className="p-4 border-b border-[#404040]">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            className="p-2 text-[#666] hover:text-[#f5f5f5]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="font-mono text-sm text-[#888]">
            {weekOffset === 0 ? 'This Week' : weekOffset === -1 ? 'Last Week' : weekOffset === 1 ? 'Next Week' : `${weekOffset} weeks`}
          </h2>
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="p-2 text-[#666] hover:text-[#f5f5f5]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Week Days - Horizontal */}
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
          {weekDays.map((day, i) => (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              className={`flex-shrink-0 flex flex-col items-center py-2 px-3 transition-colors ${
                selectedDay === i 
                  ? 'bg-[#ffb800] text-[#1a1a1a]' 
                  : day.isToday 
                    ? 'bg-[#ffb800]/10 text-[#ffb800] border border-[#ffb800]/30'
                    : 'text-[#888] hover:text-[#f5f5f5]'
              }`}
            >
              <span className="text-xs font-mono">{day.dayName}</span>
              <span className="font-display font-bold text-lg">{day.dayNum}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Day View */}
      <div className="flex-1 overflow-y-auto">
        {/* Day Header */}
        <div className="p-4 border-b border-[#404040] flex items-center justify-between">
          <div>
            <p className="font-mono text-xs text-[#888]">
              {activeDay?.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
            {activeDay?.isToday && (
              <p className="text-[#ffb800] text-xs font-mono mt-1">Today</p>
            )}
          </div>
          <div className="flex items-center gap-2 text-[#666]">
            <Sun className="w-4 h-4" />
            <span className="text-xs font-mono">72°F</span>
          </div>
        </div>

        {/* Time Slots */}
        <div className="relative">
          {TIME_SLOTS.map((slot, i) => {
            // Find any job at this time
            const slotJob = dayJobs.find((job: any) => {
              if (!job.scheduledAt) return false;
              const jobHour = new Date(job.scheduledAt).getHours();
              return jobHour === parseInt(slot.time.split(':')[0]);
            });

            return (
              <div
                key={slot.time}
                className="flex border-b border-[#404040]/50 min-h-[48px]"
              >
                {/* Time Label */}
                <div className="w-16 flex-shrink-0 p-2 text-right">
                  <span className="text-xs font-mono text-[#666]">{slot.time}</span>
                  {slot.label && (
                    <p className="text-[10px] text-[#444]">{slot.label}</p>
                  )}
                </div>

                {/* Slot Content */}
                <div className="flex-1 border-l border-[#404040]/50 p-1">
                  {slotJob ? (
                    <Link href={`/app/jobs/${slotJob.id}`}>
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="h-full p-2 bg-[#ffb800]/10 border-l-2 border-[#ffb800] hover:bg-[#ffb800]/20 transition-colors cursor-pointer"
                      >
                        <p className="text-sm font-medium truncate">{slotJob.title}</p>
                        <p className="text-xs text-[#888]">{slotJob.customer?.name}</p>
                      </motion.div>
                    </Link>
                  ) : (
                    <button className="w-full h-full flex items-center justify-center text-[#404040] hover:text-[#666] hover:bg-[#2d2d2d] transition-colors">
                      <Plus className="w-4 h-4 opacity-0 hover:opacity-100" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {dayJobs.length === 0 && (
          <div className="absolute inset-0 top-24 flex items-center justify-center pointer-events-none">
            <div className="text-center p-6 bg-[#1a1a1a]/80 backdrop-blur pointer-events-auto">
              <p className="font-display font-semibold mb-1">Your week is yours</p>
              <p className="text-[#666] text-sm mb-4">Guard it well.</p>
              <Link href="/app/jobs/new">
                <button className="inline-flex items-center gap-2 bg-[#ffb800] text-[#1a1a1a] px-4 py-2 font-display font-semibold text-sm pointer-events-auto">
                  <Plus className="w-4 h-4" />
                  Schedule a job
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Jobs Summary */}
        {dayJobs.length > 0 && (
          <div className="p-4 border-t border-[#404040]">
            <p className="font-mono text-xs text-[#888] mb-2">
              {dayJobs.length} job{dayJobs.length !== 1 ? 's' : ''} today
            </p>
            <div className="space-y-2">
              {dayJobs.map((job: any, i: number) => {
                const driveTime = getDriveTime(i);
                return (
                  <React.Fragment key={job.id}>
                    {driveTime && (
                      <div className="flex items-center gap-2 py-1 text-[#666] text-xs font-mono">
                        <div className="w-16 text-right">↓</div>
                        <div className="flex-1 flex items-center gap-2 border-l border-dashed border-[#404040] pl-2">
                          <MapPin className="w-3 h-3" />
                          {driveTime} drive
                        </div>
                      </div>
                    )}
                    <Link href={`/app/jobs/${job.id}`}>
                      <div className="flex items-center gap-2 p-2 bg-[#2d2d2d] border border-[#404040] hover:border-[#505050] transition-colors">
                        <div className="w-16 text-right">
                          <span className="text-xs font-mono text-[#ffb800]">
                            {new Date(job.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex-1 border-l border-[#404040] pl-3">
                          <p className="text-sm font-medium">{job.title}</p>
                          <p className="text-xs text-[#666]">{job.customer?.name}</p>
                        </div>
                        {job.price && (
                          <p className="font-mono text-sm text-[#ffb800]">${job.price}</p>
                        )}
                      </div>
                    </Link>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
