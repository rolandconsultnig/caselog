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
      orderBy: { startDate: 'desc' },
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
        ngoName: body.ngoName,
        ngoType: body.ngoType,
        ngoContact: body.ngoContact,
        ngoEmail: body.ngoEmail,
        ngoAddress: body.ngoAddress,
        ngoWebsite: body.ngoWebsite,
        supportType: body.supportType,
        supportFrequency: body.supportFrequency,
        partnershipStatus: body.partnershipStatus,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        partnershipAgreement: body.partnershipAgreement,
        fundingProvided: body.fundingProvided ? parseFloat(body.fundingProvided) : null,
        fundingTerms: body.fundingTerms,
        servicesProvided: body.servicesProvided,
        targetBeneficiaries: body.targetBeneficiaries,
        geographicCoverage: body.geographicCoverage,
        monitoringFrequency: body.monitoringFrequency,
        reportingRequirements: body.reportingRequirements,
        ngoSatisfactionRating: body.ngoSatisfactionRating,
        partnershipChallenges: body.partnershipChallenges,
        successStories: body.successStories,
        lessonsLearned: body.lessonsLearned,
        renewalConsiderations: body.renewalConsiderations,
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
        entityType: 'CASE_CIVIL_SOCIETY',
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
