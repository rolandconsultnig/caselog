import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Mock notifications - in production, these would come from a database
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock notifications for demonstration
    const notifications = [
      {
        id: '1',
        type: 'case_assigned',
        title: 'New Case Assigned',
        message: 'You have been assigned to case CL-202511-0001',
        caseId: 'case-123',
        read: false,
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

