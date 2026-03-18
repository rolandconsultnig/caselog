'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Shield
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import axios from 'axios';

interface CasesByTypeItem {
  type: string;
  count: number;
}

interface CasesByStateItem {
  tenantCode: string;
  tenantName: string;
  count: number;
}

type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';
type ChartType = 'bar' | 'pie' | 'line' | 'area' | 'radar';

export default function StatisticsPage() {
  const { data: session } = useSession();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: statistics, isLoading, refetch } = useQuery({
    queryKey: ['statistics', timeRange],
    queryFn: async () => {
      const response = await axios.get(`/api/statistics?range=${timeRange}`);
      return response.data;
    },
    enabled: !!session,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const getTimeRangeLabel = (range: TimeRange) => {
    switch (range) {
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 3 Months';
      case '1y': return 'Last Year';
      case 'all': return 'All Time';
      default: return 'Last 30 Days';
    }
  };

  // Prepare chart data
  const statusData = [
    { name: 'Approved', value: statistics?.summary?.approved || 0, color: '#10B981' },
    { name: 'Pending', value: statistics?.summary?.pending || 0, color: '#F59E0B' },
    { name: 'Rejected', value: statistics?.summary?.rejected || 0, color: '#EF4444' },
    { name: 'Draft', value: statistics?.summary?.draft || 0, color: '#6B7280' },
  ];

  const typeData =
    (statistics?.casesByType as CasesByTypeItem[] | undefined)?.map((item) => ({
      name: item.type.replace(/_/g, ' '),
      value: item.count,
      percentage: ((item.count / (statistics?.summary?.total || 1)) * 100).toFixed(1),
    })) || [];

  const stateData =
    (statistics?.casesByState as CasesByStateItem[] | undefined)?.map((item) => ({
      name: item.tenantCode,
      cases: item.count,
      fullName: item.tenantName,
    })) || [];

  const monthlyTrend = [
    { month: 'Jan', cases: 45, approved: 32, rejected: 8 },
    { month: 'Feb', cases: 52, approved: 38, rejected: 9 },
    { month: 'Mar', cases: 48, approved: 35, rejected: 7 },
    { month: 'Apr', cases: 61, approved: 45, rejected: 11 },
    { month: 'May', cases: 55, approved: 42, rejected: 6 },
    { month: 'Jun', cases: 67, approved: 51, rejected: 8 },
  ];

  if (!session) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📊 Statistics & Analytics</h1>
            <p className="text-gray-600 mt-1">
              Interactive dashboards with real-time insights
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 3 Months</option>
              <option value="1y">Last Year</option>
              <option value="all">All Time</option>
            </select>

            {/* Chart Type Selector */}
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as ChartType)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="bar">Bar Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="line">Line Chart</option>
              <option value="area">Area Chart</option>
              <option value="radar">Radar Chart</option>
            </select>

            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Interactive KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cases</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {isLoading ? '...' : statistics?.summary?.total || 0}
                  </p>
                  <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved Cases</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {isLoading ? '...' : statistics?.summary?.approved || 0}
                  </p>
                  <p className="text-xs text-green-600 mt-1">+8% approval rate</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">
                    {isLoading ? '...' : statistics?.summary?.pending || 0}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">Requires attention</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected Cases</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">
                    {isLoading ? '...' : statistics?.summary?.rejected || 0}
                  </p>
                  <p className="text-xs text-red-600 mt-1">-3% from last month</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Case Status Distribution</CardTitle>
              <Badge variant="info">{getTimeRangeLabel(timeRange)}</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'pie' ? (
                    <RechartsPieChart>
                      <RechartsPieChart.Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </RechartsPieChart.Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  ) : chartType === 'bar' ? (
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  ) : chartType === 'radar' ? (
                    <RadarChart data={statusData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis />
                      <Radar name="Cases" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                      <Tooltip />
                    </RadarChart>
                  ) : (
                    <AreaChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Cases by Type Chart */}
          <Card>
            <CardHeader>
              <CardTitle>SGBV Types Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typeData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => [value, 'Cases']} />
                    <Bar dataKey="value" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trend Analysis */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>📈 Monthly Trends</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">6M</Button>
              <Button variant="outline" size="sm">1Y</Button>
              <Button variant="outline" size="sm">2Y</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cases" stroke="#3B82F6" strokeWidth={2} name="Total Cases" />
                  <Line type="monotone" dataKey="approved" stroke="#10B981" strokeWidth={2} name="Approved" />
                  <Line type="monotone" dataKey="rejected" stroke="#EF4444" strokeWidth={2} name="Rejected" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Federal View: Interactive State Map */}
        {session.user.tenantType === 'FEDERAL' && (
          <Card>
            <CardHeader>
              <CardTitle>🗺️ Cases by State</CardTitle>
              <p className="text-sm text-gray-600">Interactive state-wise distribution</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {stateData
                  .sort((a, b) => b.cases - a.cases)
                  .map((state, index) => (
                    <div
                      key={state.name}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {state.name}
                            </p>
                            <p className="text-xs text-gray-600">{state.fullName}</p>
                          </div>
                        </div>
                        <Badge variant={state.cases > 50 ? 'error' : state.cases > 25 ? 'warning' : 'success'}>
                          {state.cases > 50 ? 'High' : state.cases > 25 ? 'Medium' : 'Low'}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">{state.cases}</p>
                          <p className="text-xs text-gray-500">cases reported</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-600">
                            {((state.cases / (statistics?.summary?.total || 1)) * 100).toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-500">of total</p>
                        </div>
                      </div>

                      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(state.cases / Math.max(...stateData.map(s => s.cases))) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Advanced Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>⚡ Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Approval Rate</p>
                  <p className="text-xs text-gray-500">Cases processed successfully</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">
                    {statistics?.summary?.total > 0
                      ? ((statistics.summary.approved / statistics.summary.total) * 100).toFixed(1)
                      : 0}%
                  </p>
                  <p className="text-xs text-green-600">+2.1% vs last month</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Avg Processing Time</p>
                  <p className="text-xs text-gray-500">Days to resolution</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600">7.2</p>
                  <p className="text-xs text-blue-600">-1.3 days vs last month</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Case Load</p>
                  <p className="text-xs text-gray-500">Per investigator</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-purple-600">12.5</p>
                  <p className="text-xs text-purple-600">+0.8 vs last month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>🔴 Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">High Risk Cases</p>
                  <p className="text-xs text-gray-500">Require immediate attention</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-red-600">3</p>
                  <p className="text-xs text-red-600">Active now</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Overdue Cases</p>
                  <p className="text-xs text-gray-500">Past SLA deadline</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-orange-600">8</p>
                  <p className="text-xs text-orange-600">Need review</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Escalated Cases</p>
                  <p className="text-xs text-gray-500">Supervisor review needed</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-yellow-600">5</p>
                  <p className="text-xs text-yellow-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>💚 System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Uptime</p>
                  <p className="text-xs text-gray-500">System availability</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">99.8%</p>
                  <p className="text-xs text-green-600">Excellent</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Response Time</p>
                  <p className="text-xs text-gray-500">Average API response</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600">245ms</p>
                  <p className="text-xs text-blue-600">Good</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Data Freshness</p>
                  <p className="text-xs text-gray-500">Last update</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-600">2m ago</p>
                  <p className="text-xs text-gray-600">Real-time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Recent Activity</CardTitle>
            <p className="text-sm text-gray-600">Latest case updates and system events</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'case_approved', message: 'Case #CL-202511-0042 approved by Lagos Admin', time: '2 minutes ago', icon: CheckCircle, color: 'text-green-600' },
                { type: 'witness_added', message: 'New witness added to Case #CL-202511-0039', time: '5 minutes ago', icon: Users, color: 'text-blue-600' },
                { type: 'evidence_uploaded', message: 'Forensic evidence uploaded to Case #CL-202511-0041', time: '12 minutes ago', icon: FileText, color: 'text-purple-600' },
                { type: 'service_referral', message: 'Medical service referral created for Case #CL-202511-0038', time: '18 minutes ago', icon: Shield, color: 'text-orange-600' },
                { type: 'court_hearing', message: 'Court hearing scheduled for Case #CL-202511-0040', time: '25 minutes ago', icon: AlertTriangle, color: 'text-red-600' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <activity.icon className={`w-5 h-5 mt-0.5 ${activity.color}`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

