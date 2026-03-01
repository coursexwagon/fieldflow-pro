'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, Plus, Trash2, FileText, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCustomers, useJobs, useCreateInvoice } from '@/hooks/useApi';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

function NewInvoiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedJobId = searchParams.get('jobId');
  const preselectedCustomerId = searchParams.get('customerId');
  
  const { data: customersData, isLoading: customersLoading } = useCustomers();
  const { data: jobsData } = useJobs();
  const createInvoice = useCreateInvoice();

  const customers = customersData?.customers || [];
  const jobs = jobsData?.jobs || [];

  const [formData, setFormData] = useState({
    customerId: preselectedCustomerId || '',
    jobId: preselectedJobId || '',
    dueDate: '',
    notes: '',
  });
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, unitPrice: 0 }
  ]);
  const [error, setError] = useState('');

  // Get the preselected job to auto-fill items
  const selectedJob = jobs.find((j: any) => j.id === formData.jobId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.customerId) {
      setError('Customer is required');
      return;
    }

    const validItems = items.filter(item => item.description && item.unitPrice > 0);
    if (validItems.length === 0) {
      setError('At least one item with description and price is required');
      return;
    }

    try {
      await createInvoice.mutateAsync({
        customerId: formData.customerId,
        jobId: formData.jobId || null,
        items: validItems,
        notes: formData.notes,
        dueDate: formData.dueDate || null,
      });
      router.push('/app/invoices');
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0A0A0B]/90 backdrop-blur-md border-b border-[#27272A]">
        <div className="h-full px-4 flex items-center justify-between">
          <Link href="/app/invoices" className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Cancel</span>
          </Link>
          <h1 className="text-sm font-medium text-white">New Invoice</h1>
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
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Details</span>
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
              <label className="block text-sm text-zinc-400 mb-2">Link to Job (optional)</label>
              <select
                name="jobId"
                value={formData.jobId}
                onChange={handleChange}
                className="w-full bg-[#1C1C1F] border border-[#27272A] rounded-lg px-4 py-3 text-white appearance-none cursor-pointer focus:border-orange-500 focus:outline-none"
              >
                <option value="">No linked job</option>
                {jobs
                  .filter((j: any) => !formData.customerId || j.customerId === formData.customerId)
                  .map((job: any) => (
                    <option key={job.id} value={job.id}>
                      {job.title} - {job.customer?.name}
                    </option>
                  ))}
              </select>
              {selectedJob && selectedJob.price && (
                <p className="text-xs text-zinc-500 mt-1">
                  Job price: ${selectedJob.price}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Due Date</label>
              <Input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </Card>

          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-400">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">Line Items</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addItem}
                className="text-orange-400"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="space-y-2 pb-4 border-b border-[#27272A] last:border-0">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="text-red-400"
                    disabled={items.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                    min="1"
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={item.unitPrice || ''}
                    onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="flex items-center justify-between pt-4 border-t border-[#27272A]">
              <span className="text-zinc-400">Total</span>
              <span className="text-xl font-bold text-white">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
          </Card>

          <Card className="p-4 space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Notes</label>
              <textarea
                name="notes"
                placeholder="Additional notes or payment instructions..."
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
              disabled={createInvoice.isPending || !formData.customerId}
            >
              {createInvoice.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Create Invoice'
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
    </div>
  );
}

export default function NewInvoicePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewInvoiceForm />
    </Suspense>
  );
}
