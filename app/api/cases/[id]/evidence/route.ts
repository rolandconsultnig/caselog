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
          orderBy: { transferDate: 'desc' },
          take: 1, // Latest custody record
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform the data to include custody status
    const evidenceWithCustody = evidence.map(item => ({
      ...item,
      chainOfCustody: item.chainOfCustody.length > 0,
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
        collectionDate: body.collectionDate ? new Date(body.collectionDate) : new Date(),
        collectionLocation: body.collectionLocation,
        collectedBy: body.collectedBy,
        storageLocation: body.storageLocation,
        forensicExaminerName: body.forensicExaminerName,
        forensicExaminerID: body.forensicExaminerID,
        forensicExaminerAgency: body.forensicExaminerAgency,
        forensicExaminerContact: body.forensicExaminerContact,
        forensicReportPath: body.forensicReportPath,
        forensicAnalysis: body.forensicAnalysis || false,
        analysisDate: body.analysisDate ? new Date(body.analysisDate) : null,
        analysisResults: body.analysisResults,
        chainOfCustody: body.chainOfCustody || false,
        createdById: session.user.id,
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
