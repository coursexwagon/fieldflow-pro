import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gklaggowcdlbkvknwmeg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbGFnZ293Y2RsYmt2a253bWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMDgzMjEsImV4cCI6MjA4Nzg4NDMyMX0.ec8PUraCzoRhMxrSQc78QQEDc6rmgIx1UsCqx6M9QSQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  businessName?: string;
  tradeType?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  description?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  scheduledAt?: string;
  duration?: number;
  price?: number;
  completedAt?: string;
  userId: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: string;
  url: string;
  publicId: string;
  caption?: string;
  jobId: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'CANCELLED';
  total: number;
  notes?: string;
  dueDate?: string;
  paidAt?: string;
  userId: string;
  customerId: string;
  jobId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  invoiceId: string;
  createdAt: string;
}
