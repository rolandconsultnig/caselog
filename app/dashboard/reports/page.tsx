'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  FileText,
  Download,
  Filter,
  TrendingUp,
  BarChart3,
  Activity,
  Loader2,
} from 'lucide-react';
import { getPermissions } from '@/lib/permissions';
import { TenantType } from '@prisma/client';
import { toast } from 'sonner';
import { 
  THEME_COLORS, 
  REPORT_TYPES, 
  CASE_STATUS 
} from '@/lib/constants';

export default function ReportsPage() {
  const { data: session } = useSession();
  const [reportType, setReportType] = useState('summary');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTenant] = useState('');
  const [caseStatus, setCaseStatus] = useState('');
  const [casePriority] = useState('');
  const [sgbvType] = useState('');
  const [state] = useState('');
  const [jurisdiction] = useState('');

  const permissions = session
    ? getPermissions(session.user.accessLevel, session.user.tenantType as TenantType)
    : null;

  // Use fetch instead of axios for better compatibility
  const { data: reportData, isLoading, error, refetch } = useQuery({
    queryKey: ['reports', reportType, startDate, endDate, selectedTenant, caseStatus, casePriority, sgbvType, state, jurisdiction],
    queryFn: async () => {
      const params = new URLSearchParams({
        type: reportType,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(selectedTenant && { tenantId: selectedTenant }),
        ...(caseStatus && { status: caseStatus }),
        ...(casePriority && { priority: casePriority }),
        ...(sgbvType && { sgbvType }),
        ...(state && { state }),
        ...(jurisdiction && { jurisdiction }),
      });
      
      console.log('🔍 Fetching reports data...', params.toString());
      
      const response = await fetch(`/api/reports?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`Failed to fetch reports: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Reports data received:', data);
      return data;
    },
    enabled: !!session && !!permissions?.canGenerateReports,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handleExport = async (format: string) => {
    if (!reportData?.data) {
      toast.error('No report data to export.');
      return;
    }

    try {
      const response = await fetch(`/api/reports/export/${format}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportData: reportData.data,
          reportType: reportType.charAt(0).toUpperCase() + reportType.slice(1),
          filters: { startDate, endDate, selectedTenant },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to export report');
      }

      // Get filename from response headers or create default
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `report-${reportType}-${new Date().toISOString().split('T')[0]}.${format}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export report');
    }
  };

  if (!session || !permissions?.canGenerateReports) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
              <p className="text-gray-600">You do not have permission to generate reports.</p>
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <p><strong>Session:</strong> {session ? 'Active' : 'Not found'}</p>
                <p><strong>Access Level:</strong> {session?.user.accessLevel || 'N/A'}</p>
                <p><strong>Tenant Type:</strong> {session?.user.tenantType || 'N/A'}</p>
                <p><strong>Can Generate Reports:</strong> {permissions?.canGenerateReports ? 'Yes' : 'No'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-red-600">Reports Error</h2>
              <p className="text-gray-600 mb-4">There was an error loading the reports.</p>
              <div className="p-4 bg-red-50 border border-red-200 rounded mb-4">
                <p className="text-red-800"><strong>Error:</strong> {(error as Error).message}</p>
              </div>
              <Button onClick={() => refetch()} className="mr-2">
                Try Again
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate comprehensive reports and insights</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Report Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(REPORT_TYPES).map(([key, config]) => (
                    <option key={key} value={key.toLowerCase()}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Case Status
                </label>
                <select
                  value={caseStatus}
                  onChange={(e) => setCaseStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  {Object.entries(CASE_STATUS).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button onClick={() => refetch()} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BarChart3 className="w-4 h-4 mr-2" />}
                Generate Report
              </Button>
              <Button variant="outline" onClick={() => handleExport('excel')} disabled={!reportData?.data}>
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
              <Button variant="outline" onClick={() => handleExport('pdf')} disabled={!reportData?.data}>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Report Content */}
        {isLoading ? (
          <Card>
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-600">Generating report...</p>
              </div>
            </CardContent>
          </Card>
        ) : reportData?.data ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            {reportType === 'summary' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Cases</p>
                        <p className="text-2xl font-bold text-gray-900">{reportData.data.totalCases || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Activity className="w-8 h-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Active Cases</p>
                        <p className="text-2xl font-bold text-gray-900">{reportData.data.activeCases || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <TrendingUp className="w-8 h-8 text-yellow-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                        <p className="text-2xl font-bold text-gray-900">{reportData.data.pendingApproval || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <BarChart3 className="w-8 h-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Closed Cases</p>
                        <p className="text-2xl font-bold text-gray-900">{reportData.data.closedCases || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Charts */}
            {reportData.data.statusBreakdown && (
              <Card>
                <CardHeader>
                  <CardTitle>Cases by Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={reportData.data.statusBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {reportData.data.statusBreakdown.map((entry: { count: number; name?: string }, index: number) => (
                          <Cell key={`cell-${index}`} fill={THEME_COLORS.chart[index % THEME_COLORS.chart.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Report Data</h3>
                <p className="text-gray-600">Generate a report to see the results here.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
