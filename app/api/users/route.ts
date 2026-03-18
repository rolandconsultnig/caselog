import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getPermissions } from '@/lib/permissions';
import { Prisma, TenantType } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const permissions = getPermissions(session.user.accessLevel, session.user.tenantType as TenantType);

    if (!permissions.canManageUsers) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Build where clause for tenant filtering
    const where: Prisma.UserWhereInput = {};
    
    // State admins can only see users from their own state
    // Federal users can see all users
    if (session.user.tenantType !== 'FEDERAL') {
      where.tenantId = session.user.tenantId;
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        tenant: true,
      },
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      accessLevel: user.accessLevel,
      tenantName: user.tenant.name,
      tenantType: user.tenant.type,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      lastLogin: user.lastLogin?.toISOString(),
      department: '',
      position: '',
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
    const username: string =
      typeof body.username === 'string' && body.username.trim()
        ? body.username.trim()
        : typeof email === 'string'
          ? email.split('@')[0]
          : '';

    if (!firstName || !lastName || !email || !password || !accessLevel || !tenantId || !username) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate tenant assignment: State admins can only create users for their own state
    if (session.user.tenantType !== 'FEDERAL' && tenantId !== session.user.tenantId) {
      return NextResponse.json({ 
        error: 'You can only create users for your own state' 
      }, { status: 403 });
    }

    // Validate role assignment restrictions
    const currentUserLevel = session.user.accessLevel;
  
    switch (currentUserLevel) {
      case 'LEVEL_4':
        // Level 4 can create users up to Level 3 plus Investigators and Prosecutors
        if (!['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'INVESTIGATOR', 'PROSECUTOR'].includes(accessLevel)) {
          return NextResponse.json({ error: 'Level 4 admins can only create users up to Level 3, plus Investigators and Prosecutors' }, { status: 403 });
        }
        break;
      case 'LEVEL_5':
        // Level 5 can create users up to Level 4 plus Investigators and Prosecutors (but not other Level 5)
        if (!['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'INVESTIGATOR', 'PROSECUTOR'].includes(accessLevel)) {
          return NextResponse.json({ error: 'Level 5 admins can only create users up to Level 4, plus Investigators and Prosecutors' }, { status: 403 });
        }
        break;
      case 'SUPER_ADMIN':
      case 'APP_ADMIN':
        // Admins can create any role
        break;
      default:
        return NextResponse.json({ error: 'You do not have permission to create users' }, { status: 403 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        accessLevel,
        tenant: { connect: { id: tenantId } },
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
