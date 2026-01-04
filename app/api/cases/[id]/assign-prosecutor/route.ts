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

    // Only Level 3 can assign prosecutors
    if (session.user.accessLevel !== 'LEVEL_3') {
      return NextResponse.json({ 
        error: 'Only Level 3 users can assign prosecutors' 
      }, { status: 403 });
    }

    const { prosecutorId } = await request.json();

    if (!prosecutorId) {
      return NextResponse.json({ 
        error: 'Prosecutor ID is required' 
      }, { status: 400 });
    }

    // Verify prosecutor exists and has PROSECUTOR role
    const prosecutor = await prisma.user.findUnique({
      where: { id: prosecutorId },
    });

    if (!prosecutor || prosecutor.accessLevel !== 'PROSECUTOR') {
      return NextResponse.json({ 
        error: 'Invalid prosecutor' 
      }, { status: 400 });
    }

    const caseId = params.id;

    // Check if case exists and is approved
    const existingCase = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!existingCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    if (existingCase.status !== 'APPROVED' as any) {
      return NextResponse.json({ 
        error: 'Case must be approved before assigning prosecutor' 
      }, { status: 400 });
    }

    // Assign prosecutor
    const updatedCase = await prisma.case.update({
      where: { id: caseId },
      data: {
        prosecutorId,
        prosecutorAssignedAt: new Date(),
        status: 'ACTIVE' as any,
      } as any,
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.accessLevel,
        action: 'ASSIGN_PROSECUTOR' as any,
        entityType: 'CASE',
        entityId: caseId,
        entityName: `Prosecutor ${prosecutor.firstName} ${prosecutor.lastName} assigned to case ${existingCase.caseNumber}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    return NextResponse.json({
      message: 'Prosecutor assigned successfully',
      case: updatedCase,
    });

  } catch (error) {
    console.error('Error assigning prosecutor:', error);
    return NextResponse.json(
      { error: 'Failed to assign prosecutor' },
      { status: 500 }
    );
  }
}
