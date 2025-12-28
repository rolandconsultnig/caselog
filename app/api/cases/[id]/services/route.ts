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

    const services = await prisma.caseService.findMany({
      where: { caseId: params.id },
      orderBy: { referralDate: 'desc' },
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
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

    const service = await prisma.caseService.create({
      data: {
        caseId: params.id,
        serviceType: body.serviceType,
        providerName: body.providerName,
        providerType: body.providerType,
        providerContact: body.providerContact,
        providerAddress: body.providerAddress,
        serviceUrgency: body.serviceUrgency,
        serviceStatus: body.serviceStatus,
        paymentStatus: body.paymentStatus,
        referralDate: new Date(body.referralDate),
        referralReason: body.referralReason,
        expectedStartDate: body.expectedStartDate ? new Date(body.expectedStartDate) : null,
        expectedCompletionDate: body.expectedCompletionDate ? new Date(body.expectedCompletionDate) : null,
        actualStartDate: body.actualStartDate ? new Date(body.actualStartDate) : null,
        completionDate: body.completionDate ? new Date(body.completionDate) : null,
        cost: body.cost ? parseFloat(body.cost) : null,
        fundingSource: body.fundingSource,
        serviceDescription: body.serviceDescription,
        serviceObjectives: body.serviceObjectives,
        progressNotes: body.progressNotes,
        outcome: body.outcome,
        satisfactionLevel: body.satisfactionLevel,
        followUpRequired: body.followUpRequired || false,
        followUpDate: body.followUpDate ? new Date(body.followUpDate) : null,
        followUpNotes: body.followUpNotes,
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
        entityType: 'CASE_SERVICE',
        entityId: service.id,
        entityName: `Service referral added to case ${params.id}`,
      },
    });

    return NextResponse.json({ service });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
