import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPermissions, canAccessCase } from '@/lib/permissions';
import { logAudit } from '@/lib/utils';
import { TenantType } from '@prisma/client';

// GET /api/cases/[id] - Get single case
export async function GET(
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

    if (!permissions.canRead) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const caseData = await prisma.case.findUnique({
      where: { id: params.id },
      include: {
        tenant: true,
        victims: true,
        perpetrators: true,
      },
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

    // Log audit
    await logAudit({
      userId: session.user.id,
      action: 'READ',
      entityType: 'Case',
      entityId: caseData.id,
      caseId: caseData.id,
      description: `Viewed case ${caseData.caseNumber}`,
    });

    return NextResponse.json(caseData);
  } catch (error) {
    console.error('Error fetching case:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/cases/[id] - Update case
export async function PATCH(
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

    // Only creator or higher levels can update
    if (
      caseData.createdById !== session.user.id &&
      !permissions.canApprove
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // Update case
    const updatedCase = await prisma.case.update({
      where: { id: params.id },
      data: body,
      include: {
        victims: true,
        perpetrators: true,
      },
    });

    // Log audit
    await logAudit({
      userId: session.user.id,
      action: 'UPDATE',
      entityType: 'Case',
      entityId: updatedCase.id,
      caseId: updatedCase.id,
      description: `Updated case ${updatedCase.caseNumber}`,
      metadata: body,
    });

    return NextResponse.json(updatedCase);
  } catch (error) {
    console.error('Error updating case:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/cases/[id] - Delete case (requires approval)
export async function DELETE(
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

    // Log before deletion
    await logAudit({
      userId: session.user.id,
      action: 'DELETE',
      entityType: 'Case',
      entityId: caseData.id,
      caseId: caseData.id,
      description: `Deleted case ${caseData.caseNumber}`,
    });

    // Delete case (cascade will handle related records)
    await prisma.case.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Case deleted successfully' });
  } catch (error) {
    console.error('Error deleting case:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

