'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  List, 
  Plus, 
  Loader2, 
  ChevronRight,
  Clock,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useJobs } from '@/hooks/useApi';

// Map pin positions (simulated - in real app would use coordinates)
const pinPositions = [
  { x: 20, y: 30 },
  { x: 45, y: 15 },
  { x: 70, y: 45 },
  { x: 35, y: 60 },
  { x: 60, y: 75 },
  { x: 80, y: 25 },
  { x: 15, y: 50 },
];

type ViewMode = 'map' | 'list';

export default function JobsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const { data, isLoading, error } = useJobs({});

  const jobs = data?.jobs || [];

  // Group jobs by status for visual indication
  const jobsByStatus = useMemo(() => {
    return {
      urgent: jobs.filter((j: any) => j.status === 'IN_PROGRESS'),
      pending: jobs.filter((j: any) => j.status === 'SCHEDULED'),
      done: jobs.filter((j: any) => j.status === 'COMPLETED'),
    };
  }, [jobs]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return '#ffb800';
      case 'COMPLETED': return '#22c55e';
      case 'CANCELLED': return '#ff4444';
      default: return '#666666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return <Clock className="w-3 h-3" />;
      case 'COMPLETED': return <Check className="w-3 h-3" />;
      case 'CANCELLED': return <AlertTriangle className="w-3 h-3" />;
      default: return null;
    }
  };

  const formatTime = (date: string | Date | null) => {
    if (!date) return '--:--';
    return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-[#ffb800] border-t-transparent mx-auto mb-3"
          />
          <p className="text-[#666] text-sm font-mono">Loading territory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-[#ff4444] mb-2">Failed to load jobs</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-[#ffb800] text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      {/* Header - Minimal */}
      <div className="p-4 flex items-center justify-between border-b border-[#404040]">
        <h1 className="font-display font-bold">Territory</h1>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex border border-[#404040]">
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 ${viewMode === 'map' ? 'bg-[#ffb800] text-[#1a1a1a]' : 'text-[#666]'}`}
            >
              <MapPin className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-[#ffb800] text-[#1a1a1a]' : 'text-[#666]'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="flex-1 relative overflow-hidden">
          {/* Simulated map background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#222] to-[#1a1a1a]">
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(#ffb800 1px, transparent 1px), linear-gradient(90deg, #ffb800 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }}
            />
            
            {/* Roads - abstract lines */}
            <svg className="absolute inset-0 w-full h-full opacity-10">
              <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#404040" strokeWidth="2" />
              <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#404040" strokeWidth="2" />
              <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#404040" strokeWidth="2" />
              <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#404040" strokeWidth="2" />
              <line x1="10%" y1="0" x2="90%" y2="100%" stroke="#404040" strokeWidth="1" />
              <line x1="90%" y1="0" x2="10%" y2="100%" stroke="#404040" strokeWidth="1" />
            </svg>
          </div>

          {/* Job Pins */}
          {jobs.length > 0 ? (
            jobs.slice(0, 7).map((job: any, i: number) => {
              const pos = pinPositions[i % pinPositions.length];
              const isSelected = selectedJob === job.id;
              
              return (
                <motion.button
                  key={job.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedJob(isSelected ? null : job.id)}
                  className="absolute transform -translate-x-1/2 -translate-y-full"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  {/* Pin */}
                  <div className="relative">
                    <div 
                      className={`w-8 h-8 flex items-center justify-center transition-transform ${
                        isSelected ? 'scale-125' : 'hover:scale-110'
                      }`}
                      style={{ color: getStatusColor(job.status) }}
                    >
                      <MapPin className="w-8 h-8 fill-current" />
                    </div>
                    
                    {/* Status indicator */}
                    <div 
                      className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[#1a1a1a]"
                    >
                      {getStatusIcon(job.status)}
                    </div>
                  </div>
                </motion.button>
              );
            })
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-[#2d2d2d] border border-[#404040] mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-[#666]" />
                </div>
                <p className="font-display font-semibold mb-1">Territory is clear</p>
                <p className="text-[#666] text-sm mb-4">No active jobs in your area</p>
                <Link href="/app/jobs/new">
                  <button className="inline-flex items-center gap-2 bg-[#ffb800] text-[#1a1a1a] px-4 py-2 font-display font-semibold text-sm">
                    <Plus className="w-4 h-4" />
                    Add job
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Selected Job Card */}
          <AnimatePresence>
            {selectedJob && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="absolute bottom-4 left-4 right-4"
              >
                {(() => {
                  const job = jobs.find((j: any) => j.id === selectedJob);
                  if (!job) return null;
                  
                  return (
                    <Link href={`/app/jobs/${job.id}`}>
                      <div className="bg-[#2d2d2d] border border-[#404040] p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2"
                              style={{ backgroundColor: getStatusColor(job.status) }}
                            />
                            <p className="font-mono text-xs text-[#888]">
                              {formatTime(job.scheduledAt)}
                            </p>
                          </div>
                          <span 
                            className="text-xs font-mono"
                            style={{ color: getStatusColor(job.status) }}
                          >
                            {job.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="font-display font-semibold">{job.title}</p>
                        <p className="text-[#888] text-sm">{job.customer?.name}</p>
                        {job.customer?.address && (
                          <p className="text-[#666] text-xs flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {job.customer.address}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#404040]">
                          {job.price && (
                            <p className="font-mono text-lg text-[#ffb800]">${job.price}</p>
                          )}
                          <ChevronRight className="w-5 h-5 text-[#666]" />
                        </div>
                      </div>
                    </Link>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend */}
          <div className="absolute top-4 left-4 bg-[#1a1a1a]/90 border border-[#404040] p-2 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[#ffb800]" />
                In progress
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[#22c55e]" />
                Done
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[#666]" />
                Scheduled
              </span>
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {jobs.length > 0 ? (
            jobs.map((job: any, i: number) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link href={`/app/jobs/${job.id}`}>
                  <div className="flex items-center gap-3 p-3 bg-[#2d2d2d] border border-[#404040] hover:border-[#505050] transition-colors">
                    <div 
                      className="w-2 h-2 flex-shrink-0"
                      style={{ backgroundColor: getStatusColor(job.status) }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{job.title}</p>
                      <p className="text-xs text-[#666]">{job.customer?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-[#888]">{formatTime(job.scheduledAt)}</p>
                      {job.price && (
                        <p className="font-mono text-sm text-[#ffb800]">${job.price}</p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#666] flex-shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-[#666] mb-4">No jobs in territory</p>
              <Link href="/app/jobs/new">
                <button className="inline-flex items-center gap-2 bg-[#ffb800] text-[#1a1a1a] px-4 py-2 font-display font-semibold text-sm">
                  <Plus className="w-4 h-4" />
                  Add job
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
