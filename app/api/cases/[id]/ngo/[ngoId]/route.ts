import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; ngoId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const partnership = await prisma.caseCivilSociety.findUnique({
      where: { id: params.ngoId },
    });

    if (!partnership || partnership.caseId !== params.id) {
      return NextResponse.json({ error: 'Partnership not found' }, { status: 404 });
    }

    return NextResponse.json({ partnership });
  } catch (error) {
    console.error('Error fetching partnership:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partnership' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; ngoId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Check if partnership exists
    const existingPartnership = await prisma.caseCivilSociety.findUnique({
      where: { id: params.ngoId },
    });

    if (!existingPartnership || existingPartnership.caseId !== params.id) {
      return NextResponse.json({ error: 'Partnership not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};

    // Handle progress report update
    if (body.progress) {
      const currentReports = Array.isArray(existingPartnership.progressReports) 
        ? existingPartnership.progressReports 
        : [];
      updateData.progressReports = [...currentReports, body.progress];
    }

    // Handle milestone update
    if (body.milestone) {
      const currentMilestones = existingPartnership.milestonesAchieved || [];
      updateData.milestonesAchieved = body.milestone;
    }

    // Handle final report update
    if (body.finalReport) {
      updateData.finalReportSubmitted = body.finalReport.finalReportSubmitted !== false;
      updateData.finalReportDate = body.finalReport.finalReportDate 
        ? new Date(body.finalReport.finalReportDate) 
        : new Date();
      updateData.finalReportPath = body.finalReport.finalReportPath;
      updateData.overallOutcome = body.finalReport.overallOutcome;
      updateData.recommendationsForFuture = body.finalReport.recommendationsForFuture;
    }

    // Handle satisfaction update
    if (body.satisfaction) {
      updateData.satisfactionRating = body.satisfaction.satisfactionRating;
    }

    // Update partnership
    const partnership = await prisma.caseCivilSociety.update({
      where: { id: params.ngoId },
      data: updateData,
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.accessLevel,
        action: 'UPDATE',
        entityType: 'CASE_CIVIL_SOCIETY',
        entityId: partnership.id,
        entityName: `NGO partnership updated in case ${params.id}`,
      },
    });

    return NextResponse.json({ partnership });
  } catch (error) {
    console.error('Error updating partnership:', error);
    return NextResponse.json(
      { error: 'Failed to update partnership' },
      { status: 500 }
    );
  }
}

