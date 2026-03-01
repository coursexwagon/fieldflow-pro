import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/customers - Get all customers for current user
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const where: Record<string, unknown> = { userId: user.id };
    
    // Note: Search functionality would need to be implemented differently with Supabase
    // For now, we'll fetch all and filter client-side or implement Supabase text search

    const customers = await db.customer.findMany({ where });

    // Get counts for each customer
    const customersWithCounts = await Promise.all(
      customers.map(async (customer) => {
        const jobsCount = await db.job.count({ where: { customerId: customer.id } });
        const invoicesCount = await db.invoice.count({ where: { customerId: customer.id } });
        return {
          ...customer,
          _count: {
            jobs: jobsCount,
            invoices: invoicesCount,
          },
        };
      })
    );

    // Filter by search if provided
    const filteredCustomers = search
      ? customersWithCounts.filter((c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email?.toLowerCase().includes(search.toLowerCase()) ||
          c.phone.includes(search) ||
          c.address.toLowerCase().includes(search.toLowerCase())
        )
      : customersWithCounts;

    // Sort by createdAt desc
    filteredCustomers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ customers: filteredCustomers });
  } catch (error) {
    console.error('Get customers error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// POST /api/customers - Create a new customer
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { name, email, phone, address, city, state, zip, notes } = body;

    if (!name || !phone || !address) {
      return NextResponse.json(
        { error: 'Name, phone, and address are required' },
        { status: 400 }
      );
    }

    const customer = await db.customer.create({
      data: {
        name,
        email: email || null,
        phone,
        address,
        city: city || null,
        state: state || null,
        zip: zip || null,
        notes: notes || null,
        userId: user.id,
      },
    });

    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Create customer error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
