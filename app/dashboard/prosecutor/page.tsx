'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Gavel,
  FileText,
  Calendar,
  Scale,
  CheckCircle,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';

interface ProsecutionCase {
  id: string;
  caseNumber: string;
  title: string;
  status: string;
  courtRecords: {
    id: string;
    offenceName: string;
    chargeNumber: string | null;
    trialDate: string | null;
    courtName: string | null;
    verdictReached: boolean;
    verdict: string | null;
    pleaType: string;
    pleaBargain: boolean;
  }[];
}

export default function ProsecutorDashboard() {
  useSession();
  const [prosecutionCases, setProsecutionCases] = useState<ProsecutionCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCases: 0,
    scheduledTrials: 0,
    pleaBargains: 0,
    convictions: 0,
  });

  useEffect(() => {
    fetchProsecutorData();
  }, []);

  const fetchProsecutorData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/prosecutor/cases');
      setProsecutionCases(response.data.cases || []);
      
      const cases = response.data.cases || [];
      const allRecords = cases.flatMap((c: ProsecutionCase) => c.courtRecords || []);
      
      setStats({
        totalCases: cases.length,
        scheduledTrials: allRecords.filter((r) => r.trialDate && !r.verdictReached).length,
        pleaBargains: allRecords.filter((r) => r.pleaBargain).length,
        convictions: allRecords.filter((r) => r.verdict === 'GUILTY').length,
      });
    } catch (error: unknown) {
      console.error('Error fetching prosecutor data:', error);
      toast.error('Failed to load prosecution cases');
    } finally {
      setLoading(false);
    }
  };

  const upcomingTrials = prosecutionCases
    .flatMap((c) =>
      (c.courtRecords || [])
        .filter((r) => r.trialDate && !r.verdictReached)
        .map((r) => ({ caseId: c.id, caseNumber: c.caseNumber, title: c.title, ...r }))
    )
    .sort((a, b) => {
      const dateA = new Date(a.trialDate || '').getTime();
      const dateB = new Date(b.trialDate || '').getTime();
      return dateA - dateB;
    })
    .slice(0, 5);

  const getPleaBadge = (pleaType: string) => {
    switch (pleaType) {
      case 'GUILTY':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
            Guilty
          </span>
        );
      case 'NOT_GUILTY':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            Not Guilty
          </span>
        );
      case 'NO_CONTEST':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
            No Contest
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            Not Entered
          </span>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prosecutor Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage prosecution cases, court schedules, and legal proceedings
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cases</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCases}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Scheduled Trials</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.scheduledTrials}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Plea Bargains</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pleaBargains}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Scale className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Convictions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.convictions}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Trials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <span>Upcoming Trials</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : upcomingTrials.length > 0 ? (
              <div className="space-y-4">
                {upcomingTrials.map((trial, index) => (
                  <div
                    key={`${trial.caseId}-${trial.id}-${index}`}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Link
                          href={`/dashboard/cases/${trial.caseId}`}
                          className="font-semibold text-gray-900 hover:text-green-600"
                        >
                          {trial.caseNumber}
                        </Link>
                        {getPleaBadge(trial.pleaType)}
                        {trial.pleaBargain && (
                          <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                            Plea Bargain
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{trial.offenceName}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        {trial.trialDate && (
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(trial.trialDate).toLocaleDateString()}</span>
                          </span>
                        )}
                        {trial.courtName && (
                          <span className="flex items-center space-x-1">
                            <Scale className="w-3 h-3" />
                            <span>{trial.courtName}</span>
                          </span>
                        )}
                        {trial.chargeNumber && (
                          <span className="flex items-center space-x-1">
                            <FileText className="w-3 h-3" />
                            <span>Charge: {trial.chargeNumber}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <Link href={`/dashboard/cases/${trial.caseId}/court`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No upcoming trials scheduled
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prosecution Cases */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gavel className="w-5 h-5 text-green-600" />
              <span>Prosecution Cases</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : prosecutionCases.length > 0 ? (
              <div className="space-y-4">
                {prosecutionCases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Link
                            href={`/dashboard/cases/${caseItem.id}`}
                            className="font-semibold text-gray-900 hover:text-green-600"
                          >
                            {caseItem.caseNumber}
                          </Link>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            caseItem.status === 'PENDING_COURT' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : caseItem.status === 'CLOSED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {caseItem.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{caseItem.title}</p>
                        {caseItem.courtRecords && caseItem.courtRecords.length > 0 && (
                          <div className="space-y-2">
                            {caseItem.courtRecords.map((record, idx) => (
                              <div key={record.id || idx} className="text-sm bg-gray-50 p-2 rounded">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{record.offenceName}</span>
                                  {getPleaBadge(record.pleaType)}
                                  {record.verdictReached && (
                                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                      Verdict: {record.verdict || 'Pending'}
                                    </span>
                                  )}
                                </div>
                                {record.chargeNumber && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Charge: {record.chargeNumber}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <Link href={`/dashboard/cases/${caseItem.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            View Case
                          </Button>
                        </Link>
                        <Link href={`/dashboard/cases/${caseItem.id}/court`}>
                          <Button variant="ghost" size="sm" className="w-full">
                            Court Records
                          </Button>
                        </Link>
                        <Link href={`/dashboard/cases/${caseItem.id}/charges`}>
                          <Button variant="ghost" size="sm" className="w-full">
                            Charges
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Gavel className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p>No prosecution cases assigned</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Court Schedules</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                View and manage upcoming court hearings and trials
              </p>
              <Link href="/dashboard/court">
                <Button variant="outline" className="w-full">
                  View Court Calendar
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Plea Bargains</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Review and manage plea bargain agreements
              </p>
              <Link href="/dashboard/cases">
                <Button variant="outline" className="w-full">
                  Manage Plea Bargains
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Legal Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Access case documents and legal files
              </p>
              <Link href="/dashboard/cases">
                <Button variant="outline" className="w-full">
                  View Documents
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
