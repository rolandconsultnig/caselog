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

    const partnership = await prisma.caseCivilSociety.findUnique({
      where: { id: params.id },
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

    if (!partnership) {
      return NextResponse.json(
        { error: 'Partnership not found' },
        { status: 404 }
      );
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const partnership = await prisma.caseCivilSociety.update({
      where: { id: params.id },
      data: {
        ...body,
        budgetAllocated: body.budgetAllocated ? parseFloat(body.budgetAllocated) : null,
        amountSpent: body.amountSpent ? parseFloat(body.amountSpent) : null,
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

