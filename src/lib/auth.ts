import { db } from '@/lib/db';
import { cookies } from 'next/headers';

// Simple session-based auth for API routes
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionToken = 
      cookieStore.get('next-auth.session-token')?.value ||
      cookieStore.get('__Secure-next-auth.session-token')?.value;

    if (!sessionToken) {
      return null;
    }

    // Decode the JWT token to get user ID
    // The token is base64url encoded
    const parts = sessionToken.split('.');
    if (parts.length !== 3) {
      return null;
    }

    try {
      // Decode the payload (middle part)
      const payload = JSON.parse(
        Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
      );

      if (!payload.id) {
        return null;
      }

      const user = await db.user.findUnique({
        where: { id: payload.id as string },
      });

      if (!user) return null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        businessName: user.businessName,
        tradeType: user.tradeType,
        phone: user.phone,
        avatar: user.avatar,
      };
    } catch {
      return null;
    }
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
