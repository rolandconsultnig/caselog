import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPermissions } from '@/lib/permissions';
import { Prisma, TenantType } from '@prisma/client';

export async function GET() {
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

    // Build where clause
    const where: Prisma.CourtRecordWhereInput = {};

    // Federal users can see all, state users only their own
    if (session.user.tenantType !== 'FEDERAL') {
      where.case = {
        tenantId: session.user.tenantId,
      };
    }

    const records = await prisma.courtRecord.findMany({
      where,
      include: {
        case: {
          select: {
            id: true,
            caseNumber: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });

    return NextResponse.json({ records });
  } catch (error) {
    console.error('Error fetching court records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch court records' },
      { status: 500 }
    );
  }
}

