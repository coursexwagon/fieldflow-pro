import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/user/stats - Get user statistics
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get job count
    const jobCount = await db.job.count({
      where: { userId: user.id },
    });

    // Get customer count
    const customerCount = await db.customer.count({
      where: { userId: user.id },
    });

    // Get total revenue from paid invoices
    const paidInvoices = await db.invoice.aggregate({
      where: { 
        userId: user.id,
        status: 'PAID',
      },
      _sum: {
        total: true,
      },
    });

    // Get completed jobs count
    const completedJobs = await db.job.count({
      where: { 
        userId: user.id,
        status: 'COMPLETED',
      },
    });

    // Get pending invoices count
    const pendingInvoices = await db.invoice.count({
      where: { 
        userId: user.id,
        status: { in: ['DRAFT', 'SENT', 'OVERDUE'] },
      },
    });

    return NextResponse.json({
      stats: {
        jobCount,
        customerCount,
        completedJobs,
        pendingInvoices,
        totalRevenue: paidInvoices._sum.total || 0,
      },
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
  }
}
