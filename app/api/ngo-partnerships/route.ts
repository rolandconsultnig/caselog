import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const completed = searchParams.get('completed');
    const caseId = searchParams.get('caseId');

    const where: any = {};
    
    if (active === 'true') {
      where.supportEndDate = null;
      where.finalReportSubmitted = false;
    }
    
    if (completed === 'true') {
      where.finalReportSubmitted = true;
    }
    
    if (caseId) {
      where.caseId = caseId;
    }

    const partnerships = await prisma.caseCivilSociety.findMany({
      where,
      orderBy: { supportStartDate: 'desc' },
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

    return NextResponse.json({ partnerships });
  } catch (error) {
    console.error('Error fetching partnerships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partnerships' },
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
    
    // Generate partnership number
    const partnershipCount = await prisma.caseCivilSociety.count();
    const partnershipNumber = `NGO${String(partnershipCount + 1).padStart(3, '0')}`;

    const partnership = await prisma.caseCivilSociety.create({
      data: {
        partnershipNumber,
        caseId: body.caseId,
        ngoName: body.ngoName,
        ngoType: body.ngoType || null,
        ngoRegistrationNumber: body.ngoRegistrationNumber || null,
        contactPerson: body.contactPerson,
        contactTitle: body.contactTitle || null,
        contactEmail: body.contactEmail || null,
        contactPhone: body.contactPhone,
        officeAddress: body.officeAddress || null,
        referralDate: new Date(),
        referredBy: session.user.id,
        referralReason: body.referralReason,
        servicesRequested: body.servicesRequested || [],
        supportStartDate: new Date(body.supportStartDate),
        supportFrequency: body.supportFrequency || null,
        progressReports: [],
        milestonesAchieved: [],
        finalReportSubmitted: false,
      },
    });

    return NextResponse.json({ partnership }, { status: 201 });
  } catch (error) {
    console.error('Error creating partnership:', error);
    return NextResponse.json(
      { error: 'Failed to create partnership' },
      { status: 500 }
    );
  }
}

