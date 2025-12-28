import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; messageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const message = await prisma.chatMessage.findUnique({
      where: { id: params.messageId },
    });

    if (!message || message.caseId !== params.id) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    // Only sender can edit
    if (message.senderId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updatedMessage = await prisma.chatMessage.update({
      where: { id: params.messageId },
      data: {
        messageText: body.messageText,
        editedAt: new Date(),
        editedBy: session.user.id,
      },
    });

    return NextResponse.json({ message: updatedMessage });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Only sender or admin can delete
    if (message.senderId !== session.user.id && 
        session.user.accessLevel !== 'APP_ADMIN' && 
        session.user.accessLevel !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.chatMessage.update({
      where: { id: params.messageId },
      data: { isDeleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}

