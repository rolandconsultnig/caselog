import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getPermissions } from '@/lib/permissions';
import { TenantType } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = params.userId;

    // Users can view their own profile, or admins can view any profile
    if (session.user.id !== userId) {
      const permissions = getPermissions(
        session.user.accessLevel,
        session.user.tenantType as TenantType
      );
      if (!permissions.canManageUsers) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenant: {
          select: {
            name: true,
            type: true,
          },
        },
        _count: {
          select: {
            casesCreated: true,
            casesInvestigating: true,
            casesCoordinating: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...user,
      casesCreated: user._count.casesCreated,
      casesInvestigating: user._count.casesInvestigating,
      casesCoordinating: user._count.casesCoordinating,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const permissions = getPermissions(
      session.user.accessLevel,
      session.user.tenantType as TenantType
    );

    if (!permissions.canManageUsers) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userId = params.userId;
    const body = await request.json();
    const { firstName, lastName, phoneNumber, accessLevel, isActive } = body;

    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (accessLevel) updateData.accessLevel = accessLevel;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        tenant: {
          select: {
            name: true,
            type: true,
          },
        },
      },
    });

    // Log user update
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE_USER',
        entityType: 'User',
        entityId: userId,
        details: `Updated user ${user.email}`,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

