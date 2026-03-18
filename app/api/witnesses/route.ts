import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const witnesses = await prisma.witness.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        case: {
          select: {
            caseNumber: true,
          },
        },
      },
    });

    return NextResponse.json({ witnesses });
  } catch (error) {
    console.error('Error fetching witnesses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch witnesses' },
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

    const witness = await prisma.witness.create({
      data: {
        caseId: body.caseId,
        firstName: body.firstName,
        lastName: body.lastName,
        phoneNumber: body.phoneNumber,
        email: body.email,
        address: body.address,
        witnessType: body.witnessType,
        statementText: body.statementText,
        statementDate: new Date(body.statementDate),
        // You might need to generate this number sequentially
        witnessNumber: `W${Date.now()}`, 
      },
    });

    return NextResponse.json({ witness });
  } catch (error) {
    console.error('Error creating witness:', error);
    return NextResponse.json(
      { error: 'Failed to create witness' },
      { status: 500 }
    );
  }
}
