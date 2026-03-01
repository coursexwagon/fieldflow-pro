import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Try to connect and run a simple query
    const result = await db.$queryRaw`SELECT 1 as test`;
    
    return NextResponse.json({
      status: 'connected',
      result,
      databaseUrl: process.env.DATABASE_URL ? 'set (hidden)' : 'not set',
      directUrl: process.env.DIRECT_DATABASE_URL ? 'set (hidden)' : 'not set',
    });
  } catch (error: any) {
    console.error('DB test error:', error);
    return NextResponse.json({
      status: 'error',
      error: error.message,
      code: error.code,
      databaseUrl: process.env.DATABASE_URL ? 'set (hidden)' : 'not set',
      directUrl: process.env.DIRECT_DATABASE_URL ? 'set (hidden)' : 'not set',
    }, { status: 500 });
  }
}
