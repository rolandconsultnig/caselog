import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const eventId = params.id;

    const existing = await prisma.calendarEvent.findUnique({
      where: { id: eventId },
      select: { id: true, tenantId: true },
    });

    if (!existing || existing.tenantId !== session.user.tenantId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const body = await request.json();

    const data: {
      title?: string;
      description?: string | null;
      location?: string | null;
      startAt?: Date;
      endAt?: Date;
      allDay?: boolean;
    } = {};

    if (typeof body?.title === 'string') {
      const t = body.title.trim();
      if (!t) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      data.title = t;
    }

    if (typeof body?.description === 'string') data.description = body.description;
    if (body?.description === null) data.description = null;

    if (typeof body?.location === 'string') data.location = body.location;
    if (body?.location === null) data.location = null;

    if (typeof body?.allDay === 'boolean') data.allDay = body.allDay;

    if (body?.startAt !== undefined) {
      const startAt = new Date(body.startAt);
      if (Number.isNaN(startAt.getTime())) {
        return NextResponse.json({ error: 'Invalid start date' }, { status: 400 });
      }
      data.startAt = startAt;
    }

    if (body?.endAt !== undefined) {
      const endAt = new Date(body.endAt);
      if (Number.isNaN(endAt.getTime())) {
        return NextResponse.json({ error: 'Invalid end date' }, { status: 400 });
      }
      data.endAt = endAt;
    }

    const nextStart = data.startAt ?? (await prisma.calendarEvent.findUnique({ where: { id: eventId }, select: { startAt: true } }))?.startAt;
    const nextEnd = data.endAt ?? (await prisma.calendarEvent.findUnique({ where: { id: eventId }, select: { endAt: true } }))?.endAt;

    if (!nextStart || !nextEnd) {
      return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
    }

    if (nextEnd < nextStart) {
      return NextResponse.json({ error: 'End must be after start' }, { status: 400 });
    }

    const updated = await prisma.calendarEvent.update({
      where: { id: eventId },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating calendar event:', error);
    return NextResponse.json({ error: 'Failed to update calendar event' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const eventId = params.id;

    const existing = await prisma.calendarEvent.findUnique({
      where: { id: eventId },
      select: { id: true, tenantId: true },
    });

    if (!existing || existing.tenantId !== session.user.tenantId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.calendarEvent.delete({ where: { id: eventId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    return NextResponse.json({ error: 'Failed to delete calendar event' }, { status: 500 });
  }
}
