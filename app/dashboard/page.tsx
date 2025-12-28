'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
  Shield,
  Briefcase,
  Activity,
  BarChart3,
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import axios from 'axios';
import { useState } from 'react';
import { AccessLevel } from '@prisma/client';

type TimeRange = '7d' | '30d' | 'all';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const router = useRouter();

  useEffect(() => {
    if (session) {
      if (session.user.accessLevel === AccessLevel.INVESTIGATOR) {
        router.push('/dashboard/investigator');
      } else if (session.user.accessLevel === AccessLevel.PROSECUTOR) {
        router.push('/dashboard/prosecutor');
      }
    }
  }, [session, router]);

  const { data: statistics, isLoading } = useQuery({
    queryKey: ['statistics', timeRange],
    queryFn: async () => {
      const response = await axios.get(`/api/statistics?range=${timeRange}`);
      return response.data;
    },
    enabled: !!session,
  });

  if (!session) {
    return null;
  }
  
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#8B5CF6'];

  const casesByTypeData = statistics?.casesByType
    ?.map((item: any, index: number) => ({
      name: item.type.replace(/_/g, ' '),
      value: item.count,
      fill: COLORS[index % COLORS.length],
    })) || [];

  const priorityData = statistics?.priorityDistribution 
    ? Object.entries(statistics.priorityDistribution).map(([key, value], index) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: value,
        fill: COLORS[index % COLORS.length],
      }))
    : [];
    
  const stats = [
    {
      name: 'Total Cases',
      value: statistics?.summary?.total || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/dashboard/cases',
      trend: '+5% this month',
    },
    {
      name: 'Approved Cases',
      value: statistics?.summary?.approved || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/dashboard/cases',
      trend: `${statistics?.summary?.total > 0 ? ((statistics.summary.approved / statistics.summary.total) * 100).toFixed(1) : 0}% approval rate`,
    },
    {
      name: 'Pending Approval',
      value: statistics?.summary?.pending || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      href: '/dashboard/cases',
      trend: 'Action Required',
    },
    {
      name: 'Active Services',
      value: statistics?.systemMetrics?.services || 0,
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/dashboard/services',
      trend: 'Supporting victims',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section & Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {session.user.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's your real-time analytics overview for {session.user.tenantName}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(['7d', '30d', 'all'] as TimeRange[]).map(range => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                onClick={() => setTimeRange(range)}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : 'All Time'}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Link key={stat.name} href={stat.href}>
              <Card className="hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-transparent hover:border-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-4xl font-bold text-gray-900 mt-2">
                        {isLoading ? '...' : stat.value}
                      </p>
                       <p className={`text-xs mt-2 ${stat.color}`}>{stat.trend}</p>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-full`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Chart: Cases by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Cases by Type ({timeRange === 'all' ? 'All Time' : `Last ${timeRange.replace('d', ' Days')}`})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={casesByTypeData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Cases">
                      {casesByTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Side Chart: Priority Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      align="center"
                      verticalAlign="bottom"
                      wrapperStyle={{ lineHeight: '40px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Cases */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Cases</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-gray-500">Loading...</p>
              ) : statistics?.recentCases?.length > 0 ? (
                <div className="space-y-4">
                  {statistics.recentCases.slice(0, 5).map((caseItem: any) => (
                    <Link
                      key={caseItem.id}
                      href={`/dashboard/cases/${caseItem.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-semibold text-gray-900">
                              {caseItem.caseNumber}
                            </h4>
                            <Badge
                              variant={
                                caseItem.status === 'APPROVED'
                                  ? 'success'
                                  : caseItem.status === 'PENDING_APPROVAL'
                                  ? 'warning'
                                  : caseItem.status === 'REJECTED'
                                  ? 'danger'
                                  : 'default'
                              }
                            >
                              {caseItem.status.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Victim: {caseItem.victims?.[0]?.name || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(caseItem.createdAt)}
                            {session.user.tenantType === 'FEDERAL' && ` • ${caseItem.tenant?.name}`}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No cases found in this period.</p>
              )}
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <div className="space-y-6">
             <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Link href="/dashboard/cases/new">
                  <Button className="w-full">New Case</Button>
                </Link>
                <Link href="/dashboard/reports">
                  <Button className="w-full" variant="outline">View Reports</Button>
                </Link>
                <Link href="/dashboard/services">
                  <Button className="w-full" variant="outline">Services</Button>
                </Link>
                <Link href="/dashboard/users">
                  <Button className="w-full" variant="outline">Manage Users</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

