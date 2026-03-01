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

    // Get all stats in parallel
    const [
      totalCustomers,
      todaysJobs,
      completedJobsToday,
      pendingJobs,
      totalRevenue,
      recentJobs,
      upcomingJobs,
    ] = await Promise.all([
      // Total customers for this user
      db.customer.count({
        where: { userId: user.id },
      }),
      
      // Today's scheduled jobs
      db.job.count({
        where: {
          userId: user.id,
          scheduledAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      
      // Completed jobs today
      db.job.count({
        where: {
          userId: user.id,
          status: 'COMPLETED',
          completedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      
      // Pending jobs
      db.job.count({
        where: {
          userId: user.id,
          status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
        },
      }),
      
      // Total revenue
      db.invoice.aggregate({
        where: {
          userId: user.id,
          status: 'PAID',
        },
        _sum: {
          total: true,
        },
      }),
      
      // Recent jobs
      db.job.findMany({
        where: { userId: user.id },
        include: { customer: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      
      // Upcoming job
      db.job.findFirst({
        where: {
          userId: user.id,
          status: 'SCHEDULED',
          scheduledAt: {
            gte: new Date(),
          },
        },
        include: { customer: true },
        orderBy: { scheduledAt: 'asc' },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalCustomers,
        todaysJobs,
        completedJobsToday,
        pendingJobs,
        totalRevenue: totalRevenue._sum.total || 0,
      },
      recentJobs,
      upcomingJobs,
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
