import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { 
  LEGAL_REFERENCES, 
  searchLegalProvisions,
  getLegalProvisionsByAct,
  getLegalProvisionsForOffense 
} from '@/lib/legal-references';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const act = searchParams.get('act');
    const offenseType = searchParams.get('offenseType');

    let provisions = LEGAL_REFERENCES;

    if (query) {
      provisions = searchLegalProvisions(query);
    } else if (act) {
      provisions = getLegalProvisionsByAct(act);
    } else if (offenseType) {
      provisions = getLegalProvisionsForOffense(offenseType);
    }

    return NextResponse.json({ 
      provisions,
      total: provisions.length 
    });
  } catch (error) {
    console.error('Error fetching legal references:', error);
    return NextResponse.json(
      { error: 'Failed to fetch legal references' },
      { status: 500 }
    );
  }
}
