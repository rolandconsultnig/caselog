import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function parseOptionalDate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const start = parseOptionalDate(searchParams.get('start'));
    const end = parseOptionalDate(searchParams.get('end'));

    const where: {
      tenantId: string;
      startAt?: { gte?: Date };
      endAt?: { lte?: Date };
    } = {
      tenantId: session.user.tenantId,
    };

    if (start) {
      where.startAt = { ...(where.startAt ?? {}), gte: start };
    }

    if (end) {
      where.endAt = { ...(where.endAt ?? {}), lte: end };
    }

    const events = await prisma.calendarEvent.findMany({
      where,
      orderBy: [{ startAt: 'asc' }],
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json({ error: 'Failed to fetch calendar events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const title = typeof body?.title === 'string' ? body.title.trim() : '';
    const description = typeof body?.description === 'string' ? body.description : null;
    const location = typeof body?.location === 'string' ? body.location : null;
    const allDay = typeof body?.allDay === 'boolean' ? body.allDay : false;

    const startAt = new Date(body?.startAt);
    const endAt = new Date(body?.endAt);

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
      return NextResponse.json({ error: 'Invalid start/end date' }, { status: 400 });
    }

    if (endAt < startAt) {
      return NextResponse.json({ error: 'End must be after start' }, { status: 400 });
    }

    const event = await prisma.calendarEvent.create({
      data: {
        tenantId: session.user.tenantId,
        createdById: session.user.id,
        title,
        description,
        location,
        startAt,
        endAt,
        allDay,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json({ error: 'Failed to create calendar event' }, { status: 500 });
  }
}
