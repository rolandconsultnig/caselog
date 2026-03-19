import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const tenantId = session.user.tenantId;
    const tenantType = session.user.tenantType;

    const chatWhere =
      tenantType === 'STATE'
        ? {
            isDeleted: false,
            case: { tenantId },
            NOT: { readBy: { has: userId } },
          }
        : {
            isDeleted: false,
            NOT: { readBy: { has: userId } },
          };

    const [emailsUnread, chatsUnread] = await Promise.all([
      prisma.internalEmail.count({
        where: {
          recipientIds: { has: userId },
          isDeleted: false,
          deletedBy: { isEmpty: true },
          isDraft: false,
          NOT: { readBy: { has: userId } },
        },
      }),
      prisma.chatMessage.count({
        where: chatWhere,
      }),
    ]);

    return NextResponse.json({ emailsUnread, chatsUnread });
  } catch (error) {
    console.error('Error fetching unread summary:', error);
    return NextResponse.json({ error: 'Failed to fetch unread summary' }, { status: 500 });
  }
}
