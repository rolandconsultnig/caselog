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

    const courtRecords = await prisma.courtRecord.findMany({
      where: { caseId: params.id },
      orderBy: { hearingDate: 'desc' },
    });

    return NextResponse.json({ courtRecords });
  } catch (error) {
    console.error('Error fetching court records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch court records' },
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

    const courtRecord = await prisma.courtRecord.create({
      data: {
        caseId: params.id,
        courtName: body.courtName,
        courtLocation: body.courtLocation,
        presidingJudge: body.presidingJudge,
        caseNumber: body.caseNumber,
        hearingDate: new Date(body.hearingDate),
        hearingTime: body.hearingTime,
        hearingType: body.hearingType,
        courtRoom: body.courtRoom,
        presidingJudge: body.presidingJudge,
        prosecutorPresent: body.prosecutorPresent,
        prosecutorName: body.prosecutorName,
        defensePresent: body.defensePresent,
        defenseAttorneyName: body.defenseAttorneyName,
        victimPresent: body.victimPresent,
        witnessesPresent: body.witnessesPresent || [],
        decision: body.decision,
        decisionSummary: body.decisionSummary,
        nextHearingDate: body.nextHearingDate ? new Date(body.nextHearingDate) : null,
        nextHearingTime: body.nextHearingTime,
        nextHearingType: body.nextHearingType,
        courtOrder: body.courtOrder,
        finesImposed: body.finesImposed,
        finesAmount: body.finesAmount ? parseFloat(body.finesAmount) : null,
        bailModified: body.bailModified || false,
        bailAmount: body.bailAmount ? parseFloat(body.bailAmount) : null,
        bailConditions: body.bailConditions,
        sentencing: body.sentencing,
        sentenceDetails: body.sentenceDetails,
        appealRights: body.appealRights,
        remarks: body.remarks,
        transcriptPath: body.transcriptPath,
        audioRecordingPath: body.audioRecordingPath,
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
        entityType: 'COURT_RECORD',
        entityId: courtRecord.id,
        entityName: `Court record added to case ${params.id}`,
      },
    });

    return NextResponse.json({ courtRecord });
  } catch (error) {
    console.error('Error creating court record:', error);
    return NextResponse.json(
      { error: 'Failed to create court record' },
      { status: 500 }
    );
  }
}
