import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPermissions, canAccessCase } from '@/lib/permissions';
import { logAudit } from '@/lib/utils';
import { TenantType } from '@prisma/client';

// GET /api/deletion-requests - List deletion requests
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

    if (!permissions.canApproveDelete) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PENDING';

    const where: any = { status };

    // Filter by tenant for state users
    if (session.user.tenantType !== 'FEDERAL') {
      where.case = { tenantId: session.user.tenantId };
    }

    const requests = await prisma.deletionRequest.findMany({
      where,
      include: {
        case: {
          include: {
            tenant: true,
            victim: true,
          },
        },
        requestedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching deletion requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/deletion-requests - Create deletion request
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const permissions = getPermissions(
      session.user.accessLevel,
      session.user.tenantType as TenantType
    );

    if (!permissions.canRequestDelete) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { caseId, reason } = body;

    if (!caseId || !reason) {
      return NextResponse.json(
        { error: 'Case ID and reason are required' },
        { status: 400 }
      );
    }

    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
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

    // Create deletion request
    const deletionRequest = await prisma.deletionRequest.create({
      data: {
        caseId,
        requestedById: session.user.id,
        reason,
        status: 'PENDING',
      },
      include: {
        case: true,
        requestedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Log audit
    await logAudit({
      userId: session.user.id,
      action: 'CREATE',
      entityType: 'DeletionRequest',
      entityId: deletionRequest.id,
      caseId: caseData.id,
      description: `Requested deletion for case ${caseData.caseNumber}`,
    });

    return NextResponse.json(deletionRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating deletion request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

