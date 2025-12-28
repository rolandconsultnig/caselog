'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  FileText,
  Download,
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Printer,
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Report {
  id: string;
  name: string;
  description: string;
  reportType: string;
  generatedAt: string;
  generatedBy: {
    firstName: string;
    lastName: string;
    email: string;
  };
  config: any;
  data: any;
}

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const reportId = params?.reportId as string;
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  const fetchReport = async () => {
    try {
      const response = await axios.get(`/api/reports/${reportId}`);
      setReport(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load report');
      router.push('/dashboard/reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      const response = await axios.get(`/api/reports/${reportId}/export?format=${format}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${report?.name || 'report'}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error: any) {
      toast.error(`Failed to export report as ${format.toUpperCase()}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading report...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!report) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-red-600">Report not found</p>
          <Button onClick={() => router.push('/dashboard/reports')} className="mt-4">
            Back to Reports
          </Button>
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
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{report.name}</h1>
              <p className="text-gray-600 mt-1">{report.description || 'No description'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('excel')}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Excel
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              className="flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
        </div>

        {/* Report Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Report Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Generated On</p>
                  <p className="font-medium">
                    {format(new Date(report.generatedAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Generated By</p>
                  <p className="font-medium">
                    {report.generatedBy.firstName} {report.generatedBy.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Report Type</p>
                  <p className="font-medium capitalize">{report.reportType}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Content */}
        <Card>
          <CardHeader>
            <CardTitle>Report Data</CardTitle>
            <CardDescription>
              {report.reportType === 'summary' && 'Summary statistics and breakdowns'}
              {report.reportType === 'detailed' && 'Detailed case listings'}
              {report.reportType === 'trends' && 'Trend analysis over time'}
              {report.reportType === 'performance' && 'Performance metrics and KPIs'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Summary Report */}
              {report.reportType === 'summary' && report.data && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Cases</p>
                      <p className="text-2xl font-bold text-blue-600">{report.data.totalCases || 0}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Resolution Rate</p>
                      <p className="text-2xl font-bold text-green-600">
                        {report.data.resolutionRate || 0}%
                      </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Avg Processing Time</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {report.data.averageProcessingTime || 0} days
                      </p>
                    </div>
                  </div>

                  {report.data.statusBreakdown && (
                    <div>
                      <h3 className="font-semibold mb-3">Status Breakdown</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-2 text-left border">Status</th>
                              <th className="px-4 py-2 text-left border">Count</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report.data.statusBreakdown.map((item: any, index: number) => (
                              <tr key={index}>
                                <td className="px-4 py-2 border">{item.status}</td>
                                <td className="px-4 py-2 border">{item._count}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {report.data.typeBreakdown && (
                    <div>
                      <h3 className="font-semibold mb-3">Type Breakdown</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-2 text-left border">Type</th>
                              <th className="px-4 py-2 text-left border">Count</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report.data.typeBreakdown.map((item: any, index: number) => (
                              <tr key={index}>
                                <td className="px-4 py-2 border">{item.formOfSGBV}</td>
                                <td className="px-4 py-2 border">{item._count}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Detailed Report */}
              {report.reportType === 'detailed' && report.data && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left border">Case Number</th>
                        <th className="px-4 py-2 text-left border">Victim</th>
                        <th className="px-4 py-2 text-left border">Type</th>
                        <th className="px-4 py-2 text-left border">Status</th>
                        <th className="px-4 py-2 text-left border">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(report.data) &&
                        report.data.slice(0, 100).map((caseItem: any) => (
                          <tr key={caseItem.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border">{caseItem.caseNumber}</td>
                            <td className="px-4 py-2 border">
                              {caseItem.victim
                                ? `${caseItem.victim.firstName} ${caseItem.victim.lastName}`
                                : 'N/A'}
                            </td>
                            <td className="px-4 py-2 border">{caseItem.formOfSGBV}</td>
                            <td className="px-4 py-2 border">{caseItem.status}</td>
                            <td className="px-4 py-2 border">
                              {format(new Date(caseItem.createdAt), 'MMM dd, yyyy')}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {Array.isArray(report.data) && report.data.length > 100 && (
                    <p className="text-sm text-gray-500 mt-4">
                      Showing first 100 of {report.data.length} cases
                    </p>
                  )}
                </div>
              )}

              {/* Trends Report */}
              {report.reportType === 'trends' && report.data && (
                <div>
                  <h3 className="font-semibold mb-3">Monthly Trends</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left border">Month</th>
                          <th className="px-4 py-2 text-left border">Total Cases</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(report.data) &&
                          report.data.map((item: any, index: number) => (
                            <tr key={index}>
                              <td className="px-4 py-2 border">{item.month}</td>
                              <td className="px-4 py-2 border">{item.total}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Performance Report */}
              {report.reportType === 'performance' && report.data && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Approval Rate</p>
                    <p className="text-2xl font-bold text-green-600">
                      {report.data.approvalRate || 0}%
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Rejection Rate</p>
                    <p className="text-2xl font-bold text-red-600">
                      {report.data.rejectionRate || 0}%
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Pending Cases</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {report.data.pendingCases || 0}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Avg Approval Time</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {report.data.averageApprovalTime || 0} hours
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

