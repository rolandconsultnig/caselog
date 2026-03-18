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
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        tenantId: { label: 'Tenant ID', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        try {
          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
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

          // Validate tenant access: User can only log in to their assigned state
          // Exception: SUPER_ADMIN and APP_ADMIN can access any state
          const isSuperAdmin = user.accessLevel === 'SUPER_ADMIN' || user.accessLevel === 'APP_ADMIN';
          const selectedTenantId = credentials.tenantId;

          if (!isSuperAdmin && selectedTenantId && user.tenantId !== selectedTenantId) {
            throw new Error('Access denied: You can only log in to your assigned state portal');
          }

          // For super admins, use the selected tenant context instead of their assigned tenant
          let contextTenant = user.tenant;
          if (isSuperAdmin && selectedTenantId && selectedTenantId !== user.tenantId) {
            // Fetch the selected tenant for super admin context
            const selectedTenant = await prisma.tenant.findUnique({
              where: { id: selectedTenantId },
            });
            if (selectedTenant) {
              contextTenant = selectedTenant;
            }
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
                userName: `${user.firstName} ${user.lastName}`,
                userRole: user.accessLevel,
                action: 'LOGIN',
                entityType: 'USER',
                entityId: user.id,
                description: `User ${user.username} logged in to ${contextTenant.name}`,
                affectedFields: [],
              },
            });
          } catch (error) {
            console.error('Error updating login info:', error);
            // Continue with login even if audit log fails
          }

          return {
            id: user.id,
            email: user.email || user.username,
            name: `${user.firstName} ${user.lastName}`,
            accessLevel: user.accessLevel,
            tenantId: contextTenant.id,
            tenantName: contextTenant.name,
            tenantCode: contextTenant.code,
            tenantType: contextTenant.type,
            originalTenantId: user.tenantId, // Store original tenant for reference
          };
        } catch (error) {
          console.error('Database error during authentication:', error);
          const message = error instanceof Error ? error.message : '';
          if (message === 'Invalid credentials' || message.startsWith('Access denied:')) {
            throw error;
          }
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
        token.originalTenantId = user.originalTenantId;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.accessLevel = token.accessLevel as AccessLevel;
        session.user.tenantId = token.tenantId as string;
        session.user.tenantName = token.tenantName as string;
        session.user.tenantCode = token.tenantCode as string;
        session.user.tenantType = token.tenantType as string;
        session.user.originalTenantId = token.originalTenantId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/select-state',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
};

