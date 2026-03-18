import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; chargeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const charge = await prisma.courtRecord.findUnique({
      where: { id: params.chargeId },
    });

    if (!charge || charge.caseId !== params.id) {
      return NextResponse.json({ error: 'Charge not found' }, { status: 404 });
    }

    return NextResponse.json({ charge });
  } catch (error) {
    console.error('Error fetching charge:', error);
    return NextResponse.json(
      { error: 'Failed to fetch charge' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; chargeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Check if charge exists
    const existingCharge = await prisma.courtRecord.findUnique({
      where: { id: params.chargeId },
    });

    if (!existingCharge || existingCharge.caseId !== params.id) {
      return NextResponse.json({ error: 'Charge not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: Prisma.CourtRecordUpdateInput = {};

    // Handle plea update
    if (body.plea) {
      updateData.pleaType = body.plea.pleaType;
      updateData.pleaDate = body.plea.pleaDate ? new Date(body.plea.pleaDate) : null;
      updateData.pleaBargainDetails = body.plea.pleaDetails;
    }

    // Handle trial update
    if (body.trial) {
      updateData.trialDate = body.trial.courtDate ? new Date(body.trial.courtDate) : null;
      updateData.trialLocation = body.trial.courtLocation;
      updateData.presidingJudge = body.trial.judgeName;
      updateData.defenseAttorney = body.trial.defenseAttorneyName;
    }

    // Handle verdict update
    if (body.verdict) {
      updateData.verdict = body.verdict.verdictType;
      updateData.verdictDate = body.verdict.verdictDate ? new Date(body.verdict.verdictDate) : null;
      updateData.verdictDetails = body.verdict.verdictDetails;
      updateData.sentenceType = body.verdict.sentenceType;
      updateData.sentenceDetails = body.verdict.sentenceDetails;
    }

    // Handle appeal update
    if (body.appeal) {
      updateData.appealFiled = body.appeal.appealFiled !== false;
      updateData.appealDate = body.appeal.appealDate ? new Date(body.appeal.appealDate) : null;
      updateData.appealOutcome = body.appeal.appealOutcome;
    }

    // Update charge
    const charge = await prisma.courtRecord.update({
      where: { id: params.chargeId },
      data: updateData,
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.accessLevel,
        action: 'UPDATE',
        entityType: 'CASE',
        entityId: charge.id,
        entityName: `Charge updated in case ${params.id}`,
      },
    });

    return NextResponse.json({ charge });
  } catch (error) {
    console.error('Error updating charge:', error);
    return NextResponse.json(
      { error: 'Failed to update charge' },
      { status: 500 }
    );
  }
}

