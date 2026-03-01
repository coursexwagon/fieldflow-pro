import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Try to connect and run a simple query
    const count = await db.user.count();

    return NextResponse.json({
      status: 'connected',
      userCount: count,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'using default',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'using default',
    });
  } catch (error: unknown) {
    console.error('DB test error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      status: 'error',
      error: errorMessage,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'using default',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'using default',
    }, { status: 500 });
  }
}
