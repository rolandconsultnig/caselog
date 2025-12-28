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

    // Get cases with court records where this user is the prosecutor
    const where: any = {
      courtRecords: {
        some: {
          prosecutorId: session.user.id,
        },
      },
    };

    // Federal users can see all, state users only their own
    if (session.user.tenantType !== 'FEDERAL') {
      where.tenantId = session.user.tenantId;
    }

    const cases = await prisma.case.findMany({
      where,
      include: {
        courtRecords: {
          select: {
            id: true,
            offenceName: true,
            chargeNumber: true,
            trialDate: true,
            courtName: true,
            verdictReached: true,
            verdict: true,
            pleaType: true,
            pleaBargain: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ cases });
  } catch (error) {
    console.error('Error fetching prosecutor cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prosecutor cases' },
      { status: 500 }
    );
  }
}

