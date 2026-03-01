import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Base fetcher
async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Something went wrong' }));
    throw new Error(error.error || 'Something went wrong');
  }

  return res.json();
}

// Dashboard hooks
export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => fetcher<{ stats: any; recentJobs: any[]; upcomingJobs: any }>('/api/dashboard'),
  });
}

// Jobs hooks
export function useJobs(filters?: { status?: string; customerId?: string }) {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.customerId) params.append('customerId', filters.customerId);
  
  const query = params.toString();
  
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => fetcher<{ jobs: any[] }>(`/api/jobs${query ? `?${query}` : ''}`),
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => fetcher<{ job: any }>(`/api/jobs/${id}`),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => fetcher<{ job: any }>('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateJob(id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => fetcher<{ job: any }>(`/api/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => fetcher<{ success: boolean }>(`/api/jobs/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// Customers hooks
export function useCustomers(search?: string) {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  
  return useQuery({
    queryKey: ['customers', search],
    queryFn: () => fetcher<{ customers: any[] }>(`/api/customers${params}`),
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => fetcher<{ customer: any }>(`/api/customers/${id}`),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => fetcher<{ customer: any }>('/api/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateCustomer(id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => fetcher<{ customer: any }>(`/api/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => fetcher<{ success: boolean }>(`/api/customers/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// Invoices hooks
export function useInvoices(filters?: { status?: string }) {
  const params = filters?.status ? `?status=${filters.status}` : '';
  
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => fetcher<{ invoices: any[] }>(`/api/invoices${params}`),
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => fetcher<{ invoice: any }>(`/api/invoices/${id}`),
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => fetcher<{ invoice: any }>('/api/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateInvoice(id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => fetcher<{ invoice: any }>(`/api/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// Photo upload hook
export function useUploadPhoto() {
  return useMutation({
    mutationFn: async ({ jobId, file }: { jobId: string; file: string }) => {
      return fetcher<{ photo: any }>(`/api/jobs/${jobId}/photos`, {
        method: 'POST',
        body: JSON.stringify({ file }),
      });
    },
  });
}

// Auth hooks
export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => fetcher<{ user: any }>('/api/user'),
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: (data: any) => fetcher<{ user: any }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) {
        throw new Error('Login failed');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
