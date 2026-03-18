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
      orderBy: { createdAt: 'desc' },
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
        offenceNumber: body.offenceNumber || `OFF${Date.now()}`,
        offenceName: body.offenceName || 'Court Record',
        offenceCode: body.offenceCode,
        offenceCategory: body.offenceCategory,
        law: body.law || '',
        section: body.section,
        act: body.act,
        penalty: body.penalty || '',
        minimumSentence: body.minimumSentence,
        maximumSentence: body.maximumSentence,
        chargeDate: body.chargeDate ? new Date(body.chargeDate) : null,
        chargeNumber: body.chargeNumber,
        chargingAuthority: body.chargingAuthority,
        chargedBy: body.chargedBy,
        evidenceIds: body.evidenceIds || [],
        witnessIds: body.witnessIds || [],
        supportingDocuments: body.supportingDocuments || [],
        pleaEntered: body.pleaEntered || false,
        pleaDate: body.pleaDate ? new Date(body.pleaDate) : null,
        pleaType: body.pleaType || 'NOT_ENTERED',
        pleaBargain: body.pleaBargain || false,
        pleaBargainDetails: body.pleaBargainDetails,
        trialDate: body.trialDate ? new Date(body.trialDate) : null,
        trialLocation: body.trialLocation || body.courtLocation,
        courtName: body.courtName,
        prosecutorId: body.prosecutorId,
        defenseAttorney: body.defenseAttorney || body.defenseAttorneyName,
        presidingJudge: body.presidingJudge,
        verdictReached: body.verdictReached || false,
        verdictDate: body.verdictDate ? new Date(body.verdictDate) : null,
        verdict: body.verdict,
        verdictDetails: body.verdictDetails,
        sentenced: body.sentenced || false,
        sentenceDate: body.sentenceDate ? new Date(body.sentenceDate) : null,
        sentenceType: body.sentenceType,
        sentenceDuration: body.sentenceDuration,
        fineAmount: body.fineAmount ? parseFloat(body.fineAmount) : null,
        sentenceDetails: body.sentenceDetails,
        appealFiled: body.appealFiled || false,
        appealDate: body.appealDate ? new Date(body.appealDate) : null,
        appealOutcome: body.appealOutcome,
        appealDetails: body.appealDetails,
        notes: body.notes || body.remarks,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.accessLevel,
        action: 'CREATE',
        entityType: 'CASE',
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
