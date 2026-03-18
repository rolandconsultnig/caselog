import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { Prisma } from '@prisma/client';

type ReadReceipt = {
  userId: string;
  userName: string | null;
  readAt: string;
};

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; messageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const message = await prisma.chatMessage.findUnique({
      where: { id: params.messageId },
    });

    if (!message || message.caseId !== params.id) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    const readBy = Array.isArray(message.readBy) ? message.readBy : [];
    if (!readBy.includes(session.user.id)) {
      readBy.push(session.user.id);
    }

    const readReceipts: ReadReceipt[] = Array.isArray(message.readReceipts)
      ? (message.readReceipts as unknown as ReadReceipt[])
      : [];
    const existingReceiptIndex = readReceipts.findIndex(
      (r) => r.userId === session.user.id
    );

    if (existingReceiptIndex >= 0) {
      readReceipts[existingReceiptIndex] = {
        userId: session.user.id,
        userName: session.user.name,
        readAt: new Date().toISOString(),
      };
    } else {
      readReceipts.push({
        userId: session.user.id,
        userName: session.user.name,
        readAt: new Date().toISOString(),
      });
    }

    await prisma.chatMessage.update({
      where: { id: params.messageId },
      data: {
        readBy,
        readReceipts: readReceipts as unknown as Prisma.InputJsonValue[],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking message as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark message as read' },
      { status: 500 }
    );
  }
}

