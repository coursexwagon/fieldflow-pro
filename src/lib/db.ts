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
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  scheduledAt?: Date | null;
  duration?: number | null;
  price?: number | null;
  completedAt?: Date | null;
  userId: string;
  customerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Photo {
  id: string;
  url: string;
  publicId: string;
  caption?: string | null;
  jobId: string;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  total: number;
  notes?: string | null;
  dueDate?: Date | null;
  paidAt?: Date | null;
  userId: string;
  customerId: string;
  jobId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  invoiceId: string;
  createdAt: Date;
}

// Helper to convert Supabase response to our format
const transformUser = (data: Record<string, unknown>): User => ({
  ...data,
  createdAt: new Date(data.createdAt as string),
  updatedAt: new Date(data.updatedAt as string),
});

const transformCustomer = (data: Record<string, unknown>): Customer => ({
  ...data,
  createdAt: new Date(data.createdAt as string),
  updatedAt: new Date(data.updatedAt as string),
});

const transformJob = (data: Record<string, unknown>): Job => ({
  ...data,
  scheduledAt: data.scheduledAt ? new Date(data.scheduledAt as string) : null,
  completedAt: data.completedAt ? new Date(data.completedAt as string) : null,
  createdAt: new Date(data.createdAt as string),
  updatedAt: new Date(data.updatedAt as string),
});

const transformPhoto = (data: Record<string, unknown>): Photo => ({
  ...data,
  createdAt: new Date(data.createdAt as string),
});

const transformInvoice = (data: Record<string, unknown>): Invoice => ({
  ...data,
  dueDate: data.dueDate ? new Date(data.dueDate as string) : null,
  paidAt: data.paidAt ? new Date(data.paidAt as string) : null,
  createdAt: new Date(data.createdAt as string),
  updatedAt: new Date(data.updatedAt as string),
});

const transformInvoiceItem = (data: Record<string, unknown>): InvoiceItem => ({
  ...data,
  createdAt: new Date(data.createdAt as string),
});

