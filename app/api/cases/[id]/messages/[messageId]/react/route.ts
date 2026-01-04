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
    const { emoji } = body;

    const message = await prisma.chatMessage.findUnique({
      where: { id: params.messageId },
    });

    if (!message || message.caseId !== params.id) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    const reactions = Array.isArray(message.reactions) ? message.reactions : [];
    const existingReactionIndex = reactions.findIndex(
      (r: any) => r.userId === session.user.id && r.emoji === emoji
    );

    if (existingReactionIndex >= 0) {
      // Remove reaction
      reactions.splice(existingReactionIndex, 1);
    } else {
      // Add reaction
      reactions.push({
        emoji,
        userId: session.user.id,
        userName: session.user.name,
        timestamp: new Date().toISOString(),
      });
    }

    await prisma.chatMessage.update({
      where: { id: params.messageId },
      data: { reactions: reactions as any },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating reaction:', error);
    return NextResponse.json(
      { error: 'Failed to update reaction' },
      { status: 500 }
    );
  }
}
