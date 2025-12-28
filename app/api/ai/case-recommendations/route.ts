import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCaseRecommendations } from '@/lib/lady-justice-ai';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { caseId } = body;

    if (!caseId) {
      return NextResponse.json(
        { error: 'Case ID is required' },
        { status: 400 }
      );
    }

    // Fetch case data
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        victims: true,
        perpetrators: true,
        witnesses: true,
        evidence: true,
      },
    });

    if (!caseData) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    // Get AI recommendations
    const recommendations = await getCaseRecommendations(caseData);

    return NextResponse.json({
      caseId,
      recommendations,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Case recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

