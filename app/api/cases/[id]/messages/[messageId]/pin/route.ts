import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; messageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { pinned, pinnedReason } = body;

    const message = await prisma.chatMessage.findUnique({
      where: { id: params.messageId },
    });

    if (!message || message.caseId !== params.id) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    await prisma.chatMessage.update({
      where: { id: params.messageId },
      data: {
        isPinned: pinned !== false,
        pinnedBy: pinned !== false ? session.user.id : null,
        pinnedByName: pinned !== false ? session.user.name : null,
        pinnedAt: pinned !== false ? new Date() : null,
        pinnedReason: pinnedReason || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error pinning message:', error);
    return NextResponse.json(
      { error: 'Failed to pin message' },
      { status: 500 }
    );
  }
}
