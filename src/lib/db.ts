import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gklaggowcdlbkvknwmeg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbGFnZ293Y2RsYmt2a253bWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMDgzMjEsImV4cCI6MjA4Nzg4NDMyMX0.ec8PUraCzoRhMxrSQc78QQEDc6rmgIx1UsCqx6M9QSQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

// Helper to transform dates from strings to Date objects for frontend compatibility
const transformDates = (data: AnyRecord): AnyRecord => {
  const result = { ...data };
  for (const key of Object.keys(result)) {
    if (key.endsWith('At') && typeof result[key] === 'string') {
      result[key] = new Date(result[key]);
    }
  }
  return result;
};

// Database client that mimics Prisma API using Supabase
// Using any types to avoid TypeScript issues with Supabase's complex types
export const db = {
  user: {
    async create({ data }: { data: AnyRecord }) {
      const { data: result, error } = await supabase
        .from('users')
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return transformDates(result);
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
      return data ? transformDates(data) : null;
    },
    async findFirst({ where }: { where: AnyRecord }) {
      let query = supabase.from('users').select('*');
      for (const [key, value] of Object.entries(where)) {
        query = query.eq(key, value);
      }
      const { data, error } = await query.limit(1).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data ? transformDates(data) : null;
    },
    async findMany({ where, skip, take }: { where?: AnyRecord; skip?: number; take?: number } = {}) {
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
      return (data || []).map(transformDates);
    },
    async update({ where, data }: { where: { id: string }; data: AnyRecord }) {
      const { data: result, error } = await supabase
        .from('users')
        .update({ ...data, updatedAt: new Date().toISOString() })
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformDates(result);
    },
    async delete({ where }: { where: { id: string } }) {
      const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformDates(data);
    },
    async count({ where }: { where?: AnyRecord } = {}) {
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
    async create({ data }: { data: AnyRecord }) {
      const { data: result, error } = await supabase
        .from('customers')
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return transformDates(result);
    },
    async findUnique({ where }: { where: { id: string } }) {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', where.id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data ? transformDates(data) : null;
    },
    async findFirst({ where, include }: { where: AnyRecord; include?: AnyRecord }) {
      let query = supabase.from('customers').select('*');
      for (const [key, value] of Object.entries(where)) {
        if (value !== undefined) {
          query = query.eq(key, value);
        }
      }
      const { data, error } = await query.limit(1).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;
      
      const customer = transformDates(data);
      
      if (include) {
        const result: AnyRecord = { ...customer };
        
        if ('jobs' in include) {
          const { data: jobs } = await supabase
            .from('jobs')
            .select('*')
            .eq('customerId', customer.id)
            .order('createdAt', { ascending: false })
            .limit(10);
          result.jobs = (jobs || []).map(transformDates);
        }
        
        if ('invoices' in include) {
          const { data: invoices } = await supabase
            .from('invoices')
            .select('*')
            .eq('customerId', customer.id)
            .order('createdAt', { ascending: false })
            .limit(10);
          result.invoices = (invoices || []).map(transformDates);
        }
        
        if ('_count' in include) {
          const countConfig = include._count?.select;
          result._count = {};
          if (countConfig?.jobs) {
            const { count } = await supabase
              .from('jobs')
              .select('*', { count: 'exact', head: true })
              .eq('customerId', customer.id);
            result._count.jobs = count || 0;
          }
          if (countConfig?.invoices) {
            const { count } = await supabase
              .from('invoices')
              .select('*', { count: 'exact', head: true })
              .eq('customerId', customer.id);
            result._count.invoices = count || 0;
          }
        }
        
        return result;
      }
      
      return customer;
    },
    async findMany({ where, skip, take }: { where?: AnyRecord; skip?: number; take?: number } = {}) {
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
      return (data || []).map(transformDates);
    },
    async update({ where, data }: { where: { id: string }; data: AnyRecord }) {
      const { data: result, error } = await supabase
        .from('customers')
        .update({ ...data, updatedAt: new Date().toISOString() })
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformDates(result);
    },
    async delete({ where }: { where: { id: string } }) {
      const { data, error } = await supabase
        .from('customers')
        .delete()
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformDates(data);
    },
    async count({ where }: { where?: AnyRecord } = {}) {
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
    async create({ data }: { data: AnyRecord }) {
      const insertData: AnyRecord = { ...data };
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
      return transformDates(result);
    },
    async findUnique({ where, include }: { where: { id: string }; include?: AnyRecord }) {
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
      
      const job = transformDates(data);
      const result: AnyRecord = { ...job };
      
      if (include?.customer && data.customers) {
        result.customer = transformDates(data.customers);
      }
      if (include?.photos && data.photos && Array.isArray(data.photos)) {
        result.photos = data.photos.map(transformDates);
      }
      return result;
    },
    async findFirst({ where, include }: { where: AnyRecord; include?: AnyRecord }) {
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
      
      const job = transformDates(data);
      if (include?.customer && data.customers) {
        return { ...job, customer: transformDates(data.customers) };
      }
      return job;
    },
    async findMany({ where, skip, take, include }: { where?: AnyRecord; skip?: number; take?: number; include?: AnyRecord } = {}) {
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
      return (data || []).map((item: AnyRecord) => {
        const job = transformDates(item);
        if (include?.customer && item.customers) {
          return { ...job, customer: transformDates(item.customers) };
        }
        return job;
      });
    },
    async update({ where, data }: { where: { id: string }; data: AnyRecord }) {
      const updateData: AnyRecord = { ...data, updatedAt: new Date().toISOString() };
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
      return transformDates(result);
    },
    async delete({ where }: { where: { id: string } }) {
      const { data, error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformDates(data);
    },
    async count({ where }: { where?: AnyRecord } = {}) {
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
    async create({ data }: { data: AnyRecord }) {
      const { data: result, error } = await supabase
        .from('photos')
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return transformDates(result);
    },
    async findMany({ where }: { where?: AnyRecord } = {}) {
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
      return (data || []).map(transformDates);
    },
    async delete({ where }: { where: { id: string } }) {
      const { data, error } = await supabase
        .from('photos')
        .delete()
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformDates(data);
    },
    async deleteMany({ where }: { where: { jobId: string } }) {
      const { data, error } = await supabase
        .from('photos')
        .delete()
        .eq('jobId', where.jobId)
        .select();
      if (error) throw error;
      return (data || []).map(transformDates);
    },
  },

  invoice: {
    async create({ data }: { data: AnyRecord }) {
      const { items, ...invoiceData } = data;
      const insertData: AnyRecord = { ...invoiceData };
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
      
      const invoice = transformDates(result);
      
      // Create invoice items if provided
      if (items && items.length > 0) {
        const itemsWithInvoiceId = items.map((item: AnyRecord) => ({
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
    async findUnique({ where, include }: { where: { id: string }; include?: AnyRecord }) {
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
      
      const invoice = transformDates(data);
      const result: AnyRecord = { ...invoice };
      
      if (include?.customer && data.customers) {
        result.customer = transformDates(data.customers);
      }
      if (include?.items && data.invoice_items && Array.isArray(data.invoice_items)) {
        result.items = data.invoice_items.map(transformDates);
      }
      return result;
    },
    async findFirst({ where, include }: { where: AnyRecord; include?: AnyRecord }) {
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
      
      const invoice = transformDates(data);
      if (include?.customer && data.customers) {
        return { ...invoice, customer: transformDates(data.customers) };
      }
      return invoice;
    },
    async findMany({ where, skip, take, include }: { where?: AnyRecord; skip?: number; take?: number; include?: AnyRecord } = {}) {
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
      return (data || []).map((item: AnyRecord) => {
        const invoice = transformDates(item);
        if (include?.customer && item.customers) {
          return { ...invoice, customer: transformDates(item.customers) };
        }
        return invoice;
      });
    },
    async update({ where, data }: { where: { id: string }; data: AnyRecord }) {
      const updateData: AnyRecord = { ...data, updatedAt: new Date().toISOString() };
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
      return transformDates(result);
    },
    async delete({ where }: { where: { id: string } }) {
      const { data, error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return transformDates(data);
    },
    async count({ where }: { where?: AnyRecord } = {}) {
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
    async aggregate({ where, _sum }: { where?: AnyRecord; _sum?: { total?: boolean } }) {
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
        const total = (data || []).reduce((sum: number, item: AnyRecord) => sum + (item.total || 0), 0);
        return { _sum: { total } };
      }
      return { _sum: {} };
    },
  },

  invoiceItem: {
    async create({ data }: { data: AnyRecord }) {
      const { data: result, error } = await supabase
        .from('invoice_items')
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return transformDates(result);
    },
    async createMany({ data }: { data: AnyRecord[] }) {
      const { data: result, error } = await supabase
        .from('invoice_items')
        .insert(data)
        .select();
      if (error) throw error;
      return (result || []).map(transformDates);
    },
    async deleteMany({ where }: { where: { invoiceId: string } }) {
      const { data, error } = await supabase
        .from('invoice_items')
        .delete()
        .eq('invoiceId', where.invoiceId)
        .select();
      if (error) throw error;
      return (data || []).map(transformDates);
    },
  },

  $disconnect: async () => {
    // Supabase doesn't need explicit disconnect
  },
};
