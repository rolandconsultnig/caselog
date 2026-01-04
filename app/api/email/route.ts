import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch emails (inbox, sent, drafts, etc.)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'inbox';
    const userId = session.user.id;

    let emails;

    switch (folder) {
      case 'inbox':
        emails = await (prisma as any).internalEmail.findMany({
          where: {
            recipientIds: { has: userId },
            isDeleted: false,
            deletedBy: { isEmpty: true },
            isDraft: false,
          },
          orderBy: { sentAt: 'desc' },
        });
        break;

      case 'sent':
        emails = await (prisma as any).internalEmail.findMany({
          where: {
            senderId: userId,
            isDeleted: false,
            isDraft: false,
          },
          orderBy: { sentAt: 'desc' },
        });
        break;

      case 'drafts':
        emails = await (prisma as any).internalEmail.findMany({
          where: {
            senderId: userId,
            isDraft: true,
            isDeleted: false,
          },
          orderBy: { updatedAt: 'desc' },
        });
        break;

      case 'starred':
        emails = await (prisma as any).internalEmail.findMany({
          where: {
            OR: [
              { recipientIds: { has: userId } },
              { senderId: userId },
            ],
            isStarred: true,
            isDeleted: false,
          },
          orderBy: { sentAt: 'desc' },
        });
        break;

      case 'archived':
        emails = await (prisma as any).internalEmail.findMany({
          where: {
            OR: [
              { recipientIds: { has: userId } },
              { senderId: userId },
            ],
            isArchived: true,
            isDeleted: false,
          },
          orderBy: { sentAt: 'desc' },
        });
        break;

      case 'trash':
        emails = await (prisma as any).internalEmail.findMany({
          where: {
            OR: [
              { recipientIds: { has: userId } },
              { senderId: userId },
            ],
            deletedBy: { has: userId },
          },
          orderBy: { updatedAt: 'desc' },
        });
        break;

      default:
        emails = [];
    }

    return NextResponse.json(emails);
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}

// POST - Send new email
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      subject,
      bodyContent,
      recipientIds,
      recipientEmails,
      ccIds = [],
      bccIds = [],
      attachments = [],
      priority = 'NORMAL',
      category = 'GENERAL',
      caseId,
      replyToId,
      isDraft = false,
    } = body;

    // Validation
    if (!subject || !bodyContent) {
      return NextResponse.json({ error: 'Subject and body are required' }, { status: 400 });
    }

    if (!isDraft) {
      const hasRecipients = (recipientIds && recipientIds.length > 0) || 
                           (recipientEmails && recipientEmails.length > 0);
      if (!hasRecipients) {
        return NextResponse.json({ error: 'At least one recipient is required' }, { status: 400 });
      }
    }

    // Generate thread ID if this is a reply
    let threadId = null;
    if (replyToId) {
      const originalEmail = await (prisma as any).internalEmail.findUnique({
        where: { id: replyToId },
      });
      threadId = originalEmail?.threadId || replyToId;
    }

    const email = await (prisma as any).internalEmail.create({
      data: {
        subject,
        body: bodyContent,
        senderId: session.user.id,
        senderName: session.user.name || 'Unknown',
        senderEmail: session.user.email,
        recipientIds: recipientIds || [],
        recipientEmails: recipientEmails || [],
        ccIds,
        bccIds,
        attachments,
        priority,
        category,
        caseId,
        replyToId,
        threadId,
        isDraft,
        readBy: [],
        deletedBy: [],
      },
    });

    return NextResponse.json(email, { status: 201 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
