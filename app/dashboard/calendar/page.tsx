'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

type CalendarEvent = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startAt: string;
  endAt: string;
  allDay: boolean;
  createdAt: string;
  updatedAt: string;
};

type EventDraft = {
  title: string;
  description: string;
  location: string;
  startAt: string;
  endAt: string;
  allDay: boolean;
};

function toDateTimeLocalValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function startOfDayLocal(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDayLocal(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export default function CalendarPage() {
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState(() => startOfDayLocal(new Date()));

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EventDraft>(() => {
    const base = new Date();
    base.setSeconds(0, 0);
    const start = new Date(base);
    start.setHours(9, 0, 0, 0);
    const end = new Date(base);
    end.setHours(10, 0, 0, 0);

    return {
      title: '',
      description: '',
      location: '',
      startAt: toDateTimeLocalValue(start),
      endAt: toDateTimeLocalValue(end),
      allDay: false,
    };
  });

  const range = useMemo(() => {
    const start = startOfWeek(startOfMonth(monthCursor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(monthCursor), { weekStartsOn: 1 });
    return { start, end };
  }, [monthCursor]);

  const days = useMemo(() => {
    const out: Date[] = [];
    let d = range.start;
    while (d <= range.end) {
      out.push(d);
      d = addDays(d, 1);
    }
    return out;
  }, [range]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const dayKey = format(new Date(e.startAt), 'yyyy-MM-dd');
      const list = map.get(dayKey) ?? [];
      list.push(e);
      map.set(dayKey, list);
    }
    for (const [, list] of map) {
      list.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
    }
    return map;
  }, [events]);

  const selectedDayKey = useMemo(() => format(selectedDay, 'yyyy-MM-dd'), [selectedDay]);
  const selectedDayEvents = useMemo(
    () => eventsByDay.get(selectedDayKey) ?? [],
    [eventsByDay, selectedDayKey]
  );

  async function fetchEvents() {
    setLoading(true);
    setError(null);

    try {
      const start = range.start.toISOString();
      const end = range.end.toISOString();
      const res = await fetch(`/api/calendar?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`);
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || 'Failed to load calendar events');
      }
      const data = (await res.json()) as CalendarEvent[];
      setEvents(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load calendar events';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range.start.getTime(), range.end.getTime()]);

  function resetDraftForDay(day: Date) {
    const start = new Date(day);
    start.setHours(9, 0, 0, 0);
    const end = new Date(day);
    end.setHours(10, 0, 0, 0);
    setEditingId(null);
    setDraft({
      title: '',
      description: '',
      location: '',
      startAt: toDateTimeLocalValue(start),
      endAt: toDateTimeLocalValue(end),
      allDay: false,
    });
  }

  function onSelectDay(day: Date) {
    setSelectedDay(startOfDayLocal(day));
    resetDraftForDay(day);
  }

  function onEditEvent(e: CalendarEvent) {
    setEditingId(e.id);
    setDraft({
      title: e.title,
      description: e.description ?? '',
      location: e.location ?? '',
      startAt: toDateTimeLocalValue(new Date(e.startAt)),
      endAt: toDateTimeLocalValue(new Date(e.endAt)),
      allDay: e.allDay,
    });
  }

  async function onSubmit() {
    setError(null);

    const payload = {
      title: draft.title,
      description: draft.description || null,
      location: draft.location || null,
      allDay: draft.allDay,
      startAt: new Date(draft.startAt).toISOString(),
      endAt: new Date(draft.endAt).toISOString(),
    };

    try {
      const url = editingId ? `/api/calendar/${editingId}` : '/api/calendar';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || 'Failed to save event');
      }

      await fetchEvents();
      resetDraftForDay(selectedDay);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to save event';
      setError(message);
    }
  }

  async function onDelete() {
    if (!editingId) return;
    setError(null);

    try {
      const res = await fetch(`/api/calendar/${editingId}`, { method: 'DELETE' });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || 'Failed to delete event');
      }
      await fetchEvents();
      resetDraftForDay(selectedDay);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to delete event';
      setError(message);
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-semibold text-gray-900">Calendar</div>
            <div className="text-sm text-gray-600">{format(monthCursor, 'MMMM yyyy')}</div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setMonthCursor(startOfMonth(new Date()))}>
              Today
            </Button>
            <Button variant="outline" onClick={() => setMonthCursor((m) => subMonths(m, 1))}>
              Prev
            </Button>
            <Button variant="outline" onClick={() => setMonthCursor((m) => addMonths(m, 1))}>
              Next
            </Button>
          </div>
        </div>

        {error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Month</CardTitle>
              <div className="text-sm text-gray-600">
                {loading ? 'Loading…' : `${events.length} event${events.length === 1 ? '' : 's'}`}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 text-xs text-gray-600 mb-2">
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                <div>Sun</div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {days.map((day) => {
                  const dayKey = format(day, 'yyyy-MM-dd');
                  const inMonth = isSameMonth(day, monthCursor);
                  const isSelected = isSameDay(day, selectedDay);
                  const dayEvents = eventsByDay.get(dayKey) ?? [];

                  return (
                    <button
                      key={dayKey}
                      type="button"
                      onClick={() => onSelectDay(day)}
                      className={`text-left rounded-md border px-2 py-2 min-h-[72px] transition-colors ${
                        inMonth ? 'bg-white' : 'bg-gray-50'
                      } ${isSelected ? 'border-green-600 ring-2 ring-green-200' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      <div className={`text-xs font-medium ${inMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                        {format(day, 'd')}
                      </div>
                      {dayEvents.length ? (
                        <div className="mt-1 space-y-1">
                          {dayEvents.slice(0, 2).map((e) => (
                            <div
                              key={e.id}
                              className="text-[11px] truncate rounded bg-green-50 text-green-900 px-1"
                            >
                              {e.allDay ? 'All day' : format(new Date(e.startAt), 'HH:mm')} {e.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 ? (
                            <div className="text-[11px] text-gray-500">+{dayEvents.length - 2} more</div>
                          ) : null}
                        </div>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agenda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-900 font-medium">{format(selectedDay, 'EEEE, MMM d')}</div>
                <div className="mt-3 space-y-2">
                  {selectedDayEvents.length ? (
                    selectedDayEvents.map((e) => (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => onEditEvent(e)}
                        className="w-full text-left rounded-md border border-gray-200 p-3 hover:bg-gray-50"
                      >
                        <div className="text-sm font-medium text-gray-900">{e.title}</div>
                        <div className="text-xs text-gray-600">
                          {e.allDay
                            ? 'All day'
                            : `${format(new Date(e.startAt), 'HH:mm')} - ${format(new Date(e.endAt), 'HH:mm')}`}
                          {e.location ? ` • ${e.location}` : ''}
                        </div>
                        {e.description ? (
                          <div className="mt-1 text-xs text-gray-600 line-clamp-2">{e.description}</div>
                        ) : null}
                      </button>
                    ))
                  ) : (
                    <div className="text-sm text-gray-600">No events.</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{editingId ? 'Edit event' : 'New event'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Title</div>
                    <Input
                      value={draft.title}
                      onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                      placeholder="Event title"
                    />
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Location</div>
                    <Input
                      value={draft.location}
                      onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                      placeholder="Optional"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="allDay"
                      type="checkbox"
                      checked={draft.allDay}
                      onChange={(e) => setDraft((d) => ({ ...d, allDay: e.target.checked }))}
                      className="h-4 w-4"
                    />
                    <label htmlFor="allDay" className="text-sm text-gray-700">
                      All day
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Start</div>
                      <Input
                        type="datetime-local"
                        value={draft.startAt}
                        onChange={(e) => setDraft((d) => ({ ...d, startAt: e.target.value }))}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">End</div>
                      <Input
                        type="datetime-local"
                        value={draft.endAt}
                        onChange={(e) => setDraft((d) => ({ ...d, endAt: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Description</div>
                    <Textarea
                      value={draft.description}
                      onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                      rows={3}
                      placeholder="Optional"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button onClick={() => void onSubmit()} disabled={loading}>
                      {editingId ? 'Save changes' : 'Create event'}
                    </Button>
                    <Button variant="secondary" onClick={() => resetDraftForDay(selectedDay)}>
                      Clear
                    </Button>
                    {editingId ? (
                      <Button variant="danger" onClick={() => void onDelete()}>
                        Delete
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
