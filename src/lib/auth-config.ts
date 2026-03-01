import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { db } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        }) as any;

        if (!user) {
          throw new Error('No user found');
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user.id as string,
          email: user.email as string,
          name: user.name as string,
          businessName: user.businessName as string | undefined,
          tradeType: user.tradeType as string | undefined,
          phone: user.phone as string | undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.businessName = (user as any).businessName;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.tradeType = (user as any).tradeType;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.phone = (user as any).phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          businessName: token.businessName as string | undefined,
          tradeType: token.tradeType as string | undefined,
          phone: token.phone as string | undefined,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
