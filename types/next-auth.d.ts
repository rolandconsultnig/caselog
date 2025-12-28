import { AccessLevel, TenantType } from '@prisma/client';
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    accessLevel: AccessLevel;
    tenantId: string;
    tenantName: string;
    tenantCode: string;
    tenantType: TenantType;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      accessLevel: AccessLevel;
      tenantId: string;
      tenantName: string;
      tenantCode: string;
      tenantType: TenantType;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    accessLevel: AccessLevel;
    tenantId: string;
    tenantName: string;
    tenantCode: string;
    tenantType: TenantType;
  }
}

