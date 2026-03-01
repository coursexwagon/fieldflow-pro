'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Phone,
  MapPin,
  MessageCircle,
  Camera,
  Check,
  Clock,
  DollarSign,
  Calendar,
  Loader2,
  Trash2,
  MoreVertical,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useJob, useUpdateJob, useDeleteJob } from '@/hooks/useApi';

type JobStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  
  const { data, isLoading, error } = useJob(jobId);
  const updateJob = useUpdateJob(jobId);
  const deleteJob = useDeleteJob();

  const job = data?.job;
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'scheduled';
      case 'IN_PROGRESS': return 'progress';
      case 'COMPLETED': return 'completed';
      default: return 'default';
    }
  };

  const handleStatusChange = async (newStatus: JobStatus) => {
    await updateJob.mutateAsync({ status: newStatus });
  };

  const handleDelete = async () => {
    try {
      await deleteJob.mutateAsync(jobId);
      router.push('/app/jobs');
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-white">
        <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0A0A0B]/90 backdrop-blur-md border-b border-[#27272A]">
          <div className="h-full px-4 flex items-center">
            <Link href="/app/jobs" className="flex items-center gap-2 text-zinc-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </Link>
          </div>
        </header>
        <main className="pt-20 p-4 text-center">
          <p className="text-red-400 mb-4">Failed to load job</p>
          <Link href="/app/jobs">
            <Button variant="secondary" size="sm">Back to Jobs</Button>
          </Link>
        </main>
      </div>
    );
  }

  const status = job.status as JobStatus;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0A0A0B]/90 backdrop-blur-md border-b border-[#27272A]">
        <div className="h-full px-4 flex items-center justify-between">
          <Link href="/app/jobs" className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </Link>
          <h1 className="text-sm font-medium text-white">Job Details</h1>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <Card className="w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Delete Job?</h2>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-zinc-400 text-sm mb-6">
              This will permanently delete this job and all associated photos. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleDelete}
                disabled={deleteJob.isPending}
              >
                {deleteJob.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-16 p-4 space-y-4">
        {/* Customer Card */}
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-12 h-12 flex-shrink-0">
              <AvatarFallback className="bg-orange-500/20 text-orange-400">
                {job.customer?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium">{job.customer?.name}</p>
              {job.customer?.phone && (
                <a
                  href={`tel:${job.customer.phone}`}
                  className="flex items-center gap-1.5 text-zinc-400 text-sm mt-1 hover:text-orange-400 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {job.customer.phone}
                </a>
              )}
              {job.customer?.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(job.customer.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-zinc-400 text-sm mt-1 hover:text-orange-400 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {job.customer.address}
                </a>
              )}
            </div>
          </div>
        </Card>

        {/* Job Info */}
        <Card className="p-4">
          <h2 className="text-white font-medium mb-3">Job Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-zinc-500 text-xs mb-1">Service</p>
              <p className="text-white text-sm">{job.title}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs mb-1">Price</p>
              <p className="text-orange-400 font-semibold">{job.price ? `$${job.price}` : '-'}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs mb-1">Scheduled</p>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <p className="text-white text-sm">
                  {job.scheduledAt 
                    ? new Date(job.scheduledAt).toLocaleString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })
                    : 'Not scheduled'}
                </p>
              </div>
            </div>
            <div>
              <p className="text-zinc-500 text-xs mb-1">Duration</p>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <p className="text-white text-sm">{job.duration ? `${job.duration} min` : '-'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Description */}
        {job.description && (
          <Card className="p-4">
            <h2 className="text-white font-medium mb-2">Description</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">{job.description}</p>
          </Card>
        )}

        {/* Photos */}
        <Card className="p-4">
          <h2 className="text-white font-medium mb-3">Photos ({job.photos?.length || 0})</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {job.photos?.map((photo: any) => (
              <div
                key={photo.id}
                className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-[#1C1C1F] border border-[#27272A]"
              >
                <img src={photo.url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            <button className="flex-shrink-0 w-24 h-24 rounded-lg border-2 border-dashed border-[#27272A] flex flex-col items-center justify-center gap-1 hover:border-orange-500/50 transition-colors">
              {isUploading ? (
                <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />
              ) : (
                <>
                  <Camera className="w-5 h-5 text-zinc-500" />
                  <span className="text-xs text-zinc-500">Add</span>
                </>
              )}
            </button>
          </div>
        </Card>

        {/* Invoice */}
        {job.invoice && (
          <Link href={`/app/invoices`}>
            <Card className="p-4 border-green-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{job.invoice.invoiceNumber}</p>
                  <p className="text-zinc-500 text-sm">${job.invoice.total} - {job.invoice.status}</p>
                </div>
                <Badge variant={job.invoice.status === 'PAID' ? 'completed' : 'default'}>
                  {job.invoice.status}
                </Badge>
              </div>
            </Card>
          </Link>
        )}
      </main>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-[#0A0A0B] border-t border-[#27272A]">
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1">
            <Phone className="w-4 h-4" />
            Call
          </Button>
          {status === 'SCHEDULED' && (
            <Button 
              variant="primary" 
              className="flex-1" 
              onClick={() => handleStatusChange('IN_PROGRESS')}
              disabled={updateJob.isPending}
            >
              {updateJob.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start Job'}
            </Button>
          )}
          {status === 'IN_PROGRESS' && (
            <Button 
              variant="primary" 
              className="flex-1 bg-green-600 hover:bg-green-700" 
              onClick={() => handleStatusChange('COMPLETED')}
              disabled={updateJob.isPending}
            >
              {updateJob.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                  <Check className="w-4 h-4" />
                  Complete
                </>
              )}
            </Button>
          )}
          {status === 'COMPLETED' && !job.invoice && (
            <Link href={`/app/invoices/new?jobId=${jobId}&customerId=${job.customerId}`} className="flex-1">
              <Button variant="primary" className="w-full">
                <DollarSign className="w-4 h-4" />
                Create Invoice
              </Button>
            </Link>
          )}
          {status === 'COMPLETED' && job.invoice && (
            <Link href={`/app/invoices`} className="flex-1">
              <Button variant="secondary" className="w-full">
                View Invoice
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
