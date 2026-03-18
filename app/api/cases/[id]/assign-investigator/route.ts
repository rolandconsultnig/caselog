import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canAccessCase } from '@/lib/permissions';
import { logAudit } from '@/lib/utils';
import { TenantType } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only Level 3 can assign investigators
    if (session.user.accessLevel !== 'LEVEL_3') {
      return NextResponse.json(
        { error: 'Only Level 3 users can assign investigators' },
        { status: 403 }
      );
    }

    const { investigatorId } = await request.json();

    if (!investigatorId) {
      return NextResponse.json(
        { error: 'Investigator ID is required' },
        { status: 400 }
      );
    }

    const caseId = params.id;

    const existingCase = await prisma.case.findUnique({
      where: { id: caseId },
      select: {
        id: true,
        caseNumber: true,
        tenantId: true,
        status: true,
      },
    });

    if (!existingCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // Tenant isolation: state users can only assign within their tenant
    if (
      !canAccessCase(
        session.user.tenantId,
        existingCase.tenantId,
        session.user.tenantType as TenantType
      )
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify investigator exists and has INVESTIGATOR role
    const investigator = await prisma.user.findUnique({
      where: { id: investigatorId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        accessLevel: true,
        tenantId: true,
      },
    });

    if (!investigator || investigator.accessLevel !== 'INVESTIGATOR') {
      return NextResponse.json({ error: 'Invalid investigator' }, { status: 400 });
    }

    // For state users, prevent cross-tenant assignment
    if (session.user.tenantType !== 'FEDERAL' && investigator.tenantId !== existingCase.tenantId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedCase = await prisma.case.update({
      where: { id: caseId },
      data: {
        investigatorId,
      },
      include: {
        investigator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    await logAudit({
      userId: session.user.id,
      userName: session.user.name || session.user.email,
      userRole: session.user.accessLevel,
      action: 'ASSIGN',
      entityType: 'CASE',
      entityId: caseId,
      caseId,
      description: `Assigned investigator ${investigator.firstName} ${investigator.lastName} to case ${existingCase.caseNumber}`,
      metadata: {
        investigatorId,
      },
    });

    return NextResponse.json({
      message: 'Investigator assigned successfully',
      case: updatedCase,
    });
  } catch (error) {
    console.error('Error assigning investigator:', error);
    return NextResponse.json(
      { error: 'Failed to assign investigator' },
      { status: 500 }
    );
  }
}
