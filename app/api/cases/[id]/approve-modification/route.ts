import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CaseStatus } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only Level 4 can approve case modifications
    if (session.user.accessLevel !== 'LEVEL_4') {
      return NextResponse.json({ 
        error: 'Only Level 4 users can approve case modifications' 
      }, { status: 403 });
    }

    const caseId = params.id;

    // Check if case exists and is approved/active
    const existingCase = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!existingCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    if (existingCase.status !== 'APPROVED' as any && existingCase.status !== 'ACTIVE' as any) {
      return NextResponse.json({ 
        error: 'Case must be approved and active to approve modifications' 
      }, { status: 400 });
    }

    // Record modification approval
    const updatedCase = await prisma.case.update({
      where: { id: caseId },
      data: {
        modificationApprovedBy: session.user.id,
        modificationApprovedAt: new Date(),
      } as any,
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.accessLevel,
        action: 'APPROVE_MODIFICATION' as any,
        entityType: 'CASE',
        entityId: caseId,
        entityName: `Modification approved for case ${existingCase.caseNumber}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    return NextResponse.json({
      message: 'Case modification approved successfully',
      case: updatedCase,
    });

  } catch (error) {
    console.error('Error approving case modification:', error);
    return NextResponse.json(
      { error: 'Failed to approve case modification' },
      { status: 500 }
    );
  }
}
