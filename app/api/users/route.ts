import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getPermissions } from '@/lib/permissions';
import { TenantType } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const permissions = getPermissions(session.user.accessLevel, session.user.tenantType as TenantType);

    if (!permissions.canManageUsers) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tenant: {
          select: {
            name: true,
          },
        },
      },
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      accessLevel: user.accessLevel,
      tenantName: user.tenant.name,
      isActive: user.isActive,
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const permissions = getPermissions(session.user.accessLevel, session.user.tenantType as TenantType);

    if (!permissions.canManageUsers) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { firstName, lastName, email, password, accessLevel, tenantId } = body;

    if (!firstName || !lastName || !email || !password || !accessLevel || !tenantId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        accessLevel,
        tenantId,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
