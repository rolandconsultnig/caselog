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

    const charges = await prisma.courtRecord.findMany({
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

    const charge = await prisma.courtRecord.create({
      data: {
        caseId: params.id,
        offenceNumber: `OFF${String(Date.now()).slice(-6)}`,
        offenceName: body.offenceName,
        offenceCode: body.offenceCode || null,
        law: body.applicableLaw || 'N/A',
        penalty: body.penalty || 'N/A',
        chargeDate: body.dateOfOffence ? new Date(body.dateOfOffence) : null,
        trialLocation: body.placeOfOffence || null,
        pleaType: body.pleaType,
        pleaDate: body.pleaDate ? new Date(body.pleaDate) : null,
        pleaBargainDetails: body.pleaDetails,
        verdict: body.verdictType,
        verdictDate: body.verdictDate ? new Date(body.verdictDate) : null,
        verdictDetails: body.verdictDetails,
        sentenceType: body.sentenceType,
        sentenceDetails: body.sentenceDetails,
        trialDate: body.courtDate ? new Date(body.courtDate) : null,
        notes: body.appealOutcome || null,
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
