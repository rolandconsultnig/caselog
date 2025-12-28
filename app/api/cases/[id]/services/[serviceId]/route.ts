import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; serviceId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = await prisma.caseService.findUnique({
      where: { id: params.serviceId },
    });

    if (!service || service.caseId !== params.id) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; serviceId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Check if service exists
    const existingService = await prisma.caseService.findUnique({
      where: { id: params.serviceId },
    });

    if (!existingService || existingService.caseId !== params.id) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};

    // Handle appointment update
    if (body.appointment) {
      updateData.appointmentScheduled = body.appointment.appointmentScheduled !== false;
      updateData.appointmentDate = body.appointment.appointmentDate ? new Date(body.appointment.appointmentDate) : null;
      updateData.appointmentTime = body.appointment.appointmentTime;
      updateData.appointmentLocation = body.appointment.appointmentLocation;
      updateData.appointmentConfirmed = body.appointment.appointmentConfirmed || false;
    }

    // Handle tracking update
    if (body.tracking) {
      updateData.serviceStatus = body.tracking.serviceStatus;
      updateData.serviceStartDate = body.tracking.serviceStartDate ? new Date(body.tracking.serviceStartDate) : null;
      updateData.serviceEndDate = body.tracking.serviceEndDate ? new Date(body.tracking.serviceEndDate) : null;
      updateData.appointmentAttended = body.tracking.appointmentAttended;
      updateData.appointmentOutcome = body.tracking.appointmentOutcome;
    }

    // Handle cost update
    if (body.cost) {
      updateData.cost = body.cost.cost;
      updateData.fundingSource = body.cost.fundingSource;
      updateData.paymentStatus = body.cost.paymentStatus;
    }

    // Handle satisfaction update
    if (body.satisfaction) {
      updateData.satisfactionLevel = body.satisfaction.satisfactionLevel;
      updateData.satisfactionNotes = body.satisfaction.satisfactionNotes;
    }

    // Update service
    const service = await prisma.caseService.update({
      where: { id: params.serviceId },
      data: updateData,
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.accessLevel,
        action: 'UPDATE',
        entityType: 'CASE_SERVICE',
        entityId: service.id,
        entityName: `Service updated in case ${params.id}`,
      },
    });

    return NextResponse.json({ service });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

