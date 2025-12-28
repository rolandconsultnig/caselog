import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPermissions } from '@/lib/permissions';
import { logAudit } from '@/lib/utils';
import { TenantType } from '@prisma/client';

// POST /api/deletion-requests/[id]/approve - Approve deletion request
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

    if (!permissions.canApproveDelete) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const deletionRequest = await prisma.deletionRequest.findUnique({
      where: { id: params.id },
      include: { case: true },
    });

    if (!deletionRequest) {
      return NextResponse.json(
        { error: 'Deletion request not found' },
        { status: 404 }
      );
    }

    if (deletionRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Deletion request is not pending' },
        { status: 400 }
      );
    }

    // Approve and delete the case
    await prisma.$transaction(async (tx) => {
      // Update deletion request
      await tx.deletionRequest.update({
        where: { id: params.id },
        data: {
          status: 'APPROVED',
          approvedById: session.user.id,
          approvedAt: new Date(),
        },
      });

      // Log before deletion
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'DELETE',
          entityType: 'Case',
          entityId: deletionRequest.caseId,
          caseId: deletionRequest.caseId,
          description: `Approved deletion request and deleted case ${deletionRequest.case.caseNumber}`,
        },
      });

      // Delete the case
      await tx.case.delete({
        where: { id: deletionRequest.caseId },
      });
    });

    return NextResponse.json({ message: 'Deletion request approved and case deleted' });
  } catch (error) {
    console.error('Error approving deletion request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

