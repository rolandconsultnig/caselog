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

    const witnesses = await prisma.witness.findMany({
      where: { caseId: params.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ witnesses });
  } catch (error) {
    console.error('Error fetching witnesses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch witnesses' },
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

    // Get the next witness number for this case
    const witnessCount = await prisma.witness.count({
      where: { caseId: params.id },
    });

    const witness = await prisma.witness.create({
      data: {
        caseId: params.id,
        witnessNumber: `WIT${String(witnessCount + 1).padStart(3, '0')}`,
        firstName: body.firstName,
        lastName: body.lastName,
        middleName: body.middleName,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        gender: body.gender,
        phoneNumber: body.phoneNumber,
        email: body.email,
        address: body.address,
        city: body.city,
        state: body.state,
        occupation: body.occupation,
        relationshipToVictim: body.relationshipToVictim,
        witnessType: body.witnessType,
        protectionLevel: body.protectionLevel,
        threatLevel: body.threatLevel,
        credibilityRating: body.credibilityRating,
        statementText: body.statementText || '',
        statementDate: body.statementDate ? new Date(body.statementDate) : new Date(),
        statementRecordedBy: body.statementRecordedBy || session.user.id,
        statementLocation: body.statementLocation,
        statementAudioPath: body.statementAudioPath,
        statementVideoPath: body.statementVideoPath,
        requiresInterpreter: body.requiresInterpreter || body.interpreterRequired || false,
        interpreterLanguage: body.interpreterLanguage,
        protectionMeasures: body.protectionMeasures || [],
        specialNeeds: body.specialNeeds,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.accessLevel,
        action: 'CREATE',
        entityType: 'WITNESS',
        entityId: witness.id,
        entityName: `Witness ${witness.witnessNumber} added to case ${params.id}`,
      },
    });

    return NextResponse.json({ witness });
  } catch (error) {
    console.error('Error creating witness:', error);
    return NextResponse.json(
      { error: 'Failed to create witness' },
      { status: 500 }
    );
  }
}
