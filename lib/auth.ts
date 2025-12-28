import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { AccessLevel } from '@prisma/client';

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
          throw new Error('Invalid credentials');
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { tenant: true },
          });

          if (!user || !user.isActive) {
            throw new Error('Invalid credentials');
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error('Invalid credentials');
          }

          // Update last login
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: { lastLogin: new Date() },
            });

            // Log login action
            await prisma.auditLog.create({
              data: {
                userId: user.id,
                action: 'LOGIN',
                entityType: 'User',
                entityId: user.id,
                details: `User ${user.email} logged in`,
              },
            });
          } catch (error) {
            console.error('Error updating login info:', error);
            // Continue with login even if audit log fails
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            accessLevel: user.accessLevel,
            tenantId: user.tenantId,
            tenantName: user.tenant.name,
            tenantCode: user.tenant.code,
            tenantType: user.tenant.type,
          };
        } catch (error) {
          console.error('Database error during authentication:', error);
          throw new Error('Authentication service unavailable');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessLevel = user.accessLevel;
        token.tenantId = user.tenantId;
        token.tenantName = user.tenantName;
        token.tenantCode = user.tenantCode;
        token.tenantType = user.tenantType;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.accessLevel = token.accessLevel as AccessLevel;
        session.user.tenantId = token.tenantId as string;
        session.user.tenantName = token.tenantName as string;
        session.user.tenantCode = token.tenantCode as string;
        session.user.tenantType = token.tenantType as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

