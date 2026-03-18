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

    const ngoPartnerships = await prisma.caseCivilSociety.findMany({
      where: { caseId: params.id },
      orderBy: { supportStartDate: 'desc' },
    });

    return NextResponse.json({ ngoPartnerships });
  } catch (error) {
    console.error('Error fetching NGO partnerships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NGO partnerships' },
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

    const ngoPartnership = await prisma.caseCivilSociety.create({
      data: {
        caseId: params.id,
        partnershipNumber: body.partnershipNumber || `NGO${Date.now()}`,
        ngoName: body.ngoName,
        ngoType: body.ngoType,
        ngoRegistrationNumber: body.ngoRegistrationNumber,
        contactPerson: body.contactPerson || body.ngoContact || '',
        contactTitle: body.contactTitle,
        contactEmail: body.contactEmail || body.ngoEmail,
        contactPhone: body.contactPhone || '',
        officeAddress: body.officeAddress || body.ngoAddress,
        referralDate: body.referralDate ? new Date(body.referralDate) : new Date(),
        referredBy: session.user.id,
        referralReason: body.referralReason || '',
        servicesRequested: body.servicesRequested || [],
        supportStartDate: body.supportStartDate || body.startDate ? new Date(body.supportStartDate || body.startDate) : new Date(),
        supportEndDate: body.supportEndDate || body.endDate ? new Date(body.supportEndDate || body.endDate) : null,
        supportDuration: body.supportDuration,
        supportFrequency: body.supportFrequency,
        progressReports: body.progressReports || [],
        milestonesAchieved: body.milestonesAchieved || [],
        challengesFaced: body.challengesFaced || body.partnershipChallenges,
        finalReportSubmitted: body.finalReportSubmitted || false,
        finalReportDate: body.finalReportDate ? new Date(body.finalReportDate) : null,
        finalReportPath: body.finalReportPath,
        overallOutcome: body.overallOutcome || body.successStories,
        recommendationsForFuture: body.recommendationsForFuture || body.lessonsLearned,
        satisfactionRating: body.satisfactionRating || body.ngoSatisfactionRating,
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
        entityId: ngoPartnership.id,
        entityName: `NGO partnership added to case ${params.id}`,
      },
    });

    return NextResponse.json({ ngoPartnership });
  } catch (error) {
    console.error('Error creating NGO partnership:', error);
    return NextResponse.json(
      { error: 'Failed to create NGO partnership' },
      { status: 500 }
    );
  }
}
