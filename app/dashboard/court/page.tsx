'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Scale, Calendar, FileText, Gavel, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';

interface CourtRecord {
  id: string;
  caseId: string;
  case: {
    id: string;
    caseNumber: string;
    title: string;
    status: string;
  };
  offenceName: string;
  chargeNumber: string | null;
  trialDate: string | null;
  courtName: string | null;
  verdictReached: boolean;
  verdict: string | null;
  sentenced: boolean;
  sentenceType: string | null;
  appealFiled: boolean;
}

export default function CourtDashboard() {
  const { data: session } = useSession();
  const [courtRecords, setCourtRecords] = useState<CourtRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCases: 0,
    pendingHearings: 0,
    verdictsReached: 0,
    appealsFiled: 0,
  });

  useEffect(() => {
    fetchCourtData();
  }, []);

  const fetchCourtData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/court/records');
      setCourtRecords(response.data.records || []);
      
      // Calculate stats
      const records = response.data.records || [];
      setStats({
        totalCases: records.length,
        pendingHearings: records.filter((r: CourtRecord) => r.trialDate && !r.verdictReached).length,
        verdictsReached: records.filter((r: CourtRecord) => r.verdictReached).length,
        appealsFiled: records.filter((r: CourtRecord) => r.appealFiled).length,
      });
    } catch (error: any) {
      console.error('Error fetching court data:', error);
      toast.error('Failed to load court records');
    } finally {
      setLoading(false);
    }
  };

  const upcomingHearings = courtRecords
    .filter((r) => r.trialDate && !r.verdictReached)
    .sort((a, b) => {
      const dateA = new Date(a.trialDate || '').getTime();
      const dateB = new Date(b.trialDate || '').getTime();
      return dateA - dateB;
    })
    .slice(0, 5);

  const getStatusBadge = (record: CourtRecord) => {
    if (record.appealFiled) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
          Appeal Filed
        </span>
      );
    }
    if (record.sentenced) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          Sentenced
        </span>
      );
    }
    if (record.verdictReached) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          Verdict Reached
        </span>
      );
    }
    if (record.trialDate) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
          Trial Scheduled
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
        Pending
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Court Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage court records, hearings, and proceedings
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
                  <Scale className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Hearings</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingHearings}</p>
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
                  <p className="text-sm font-medium text-gray-600">Verdicts Reached</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.verdictsReached}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Gavel className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Appeals Filed</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.appealsFiled}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Hearings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <span>Upcoming Hearings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : upcomingHearings.length > 0 ? (
              <div className="space-y-4">
                {upcomingHearings.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Link
                          href={`/dashboard/cases/${record.caseId}`}
                          className="font-semibold text-gray-900 hover:text-green-600"
                        >
                          {record.case.caseNumber}
                        </Link>
                        {getStatusBadge(record)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{record.offenceName}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        {record.trialDate && (
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(record.trialDate).toLocaleDateString()}</span>
                          </span>
                        )}
                        {record.courtName && (
                          <span className="flex items-center space-x-1">
                            <Scale className="w-3 h-3" />
                            <span>{record.courtName}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <Link href={`/dashboard/cases/${record.caseId}/court`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No upcoming hearings scheduled
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Court Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-green-600" />
              <span>Recent Court Records</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : courtRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Case Number
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Offence
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Charge Number
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {courtRecords.slice(0, 10).map((record) => (
                      <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <Link
                            href={`/dashboard/cases/${record.caseId}`}
                            className="text-sm font-medium text-green-600 hover:underline"
                          >
                            {record.case.caseNumber}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {record.offenceName}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {record.chargeNumber || 'N/A'}
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(record)}</td>
                        <td className="py-3 px-4">
                          <Link href={`/dashboard/cases/${record.caseId}/court`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No court records found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
