import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { CasePriority, CaseStatus, CaseType, Prisma } from '@prisma/client';

type SearchFilters = {
  status: string | null;
  priority: string | null;
  caseType: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  state: string | null;
  lga: string | null;
};

type SearchResults = {
  cases: unknown[];
  victims: unknown[];
  suspects: unknown[];
  evidence: unknown[];
  documents: unknown[];
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // all, cases, victims, suspects, evidence
    const tenantId = searchParams.get('tenantId');
    const filters: SearchFilters = {
      status: searchParams.get('status'),
      priority: searchParams.get('priority'),
      caseType: searchParams.get('caseType'),
      dateFrom: searchParams.get('dateFrom'),
      dateTo: searchParams.get('dateTo'),
      state: searchParams.get('state'),
      lga: searchParams.get('lga'),
    };

    if (!query.trim() && type === 'all') {
      return NextResponse.json({ results: [] });
    }

    const results: SearchResults = {
      cases: [],
      victims: [],
      suspects: [],
      evidence: [],
      documents: [],
    };

    const scopeTenantId = session.user.tenantType !== 'FEDERAL' ? session.user.tenantId : tenantId;

    // Search cases
    if (type === 'all' || type === 'cases') {
      const caseWhere: Prisma.CaseWhereInput = {
        OR: [
          { caseNumber: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      };

      if (scopeTenantId) {
        caseWhere.tenantId = scopeTenantId;
      }

      // Apply filters
      if (filters.status && Object.values(CaseStatus).includes(filters.status as CaseStatus)) {
        caseWhere.status = filters.status as CaseStatus;
      }
      if (filters.priority && Object.values(CasePriority).includes(filters.priority as CasePriority)) {
        caseWhere.priority = filters.priority as CasePriority;
      }
      if (filters.caseType && Object.values(CaseType).includes(filters.caseType as CaseType)) {
        caseWhere.caseType = filters.caseType as CaseType;
      }
      if (filters.state) caseWhere.incidentState = filters.state;
      if (filters.lga) caseWhere.incidentLga = filters.lga;
      if (filters.dateFrom || filters.dateTo) {
        const reportedDate: Prisma.DateTimeFilter = {};
        if (filters.dateFrom) reportedDate.gte = new Date(filters.dateFrom);
        if (filters.dateTo) reportedDate.lte = new Date(filters.dateTo);
        caseWhere.reportedDate = reportedDate;
      }

      results.cases = await prisma.case.findMany({
        where: caseWhere,
        take: 20,
        orderBy: { reportedDate: 'desc' },
        select: {
          id: true,
          caseNumber: true,
          caseType: true,
          status: true,
          priority: true,
          reportedDate: true,
          incidentLocation: true,
        },
      });
    }

    // Search victims
    if (type === 'all' || type === 'victims') {
      const victimWhere: Prisma.VictimWhereInput = {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { middleName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phoneNumber: { contains: query, mode: 'insensitive' } },
          { currentAddress: { contains: query, mode: 'insensitive' } },
          { permanentAddress: { contains: query, mode: 'insensitive' } },
        ],
      };

      if (scopeTenantId) {
        victimWhere.case = { tenantId: scopeTenantId };
      }

      results.victims = await prisma.victim.findMany({
        where: victimWhere,
        take: 20,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          middleName: true,
          email: true,
          phoneNumber: true,
          dateOfBirth: true,
          caseId: true,
        },
      });
    }

    // Search perpetrators (suspects)
    if (type === 'all' || type === 'suspects') {
      const suspectWhere: Prisma.PerpetratorWhereInput = {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { middleName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phoneNumber: { contains: query, mode: 'insensitive' } },
          { currentAddress: { contains: query, mode: 'insensitive' } },
        ],
      };

      if (scopeTenantId) {
        suspectWhere.case = { tenantId: scopeTenantId };
      }

      results.suspects = await prisma.perpetrator.findMany({
        where: suspectWhere,
        take: 20,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          middleName: true,
          email: true,
          phoneNumber: true,
          dateOfBirth: true,
          caseId: true,
        },
      });
    }

    // Search evidence
    if (type === 'all' || type === 'evidence') {
      const evidenceWhere: Prisma.EvidenceWhereInput = {
        OR: [
          { evidenceNumber: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { collectionLocation: { contains: query, mode: 'insensitive' } },
        ],
      };

      if (scopeTenantId) {
        evidenceWhere.case = { tenantId: scopeTenantId };
      }

      results.evidence = await prisma.evidence.findMany({
        where: evidenceWhere,
        take: 20,
        orderBy: { collectedDate: 'desc' },
        select: {
          id: true,
          evidenceNumber: true,
          description: true,
          evidenceType: true,
          collectedDate: true,
          caseId: true,
        },
      });
    }

    // Search documents
    if (type === 'all' || type === 'documents') {
      const documentWhere: Prisma.CaseFileWhereInput = {
        OR: [
          { originalFileName: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
        ],
      };

      if (scopeTenantId) {
        documentWhere.case = { tenantId: scopeTenantId };
      }

      results.documents = await prisma.caseFile.findMany({
        where: documentWhere,
        take: 20,
        orderBy: { uploadDate: 'desc' },
        select: {
          id: true,
          originalFileName: true,
          fileType: true,
          description: true,
          uploadDate: true,
          caseId: true,
        },
      });
    }

    // Save search history
    if (query.trim()) {
      const resultCount = Object.values(results).reduce((sum, arr) => {
        if (!Array.isArray(arr)) return sum;
        return sum + arr.length;
      }, 0);

      await prisma.searchHistory.create({
        data: {
          userId: session.user.id,
          searchQuery: query,
          searchType: type,
          filters: filters as Prisma.InputJsonValue,
          resultCount,
        },
      });
    }

    return NextResponse.json({ results, query, type, filters });
  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}