// Database client that mimics Prisma API
export const db = {
  user: {
    async create({ data }: { data: Partial<User> }) {
      const { data: result, error } = await supabase
        .from('users')
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return transformUser(result as Record<string, unknown>);
    },
    async findUnique({ where }: { where: { id?: string; email?: string } }) {
      let query = supabase.from('users').select('*');
      if (where.id) {
        query = query.eq('id', where.id);
      } else if (where.email) {
        query = query.eq('email', where.email);
      } else {
        return null;
      }
      const { data, error } = await query.single();
      if (error && error.code !== 'PGRST116') throw error;
      return data ? transformUser(data as Record<string, unknown>) : null;
    },
    async findFirst({ where }: { where: Record<string, unknown> }) {
      let query = supabase.from('users').select('*');
      for (const [key, value] of Object.entries(where)) {
        query = query.eq(key, value);
      }
      const { data, error } = await query.limit(1).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data ? transformUser(data as Record<string, unknown>) : null;
    },
    async findMany({ where, orderBy, skip, take }: { where?: Record<string, unknown>; orderBy?: Record<string, unknown>; skip?: number; take?: number } = {}) {
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
      return (data || []).map(transformUser);
    },
    async update({ where, data }: { where: { id: string }; data: Partial<User> }) {
      const { data: result, error } = await supabase
        .from('users')
        .update({ ...data, updatedAt: new Date().toISOString() })
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformUser(result as Record<string, unknown>);
    },
    async delete({ where }: { where: { id: string } }) {
      const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformUser(data as Record<string, unknown>);
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
      return transformCustomer(result as Record<string, unknown>);
    },
    async findUnique({ where }: { where: { id: string } }) {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', where.id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data ? transformCustomer(data as Record<string, unknown>) : null;
    },
    async findMany({ where, orderBy, skip, take }: { where?: Record<string, unknown>; orderBy?: Record<string, unknown>; skip?: number; take?: number } = {}) {
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
      return (data || []).map(transformCustomer);
    },
    async update({ where, data }: { where: { id: string }; data: Partial<Customer> }) {
      const { data: result, error } = await supabase
        .from('customers')
        .update({ ...data, updatedAt: new Date().toISOString() })
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformCustomer(result as Record<string, unknown>);
    },
    async delete({ where }: { where: { id: string } }) {
      const { data, error } = await supabase
        .from('customers')
        .delete()
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformCustomer(data as Record<string, unknown>);
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
      const { data: result, error } = await supabase
        .from('jobs')
        .insert({
          ...data,
          scheduledAt: data.scheduledAt instanceof Date ? data.scheduledAt.toISOString() : data.scheduledAt,
          completedAt: data.completedAt instanceof Date ? data.completedAt.toISOString() : data.completedAt,
        })
        .select()
        .single();
      if (error) throw error;
      return transformJob(result as Record<string, unknown>);
    },
    async findUnique({ where, include }: { where: { id: string }; include?: Record<string, boolean> }) {
      let query = supabase.from('jobs').select('*');
      if (include?.customer) {
        query = supabase.from('jobs').select('*, customers(*)');
      }
      const { data, error } = await query.eq('id', where.id).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;
      
      const job = transformJob(data as Record<string, unknown>);
      if (include?.customer && (data as Record<string, unknown>).customers) {
        return { ...job, customer: transformCustomer((data as Record<string, unknown>).customers as Record<string, unknown>) };
      }
      return job;
    },
    async findMany({ where, orderBy, skip, take, include }: { where?: Record<string, unknown>; orderBy?: Record<string, unknown>; skip?: number; take?: number; include?: Record<string, boolean> } = {}) {
      let query = supabase.from('jobs').select(include?.customer ? '*, customers(*)' : '*');
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
      return (data || []).map((item: Record<string, unknown>) => {
        const job = transformJob(item);
        if (include?.customer && item.customers) {
          return { ...job, customer: transformCustomer(item.customers as Record<string, unknown>) };
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
      return transformJob(result as Record<string, unknown>);
    },
    async delete({ where }: { where: { id: string } }) {
      const { data, error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformJob(data as Record<string, unknown>);
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
      return transformPhoto(result as Record<string, unknown>);
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
      return (data || []).map(transformPhoto);
    },
    async delete({ where }: { where: { id: string } }) {
      const { data, error } = await supabase
        .from('photos')
        .delete()
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformPhoto(data as Record<string, unknown>);
    },
  },

  invoice: {
    async create({ data }: { data: Partial<Invoice> }) {
      const { data: result, error } = await supabase
        .from('invoices')
        .insert({
          ...data,
          dueDate: data.dueDate instanceof Date ? data.dueDate.toISOString() : data.dueDate,
          paidAt: data.paidAt instanceof Date ? data.paidAt.toISOString() : data.paidAt,
        })
        .select()
        .single();
      if (error) throw error;
      return transformInvoice(result as Record<string, unknown>);
    },
    async findUnique({ where, include }: { where: { id: string }; include?: Record<string, boolean> }) {
      let selectFields = include?.customer || include?.items ? '*, customers(*)' : '*';
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
      
      const invoice = transformInvoice(data as Record<string, unknown>);
      const result: Record<string, unknown> = { ...invoice };
      if (include?.customer && (data as Record<string, unknown>).customers) {
        result.customer = transformCustomer((data as Record<string, unknown>).customers as Record<string, unknown>);
      }
      if (include?.items && (data as Record<string, unknown>).invoice_items) {
        result.items = ((data as Record<string, unknown>).invoice_items as Record<string, unknown>[]).map(transformInvoiceItem);
      }
      return result as Invoice & { customer?: Customer; items?: InvoiceItem[] };
    },
    async findMany({ where, orderBy, skip, take, include }: { where?: Record<string, unknown>; orderBy?: Record<string, unknown>; skip?: number; take?: number; include?: Record<string, boolean> } = {}) {
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
      return (data || []).map((item: Record<string, unknown>) => {
        const invoice = transformInvoice(item);
        if (include?.customer && item.customers) {
          return { ...invoice, customer: transformCustomer(item.customers as Record<string, unknown>) };
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
      return transformInvoice(result as Record<string, unknown>);
    },
    async delete({ where }: { where: { id: string } }) {
      const { data, error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformInvoice(data as Record<string, unknown>);
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
  },

  invoiceItem: {
    async create({ data }: { data: Partial<InvoiceItem> }) {
      const { data: result, error } = await supabase
        .from('invoice_items')
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return transformInvoiceItem(result as Record<string, unknown>);
    },
    async createMany({ data }: { data: Partial<InvoiceItem>[] }) {
      const { data: result, error } = await supabase
        .from('invoice_items')
        .insert(data)
        .select();
      if (error) throw error;
      return (result || []).map(transformInvoiceItem);
    },
    async deleteMany({ where }: { where: { invoiceId: string } }) {
      const { data, error } = await supabase
        .from('invoice_items')
        .delete()
        .eq('invoiceId', where.invoiceId)
        .select();
      if (error) throw error;
      return (data || []).map(transformInvoiceItem);
    },
  },

  $disconnect: async () => {
    // Supabase doesn't need explicit disconnect
  },
};

export { supabase };
