import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPermissions } from '@/lib/permissions';
import { TenantType } from '@prisma/client';

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
    const formOfSGBV = searchParams.get('formOfSGBV');

    // Build where clause
    const where: any = {};

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

    // SGBV type filtering
    if (formOfSGBV) {
      where.formOfSGBV = formOfSGBV;
    }

    switch (reportType) {
      case 'summary':
        return await generateSummaryReport(where);
      
      case 'detailed':
        return await generateDetailedReport(where);
      
      case 'trends':
        return await generateTrendsReport(where);
      
      case 'performance':
        return await generatePerformanceReport(where);
      
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateSummaryReport(where: any) {
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
      by: ['formOfSGBV'],
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

async function generateDetailedReport(where: any) {
  const cases = await prisma.case.findMany({
    where,
    include: {
      victim: true,
      perpetrator: true,
      offence: true,
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

async function generateTrendsReport(where: any) {
  // Get cases grouped by month
  const cases = await prisma.case.findMany({
    where,
    select: {
      createdAt: true,
      status: true,
      formOfSGBV: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  // Group by month
  const monthlyData = cases.reduce((acc: any, caseItem) => {
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
    acc[month].byType[caseItem.formOfSGBV] = (acc[month].byType[caseItem.formOfSGBV] || 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    reportType: 'trends',
    generatedAt: new Date().toISOString(),
    data: Object.values(monthlyData),
  });
}

async function generatePerformanceReport(where: any) {
  const [
    totalCases,
    approvedCases,
    rejectedCases,
    pendingCases,
    averageApprovalTime,
  ] = await Promise.all([
    prisma.case.count({ where }),
    prisma.case.count({ where: { ...where, status: 'APPROVED' } }),
    prisma.case.count({ where: { ...where, status: 'REJECTED' } }),
    prisma.case.count({ where: { ...where, status: 'PENDING_APPROVAL' } }),
    calculateAverageApprovalTime(where),
  ]);

  const approvalRate = totalCases > 0 ? (approvedCases / totalCases) * 100 : 0;
  const rejectionRate = totalCases > 0 ? (rejectedCases / totalCases) * 100 : 0;

  return NextResponse.json({
    reportType: 'performance',
    generatedAt: new Date().toISOString(),
    data: {
      totalCases,
      approvedCases,
      rejectedCases,
      pendingCases,
      approvalRate: approvalRate.toFixed(2),
      rejectionRate: rejectionRate.toFixed(2),
      averageApprovalTime,
    },
  });
}

async function calculateResolutionRate(where: any) {
  const total = await prisma.case.count({ where });
  const resolved = await prisma.case.count({
    where: {
      ...where,
      status: { in: ['APPROVED', 'CLOSED', 'ARCHIVED'] },
    },
  });
  return total > 0 ? ((resolved / total) * 100).toFixed(2) : '0.00';
}

async function calculateAverageProcessingTime(where: any) {
  const cases = await prisma.case.findMany({
    where: {
      ...where,
      approvedAt: { not: null },
    },
    select: {
      createdAt: true,
      approvedAt: true,
    },
  });

  if (cases.length === 0) return 0;

  const totalDays = cases.reduce((sum, caseItem) => {
    const diff = new Date(caseItem.approvedAt!).getTime() - new Date(caseItem.createdAt).getTime();
    return sum + diff / (1000 * 60 * 60 * 24);
  }, 0);

  return (totalDays / cases.length).toFixed(1);
}

async function calculateAverageApprovalTime(where: any) {
  const cases = await prisma.case.findMany({
    where: {
      ...where,
      status: 'APPROVED',
      approvedAt: { not: null },
    },
    select: {
      createdAt: true,
      approvedAt: true,
    },
  });

  if (cases.length === 0) return 0;

  const totalHours = cases.reduce((sum, caseItem) => {
    const diff = new Date(caseItem.approvedAt!).getTime() - new Date(caseItem.createdAt).getTime();
    return sum + diff / (1000 * 60 * 60);
  }, 0);

  return (totalHours / cases.length).toFixed(1);
}

