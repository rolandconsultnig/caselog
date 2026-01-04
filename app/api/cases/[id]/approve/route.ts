import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPermissions, canAccessCase } from '@/lib/permissions';
import { logAudit } from '@/lib/utils';
import { TenantType, CaseStatus } from '@prisma/client';

// POST /api/cases/[id]/approve - Approve case
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    // Only Level 3 can approve cases
    if (session.user.accessLevel !== 'LEVEL_3') {
      return NextResponse.json({ 
        error: 'Only Level 3 users can approve cases' 
      }, { status: 403 });
    }

    const caseData = await prisma.case.findUnique({
      where: { id: params.id },
    });

    if (!caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // Check access permissions
    if (
      !canAccessCase(
        session.user.tenantId,
        caseData.tenantId,
        session.user.tenantType as TenantType
      )
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (caseData.status !== 'PENDING_APPROVAL' as any) {
      return NextResponse.json(
        { error: 'Case is not pending approval' },
        { status: 400 }
      );
    }

    // Approve case
    const updatedCase = await prisma.case.update({
      where: { id: params.id },
      data: {
        status: 'APPROVED' as any,
        approvedBy: session.user.id,
        approvedAt: new Date(),
      } as any,
      include: {
        victims: true,
        perpetrators: true,
      },
    });

    // Log audit
    await logAudit({
      userId: session.user.id,
      userName: session.user.name || 'Unknown',
      userRole: session.user.accessLevel,
      action: 'APPROVE',
      entityType: 'Case',
      entityId: updatedCase.id,
      caseId: updatedCase.id,
      description: `Approved case ${updatedCase.caseNumber}`,
    });

    return NextResponse.json(updatedCase);
  } catch (error) {
    console.error('Error approving case:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

