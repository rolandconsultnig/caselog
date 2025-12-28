import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// Server-Sent Events for real-time messaging
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Create a readable stream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        // Send initial connection message
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`));

        // Poll for new messages every 2 seconds
        let lastMessageId: string | null = null;
        const interval = setInterval(async () => {
          try {
            const where: any = { caseId: params.id, isDeleted: false };
            if (lastMessageId) {
              where.id = { gt: lastMessageId };
            }

            const newMessages = await prisma.chatMessage.findMany({
              where,
              orderBy: { createdAt: 'asc' },
              take: 10,
            });

            if (newMessages.length > 0) {
              lastMessageId = newMessages[newMessages.length - 1].id;
              
              for (const message of newMessages) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: 'message', message })}\n\n`)
                );
              }
            }
          } catch (error) {
            console.error('Error polling messages:', error);
          }
        }, 2000);

        // Cleanup on close
        request.signal.addEventListener('abort', () => {
          clearInterval(interval);
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error setting up SSE stream:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

