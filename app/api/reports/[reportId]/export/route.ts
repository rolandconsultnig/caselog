import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPermissions } from '@/lib/permissions';
import { TenantType } from '@prisma/client';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const permissions = getPermissions(
      session.user.accessLevel,
      session.user.tenantType as TenantType
    );

    if (!permissions.canGenerateReports) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // In production, fetch the saved report and export it
    // For now, redirect to the main export endpoint
    // TODO: Implement proper report storage and export

    return NextResponse.json({
      error: 'Report export not yet fully implemented. Please use the main reports page to export.',
    }, { status: 501 });
  } catch (error) {
    console.error('Error exporting report:', error);
    return NextResponse.json(
      { error: 'Failed to export report' },
      { status: 500 }
    );
  }
}

