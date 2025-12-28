'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface CourtRecord {
  id: string;
  courtName: string;
  presidingJudge: string;
  verdict: string;
  caseNumber: string;
  hearingDate: string;
  hearingType: string;
  decision: string;
  nextHearingDate?: string;
  remarks?: string;
}

export default function CaseCourtPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [courtRecords, setCourtRecords] = useState<CourtRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourtRecords();
  }, [params.id]);

  const fetchCourtRecords = async () => {
    try {
      const response = await fetch(`/api/cases/${params.id}/court`);
      if (response.ok) {
        const data = await response.json();
        setCourtRecords(data.courtRecords || []);
      }
    } catch (error) {
      console.error('Error fetching court records:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHearingTypeColor = (type: string) => {
    switch (type) {
      case 'INITIAL': return 'info';
      case 'PRELIMINARY': return 'warning';
      case 'TRIAL': return 'default';
      case 'SENTENCING': return 'error';
      case 'APPEAL': return 'success';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Court Records</h1>
            <p className="text-gray-600 mt-1">
              Track court proceedings, hearings, and judicial decisions
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/cases/${params.id}`}>
              <Button variant="outline">Back to Case</Button>
            </Link>
            <Link href={`/dashboard/cases/${params.id}/court/new`}>
              <Button>
                <span className="mr-2">+</span>
                Add Court Record
              </Button>
            </Link>
          </div>
        </div>

        {/* Court Records List */}
        {loading ? (
          <Card>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading court records...</p>
            </div>
          </Card>
        ) : courtRecords.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No court records</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start by adding court hearing records.
              </p>
              <div className="mt-6">
                <Link href={`/dashboard/cases/${params.id}/court/new`}>
                  <Button>
                    <span className="mr-2">+</span>
                    Add First Record
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {courtRecords
              .sort((a, b) => new Date(b.hearingDate).getTime() - new Date(a.hearingDate).getTime())
              .map((record) => (
              <Card key={record.id} className="hover:shadow-lg transition-shadow">
                <Link href={`/dashboard/cases/${params.id}/court/${record.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold">
                          {record.courtName}
                        </h3>
                        <Badge variant={getHearingTypeColor(record.hearingType)}>
                          {record.hearingType}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Location:</span>
                          <p className="font-medium">{record.courtLocation}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Presiding Judge:</span>
                          <p className="font-medium">{record.presidingJudge}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Case #:</span>
                          <p className="font-medium">{record.caseNumber}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Hearing Date:</span>
                          <p className="font-medium">
                            {new Date(record.hearingDate).toLocaleDateString()}
                          </p>
                        </div>
                        {record.nextHearingDate && (
                          <div>
                            <span className="text-gray-500">Next Hearing:</span>
                            <p className="font-medium">
                              {new Date(record.nextHearingDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="text-sm mb-2">
                        <span className="text-gray-500">Verdict:</span>
                        <p className="font-medium">{record.verdict}</p>
                      </div>

                      <div className="text-sm mb-2">
                        <span className="text-gray-500">Decision:</span>
                        <p className="font-medium">{record.decision}</p>
                      </div>

                      {record.remarks && (
                        <div className="text-sm">
                          <span className="text-gray-500">Remarks:</span>
                          <p className="font-medium">{record.remarks}</p>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {courtRecords.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Court Hearings</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {courtRecords.filter(c => c.hearingType === 'INITIAL').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Initial Hearings</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {courtRecords.filter(c => c.hearingType === 'TRIAL').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Trial Hearings</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">
                {courtRecords.filter(c => c.nextHearingDate).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Pending Hearings</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

