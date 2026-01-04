import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stateCode = searchParams.get('state');

    // Get all tenants (states)
    const tenants = await prisma.tenant.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    if (stateCode) {
      // Get statistics for a specific state
      const tenant = await prisma.tenant.findUnique({
        where: { code: stateCode },
      });

      if (!tenant) {
        return NextResponse.json(
          { error: 'State not found' },
          { status: 404 }
        );
      }

      const [
        totalCases,
        activeCases,
        closedCases,
        casesByStatus,
        casesByPriority,
        recentCases,
        casesByMonth,
      ] = await Promise.all([
        // Total cases
        prisma.case.count({
          where: { tenantId: tenant.id },
        }),
        // Active cases
        prisma.case.count({
          where: {
            tenantId: tenant.id,
            status: { in: ['NEW', 'ACTIVE', 'INVESTIGATION', 'PENDING_COURT'] },
          },
        }),
        // Closed cases
        prisma.case.count({
          where: {
            tenantId: tenant.id,
            status: { in: ['CLOSED', 'ARCHIVED'] },
          },
        }),
        // Cases by status
        prisma.case.groupBy({
          by: ['status'],
          where: { tenantId: tenant.id },
          _count: true,
        }),
        // Cases by priority
        prisma.case.groupBy({
          by: ['priority'],
          where: { tenantId: tenant.id },
          _count: true,
        }),
        // Recent cases (last 10)
        prisma.case.findMany({
          where: { tenantId: tenant.id },
          orderBy: { reportedDate: 'desc' },
          take: 10,
          select: {
            id: true,
            caseNumber: true,
            title: true,
            status: true,
            priority: true,
            reportedDate: true,
          },
        }),
        // Cases by month (last 12 months)
        prisma.$queryRaw`
          SELECT 
            TO_CHAR(reported_date, 'YYYY-MM') as month,
            COUNT(*)::int as count
          FROM cases
          WHERE tenant_id = ${tenant.id}
            AND reported_date >= NOW() - INTERVAL '12 months'
          GROUP BY TO_CHAR(reported_date, 'YYYY-MM')
          ORDER BY month DESC
          LIMIT 12
        `,
      ]);

      return NextResponse.json({
        state: {
          name: tenant.name,
          code: tenant.code,
          type: tenant.type,
        },
        statistics: {
          totalCases,
          activeCases,
          closedCases,
          casesByStatus: casesByStatus.map((item) => ({
            status: item.status,
            count: item._count,
          })),
          casesByPriority: casesByPriority.map((item) => ({
            priority: item.priority,
            count: item._count,
          })),
          recentCases,
          casesByMonth,
        },
      });
    } else {
      // Get collective/national statistics
      const [
        totalCases,
        activeCases,
        closedCases,
        casesByStatus,
        casesByPriority,
        casesByState,
        casesByMonth,
      ] = await Promise.all([
        // Total cases nationwide
        prisma.case.count(),
        // Active cases nationwide
        prisma.case.count({
          where: {
            status: { in: ['NEW', 'ACTIVE', 'INVESTIGATION', 'PENDING_COURT'] },
          },
        }),
        // Closed cases nationwide
        prisma.case.count({
          where: {
            status: { in: ['CLOSED', 'ARCHIVED'] },
          },
        }),
        // Cases by status
        prisma.case.groupBy({
          by: ['status'],
          _count: true,
        }),
        // Cases by priority
        prisma.case.groupBy({
          by: ['priority'],
          _count: true,
        }),
        // Cases by state (top 10)
        prisma.case.groupBy({
          by: ['tenantId'],
          _count: true,
          orderBy: {
            _count: {
              tenantId: 'desc',
            },
          },
          take: 10,
        }),
        // Cases by month (last 12 months)
        prisma.$queryRaw`
          SELECT 
            TO_CHAR(reported_date, 'YYYY-MM') as month,
            COUNT(*)::int as count
          FROM cases
          WHERE reported_date >= NOW() - INTERVAL '12 months'
          GROUP BY TO_CHAR(reported_date, 'YYYY-MM')
          ORDER BY month DESC
          LIMIT 12
        `,
      ]);

      // Get tenant names for state statistics
      const tenantIds = casesByState.map((item) => item.tenantId);
      const tenantsData = await prisma.tenant.findMany({
        where: { id: { in: tenantIds } },
        select: { id: true, name: true, code: true },
      });

      const tenantMap = new Map(tenantsData.map((t) => [t.id, t]));

      return NextResponse.json({
        statistics: {
          totalCases,
          activeCases,
          closedCases,
          casesByStatus: casesByStatus.map((item) => ({
            status: item.status,
            count: item._count,
          })),
          casesByPriority: casesByPriority.map((item) => ({
            priority: item.priority,
            count: item._count,
          })),
          casesByState: casesByState.map((item) => ({
            state: tenantMap.get(item.tenantId)?.name || 'Unknown',
            code: tenantMap.get(item.tenantId)?.code || '',
            count: item._count,
          })),
          casesByMonth,
        },
        states: tenants.map((t) => ({
          name: t.name,
          code: t.code,
          type: t.type,
        })),
      });
    }
  } catch (error) {
    console.error('Error fetching public statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
