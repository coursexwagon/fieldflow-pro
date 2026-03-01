import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/dashboard - Get dashboard stats
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get basic counts
    const totalCustomers = await db.customer.count({ where: { userId: user.id } });
    
    // Get all jobs for this user
    const allJobs = await db.job.findMany({ where: { userId: user.id } });
    
    // Get paid invoices for revenue
    const paidInvoices = await db.invoice.findMany({ 
      where: { userId: user.id, status: 'PAID' } 
    });
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    
    // Calculate job stats
    const todaysJobs = allJobs.filter(job => {
      if (!job.scheduledAt) return false;
      const scheduledDate = new Date(job.scheduledAt as string);
      return scheduledDate >= today && scheduledDate < tomorrow;
    }).length;
    
    const completedJobsToday = allJobs.filter(job => {
      if (job.status !== 'COMPLETED' || !job.completedAt) return false;
      const completedDate = new Date(job.completedAt as string);
      return completedDate >= today && completedDate < tomorrow;
    }).length;
    
    const pendingJobs = allJobs.filter(job => 
      job.status === 'SCHEDULED' || job.status === 'IN_PROGRESS'
    ).length;
    
    // Get recent jobs with customers
    const recentJobs = await db.job.findMany({
      where: { userId: user.id },
      include: { customer: true },
      take: 5,
    });
    
    // Sort by createdAt desc
    recentJobs.sort((a, b) => {
      const aDate = a.createdAt ? new Date(a.createdAt as string).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt as string).getTime() : 0;
      return bDate - aDate;
    });
    
    // Get upcoming job
    const now = new Date();
    const scheduledJobs = allJobs.filter(job => 
      job.status === 'SCHEDULED' && job.scheduledAt && new Date(job.scheduledAt as string) >= now
    );
    
    let upcomingJob: Record<string, unknown> | null = null;
    if (scheduledJobs.length > 0) {
      // Sort by scheduledAt asc
      scheduledJobs.sort((a, b) => {
        const aDate = new Date(a.scheduledAt as string).getTime();
        const bDate = new Date(b.scheduledAt as string).getTime();
        return aDate - bDate;
      });
      upcomingJob = scheduledJobs[0] as Record<string, unknown>;
      
      // Get customer for upcoming job
      if (upcomingJob) {
        const customer = await db.customer.findUnique({ where: { id: upcomingJob.customerId as string } });
        upcomingJob.customer = customer;
      }
    }

    return NextResponse.json({
      stats: {
        totalCustomers,
        todaysJobs,
        completedJobsToday,
        pendingJobs,
        totalRevenue,
      },
      recentJobs: recentJobs.slice(0, 5),
      upcomingJob,
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
