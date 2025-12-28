import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/tenants - Get list of all tenants (states)
export async function GET() {
  try {
    const tenants = await prisma.tenant.findMany({
      select: {
        id: true,
        name: true,
        type: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(tenants);
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenants' },
      { status: 500 }
    );
  }
}

