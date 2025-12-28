import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // all, cases, victims, suspects, evidence
    const filters = {
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

    const results: any = {
      cases: [],
      victims: [],
      suspects: [],
      evidence: [],
      documents: [],
    };

    // Search cases
    if (type === 'all' || type === 'cases') {
      const caseWhere: any = {
        OR: [
          { caseNumber: { contains: query, mode: 'insensitive' } },
          { mojFileNumber: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { incidentLocation: { contains: query, mode: 'insensitive' } },
        ],
      };

      // Apply filters
      if (filters.status) caseWhere.status = filters.status;
      if (filters.priority) caseWhere.priority = filters.priority;
      if (filters.caseType) caseWhere.caseType = filters.caseType;
      if (filters.state) caseWhere.incidentState = filters.state;
      if (filters.lga) caseWhere.incidentLGA = filters.lga;
      if (filters.dateFrom || filters.dateTo) {
        caseWhere.dateReported = {};
        if (filters.dateFrom) caseWhere.dateReported.gte = new Date(filters.dateFrom);
        if (filters.dateTo) caseWhere.dateReported.lte = new Date(filters.dateTo);
      }

      results.cases = await prisma.case.findMany({
        where: caseWhere,
        take: 20,
        orderBy: { dateReported: 'desc' },
        select: {
          id: true,
          caseNumber: true,
          mojFileNumber: true,
          caseType: true,
          status: true,
          priority: true,
          dateReported: true,
          incidentLocation: true,
        },
      });
    }

    // Search victims
    if (type === 'all' || type === 'victims') {
      const victimWhere: any = {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { middleName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phoneNumber: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } },
        ],
      };

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

    // Search suspects
    if (type === 'all' || type === 'suspects') {
      const suspectWhere: any = {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { middleName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phoneNumber: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } },
        ],
      };

      results.suspects = await prisma.suspect.findMany({
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
      const evidenceWhere: any = {
        OR: [
          { evidenceNumber: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { locationFound: { contains: query, mode: 'insensitive' } },
        ],
      };

      results.evidence = await prisma.evidence.findMany({
        where: evidenceWhere,
        take: 20,
        orderBy: { dateCollected: 'desc' },
        select: {
          id: true,
          evidenceNumber: true,
          description: true,
          evidenceType: true,
          dateCollected: true,
          caseId: true,
        },
      });
    }

    // Search documents
    if (type === 'all' || type === 'documents') {
      const documentWhere: any = {
        OR: [
          { originalFileName: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
        ],
      };

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
      await prisma.searchHistory.create({
        data: {
          userId: session.user.id,
          searchQuery: query,
          searchType: type,
          filters: filters as any,
          resultCount: Object.values(results).reduce((sum: number, arr: any) => sum + arr.length, 0),
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

