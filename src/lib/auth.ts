import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { db } from '@/lib/db';

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return null;
    }
    
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });
    
    if (!user) return null;
    
    // Return only selected fields
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      businessName: user.businessName,
      tradeType: user.tradeType,
      phone: user.phone,
      avatar: user.avatar,
    };
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

export { authOptions } from '@/lib/auth-config';
