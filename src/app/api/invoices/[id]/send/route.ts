import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { sendInvoiceEmail } from '@/lib/email';
import { supabase } from '@/lib/db';

// POST /api/invoices/[id]/send - Send invoice email
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get invoice
    const invoice = await db.invoice.findFirst({
      where: { id, userId: user.id },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Get customer
    const customer = await db.customer.findUnique({ where: { id: invoice.customerId as string } });
    if (!customer || !customer.email) {
      return NextResponse.json({ 
        error: 'Customer has no email address' 
      }, { status: 400 });
    }

    // Get items
    const { data: items } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoiceId', id);

    // Send the invoice email
    const result = await sendInvoiceEmail(
      customer.email,
      customer.name,
      invoice.invoiceNumber as string,
      invoice.total,
      user.businessName || user.name,
      (items || []).map((item: { description: string; quantity: number; unitPrice: number; total: number }) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      }))
    );

    if (!result.success) {
      return NextResponse.json({ 
        error: 'Failed to send email' 
      }, { status: 500 });
    }

    // Update invoice status to SENT
    await db.invoice.update({
      where: { id },
      data: { status: 'SENT' },
    });

    return NextResponse.json({ 
      success: true, 
      message: `Invoice sent to ${customer.email}` 
    });
  } catch (error) {
    console.error('Send invoice error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
