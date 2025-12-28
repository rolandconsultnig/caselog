import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

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
    
    // Calculate custody duration if dates provided
    let custodyDuration = null;
    if (body.custodyStartDate && body.custodyEndDate) {
      const start = new Date(`${body.custodyStartDate}T${body.custodyStartTime || '00:00'}`);
      const end = new Date(`${body.custodyEndDate}T${body.custodyEndTime || '00:00'}`);
      custodyDuration = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    }

    // Convert arrest witnesses string to array
    const arrestWitnesses = body.arrestWitnesses
      ? body.arrestWitnesses.split(',').map((w: string) => w.trim()).filter(Boolean)
      : [];

    // Find or create perpetrator for this case
    let perpetrator = await prisma.perpetrator.findFirst({
      where: { caseId: params.id },
    });

    if (!perpetrator) {
      // Create a basic perpetrator record if none exists
      const perpetratorCount = await prisma.perpetrator.count();
      perpetrator = await prisma.perpetrator.create({
        data: {
          caseId: params.id,
          perpetratorNumber: `PERP${String(perpetratorCount + 1).padStart(3, '0')}`,
          firstName: 'Unknown',
          lastName: 'Suspect',
        },
      });
    }

    // Update perpetrator with arrest information
    const updatedPerp = await prisma.perpetrator.update({
      where: { id: perpetrator.id },
      data: {
        // Arrest Information
        arrested: body.arrested,
        arrestDate: body.arrestDate ? new Date(body.arrestDate) : null,
        arrestTime: body.arrestTime || null,
        arrestLocation: body.arrestLocation || null,
        arrestLocationAddress: body.arrestLocationAddress || null,
        arrestingAgency: body.arrestingAgency || null,
        arrestingOfficerName: body.arrestingOfficerName || null,
        arrestingOfficerRank: body.arrestingOfficerRank || null,
        arrestingOfficerBadge: body.arrestingOfficerBadge || null,
        arrestingOfficerStation: body.arrestingOfficerStation || null,
        arrestingOfficerPhone: body.arrestingOfficerPhone || null,
        arrestWarrantNumber: body.arrestWarrantNumber || null,
        arrestWarrantDate: body.arrestWarrantDate ? new Date(body.arrestWarrantDate) : null,
        arrestReason: body.arrestReason || null,
        arrestCircumstances: body.arrestCircumstances || null,
        resistedArrest: body.resistedArrest || false,
        arrestWitnesses: arrestWitnesses,
        
        // Case Reporting
        caseReportedBy: body.caseReportedBy || null,
        reporterRelationship: body.reporterRelationship || null,
        reporterContact: body.reporterContact || null,
        reportDate: body.reportDate ? new Date(body.reportDate) : null,
        reportTime: body.reportTime || null,
        reportLocation: body.reportLocation || null,
        firstRespondingOfficer: body.firstRespondingOfficer || null,
        
        // Custody Details
        detentionFacility: body.detentionFacility || null,
        detentionFacilityAddress: body.detentionFacilityAddress || null,
        custodyStartDate: body.custodyStartDate ? new Date(body.custodyStartDate) : null,
        custodyStartTime: body.custodyStartTime || null,
        custodyEndDate: body.custodyEndDate ? new Date(body.custodyEndDate) : null,
        custodyEndTime: body.custodyEndTime || null,
        custodyDuration: custodyDuration,
        cellNumber: body.cellNumber || null,
        custodyOfficerName: body.custodyOfficerName || null,
        custodyOfficerBadge: body.custodyOfficerBadge || null,
        
        // Release Details
        released: body.released || false,
        releaseDate: body.releaseDate ? new Date(body.releaseDate) : null,
        releaseTime: body.releaseTime || null,
        releaseType: body.releaseType || null,
        releaseAuthority: body.releaseAuthority || null,
        releaseAuthorityRank: body.releaseAuthorityRank || null,
        releaseDocumentNumber: body.releaseDocumentNumber || null,
        
        // Bail Information
        bailGranted: body.bailGranted || false,
        bailAmount: body.bailAmount ? parseFloat(body.bailAmount) : null,
        bailConditions: body.bailConditions || null,
        bailBondNumber: body.bailBondNumber || null,
        bailGrantedBy: body.bailGrantedBy || null,
        bailGrantedDate: body.bailGrantedDate ? new Date(body.bailGrantedDate) : null,
        
        // Surety Information
        suretyRequired: body.suretyRequired || false,
        suretyFullName: body.suretyFullName || null,
        suretyDateOfBirth: body.suretyDateOfBirth ? new Date(body.suretyDateOfBirth) : null,
        suretyGender: body.suretyGender || null,
        suretyNIN: body.suretyNIN || null,
        suretyPhoneNumber: body.suretyPhoneNumber || null,
        suretyEmail: body.suretyEmail || null,
        suretyOccupation: body.suretyOccupation || null,
        suretyEmployer: body.suretyEmployer || null,
        suretyAddress: body.suretyAddress || null,
        suretyCity: body.suretyCity || null,
        suretyState: body.suretyState || null,
        suretyLGA: body.suretyLGA || null,
        suretyRelationshipToAccused: body.suretyRelationshipToAccused || null,
        suretyIDType: body.suretyIDType || null,
        suretyIDNumber: body.suretyIDNumber || null,
        
        // Address Verification
        addressVerified: body.addressVerified || false,
        addressVerifiedBy: body.addressVerifiedBy || null,
        addressVerifierRank: body.addressVerifierRank || null,
        addressVerifierBadge: body.addressVerifierBadge || null,
        addressVerificationDate: body.addressVerificationDate ? new Date(body.addressVerificationDate) : null,
        addressVerificationReport: body.addressVerificationReport || null,
        landlordName: body.landlordName || null,
        landlordContact: body.landlordContact || null,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.accessLevel,
        action: 'UPDATE',
        entityType: 'PERPETRATOR',
        entityId: perpetrator.id,
        entityName: `Arrest information recorded for case ${params.id}`,
      },
    });

    return NextResponse.json({ 
      success: true,
      perpetrator: updatedPerp,
      message: 'Arrest information saved successfully'
    });
  } catch (error) {
    console.error('Error saving arrest information:', error);
    return NextResponse.json(
      { error: 'Failed to save arrest information' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const perpetrator = await prisma.perpetrator.findFirst({
      where: { caseId: params.id },
    });

    if (!perpetrator) {
      return NextResponse.json({ arrestInfo: null });
    }

    return NextResponse.json({ arrestInfo: perpetrator });
  } catch (error) {
    console.error('Error fetching arrest information:', error);
    return NextResponse.json(
      { error: 'Failed to fetch arrest information' },
      { status: 500 }
    );
  }
}

