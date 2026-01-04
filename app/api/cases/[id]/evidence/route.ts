import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const evidence = await prisma.evidence.findMany({
      where: { caseId: params.id },
      include: {
        chainOfCustody: {
          include: {
            custodyTransfers: {
              orderBy: { transferDate: 'desc' },
              take: 1, // Latest custody transfer
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform the data to include custody status
    const evidenceWithCustody = evidence.map(item => ({
      ...item,
      hasChainOfCustody: item.chainOfCustody !== null,
      latestTransfer: item.chainOfCustody?.custodyTransfers?.[0] || null,
    }));

    return NextResponse.json({ evidence: evidenceWithCustody });
  } catch (error) {
    console.error('Error fetching evidence:', error);
    return NextResponse.json(
      { error: 'Failed to fetch evidence' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Get the next evidence number for this case
    const evidenceCount = await prisma.evidence.count({
      where: { caseId: params.id },
    });

    const evidence = await prisma.evidence.create({
      data: {
        caseId: params.id,
        evidenceNumber: `EVD${String(evidenceCount + 1).padStart(3, '0')}`,
        evidenceType: body.evidenceType,
        description: body.description,
        collectedDate: body.collectedDate || body.collectionDate ? new Date(body.collectedDate || body.collectionDate) : new Date(),
        collectedTime: body.collectedTime,
        collectedBy: body.collectedBy,
        collectedByName: body.collectedByName || session.user.name || '',
        collectionLocation: body.collectionLocation || body.collectionLocation,
        storageLocation: body.storageLocation,
        storageType: body.storageType || 'SECURE',
        forensicAnalysisRequired: body.forensicAnalysisRequired || false,
        forensicAnalysisRequested: body.forensicAnalysisRequested || false,
        forensicAnalysisDate: body.forensicAnalysisDate ? new Date(body.forensicAnalysisDate) : null,
        forensicLab: body.forensicLab,
        forensicAnalystName: body.forensicAnalystName || body.forensicExaminerName,
        forensicAnalystID: body.forensicAnalystID || body.forensicExaminerID,
        forensicReportNumber: body.forensicReportNumber,
        forensicReportPath: body.forensicReportPath,
        currentCustodian: session.user.id,
        currentCustodianName: session.user.name || '',
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.accessLevel,
        action: 'CREATE',
        entityType: 'EVIDENCE',
        entityId: evidence.id,
        entityName: `Evidence ${evidence.evidenceNumber} added to case ${params.id}`,
      },
    });

    return NextResponse.json({ evidence });
  } catch (error) {
    console.error('Error creating evidence:', error);
    return NextResponse.json(
      { error: 'Failed to create evidence' },
      { status: 500 }
    );
  }
}
