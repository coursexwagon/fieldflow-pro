'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Calendar, Clock, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCustomers, useCreateJob } from '@/hooks/useApi';

export default function NewJobPage() {
  const router = useRouter();
  const { data: customersData, isLoading: customersLoading } = useCustomers();
  const customers = customersData?.customers || [];
  const createJob = useCreateJob();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customerId: '',
    scheduledAt: '',
    duration: '',
    price: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.customerId) {
      setError('Title and customer are required');
      return;
    }

    try {
      const result = await createJob.mutateAsync({
        title: formData.title,
        description: formData.description,
        customerId: formData.customerId,
        scheduledAt: formData.scheduledAt || null,
        duration: formData.duration || null,
        price: formData.price || null,
      });

      router.push(`/app/jobs/${result.job.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create job');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0A0A0B]/90 backdrop-blur-md border-b border-[#27272A]">
        <div className="h-full px-4 flex items-center justify-between">
          <Link href="/app/jobs" className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Cancel</span>
          </Link>
          <h1 className="text-sm font-medium text-white">New Job</h1>
          <div className="w-16" />
        </div>
      </header>

      {/* Form */}
      <main className="pt-16 p-4 space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card className="p-4 space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Job Title *</label>
              <Input
                name="title"
                placeholder="e.g., HVAC Repair, Furnace Installation"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Customer *</label>
              {customersLoading ? (
                <div className="flex items-center justify-center py-3">
                  <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
                </div>
              ) : customers.length === 0 ? (
                <div className="text-center py-3">
                  <p className="text-zinc-500 text-sm mb-2">No customers yet</p>
                  <Link href="/app/customers/new">
                    <Button variant="secondary" size="sm">Add Customer</Button>
                  </Link>
                </div>
              ) : (
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  className="w-full bg-[#1C1C1F] border border-[#27272A] rounded-lg px-4 py-3 text-white appearance-none cursor-pointer focus:border-orange-500 focus:outline-none"
                  required
                >
                  <option value="">Select customer</option>
                  {customers.map((customer: any) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Description</label>
              <textarea
                name="description"
                placeholder="Job details..."
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-[#1C1C1F] border border-[#27272A] rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:border-orange-500 focus:outline-none resize-none"
              />
            </div>
          </Card>

          <Card className="p-4 space-y-4">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Schedule</span>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Date & Time</label>
              <Input
                type="datetime-local"
                name="scheduledAt"
                value={formData.scheduledAt}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Duration (min)
                </label>
                <Input
                  type="number"
                  name="duration"
                  placeholder="60"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  <DollarSign className="w-3 h-3 inline mr-1" />
                  Price
                </label>
                <Input
                  type="number"
                  step="0.01"
                  name="price"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="fixed bottom-16 left-0 right-0 p-4 bg-[#0A0A0B] border-t border-[#27272A]">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={createJob.isPending || !formData.title || !formData.customerId}
            >
              {createJob.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Create Job'
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
