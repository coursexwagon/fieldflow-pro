'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, User, Phone, MapPin, Building2, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateCustomer } from '@/hooks/useApi';

export default function NewCustomerPage() {
  const router = useRouter();
  const createCustomer = useCreateCustomer();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.phone || !formData.address) {
      setError('Name, phone, and address are required');
      return;
    }

    try {
      await createCustomer.mutateAsync(formData);
      router.push('/app/customers');
    } catch (err: any) {
      setError(err.message || 'Failed to create customer');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0A0A0B]/90 backdrop-blur-md border-b border-[#27272A]">
        <div className="h-full px-4 flex items-center justify-between">
          <Link href="/app/customers" className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Cancel</span>
          </Link>
          <h1 className="text-sm font-medium text-white">New Customer</h1>
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
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Contact Info</span>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Name *</label>
              <Input
                name="name"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  <Phone className="w-3 h-3 inline mr-1" />
                  Phone *
                </label>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="(555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Email</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </Card>

          <Card className="p-4 space-y-4">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Address</span>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Street Address *</label>
              <Input
                name="address"
                placeholder="123 Main St"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">City</label>
                <Input
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">State</label>
                <Input
                  name="state"
                  placeholder="ST"
                  value={formData.state}
                  onChange={handleChange}
                  maxLength={2}
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">ZIP</label>
                <Input
                  name="zip"
                  placeholder="00000"
                  value={formData.zip}
                  onChange={handleChange}
                />
              </div>
            </div>
          </Card>

          <Card className="p-4 space-y-4">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Notes</span>
            </div>

            <div>
              <textarea
                name="notes"
                placeholder="Any additional notes about this customer..."
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full bg-[#1C1C1F] border border-[#27272A] rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:border-orange-500 focus:outline-none resize-none"
              />
            </div>
          </Card>

          {/* Submit Button */}
          <div className="fixed bottom-16 left-0 right-0 p-4 bg-[#0A0A0B] border-t border-[#27272A]">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={createCustomer.isPending || !formData.name || !formData.phone || !formData.address}
            >
              {createCustomer.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Add Customer'
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
