import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPermissions } from '@/lib/permissions';
import { TenantType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const permissions = getPermissions(
      session.user.accessLevel,
      session.user.tenantType as TenantType
    );

    if (!permissions.canRead) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get cases assigned to this investigator
    const where: any = {
      investigatorId: session.user.id,
    };

    // Federal users can see all, state users only their own
    if (session.user.tenantType !== 'FEDERAL') {
      where.tenantId = session.user.tenantId;
    }

    const cases = await prisma.case.findMany({
      where,
      include: {
        victims: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
          take: 5,
        },
        perpetrators: {
          select: {
            id: true,
            name: true,
          },
          take: 5,
        },
        evidence: {
          select: {
            id: true,
            type: true,
          },
          take: 5,
        },
        witnesses: {
          select: {
            id: true,
            name: true,
          },
          take: 5,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ cases });
  } catch (error) {
    console.error('Error fetching investigator cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch investigator cases' },
      { status: 500 }
    );
  }
}

