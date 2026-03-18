import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canAccessCase } from '@/lib/permissions';
import { Prisma, TenantType } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only Level 3 can load assignees list for assignment
    if (session.user.accessLevel !== 'LEVEL_3') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const caseId = params.id;

    const caseRow = await prisma.case.findUnique({
      where: { id: caseId },
      select: {
        id: true,
        tenantId: true,
      },
    });

    if (!caseRow) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    if (
      !canAccessCase(
        session.user.tenantId,
        caseRow.tenantId,
        session.user.tenantType as TenantType
      )
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const whereBase: Prisma.UserWhereInput = {
      isActive: true,
      accessLevel: { in: ['INVESTIGATOR', 'PROSECUTOR'] },
    };

    // State users: only users within same tenant
    if (session.user.tenantType !== 'FEDERAL') {
      whereBase.tenantId = caseRow.tenantId;
    }

    const users = await prisma.user.findMany({
      where: whereBase,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        accessLevel: true,
      },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
    });

    const investigators = users
      .filter((u) => u.accessLevel === 'INVESTIGATOR')
      .map((u) => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`.trim(),
        email: u.email,
      }));

    const prosecutors = users
      .filter((u) => u.accessLevel === 'PROSECUTOR')
      .map((u) => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`.trim(),
        email: u.email,
      }));

    return NextResponse.json({ investigators, prosecutors });
  } catch (error) {
    console.error('Error fetching assignees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignees' },
      { status: 500 }
    );
  }
}
