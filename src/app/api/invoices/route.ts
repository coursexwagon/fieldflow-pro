import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { nanoid } from 'nanoid';
import { getCurrentUser } from '@/lib/auth';

// GET /api/invoices - Get all invoices
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = { userId: user.id };
    
    if (status) {
      where.status = status;
    }

    const invoices = await db.invoice.findMany({
      where,
      include: {
        customer: true,
        items: true,
        job: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error('Get invoices error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// POST /api/invoices - Create a new invoice
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { customerId, jobId, items, notes, dueDate } = body;

    if (!customerId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Customer and items are required' },
        { status: 400 }
      );
    }

    // Verify customer belongs to user
    const customer = await db.customer.findFirst({
      where: { id: customerId, userId: user.id },
    });
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Generate invoice number
    const invoiceNumber = `INV-${nanoid(8).toUpperCase()}`;

    // Calculate total
    const total = items.reduce((sum: number, item: any) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);

    const invoice = await db.invoice.create({
      data: {
        invoiceNumber,
        customerId,
        userId: user.id,
        jobId: jobId || null,
        total,
        notes: notes || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: 'DRAFT',
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
          })),
        },
      },
      include: {
        customer: true,
        items: true,
      },
    });

    return NextResponse.json({ invoice });
  } catch (error) {
    console.error('Create invoice error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
