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

    const charges = await prisma.caseOffence.findMany({
      where: { caseId: params.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ charges });
  } catch (error) {
    console.error('Error fetching charges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch charges' },
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

    const charge = await prisma.caseOffence.create({
      data: {
        caseId: params.id,
        offenceName: body.offenceName,
        offenceCode: body.offenceCode,
        applicableLaw: body.applicableLaw,
        penalty: body.penalty,
        dateOfOffence: body.dateOfOffence ? new Date(body.dateOfOffence) : null,
        placeOfOffence: body.placeOfOffence,
        pleaType: body.pleaType,
        pleaDate: body.pleaDate ? new Date(body.pleaDate) : null,
        pleaDetails: body.pleaDetails,
        verdictType: body.verdictType,
        verdictDate: body.verdictDate ? new Date(body.verdictDate) : null,
        verdictDetails: body.verdictDetails,
        sentenceType: body.sentenceType,
        sentenceDetails: body.sentenceDetails,
        courtDate: body.courtDate ? new Date(body.courtDate) : null,
        courtLocation: body.courtLocation,
        judgeName: body.judgeName,
        prosecutorName: body.prosecutorName,
        defenseAttorneyName: body.defenseAttorneyName,
        trialStatus: body.trialStatus,
        appealFiled: body.appealFiled || false,
        appealDate: body.appealDate ? new Date(body.appealDate) : null,
        appealOutcome: body.appealOutcome,
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
        entityType: 'CASE_OFFENCE',
        entityId: charge.id,
        entityName: `Legal charge added to case ${params.id}`,
      },
    });

    return NextResponse.json({ charge });
  } catch (error) {
    console.error('Error creating charge:', error);
    return NextResponse.json(
      { error: 'Failed to create charge' },
      { status: 500 }
    );
  }
}
