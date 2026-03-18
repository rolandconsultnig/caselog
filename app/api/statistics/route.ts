import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPermissions } from '@/lib/permissions';
import { Prisma, TenantType } from '@prisma/client';
import { subDays, subMonths, startOfDay, endOfDay } from 'date-fns';

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
    const where: Prisma.CaseWhereInput = {
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

    const scopeTenantId = session.user.tenantType !== 'FEDERAL' ? session.user.tenantId : tenantId;

    // Get comprehensive case statistics
    const [
      totalCases,
      activeCases,
      closedCases,
      archivedCases,
      investigationCases,
      pendingCases,
      approvedCases,
      casesByType,
      casesByState,
      recentCases,
      lowPriorityCases,
      mediumPriorityCases,
      highPriorityCases,
      urgentPriorityCases,
      criticalPriorityCases,
      witnessesCount,
      evidenceCount,
      servicesCount,
      courtRecordsCount,
    ] = await Promise.all([
      // Total cases
      prisma.case.count({ where }),
      prisma.case.count({ where: { ...where, status: 'ACTIVE' } }),
      prisma.case.count({ where: { ...where, status: 'CLOSED' } }),
      prisma.case.count({ where: { ...where, status: 'ARCHIVED' } }),
      prisma.case.count({ where: { ...where, status: 'INVESTIGATION' } }),
      prisma.case.count({ where: { ...where, status: 'PENDING_APPROVAL' } }),
      prisma.case.count({ where: { ...where, status: 'APPROVED' } }),
      prisma.case.groupBy({
        by: ['caseType'],
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
          victims: { select: { firstName: true, lastName: true }, take: 1 },
          tenant: { select: { name: true, code: true } },
        },
      }),
      prisma.case.count({ where: { ...where, priority: 'LOW' } }),
      prisma.case.count({ where: { ...where, priority: 'MEDIUM' } }),
      prisma.case.count({ where: { ...where, priority: 'HIGH' } }),
      prisma.case.count({ where: { ...where, priority: 'URGENT' } }),
      prisma.case.count({ where: { ...where, priority: 'CRITICAL' } }),
      prisma.witness.count({
        where: scopeTenantId ? { case: { tenantId: scopeTenantId } } : {},
      }),
      prisma.evidence.count({
        where: scopeTenantId ? { case: { tenantId: scopeTenantId } } : {},
      }),
      prisma.caseService.count({
        where: scopeTenantId ? { case: { tenantId: scopeTenantId } } : {},
      }),
      prisma.courtRecord.count({
        where: scopeTenantId ? { case: { tenantId: scopeTenantId } } : {},
      }),
    ]);

    // Prisma `groupBy` with `_count: true` returns `_count` as a number.
    type CaseGroupByCaseTypeResult = { caseType: string; _count: number };
    type CaseGroupByTenantResult = { tenantId: string; _count: number };
    type StateStatistic = {
      tenantId: string;
      tenantName: string;
      tenantCode: string;
      count: number;
    };
    type FederalMetrics = {
      totalStates?: number;
      activeStates?: number;
      federalCases?: number;
      averageCasesPerState?: number;
      topPerformingStates?: StateStatistic[];
      statesWithNoCases?: string[];
    };

    // Get tenant names for state statistics and enhanced federal data
    let stateStatistics: StateStatistic[] = [];
    let federalMetrics: FederalMetrics = {};

    if (session.user.tenantType === 'FEDERAL' && (casesByState as unknown[]).length > 0) {
      const tenants = await prisma.tenant.findMany({
        where: {
          id: { in: (casesByState as CaseGroupByTenantResult[]).map((s) => s.tenantId) },
        },
      });

      stateStatistics = (casesByState as CaseGroupByTenantResult[]).map((stat) => {
        const tenant = tenants.find((t) => t.id === stat.tenantId);
        return {
          tenantId: stat.tenantId,
          tenantName: tenant?.name || 'Unknown',
          tenantCode: tenant?.code || 'N/A',
          count: stat._count,
        };
      });

      // Calculate federal-level metrics
      federalMetrics = {
        totalStates: tenants.length,
        activeStates: tenants.filter((t) => t.type === 'STATE').length,
        federalCases: totalCases,
        averageCasesPerState: totalCases > 0 ? Math.round(totalCases / tenants.length) : 0,
        topPerformingStates: stateStatistics
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
        statesWithNoCases: tenants.filter((tenant) =>
          !stateStatistics.find((stat) => stat.tenantId === tenant.id)
        ).map((tenant) => tenant.name),
      };
    }

    return NextResponse.json({
      summary: {
        total: totalCases,
        active: activeCases,
        closed: closedCases,
        archived: archivedCases,
        byStatus: {
          pending: pendingCases,
          approved: approvedCases,
          investigation: investigationCases,
          closed: closedCases,
          archived: archivedCases,
        },
      },
      casesByType: (casesByType as CaseGroupByCaseTypeResult[]).map((item) => ({
        type: item.caseType,
        count: item._count,
      })),
      casesByState: stateStatistics,
      federalMetrics,
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

