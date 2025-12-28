import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; chargeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const charge = await prisma.caseOffence.findUnique({
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
    const existingCharge = await prisma.caseOffence.findUnique({
      where: { id: params.chargeId },
    });

    if (!existingCharge || existingCharge.caseId !== params.id) {
      return NextResponse.json({ error: 'Charge not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};

    // Handle plea update
    if (body.plea) {
      updateData.pleaType = body.plea.pleaType;
      updateData.pleaDate = body.plea.pleaDate ? new Date(body.plea.pleaDate) : null;
      updateData.pleaDetails = body.plea.pleaDetails;
      if (body.plea.pleaType) {
        updateData.trialStatus = 'PLEA_RECORDED';
      }
    }

    // Handle trial update
    if (body.trial) {
      updateData.courtDate = body.trial.courtDate ? new Date(body.trial.courtDate) : null;
      updateData.courtLocation = body.trial.courtLocation;
      updateData.judgeName = body.trial.judgeName;
      updateData.prosecutorName = body.trial.prosecutorName;
      updateData.defenseAttorneyName = body.trial.defenseAttorneyName;
      if (body.trial.courtDate) {
        updateData.trialStatus = 'TRIAL';
      }
    }

    // Handle verdict update
    if (body.verdict) {
      updateData.verdictType = body.verdict.verdictType;
      updateData.verdictDate = body.verdict.verdictDate ? new Date(body.verdict.verdictDate) : null;
      updateData.verdictDetails = body.verdict.verdictDetails;
      updateData.sentenceType = body.verdict.sentenceType;
      updateData.sentenceDetails = body.verdict.sentenceDetails;
      if (body.verdict.verdictType) {
        updateData.trialStatus = 'VERDICT';
      }
    }

    // Handle appeal update
    if (body.appeal) {
      updateData.appealFiled = body.appeal.appealFiled !== false;
      updateData.appealDate = body.appeal.appealDate ? new Date(body.appeal.appealDate) : null;
      updateData.appealOutcome = body.appeal.appealOutcome;
    }

    // Update charge
    const charge = await prisma.caseOffence.update({
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
        entityType: 'CASE_OFFENCE',
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

