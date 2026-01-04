import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays, subMonths, startOfMonth, endOfMonth, startOfDay, endOfDay, format } from 'date-fns';

// GET /api/public/statistics - Get public dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stateId = searchParams.get('state');
    const timeRange = searchParams.get('range') || 'all';

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
        dateFrom = new Date('2020-01-01');
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

    // Filter by state if specified
    if (stateId && stateId !== 'all') {
      where.tenantId = stateId;
    }

    // Get comprehensive statistics (public data only)
    const [
      totalCases,
      approvedCases,
      closedCases,
      casesByType,
      casesByState,
      monthlyTrend,
      availableStates,
      thisMonthCases,
    ] = await Promise.all([
      // Total cases
      prisma.case.count({ where }),
      
      // Approved cases (publicly resolved)
      prisma.case.count({ where: { ...where, status: 'APPROVED' } }),
      
      // Closed cases
      prisma.case.count({ where: { ...where, status: 'CLOSED' } }),
      
      // Cases by type
      prisma.case.groupBy({
        by: ['caseType'],
        where,
        _count: true,
      }),
      
      // Cases by state
      prisma.case.groupBy({
        by: ['tenantId'],
        where,
        _count: true,
      }),
      
      // Monthly trend (last 12 months)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*) as cases
        FROM "Case" 
        WHERE "createdAt" >= ${subMonths(now, 12)}
        ${stateId && stateId !== 'all' ? prisma.$queryRaw`AND "tenantId" = ${stateId}` : prisma.$queryRaw``}
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month ASC
      `,
      
      // Available states
      prisma.tenant.findMany({
        where: { type: 'STATE' },
        select: { id: true, name: true, code: true },
        orderBy: { name: 'asc' },
      }),
      
      // This month cases
      prisma.case.count({
        where: {
          createdAt: {
            gte: startOfMonth(now),
            lte: endOfDay(now),
          },
          ...(stateId && stateId !== 'all' ? { tenantId: stateId } : {}),
        },
      }),
    ]);

    // Process state statistics
    let stateStatistics: any[] = [];
    let activeStatesCount = 0;
    
    if (casesByState.length > 0) {
      const tenants = await prisma.tenant.findMany({
        where: {
          id: { in: casesByState.map((s: any) => s.tenantId) },
        },
        select: { id: true, name: true, code: true },
      });

      stateStatistics = casesByState.map((stat: any) => {
        const tenant = tenants.find((t) => t.id === stat.tenantId);
        return {
          tenantId: stat.tenantId,
          tenantName: tenant?.name || 'Unknown',
          tenantCode: tenant?.code || 'N/A',
          count: stat._count,
        };
      }).sort((a, b) => b.count - a.count);

      activeStatesCount = new Set(casesByState.map((s: any) => s.tenantId)).size;
    }

    // Calculate resolution rate
    const resolutionRate = totalCases > 0 
      ? Math.round(((approvedCases + closedCases) / totalCases) * 100) 
      : 0;

    // Process monthly trend data
    const processedMonthlyTrend = (monthlyTrend as any[]).map(item => ({
      month: format(new Date(item.month), 'MMM yyyy'),
      cases: Number(item.cases),
    }));

    // Process cases by type
    const processedCasesByType = casesByType.map((item: any) => ({
      type: item.caseType,
      count: item._count,
    }));

    // Return public statistics (anonymized and aggregated)
    return NextResponse.json({
      summary: {
        total: totalCases,
        approved: approvedCases,
        closed: closedCases,
        resolutionRate,
        activeStates: activeStatesCount,
        thisMonth: thisMonthCases,
      },
      casesByType: processedCasesByType,
      casesByState: stateStatistics,
      stateComparison: stateStatistics.slice(0, 15), // Top 15 states
      monthlyTrend: processedMonthlyTrend,
      availableStates,
      timeRange,
      generatedAt: new Date().toISOString(),
      disclaimer: 'This data is anonymized and aggregated to protect privacy. Individual case details are not publicly accessible.',
    });
  } catch (error) {
    console.error('Error fetching public statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
