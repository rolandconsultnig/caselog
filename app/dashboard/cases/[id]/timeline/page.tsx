'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Calendar,
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface TimelineEvent {
  id: string;
  type: 'created' | 'updated' | 'approved' | 'rejected' | 'status_change' | 'assigned' | 'comment';
  title: string;
  description: string;
  timestamp: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  metadata?: unknown;
}

interface CaseSummary {
  caseNumber?: string;
  status?: string;
  formOfSGBV?: string;
  createdAt?: string;
  approvedAt?: string;
}

interface AuditLog {
  id: string;
  action: string;
  details: string;
  createdAt: string;
  user?: TimelineEvent['user'];
}

export default function CaseTimelinePage() {
  const params = useParams();
  const router = useRouter();
  useSession();
  const caseId = params?.id as string;
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [caseData, setCaseData] = useState<CaseSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (caseId) {
      fetchTimeline();
      fetchCaseData();
    }
  }, [caseId]);

  const fetchCaseData = async () => {
    try {
      const response = await axios.get(`/api/cases/${caseId}`);
      setCaseData(response.data as CaseSummary);
    } catch {
      toast.error('Failed to load case data');
    }
  };

  const fetchTimeline = async () => {
    try {
      const response = await axios.get(`/api/cases/${caseId}/timeline`);
      setTimeline(response.data.events || []);
    } catch {
      // If endpoint doesn't exist, generate timeline from audit logs
      try {
        const auditResponse = await axios.get(`/api/admin/audit-logs?entityType=Case&entityId=${caseId}`);
        const logs = (auditResponse.data?.logs as AuditLog[] | undefined) || [];
        const events: TimelineEvent[] = logs.map((log) => ({
          id: log.id,
          type: mapActionToType(log.action),
          title: log.action,
          description: log.details,
          timestamp: log.createdAt,
          user: log.user,
        }));
        setTimeline(
          events.sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
        );
      } catch {
        // Generate basic timeline from case data
        if (caseData) {
          const basicTimeline: TimelineEvent[] = [
            {
              id: 'created',
              type: 'created',
              title: 'Case Created',
              description: `Case ${caseData.caseNumber || ''} was created`,
              timestamp: caseData.createdAt || new Date().toISOString(),
            },
          ];
          if (caseData.approvedAt) {
            basicTimeline.push({
              id: 'approved',
              type: 'approved',
              title: 'Case Approved',
              description: 'Case was approved',
              timestamp: caseData.approvedAt,
            });
          }
          setTimeline(basicTimeline);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const mapActionToType = (action: string): TimelineEvent['type'] => {
    if (action.includes('CREATE')) return 'created';
    if (action.includes('APPROVE')) return 'approved';
    if (action.includes('REJECT')) return 'rejected';
    if (action.includes('UPDATE')) return 'updated';
    if (action.includes('ASSIGN')) return 'assigned';
    return 'updated';
  };

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'created':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'status_change':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'assigned':
        return <User className="w-5 h-5 text-purple-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'created':
        return 'bg-blue-100 border-blue-300';
      case 'approved':
        return 'bg-green-100 border-green-300';
      case 'rejected':
        return 'bg-red-100 border-red-300';
      case 'status_change':
        return 'bg-yellow-100 border-yellow-300';
      case 'assigned':
        return 'bg-purple-100 border-purple-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading timeline...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/cases/${caseId}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Case
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Case Timeline</h1>
              {caseData && (
                <p className="text-gray-600 mt-1">Case: {caseData.caseNumber}</p>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Case History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {timeline.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No timeline events found
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                {/* Timeline events */}
                <div className="space-y-6">
                  {timeline.map((event) => (
                    <div key={event.id} className="relative flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-2 ${getEventColor(
                          event.type
                        )}`}
                      >
                        {getEventIcon(event.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-6">
                        <div className={`p-4 rounded-lg border-2 ${getEventColor(event.type)}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{event.title}</h3>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{event.description}</p>
                          {event.user && (
                            <p className="text-sm text-gray-500">
                              By: {event.user.firstName} {event.user.lastName} ({event.user.email})
                            </p>
                          )}
                          {event.metadata != null && (
                            <div className="mt-2 text-xs text-gray-500">
                              <pre className="bg-white/50 p-2 rounded overflow-auto">
                                {JSON.stringify(event.metadata, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Case Summary */}
        {caseData && (
          <Card>
            <CardHeader>
              <CardTitle>Case Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Case Number</p>
                  <p className="font-medium">{caseData.caseNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium">{caseData.status || ''}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Form of SGBV</p>
                  <p className="font-medium">{caseData.formOfSGBV || ''}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="font-medium">
                    {caseData.createdAt ? format(new Date(caseData.createdAt), 'MMM dd, yyyy') : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

