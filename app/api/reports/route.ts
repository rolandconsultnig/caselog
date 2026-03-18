import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPermissions } from '@/lib/permissions';
import { CasePriority, CaseStatus, CaseType, Jurisdiction, Prisma, TenantType } from '@prisma/client';

// GET /api/reports - Generate custom reports
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

    if (!permissions.canGenerateReports) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'summary';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const tenantId = searchParams.get('tenantId');
    const sgbvType = searchParams.get('sgbvType');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const state = searchParams.get('state');
    const jurisdiction = searchParams.get('jurisdiction');

    // Build where clause
    const where: Prisma.CaseWhereInput = {};

    // Tenant filtering
    if (session.user.tenantType !== 'FEDERAL') {
      where.tenantId = session.user.tenantId;
    } else if (tenantId) {
      where.tenantId = tenantId;
    }

    // Date range filtering
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Advanced filters
    if (sgbvType) {
      // Map legacy query param `sgbvType` to the `caseType` enum field
      if (Object.values(CaseType).includes(sgbvType as CaseType)) {
        where.caseType = sgbvType as CaseType;
      }
    }

    if (status) {
      if (Object.values(CaseStatus).includes(status as CaseStatus)) {
        where.status = status as CaseStatus;
      }
    }

    if (priority) {
      if (Object.values(CasePriority).includes(priority as CasePriority)) {
        where.priority = priority as CasePriority;
      }
    }

    if (state) {
      where.incidentState = {
        contains: state,
        mode: 'insensitive',
      };
    }

    if (jurisdiction) {
      if (Object.values(Jurisdiction).includes(jurisdiction as Jurisdiction)) {
        where.jurisdiction = jurisdiction as Jurisdiction;
      }
    }

    switch (reportType) {
      case 'summary':
        return await generateSummaryReport(where);
      
      case 'cases':
        return await generateDetailedReport(where);
      
      case 'analytics':
        return await generateTrendsReport(where);
      
      case 'export':
        return await generateDetailedReport(where);
      
      default:
        return await generateSummaryReport(where);
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateSummaryReport(where: Prisma.CaseWhereInput) {
  const [
    totalCases,
    statusBreakdown,
    typeBreakdown,
    resolutionRate,
    averageProcessingTime,
  ] = await Promise.all([
    prisma.case.count({ where }),
    prisma.case.groupBy({
      by: ['status'],
      where,
      _count: true,
    }),
    prisma.case.groupBy({
      by: ['caseType'],
      where,
      _count: true,
    }),
    calculateResolutionRate(where),
    calculateAverageProcessingTime(where),
  ]);

  return NextResponse.json({
    reportType: 'summary',
    generatedAt: new Date().toISOString(),
    data: {
      totalCases,
      statusBreakdown,
      typeBreakdown,
      resolutionRate,
      averageProcessingTime,
    },
  });
}

async function generateDetailedReport(where: Prisma.CaseWhereInput) {
  const cases = await prisma.case.findMany({
    where,
    include: {
      victims: true,
      perpetrators: true,
      courtRecords: true,
      tenant: true,
      createdBy: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({
    reportType: 'detailed',
    generatedAt: new Date().toISOString(),
    totalRecords: cases.length,
    data: cases,
  });
}

async function generateTrendsReport(where: Prisma.CaseWhereInput) {
  // Get cases grouped by month
  const cases = await prisma.case.findMany({
    where,
    select: {
      createdAt: true,
      status: true,
      caseType: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  // Group by month
  type MonthlyBucket = {
    month: string;
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
  };

  const monthlyData = cases.reduce<Record<string, MonthlyBucket>>((acc, caseItem) => {
    const month = new Date(caseItem.createdAt).toISOString().slice(0, 7);
    if (!acc[month]) {
      acc[month] = {
        month,
        total: 0,
        byStatus: {},
        byType: {},
      };
    }
    acc[month].total++;
    acc[month].byStatus[caseItem.status] = (acc[month].byStatus[caseItem.status] || 0) + 1;
    acc[month].byType[caseItem.caseType || 'N/A'] = (acc[month].byType[caseItem.caseType || 'N/A'] || 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    reportType: 'trends',
    generatedAt: new Date().toISOString(),
    data: Object.values(monthlyData),
  });
}

async function calculateResolutionRate(where: Prisma.CaseWhereInput) {
  const total = await prisma.case.count({ where });
  const resolved = await prisma.case.count({
    where: {
      ...where,
      status: { in: ['APPROVED', 'CLOSED', 'ARCHIVED'] },
    },
  });
  return total > 0 ? ((resolved / total) * 100).toFixed(2) : '0.00';
}

async function calculateAverageProcessingTime(where: Prisma.CaseWhereInput) {
  const cases = await prisma.case.findMany({
    where: {
      ...where,
    },
    select: {
      createdAt: true,
      updatedAt: true,
    },
  });

  if (cases.length === 0) return 0;

  const totalDays = cases.reduce((sum, caseItem) => {
    const diff = new Date(caseItem.updatedAt).getTime() - new Date(caseItem.createdAt).getTime();
    return sum + diff / (1000 * 60 * 60 * 24);
  }, 0);

  return (totalDays / cases.length).toFixed(1);
}

