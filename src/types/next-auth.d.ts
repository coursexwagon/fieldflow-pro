import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    businessName?: string | null;
    tradeType?: string | null;
    phone?: string | null;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    businessName?: string | null;
    tradeType?: string | null;
    phone?: string | null;
  }
}
