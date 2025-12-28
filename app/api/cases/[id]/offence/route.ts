import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET handler to fetch offence details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const offence = await prisma.caseOffence.findFirst({
      where: { caseId: params.id },
    });

    return NextResponse.json({ offence });
  } catch (error) {
    console.error('Error fetching offence details:', error);
    return NextResponse.json({ error: 'Failed to fetch offence details' }, { status: 500 });
  }
}

// POST handler to create/update offence details
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
    const { 
      dateOfOffence,
      dateReported,
      dateArrested,
      ...restOfBody
    } = body;
    
    const data = {
      ...restOfBody,
      dateOfOffence: dateOfOffence ? new Date(dateOfOffence) : null,
      dateReported: dateReported ? new Date(dateReported) : null,
      dateArrested: dateArrested ? new Date(dateArrested) : null,
      caseId: params.id,
    };

    // Use upsert to create or update the offence record
    const offence = await prisma.caseOffence.upsert({
      where: { caseId: params.id },
      update: data,
      create: {
        ...data,
        offenceNumber: `OFF-${params.id.substring(0, 8).toUpperCase()}`,
      },
    });

    return NextResponse.json({ success: true, offence });
  } catch (error) {
    console.error('Error saving offence details:', error);
    return NextResponse.json({ error: 'Failed to save offence details' }, { status: 500 });
  }
}
