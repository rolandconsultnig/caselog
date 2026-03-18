import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { Prisma } from '@prisma/client';

type TransformedCustodyRecord = {
  id: string;
  evidenceId: string;
  evidenceNumber: string;
  transferredFrom: string;
  transferredTo: string;
  transferDate: string;
  purpose: string;
  condition: string;
  receivedBy: string | null;
  receivedBySignature?: string | null;
  notes: string | null;
  transferNumber?: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const evidenceId = searchParams.get('evidenceId');

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get evidence items for this case
    const evidenceWhere: Prisma.EvidenceWhereInput = { caseId: params.id };
    if (evidenceId) {
      evidenceWhere.id = evidenceId;
    }

    const evidenceItems = await prisma.evidence.findMany({
      where: evidenceWhere,
      select: { id: true, evidenceNumber: true },
    });

    // Get chain of custody records for these evidence items
    const custodyRecords = await prisma.chainOfCustody.findMany({
      where: {
        evidenceId: { in: evidenceItems.map(e => e.id) },
      },
      include: {
        evidence: {
          select: {
            evidenceNumber: true,
          },
        },
        custodyTransfers: {
          orderBy: { transferDate: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform data for frontend - flatten transfers
    const transformedRecords: TransformedCustodyRecord[] = [];
    custodyRecords.forEach(custody => {
      if (custody.custodyTransfers.length === 0) {
        // If no transfers, show the initial custody record
        transformedRecords.push({
          id: custody.id,
          evidenceId: custody.evidenceId,
          evidenceNumber: custody.evidence.evidenceNumber,
          transferredFrom: custody.currentCustodian,
          transferredTo: custody.currentCustodian,
          transferDate: custody.createdAt.toISOString(),
          purpose: 'Initial custody',
          condition: 'EXCELLENT',
          receivedBy: custody.currentCustodianName,
          notes: 'Initial custody assignment',
        });
      } else {
        // Add each transfer as a record
        custody.custodyTransfers.forEach(transfer => {
          transformedRecords.push({
            id: transfer.id,
            evidenceId: custody.evidenceId,
            evidenceNumber: custody.evidence.evidenceNumber,
            transferredFrom: transfer.transferredFromName,
            transferredTo: transfer.transferredToName,
            transferDate: transfer.transferDate.toISOString(),
            purpose: transfer.reasonDetails || transfer.transferReason,
            condition: transfer.conditionAfter,
            receivedBy: transfer.receivedByName,
            receivedBySignature: transfer.receiverSignature,
            notes: transfer.notes,
            transferNumber: transfer.transferNumber,
          });
        });
      }
    });

    return NextResponse.json({ custodyRecords: transformedRecords });
  } catch (error) {
    console.error('Error fetching custody records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch custody records' },
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

    // Check if ChainOfCustody record exists for this evidence
    let chainOfCustody = await prisma.chainOfCustody.findUnique({
      where: { evidenceId: body.evidenceId },
    });

    // If no chain of custody exists, create one
    if (!chainOfCustody) {
      // Get the latest transfer number for this case
      const latestTransfer = await prisma.custodyTransfer.findFirst({
        orderBy: { transferNumber: 'desc' },
      });

      let transferNumber = 'COC001';
      if (latestTransfer) {
        const num = parseInt(latestTransfer.transferNumber.replace('COC', ''));
        transferNumber = `COC${String(num + 1).padStart(3, '0')}`;
      }

      chainOfCustody = await prisma.chainOfCustody.create({
        data: {
          evidenceId: body.evidenceId,
          transferNumber,
          currentCustodian: body.transferredFrom,
          currentCustodianName: body.transferredFromName,
          currentCustodianTitle: body.transferredFromTitle,
          currentCustodianAgency: body.transferredFromAgency,
        },
      });
    }

    // Get the latest transfer number for this chain of custody
    const latestTransfer = await prisma.custodyTransfer.findFirst({
      where: { chainOfCustodyId: chainOfCustody.id },
      orderBy: { transferNumber: 'desc' },
    });

    let transferNumber = 'T001';
    if (latestTransfer) {
      const num = parseInt(latestTransfer.transferNumber.replace('T', ''));
      transferNumber = `T${String(num + 1).padStart(3, '0')}`;
    }

    // Create custody transfer
    const transferDate = new Date(`${body.transferDate}T${body.transferTime}`);
    const receivedDate = new Date(`${body.receivedDate}T${body.receivedTime}`);

    const custodyTransfer = await prisma.custodyTransfer.create({
      data: {
        chainOfCustodyId: chainOfCustody.id,
        transferNumber,
        transferredFrom: body.transferredFrom,
        transferredFromName: body.transferredFromName,
        transferredFromTitle: body.transferredFromTitle,
        transferredFromAgency: body.transferredFromAgency,
        transferredTo: body.transferredTo,
        transferredToName: body.transferredToName,
        transferredToTitle: body.transferredToTitle,
        transferredToAgency: body.transferredToAgency,
        transferDate,
        transferTime: body.transferTime,
        transferLocation: body.transferLocation,
        transferReason: body.transferReason,
        reasonDetails: body.reasonDetails,
        conditionBefore: body.conditionBefore,
        conditionAfter: body.conditionAfter,
        conditionNotes: body.conditionNotes,
        damageReported: body.damageReported || false,
        damageDescription: body.damageDescription,
        receivedBy: body.receivedBy,
        receivedByName: body.receivedByName,
        receivedDate,
        receivedTime: body.receivedTime,
        verificationMethod: body.verificationMethod,
        discrepanciesNoted: body.discrepanciesNoted || false,
        discrepancyDetails: body.discrepancyDetails,
        transferrerSignature: body.transferrerSignature || '',
        transferrerSignatureDate: transferDate,
        receiverSignature: body.receiverSignature,
        receiverSignatureDate: receivedDate,
        witnessSignature: body.witnessSignature,
        witnessName: body.witnessName,
        compliesWithProtocol: body.compliesWithProtocol !== false,
        protocolDeviations: body.protocolDeviations,
        correctiveActions: body.correctiveActions,
        notes: body.notes,
      },
    });

    // Update chain of custody current custodian
    await prisma.chainOfCustody.update({
      where: { id: chainOfCustody.id },
      data: {
        currentCustodian: body.transferredTo,
        currentCustodianName: body.transferredToName,
        currentCustodianTitle: body.transferredToTitle,
        currentCustodianAgency: body.transferredToAgency,
        allSignaturesObtained: !!(body.transferrerSignature && body.receiverSignature),
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
        entityId: custodyTransfer.id,
        entityName: `Custody transfer ${transferNumber} created for evidence in case ${params.id}`,
      },
    });

    return NextResponse.json({ custodyTransfer });
  } catch (error: unknown) {
    console.error('Error creating custody transfer:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create custody transfer' },
      { status: 500 }
    );
  }
}
