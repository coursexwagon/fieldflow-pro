import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { nanoid } from 'nanoid';

export async function GET() {
  try {
    // Test direct insert
    const testData = {
      id: nanoid(),
      name: 'Debug User',
      email: `debug${Date.now()}@test.com`,
      password: 'testpassword',
    };

    const { data, error } = await supabase
      .from('users')
      .insert(testData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        },
        testData,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'missing',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'missing',
      });
    }

    // Clean up - delete the test user
    await supabase.from('users').delete().eq('id', testData.id);

    return NextResponse.json({
      success: true,
      data,
      message: 'Direct insert works!',
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: {
        message: err.message,
        stack: err.stack,
      },
    });
  }
}
