'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  UserSearch,
  FileText,
  Search,
  Users,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';

interface AssignedCase {
  id: string;
  caseNumber: string;
  title: string;
  status: string;
  priority: string;
  incidentDate: string;
  investigatorId: string | null;
  victims: { id: string; firstName: string; lastName: string }[];
  perpetrators: { id: string; name: string }[];
  evidence: { id: string; type: string }[];
  witnesses: { id: string; name: string }[];
}

export default function InvestigatorDashboard() {
  useSession();
  const [assignedCases, setAssignedCases] = useState<AssignedCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    activeInvestigations: 0,
    pendingReports: 0,
    completedCases: 0,
  });

  useEffect(() => {
    fetchInvestigatorData();
  }, []);

  const fetchInvestigatorData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/investigator/cases');
      setAssignedCases(response.data.cases || []);
      
      const cases = response.data.cases || [];
      setStats({
        totalAssigned: cases.length,
        activeInvestigations: cases.filter((c: AssignedCase) => 
          c.status === 'INVESTIGATION' || c.status === 'ACTIVE'
        ).length,
        pendingReports: cases.filter((c: AssignedCase) => 
          c.status === 'INVESTIGATION'
        ).length,
        completedCases: cases.filter((c: AssignedCase) => 
          c.status === 'CLOSED'
        ).length,
      });
    } catch (error: unknown) {
      console.error('Error fetching investigator data:', error);
      toast.error('Failed to load assigned cases');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800';
      case 'URGENT':
        return 'bg-orange-100 text-orange-800';
      case 'HIGH':
        return 'bg-yellow-100 text-yellow-800';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'INVESTIGATION':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800';
      case 'CLOSED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investigator Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your assigned cases, evidence, and investigations
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assigned</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalAssigned}</p>
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
                  <p className="text-sm font-medium text-gray-600">Active Investigations</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeInvestigations}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingReports}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Cases</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completedCases}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Cases */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-green-600" />
              <span>My Assigned Cases</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : assignedCases.length > 0 ? (
              <div className="space-y-4">
                {assignedCases.map((caseItem) => (
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
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(caseItem.priority)}`}>
                            {caseItem.priority}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(caseItem.status)}`}>
                            {caseItem.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{caseItem.title}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{caseItem.victims.length} Victim(s)</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Shield className="w-4 h-4" />
                            <span>{caseItem.perpetrators.length} Suspect(s)</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Search className="w-4 h-4" />
                            <span>{caseItem.evidence.length} Evidence</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Eye className="w-4 h-4" />
                            <span>{caseItem.witnesses.length} Witness(es)</span>
                          </div>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                          Incident Date: {new Date(caseItem.incidentDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <Link href={`/dashboard/cases/${caseItem.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            View Case
                          </Button>
                        </Link>
                        <Link href={`/dashboard/cases/${caseItem.id}/evidence`}>
                          <Button variant="ghost" size="sm" className="w-full">
                            Evidence
                          </Button>
                        </Link>
                        <Link href={`/dashboard/cases/${caseItem.id}/witnesses`}>
                          <Button variant="ghost" size="sm" className="w-full">
                            Witnesses
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UserSearch className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p>No cases assigned to you</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evidence Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Upload, track, and manage evidence for your cases
              </p>
              <Link href="/dashboard/cases">
                <Button variant="outline" className="w-full">
                  View All Cases
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Witness Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Schedule and conduct witness interviews
              </p>
              <Link href="/dashboard/witnesses">
                <Button variant="outline" className="w-full">
                  Manage Witnesses
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Investigation Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Create and submit investigation reports
              </p>
              <Link href="/dashboard/reports">
                <Button variant="outline" className="w-full">
                  Generate Reports
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
