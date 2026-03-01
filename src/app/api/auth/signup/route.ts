import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, businessName, tradeType } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    try {
      const existingUser = await db.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }
    } catch (dbError) {
      console.error('Database error checking user:', dbError);
      return NextResponse.json(
        { error: 'Database connection error. Please try again.' },
        { status: 500 }
      );
    }

    // Hash password
    let hashedPassword: string;
    try {
      hashedPassword = await hash(password, 12);
    } catch (hashError) {
      console.error('Password hashing error:', hashError);
      return NextResponse.json(
        { error: 'Error processing password' },
        { status: 500 }
      );
    }

    // Create user
    try {
      const user = await db.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
          phone: phone || null,
          businessName: businessName || null,
          tradeType: tradeType || null,
        },
      });

      // Return user without password
      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          businessName: user.businessName,
          tradeType: user.tradeType,
          phone: user.phone,
        },
      });
    } catch (createError: any) {
      console.error('User creation error:', createError);
      console.error('Error details:', JSON.stringify({
        message: createError?.message,
        code: createError?.code,
        details: createError?.details,
        hint: createError?.hint,
      }));

      // Check for specific Prisma errors
      if (createError.code === 'P2002') {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: 'Failed to create user. Please try again.',
          details: createError?.message || 'Unknown error',
          code: createError?.code
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
