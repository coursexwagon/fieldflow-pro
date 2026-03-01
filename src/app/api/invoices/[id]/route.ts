import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/db';

// GET /api/invoices/[id] - Get a single invoice
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

    const invoice = await db.invoice.findFirst({
      where: { id, userId: user.id },
      include: { customer: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Get items
    const { data: items } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoiceId', id);

    // Get job if exists
    let job = null;
    if (invoice.jobId) {
      job = await db.job.findUnique({ where: { id: invoice.jobId as string } });
      if (job) {
        const { data: photos } = await supabase
          .from('photos')
          .select('*')
          .eq('jobId', job.id as string);
        job = { ...job, photos: photos || [] };
      }
    }

    return NextResponse.json({ 
      invoice: {
        ...invoice,
        items: items || [],
        job,
      }
    });
  } catch (error) {
    console.error('Get invoice error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// PUT /api/invoices/[id] - Update an invoice
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
    const { status, notes, dueDate, items } = body;

    // Verify invoice belongs to user
    const existingInvoice = await db.invoice.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingInvoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'PAID') {
        updateData.paidAt = new Date();
      }
    }
    if (notes !== undefined) updateData.notes = notes;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    // If items are provided, update them
    if (items && items.length > 0) {
      // Delete existing items
      await db.invoiceItem.deleteMany({ where: { invoiceId: id } });

      // Calculate new total
      const total = items.reduce((sum: number, item: { quantity: number; unitPrice: number }) => {
        return sum + (item.quantity * item.unitPrice);
      }, 0);

      updateData.total = total;

      // Create new items
      await db.invoiceItem.createMany({
        data: items.map((item: { description: string; quantity: number; unitPrice: number }) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
          invoiceId: id,
        })),
      });
    }

    const invoice = await db.invoice.update({
      where: { id },
      data: updateData,
    });

    // Get customer and items
    const customer = await db.customer.findUnique({ where: { id: invoice.customerId as string } });
    const { data: invoiceItems } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoiceId', id);

    return NextResponse.json({ 
      invoice: {
        ...invoice,
        customer,
        items: invoiceItems || [],
      }
    });
  } catch (error) {
    console.error('Update invoice error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// DELETE /api/invoices/[id] - Delete an invoice
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

    // Verify invoice belongs to user
    const existingInvoice = await db.invoice.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingInvoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Delete items first
    await db.invoiceItem.deleteMany({ where: { invoiceId: id } });

    await db.invoice.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete invoice error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
