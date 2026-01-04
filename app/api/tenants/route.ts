import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NIGERIAN_STATES } from '@/lib/nigerian-locations';

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

    // If no tenants found, return fallback list
    if (tenants.length === 0) {
      console.warn('No tenants found in database, returning fallback list');
      const fallbackTenants = [
        {
          id: 'federal',
          name: 'Federal Ministry of Justice',
          type: 'FEDERAL',
        },
        ...NIGERIAN_STATES.map((state) => ({
          id: `state-${state.code.toLowerCase()}`,
          name: state.name,
          type: 'STATE',
        })),
      ];
      return NextResponse.json(fallbackTenants);
    }

    return NextResponse.json(tenants);
  } catch (error) {
    console.error('Error fetching tenants:', error);
    // Return fallback list on error
    const fallbackTenants = [
      {
        id: 'federal',
        name: 'Federal Ministry of Justice',
        type: 'FEDERAL',
      },
      ...NIGERIAN_STATES.map((state) => ({
        id: `state-${state.code.toLowerCase()}`,
        name: state.name,
        type: 'STATE',
      })),
    ];
    return NextResponse.json(fallbackTenants);
  }
}

