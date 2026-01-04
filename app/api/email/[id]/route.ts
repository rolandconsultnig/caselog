import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch single email
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = await prisma.internalEmail.findUnique({
      where: { id: params.id },
    });

    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    // Check if user has access to this email
    const userId = session.user.id;
    const hasAccess =
      email.senderId === userId ||
      email.recipientIds.includes(userId) ||
      email.ccIds.includes(userId) ||
      email.bccIds.includes(userId);

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Mark as read if recipient is viewing
    if (email.recipientIds.includes(userId) && !email.readBy.includes(userId)) {
      await prisma.internalEmail.update({
        where: { id: params.id },
        data: {
          readBy: [...email.readBy, userId],
          readAt: new Date(),
        },
      });
    }

    return NextResponse.json(email);
  } catch (error) {
    console.error('Error fetching email:', error);
    return NextResponse.json({ error: 'Failed to fetch email' }, { status: 500 });
  }
}

// PATCH - Update email (star, archive, mark as read, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, value } = body;

    const email = await prisma.internalEmail.findUnique({
      where: { id: params.id },
    });

    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    const userId = session.user.id;
    const hasAccess =
      email.senderId === userId ||
      email.recipientIds.includes(userId) ||
      email.ccIds.includes(userId) ||
      email.bccIds.includes(userId);

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    let updateData: any = {};

    switch (action) {
      case 'star':
        updateData.isStarred = value;
        break;
      case 'archive':
        updateData.isArchived = value;
        break;
      case 'read':
        if (value && !email.readBy.includes(userId)) {
          updateData.readBy = [...email.readBy, userId];
          updateData.readAt = new Date();
        } else if (!value) {
          updateData.readBy = email.readBy.filter((id) => id !== userId);
        }
        break;
      case 'delete':
        if (!email.deletedBy.includes(userId)) {
          updateData.deletedBy = [...email.deletedBy, userId];
        }
        break;
      case 'restore':
        updateData.deletedBy = email.deletedBy.filter((id) => id !== userId);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const updatedEmail = await prisma.internalEmail.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(updatedEmail);
  } catch (error) {
    console.error('Error updating email:', error);
    return NextResponse.json({ error: 'Failed to update email' }, { status: 500 });
  }
}

// DELETE - Permanently delete email
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = await prisma.internalEmail.findUnique({
      where: { id: params.id },
    });

    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    // Only sender can permanently delete
    if (email.senderId !== session.user.id) {
      return NextResponse.json({ error: 'Only sender can permanently delete' }, { status: 403 });
    }

    await prisma.internalEmail.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Email permanently deleted' });
  } catch (error) {
    console.error('Error deleting email:', error);
    return NextResponse.json({ error: 'Failed to delete email' }, { status: 500 });
  }
}
