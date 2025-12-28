import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        caseId: params.id,
        isDeleted: false,
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Get the next message number
    const lastMessage = await prisma.chatMessage.findFirst({
      where: { caseId: params.id },
      orderBy: { messageNumber: 'desc' },
    });
    
    const messageNumber = (lastMessage?.messageNumber || 0) + 1;

    const message = await prisma.chatMessage.create({
      data: {
        caseId: params.id,
        messageNumber,
        senderId: session.user.id,
        senderName: session.user.name,
        senderRole: session.user.accessLevel,
        messageText: body.messageText,
        messageType: body.messageType || 'TEXT',
        isImportant: body.isImportant || false,
        isPinned: false,
        attachments: body.attachments || [],
        readBy: [session.user.id],
        readReceipts: [],
        reactions: [],
        replyToMessageId: body.replyToMessageId || null,
        threadId: body.replyToMessageId || null,
        isDeleted: false,
      },
    });

    // Update thread count if this is a reply
    if (body.replyToMessageId) {
      await prisma.chatMessage.update({
        where: { id: body.replyToMessageId },
        data: {
          isThreadStarter: true,
          threadRepliesCount: { increment: 1 },
        },
      });
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}

