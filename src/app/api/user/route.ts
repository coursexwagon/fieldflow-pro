import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

// GET /api/user - Get current authenticated user
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ user: null, error: 'Not authenticated' }, { status: 401 });
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ user: null, error: 'Something went wrong' }, { status: 500 });
  }
}
