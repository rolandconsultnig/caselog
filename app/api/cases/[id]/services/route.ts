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
        victimId: body.victimId,
        serviceNumber: body.serviceNumber || `SRV${Date.now()}`,
        serviceType: body.serviceType,
        serviceCategory: body.serviceCategory,
        serviceName: body.serviceName || body.serviceDescription,
        providerName: body.providerName,
        providerType: body.providerType,
        providerContact: body.providerContact,
        providerAddress: body.providerAddress,
        providerEmail: body.providerEmail,
        providerPhone: body.providerPhone,
        referralDate: body.referralDate ? new Date(body.referralDate) : new Date(),
        referredBy: session.user.id,
        referredByName: session.user.name || '',
        referralReason: body.referralReason || '',
        urgency: body.urgency || body.serviceUrgency || 'MEDIUM',
        appointmentScheduled: body.appointmentScheduled || false,
        appointmentDate: body.appointmentDate ? new Date(body.appointmentDate) : null,
        appointmentTime: body.appointmentTime,
        appointmentLocation: body.appointmentLocation,
        serviceStartDate: body.serviceStartDate || body.actualStartDate || body.expectedStartDate ? new Date(body.serviceStartDate || body.actualStartDate || body.expectedStartDate) : null,
        serviceEndDate: body.serviceEndDate || body.completionDate || body.expectedCompletionDate ? new Date(body.serviceEndDate || body.completionDate || body.expectedCompletionDate) : null,
        serviceDuration: body.serviceDuration,
        sessionsPlanned: body.sessionsPlanned,
        serviceStatus: body.serviceStatus || 'PENDING',
        estimatedCost: body.estimatedCost || body.cost ? parseFloat(body.estimatedCost || body.cost) : null,
        actualCost: body.actualCost ? parseFloat(body.actualCost) : null,
        fundingSource: body.fundingSource,
        paymentStatus: body.paymentStatus || 'NOT_APPLICABLE',
        outcomeAchieved: body.outcomeAchieved,
        outcomeDescription: body.outcomeDescription || body.outcome,
        beneficiarySatisfaction: body.beneficiarySatisfaction || body.satisfactionLevel,
        feedback: body.feedback || body.progressNotes,
        followUpRequired: body.followUpRequired || false,
        followUpDate: body.followUpDate ? new Date(body.followUpDate) : null,
        notes: body.notes || body.followUpNotes,
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
