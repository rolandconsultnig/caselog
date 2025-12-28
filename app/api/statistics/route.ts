import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPermissions } from '@/lib/permissions';
import { TenantType } from '@prisma/client';
import { subDays, subMonths, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';

// GET /api/statistics - Get dashboard statistics
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

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const timeRange = searchParams.get('range') || '30d';

    // Calculate date range
    const now = new Date();
    let dateFrom: Date;

    switch (timeRange) {
      case '7d':
        dateFrom = subDays(now, 7);
        break;
      case '30d':
        dateFrom = subDays(now, 30);
        break;
      case '90d':
        dateFrom = subDays(now, 90);
        break;
      case '1y':
        dateFrom = subMonths(now, 12);
        break;
      case 'all':
        dateFrom = new Date('2020-01-01'); // Start from a reasonable date
        break;
      default:
        dateFrom = subDays(now, 30);
    }

    // Build where clause
    const where: any = {
      createdAt: {
        gte: startOfDay(dateFrom),
        lte: endOfDay(now),
      },
    };

    if (session.user.tenantType !== 'FEDERAL') {
      where.tenantId = session.user.tenantId;
    } else if (tenantId) {
      where.tenantId = tenantId;
    }

    // Get comprehensive case statistics
    const [
      totalCases,
      draftCases,
      pendingCases,
      approvedCases,
      rejectedCases,
      casesByType,
      casesByState,
      recentCases,
      // Additional analytics
      investigationCases,
      closedCases,
      archivedCases,
      highPriorityCases,
      mediumPriorityCases,
      lowPriorityCases,
      urgentPriorityCases,
      criticalPriorityCases,
      witnessesCount,
      evidenceCount,
      servicesCount,
      courtRecordsCount,
    ] = await Promise.all([
      prisma.case.count({ where }),
      prisma.case.count({ where: { ...where, status: 'DRAFT' } }),
      prisma.case.count({ where: { ...where, status: 'PENDING_APPROVAL' } }),
      prisma.case.count({ where: { ...where, status: 'APPROVED' } }),
      prisma.case.count({ where: { ...where, status: 'REJECTED' } }),
      prisma.case.groupBy({
        by: ['formOfSGBV'],
        where,
        _count: true,
      }),
      session.user.tenantType === 'FEDERAL'
        ? prisma.case.groupBy({
            by: ['tenantId'],
            _count: true,
          })
        : Promise.resolve([]),
      prisma.case.findMany({
        where,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          victim: { select: { name: true } },
          tenant: { select: { name: true, code: true } },
        },
      }),
      // Additional analytics queries
      prisma.case.count({ where: { ...where, status: 'INVESTIGATION' } }),
      prisma.case.count({ where: { ...where, status: 'CLOSED' } }),
      prisma.case.count({ where: { ...where, status: 'ARCHIVED' } }),
      prisma.case.count({ where: { ...where, priority: 'HIGH' } }),
      prisma.case.count({ where: { ...where, priority: 'MEDIUM' } }),
      prisma.case.count({ where: { ...where, priority: 'LOW' } }),
      prisma.case.count({ where: { ...where, priority: 'URGENT' } }),
      prisma.case.count({ where: { ...where, priority: 'CRITICAL' } }),
      prisma.witness.count({ where: { case: where } }),
      prisma.evidence.count({ where: { case: where } }),
      prisma.caseService.count({ where: { case: where } }),
      prisma.courtRecord.count({ where: { case: where } }),
    ]);

    // Get tenant names for state statistics
    let stateStatistics = [];
    if (session.user.tenantType === 'FEDERAL' && casesByState.length > 0) {
      const tenants = await prisma.tenant.findMany({
        where: {
          id: { in: casesByState.map((s: any) => s.tenantId) },
        },
      });

      stateStatistics = casesByState.map((stat: any) => {
        const tenant = tenants.find((t) => t.id === stat.tenantId);
        return {
          tenantId: stat.tenantId,
          tenantName: tenant?.name || 'Unknown',
          tenantCode: tenant?.code || 'N/A',
          count: stat._count,
        };
      });
    }

    return NextResponse.json({
      summary: {
        total: totalCases,
        draft: draftCases,
        pending: pendingCases,
        approved: approvedCases,
        rejected: rejectedCases,
        investigation: investigationCases,
        closed: closedCases,
        archived: archivedCases,
      },
      casesByType: casesByType.map((item: any) => ({
        type: item.formOfSGBV,
        count: item._count,
      })),
      casesByState: stateStatistics,
      priorityDistribution: {
        low: lowPriorityCases,
        medium: mediumPriorityCases,
        high: highPriorityCases,
        urgent: urgentPriorityCases,
        critical: criticalPriorityCases,
      },
      systemMetrics: {
        witnesses: witnessesCount,
        evidence: evidenceCount,
        services: servicesCount,
        courtRecords: courtRecordsCount,
      },
      recentCases,
      timeRange,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

