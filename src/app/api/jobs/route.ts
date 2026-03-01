import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/jobs - Get all jobs for current user
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');

    const where: any = { userId: user.id };
    
    if (status) {
      where.status = status;
    }
    
    if (customerId) {
      where.customerId = customerId;
    }

    const jobs = await db.job.findMany({
      where,
      include: {
        customer: true,
        photos: true,
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Get jobs error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { title, description, customerId, scheduledAt, duration, price } = body;

    if (!title || !customerId) {
      return NextResponse.json(
        { error: 'Title and customer are required' },
        { status: 400 }
      );
    }

    // Verify the customer belongs to this user
    const customer = await db.customer.findFirst({
      where: { id: customerId, userId: user.id },
    });
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const job = await db.job.create({
      data: {
        title,
        description: description || null,
        customerId,
        userId: user.id,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        duration: duration ? parseInt(duration) : null,
        price: price ? parseFloat(price) : null,
        status: 'SCHEDULED',
      },
      include: {
        customer: true,
      },
    });

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Create job error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
