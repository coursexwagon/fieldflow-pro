import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gklaggowcdlbkvknwmeg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbGFnZ293Y2RsYmt2a253bWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMDgzMjEsImV4cCI6MjA4Nzg4NDMyMX0.ec8PUraCzoRhMxrSQc78QQEDc6rmgIx1UsCqx6M9QSQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  businessName?: string | null;
  tradeType?: string | null;
  avatar?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  address: string;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  notes?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  scheduledAt?: string | null;
  duration?: number | null;
  price?: number | null;
  completedAt?: string | null;
  userId: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: string;
  url: string;
  publicId: string;
  caption?: string | null;
  jobId: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  total: number;
  notes?: string | null;
  dueDate?: string | null;
  paidAt?: string | null;
  userId: string;
  customerId: string;
  jobId?: string | null;
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

// Helper to transform dates from strings to Date objects for frontend compatibility
const transformDates = <T extends Record<string, unknown>>(data: T): T => {
  const result = { ...data };
  for (const key of Object.keys(result)) {
    if (key.endsWith('At') && typeof result[key] === 'string') {
      (result as Record<string, unknown>)[key] = new Date(result[key] as string);
    }
  }
  return result;
};

// Database client that mimics Prisma API using Supabase
export const db = {
  user: {
    async create({ data }: { data: Partial<User> }) {
      const { data: result, error } = await supabase
        .from('users')
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return transformDates(result as User);
    },
    async findUnique({ where, select }: { where: { id?: string; email?: string }; select?: Record<string, boolean> }) {
      let query = supabase.from('users').select(select ? Object.keys(select).join(',') : '*');
      if (where.id) {
        query = query.eq('id', where.id);
      } else if (where.email) {
        query = query.eq('email', where.email);
      } else {
        return null;
      }
      const { data, error } = await query.single();
      if (error && error.code !== 'PGRST116') throw error;
      return data ? transformDates(data as User) : null;
    },
    async findFirst({ where }: { where: Record<string, unknown> }) {
      let query = supabase.from('users').select('*');
      for (const [key, value] of Object.entries(where)) {
        query = query.eq(key, value);
      }
      const { data, error } = await query.limit(1).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data ? transformDates(data as User) : null;
    },
    async findMany({ where, skip, take }: { where?: Record<string, unknown>; skip?: number; take?: number } = {}) {
      let query = supabase.from('users').select('*');
      if (where) {
        for (const [key, value] of Object.entries(where)) {
          if (value !== undefined) {
            query = query.eq(key, value);
          }
        }
      }
      if (skip) query = query.range(skip, skip + (take || 10) - 1);
      if (take && !skip) query = query.limit(take);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map((d: User) => transformDates(d));
    },
    async update({ where, data }: { where: { id: string }; data: Partial<User> }) {
      const { data: result, error } = await supabase
        .from('users')
        .update({ ...data, updatedAt: new Date().toISOString() })
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformDates(result as User);
    },
    async delete({ where }: { where: { id: string } }) {
      const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformDates(data as User);
    },
    async count({ where }: { where?: Record<string, unknown> } = {}) {
      let query = supabase.from('users').select('*', { count: 'exact', head: true });
      if (where) {
        for (const [key, value] of Object.entries(where)) {
          if (value !== undefined) {
            query = query.eq(key, value);
          }
        }
      }
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
  },

  customer: {
    async create({ data }: { data: Partial<Customer> }) {
      const { data: result, error } = await supabase
        .from('customers')
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return transformDates(result as Customer);
    },
    async findUnique({ where }: { where: { id: string } }) {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', where.id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data ? transformDates(data as Customer) : null;
    },
    async findFirst({ where, include }: { where: Record<string, unknown>; include?: Record<string, unknown> }) {
      let query = supabase.from('customers').select('*');
      for (const [key, value] of Object.entries(where)) {
        if (value !== undefined) {
          query = query.eq(key, value);
        }
      }
      const { data, error } = await query.limit(1).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;
      
      const customer = transformDates(data as Customer);
      
      if (include) {
        const result: Record<string, unknown> = { ...customer };
        
        if ('jobs' in include) {
          const { data: jobs } = await supabase
            .from('jobs')
            .select('*')
            .eq('customerId', customer.id)
            .order('createdAt', { ascending: false })
            .limit(10);
          result.jobs = (jobs || []).map((j: Job) => transformDates(j));
        }
        
        if ('invoices' in include) {
          const { data: invoices } = await supabase
            .from('invoices')
            .select('*')
            .eq('customerId', customer.id)
            .order('createdAt', { ascending: false })
            .limit(10);
          result.invoices = (invoices || []).map((i: Invoice) => transformDates(i));
        }
        
        if ('_count' in include) {
          const countConfig = (include._count as Record<string, unknown>)?.select as Record<string, boolean>;
          result._count = {};
          if (countConfig?.jobs) {
            const { count } = await supabase
              .from('jobs')
              .select('*', { count: 'exact', head: true })
              .eq('customerId', customer.id);
            (result._count as Record<string, number>).jobs = count || 0;
          }
          if (countConfig?.invoices) {
            const { count } = await supabase
              .from('invoices')
              .select('*', { count: 'exact', head: true })
              .eq('customerId', customer.id);
            (result._count as Record<string, number>).invoices = count || 0;
          }
        }
        
        return result;
      }
      
      return customer;
    },
    async findMany({ where, skip, take }: { where?: Record<string, unknown>; skip?: number; take?: number } = {}) {
      let query = supabase.from('customers').select('*');
      if (where) {
        for (const [key, value] of Object.entries(where)) {
          if (value !== undefined) {
            query = query.eq(key, value);
          }
        }
      }
      if (skip) query = query.range(skip, skip + (take || 10) - 1);
      if (take && !skip) query = query.limit(take);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map((d: Customer) => transformDates(d));
    },
    async update({ where, data }: { where: { id: string }; data: Partial<Customer> }) {
      const { data: result, error } = await supabase
        .from('customers')
        .update({ ...data, updatedAt: new Date().toISOString() })
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformDates(result as Customer);
    },
    async delete({ where }: { where: { id: string } }) {
      const { data, error } = await supabase
        .from('customers')
        .delete()
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformDates(data as Customer);
    },
    async count({ where }: { where?: Record<string, unknown> } = {}) {
      let query = supabase.from('customers').select('*', { count: 'exact', head: true });
      if (where) {
        for (const [key, value] of Object.entries(where)) {
          if (value !== undefined) {
            query = query.eq(key, value);
          }
        }
      }
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
  },

  job: {
    async create({ data }: { data: Partial<Job> }) {
      const insertData: Record<string, unknown> = { ...data };
      if (data.scheduledAt instanceof Date) {
        insertData.scheduledAt = data.scheduledAt.toISOString();
      }
      if (data.completedAt instanceof Date) {
        insertData.completedAt = data.completedAt.toISOString();
      }
      const { data: result, error } = await supabase
        .from('jobs')
        .insert(insertData)
        .select()
        .single();
      if (error) throw error;
      return transformDates(result as Job);
    },
    async findUnique({ where, include }: { where: { id: string }; include?: Record<string, unknown> }) {
      let selectFields = '*';
      if (include?.customer) {
        selectFields = '*, customers(*)';
      }
      if (include?.photos) {
        selectFields = '*, customers(*), photos(*)';
      }
      const { data, error } = await supabase
        .from('jobs')
        .select(selectFields)
        .eq('id', where.id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;
      
      const job = transformDates(data as unknown as Job);
      const result: Record<string, unknown> = { ...job };
      
      if (include?.customer) {
        const customerData = (data as unknown as Record<string, unknown>).customers;
        if (customerData) {
          result.customer = transformDates(customerData as Customer);
        }
      }
      if (include?.photos) {
        const photosData = (data as unknown as Record<string, unknown>).photos;
        if (photosData && Array.isArray(photosData)) {
          result.photos = photosData.map((p: Photo) => transformDates(p));
        }
      }
      return result;
    },
    async findFirst({ where, include }: { where: Record<string, unknown>; include?: Record<string, unknown> }) {
      let selectFields = '*';
      if (include?.customer) {
        selectFields = '*, customers(*)';
      }
      let query = supabase.from('jobs').select(selectFields);
      for (const [key, value] of Object.entries(where)) {
        if (value !== undefined) {
          query = query.eq(key, value);
        }
      }
      const { data, error } = await query.limit(1).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;
      
      const job = transformDates(data as unknown as Job);
      if (include?.customer) {
        const customerData = (data as unknown as Record<string, unknown>).customers;
        if (customerData) {
          return { ...job, customer: transformDates(customerData as Customer) };
        }
      }
      return job;
    },
    async findMany({ where, skip, take, include }: { where?: Record<string, unknown>; skip?: number; take?: number; include?: Record<string, unknown> } = {}) {
      let selectFields = '*';
      if (include?.customer) {
        selectFields = '*, customers(*)';
      }
      let query = supabase.from('jobs').select(selectFields);
      if (where) {
        for (const [key, value] of Object.entries(where)) {
          if (value !== undefined && value !== null) {
            if (key === 'status' && Array.isArray(value)) {
              query = query.in(key, value);
            } else {
              query = query.eq(key, value);
            }
          }
        }
      }
      if (skip) query = query.range(skip, skip + (take || 10) - 1);
      if (take && !skip) query = query.limit(take);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map((item: unknown) => {
        const jobData = item as Record<string, unknown>;
        const job = transformDates(jobData as unknown as Job);
        if (include?.customer && jobData.customers) {
          return { ...job, customer: transformDates(jobData.customers as Customer) };
        }
        return job;
      });
    },
    async update({ where, data }: { where: { id: string }; data: Partial<Job> }) {
      const updateData: Record<string, unknown> = { ...data, updatedAt: new Date().toISOString() };
      if (data.scheduledAt instanceof Date) {
        updateData.scheduledAt = data.scheduledAt.toISOString();
      }
      if (data.completedAt instanceof Date) {
        updateData.completedAt = data.completedAt.toISOString();
      }
      const { data: result, error } = await supabase
        .from('jobs')
        .update(updateData)
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformDates(result as Job);
    },
    async delete({ where }: { where: { id: string } }) {
      const { data, error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformDates(data as Job);
    },
    async count({ where }: { where?: Record<string, unknown> } = {}) {
      let query = supabase.from('jobs').select('*', { count: 'exact', head: true });
      if (where) {
        for (const [key, value] of Object.entries(where)) {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        }
      }
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
  },

  photo: {
    async create({ data }: { data: Partial<Photo> }) {
      const { data: result, error } = await supabase
        .from('photos')
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return transformDates(result as Photo);
    },
    async findMany({ where }: { where?: Record<string, unknown> } = {}) {
      let query = supabase.from('photos').select('*');
      if (where) {
        for (const [key, value] of Object.entries(where)) {
          if (value !== undefined) {
            query = query.eq(key, value);
          }
        }
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map((d: Photo) => transformDates(d));
    },
    async delete({ where }: { where: { id: string } }) {
      const { data, error } = await supabase
        .from('photos')
        .delete()
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformDates(data as Photo);
    },
    async deleteMany({ where }: { where: { jobId: string } }) {
      const { data, error } = await supabase
        .from('photos')
        .delete()
        .eq('jobId', where.jobId)
        .select();
      if (error) throw error;
      return (data || []).map((d: Photo) => transformDates(d));
    },
  },

  invoice: {
    async create({ data }: { data: Partial<Invoice> & { items?: Partial<InvoiceItem>[] } }) {
      const { items, ...invoiceData } = data;
      const insertData: Record<string, unknown> = { ...invoiceData };
      if (data.dueDate instanceof Date) {
        insertData.dueDate = data.dueDate.toISOString();
      }
      if (data.paidAt instanceof Date) {
        insertData.paidAt = data.paidAt.toISOString();
      }
      const { data: result, error } = await supabase
        .from('invoices')
        .insert(insertData)
        .select()
        .single();
      if (error) throw error;
      
      const invoice = transformDates(result as Invoice);
      
      // Create invoice items if provided
      if (items && items.length > 0) {
        const itemsWithInvoiceId = items.map(item => ({
          ...item,
          invoiceId: invoice.id,
        }));
        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(itemsWithInvoiceId);
        if (itemsError) throw itemsError;
      }
      
      return invoice;
    },
    async findUnique({ where, include }: { where: { id: string }; include?: Record<string, unknown> }) {
      let selectFields = '*';
      if (include?.customer) {
        selectFields = '*, customers(*)';
      }
      if (include?.items) {
        selectFields = '*, customers(*), invoice_items(*)';
      }
      const { data, error } = await supabase
        .from('invoices')
        .select(selectFields)
        .eq('id', where.id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;
      
      const invoiceData = data as unknown as Record<string, unknown>;
      const invoice = transformDates(invoiceData as unknown as Invoice);
      const result: Record<string, unknown> = { ...invoice };
      
      if (include?.customer && invoiceData.customers) {
        result.customer = transformDates(invoiceData.customers as Customer);
      }
      if (include?.items && invoiceData.invoice_items && Array.isArray(invoiceData.invoice_items)) {
        result.items = (invoiceData.invoice_items as InvoiceItem[]).map((i: InvoiceItem) => transformDates(i));
      }
      return result;
    },
    async findFirst({ where, include }: { where: Record<string, unknown>; include?: Record<string, unknown> }) {
      let selectFields = '*';
      if (include?.customer) {
        selectFields = '*, customers(*)';
      }
      let query = supabase.from('invoices').select(selectFields);
      for (const [key, value] of Object.entries(where)) {
        if (value !== undefined) {
          query = query.eq(key, value);
        }
      }
      const { data, error } = await query.limit(1).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;
      
      const invoiceData = data as unknown as Record<string, unknown>;
      const invoice = transformDates(invoiceData as unknown as Invoice);
      if (include?.customer && invoiceData.customers) {
        return { ...invoice, customer: transformDates(invoiceData.customers as Customer) };
      }
      return invoice;
    },
    async findMany({ where, skip, take, include }: { where?: Record<string, unknown>; skip?: number; take?: number; include?: Record<string, unknown> } = {}) {
      let selectFields = '*';
      if (include?.customer) {
        selectFields = '*, customers(*)';
      }
      let query = supabase.from('invoices').select(selectFields);
      if (where) {
        for (const [key, value] of Object.entries(where)) {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        }
      }
      if (skip) query = query.range(skip, skip + (take || 10) - 1);
      if (take && !skip) query = query.limit(take);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map((item: unknown) => {
        const invoiceData = item as Record<string, unknown>;
        const invoice = transformDates(invoiceData as unknown as Invoice);
        if (include?.customer && invoiceData.customers) {
          return { ...invoice, customer: transformDates(invoiceData.customers as Customer) };
        }
        return invoice;
      });
    },
    async update({ where, data }: { where: { id: string }; data: Partial<Invoice> }) {
      const updateData: Record<string, unknown> = { ...data, updatedAt: new Date().toISOString() };
      if (data.dueDate instanceof Date) {
        updateData.dueDate = data.dueDate.toISOString();
      }
      if (data.paidAt instanceof Date) {
        updateData.paidAt = data.paidAt.toISOString();
      }
      const { data: result, error } = await supabase
        .from('invoices')
        .update(updateData)
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformDates(result as Invoice);
    },
    async delete({ where }: { where: { id: string } }) {
      const { data, error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformDates(data as Invoice);
    },
    async count({ where }: { where?: Record<string, unknown> } = {}) {
      let query = supabase.from('invoices').select('*', { count: 'exact', head: true });
      if (where) {
        for (const [key, value] of Object.entries(where)) {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        }
      }
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
    async aggregate({ where, _sum }: { where?: Record<string, unknown>; _sum?: { total?: boolean } }) {
      if (_sum?.total) {
        let query = supabase.from('invoices').select('total');
        if (where) {
          for (const [key, value] of Object.entries(where)) {
            if (value !== undefined && value !== null) {
              query = query.eq(key, value);
            }
          }
        }
        const { data, error } = await query;
        if (error) throw error;
        const total = (data || []).reduce((sum: number, item: { total: number }) => sum + (item.total || 0), 0);
        return { _sum: { total } };
      }
      return { _sum: {} };
    },
  },

  invoiceItem: {
    async create({ data }: { data: Partial<InvoiceItem> }) {
      const { data: result, error } = await supabase
        .from('invoice_items')
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return transformDates(result as InvoiceItem);
    },
    async createMany({ data }: { data: Partial<InvoiceItem>[] }) {
      const { data: result, error } = await supabase
        .from('invoice_items')
        .insert(data)
        .select();
      if (error) throw error;
      return (result || []).map((d: InvoiceItem) => transformDates(d));
    },
    async deleteMany({ where }: { where: { invoiceId: string } }) {
      const { data, error } = await supabase
        .from('invoice_items')
        .delete()
        .eq('invoiceId', where.invoiceId)
        .select();
      if (error) throw error;
      return (data || []).map((d: InvoiceItem) => transformDates(d));
    },
  },

  $disconnect: async () => {
    // Supabase doesn't need explicit disconnect
  },
};

export { supabase };
