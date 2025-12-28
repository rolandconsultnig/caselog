import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const caseId = params.id;

    // Verify case exists and user has access
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!caseRecord) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // Get audit logs for this case
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        caseId: caseId,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Build timeline events
    const events = auditLogs.map((log) => ({
      id: log.id,
      type: mapActionToType(log.action),
      title: log.action.replace(/_/g, ' '),
      description: log.details,
      timestamp: log.createdAt.toISOString(),
      user: log.user,
      metadata: {
        action: log.action,
        entityType: log.entityType,
      },
    }));

    // Add case creation event if not in audit logs
    const hasCreationEvent = events.some((e) => e.type === 'created');
    if (!hasCreationEvent) {
      events.unshift({
        id: 'case-created',
        type: 'created',
        title: 'Case Created',
        description: `Case ${caseRecord.caseNumber} was created`,
        timestamp: caseRecord.createdAt.toISOString(),
        user: undefined,
        metadata: {},
      });
    }

    // Add approval event if case is approved
    if (caseRecord.status === 'APPROVED' && caseRecord.updatedAt) {
      const hasApprovalEvent = events.some((e) => e.type === 'approved');
      if (!hasApprovalEvent) {
        events.push({
          id: 'case-approved',
          type: 'approved',
          title: 'Case Approved',
          description: 'Case was approved',
          timestamp: caseRecord.updatedAt.toISOString(),
          user: undefined,
          metadata: {},
        });
      }
    }

    return NextResponse.json({
      caseId,
      events: events.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    });
  } catch (error) {
    console.error('Error fetching timeline:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeline' },
      { status: 500 }
    );
  }
}

function mapActionToType(action: string): 'created' | 'updated' | 'approved' | 'rejected' | 'status_change' | 'assigned' | 'comment' {
  const upperAction = action.toUpperCase();
  if (upperAction.includes('CREATE')) return 'created';
  if (upperAction.includes('APPROVE')) return 'approved';
  if (upperAction.includes('REJECT')) return 'rejected';
  if (upperAction.includes('ASSIGN')) return 'assigned';
  if (upperAction.includes('STATUS')) return 'status_change';
  if (upperAction.includes('COMMENT') || upperAction.includes('MESSAGE')) return 'comment';
  return 'updated';
}

