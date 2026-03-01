import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supabase } from '@/lib/db';
import { nanoid } from 'nanoid';

export async function GET() {
  try {
    // Try to connect and run a simple query
    const count = await db.user.count();

    // Test direct Supabase insert
    const testId = nanoid();
    const testEmail = `test${Date.now()}@test.com`;

    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert({
        id: testId,
        name: 'Test User',
        email: testEmail,
        password: 'testpassword123',
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({
        status: 'insert_failed',
        userCount: count,
        insertError: {
          message: insertError.message,
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint,
        },
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'using default',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'using default',
      });
    }

    // Clean up - delete test user
    await supabase.from('users').delete().eq('id', testId);

    return NextResponse.json({
      status: 'fully_working',
      userCount: count,
      insertTest: 'passed',
      insertedUserId: testId,
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
