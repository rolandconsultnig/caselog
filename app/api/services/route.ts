import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { Prisma, ServiceStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const caseId = searchParams.get('caseId');

    const where: Prisma.CaseServiceWhereInput = {};
    
    if (status && status !== 'all') {
      if ((Object.values(ServiceStatus) as string[]).includes(status)) {
        where.serviceStatus = status as ServiceStatus;
      }
    }
    
    if (caseId) {
      where.caseId = caseId;
    }

    const services = await prisma.caseService.findMany({
      where,
      orderBy: { referralDate: 'desc' },
      include: {
        case: {
          select: {
            id: true,
            caseNumber: true,
            title: true,
          },
        },
      },
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Generate service number
    const serviceCount = await prisma.caseService.count();
    const serviceNumber = `SRV${String(serviceCount + 1).padStart(3, '0')}`;

    const service = await prisma.caseService.create({
      data: {
        serviceNumber,
        caseId: body.caseId,
        victimId: body.victimId || null,
        serviceType: body.serviceType,
        serviceCategory: body.serviceCategory || null,
        serviceName: body.serviceName,
        providerName: body.providerName,
        providerType: body.providerType,
        providerContact: body.providerContact || null,
        providerAddress: body.providerAddress || null,
        providerEmail: body.providerEmail || null,
        providerPhone: body.providerPhone || null,
        referralDate: new Date(),
        referredBy: session.user.id,
        referredByName: session.user.name,
        referralReason: body.referralReason,
        urgency: body.urgency || 'MEDIUM',
        appointmentScheduled: body.appointmentScheduled || false,
        appointmentDate: body.appointmentDate ? new Date(body.appointmentDate) : null,
        appointmentTime: body.appointmentTime || null,
        appointmentLocation: body.appointmentLocation || null,
        estimatedCost: body.estimatedCost || null,
        fundingSource: body.fundingSource || null,
        serviceStatus: 'PENDING',
        sessionsCompleted: 0,
        paymentStatus: 'NOT_APPLICABLE',
        followUpRequired: false,
      },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}

