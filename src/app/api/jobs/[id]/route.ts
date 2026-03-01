import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/db';

// GET /api/jobs/[id] - Get a single job
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = await params;

    const job = await db.job.findFirst({
      where: { id, userId: user.id },
      include: { customer: true },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Get photos
    const { data: photos } = await supabase
      .from('photos')
      .select('*')
      .eq('jobId', id);

    // Get invoice if exists
    const invoices = await db.invoice.findMany({ 
      where: { jobId: id },
      include: { customer: true },
    });
    
    // Get items for each invoice
    let invoice = invoices[0] || null;
    if (invoice) {
      const { data: items } = await supabase
        .from('invoice_items')
        .select('*')
        .eq('invoiceId', invoice.id);
      invoice = { ...invoice, items: items || [] };
    }

    return NextResponse.json({ 
      job: {
        ...job,
        photos: photos || [],
        invoice,
      }
    });
  } catch (error) {
    console.error('Get job error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// PUT /api/jobs/[id] - Update a job
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = await params;
    const body = await request.json();
    const { title, description, status, scheduledAt, duration, price, customerId } = body;

    // Verify job belongs to user
    const existingJob = await db.job.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (customerId !== undefined) updateData.customerId = customerId;
    if (scheduledAt !== undefined) updateData.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
    if (duration !== undefined) updateData.duration = duration ? parseInt(duration) : null;
    if (price !== undefined) updateData.price = price ? parseFloat(price) : null;
    
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'COMPLETED') {
        updateData.completedAt = new Date();
      }
    }

    const job = await db.job.update({
      where: { id },
      data: updateData,
    });

    // Get customer and photos
    const customer = await db.customer.findUnique({ where: { id: job.customerId } });
    const { data: photos } = await supabase
      .from('photos')
      .select('*')
      .eq('jobId', id);

    return NextResponse.json({ 
      job: {
        ...job,
        customer,
        photos: photos || [],
      }
    });
  } catch (error) {
    console.error('Update job error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// DELETE /api/jobs/[id] - Delete a job
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = await params;

    // Verify job belongs to user
    const existingJob = await db.job.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Delete photos first
    await db.photo.deleteMany({ where: { jobId: id } });

    await db.job.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete job error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
