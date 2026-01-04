'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
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
import {
  Shield,
  Users,
  FileText,
  TrendingUp,
  MapPin,
  Calendar,
  Eye,
  Download,
  Phone,
  Mail,
  ExternalLink,
} from 'lucide-react';
import axios from 'axios';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#8B5CF6'];

export default function PublicDashboard() {
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('all');
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    fetchPublicStatistics();
  }, [selectedState, timeRange]);

  const fetchPublicStatistics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/public/statistics?state=${selectedState}&range=${timeRange}`
      );
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching public statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const casesByTypeData = statistics?.casesByType
    ?.map((item: any, index: number) => ({
      name: item.type.replace(/_/g, ' '),
      value: item.count,
      fill: COLORS[index % COLORS.length],
    })) || [];

  const monthlyTrendData = statistics?.monthlyTrend || [];
  const stateComparisonData = statistics?.stateComparison || [];

  const stats = [
    {
      name: 'Total Cases Reported',
      value: statistics?.summary?.total || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Across all states',
    },
    {
      name: 'Active States',
      value: statistics?.summary?.activeStates || 0,
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'States reporting data',
    },
    {
      name: 'Cases This Month',
      value: statistics?.summary?.thisMonth || 0,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'New reports',
    },
    {
      name: 'Resolution Rate',
      value: `${statistics?.summary?.resolutionRate || 0}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Cases resolved',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading public dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Image
                src="/coat-of-arms.png"
                alt="Nigerian Coat of Arms"
                width={40}
                height={40}
                className="object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  SGBV Information System - Public Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Federal Ministry of Justice, Nigeria
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/select-state">
                <Button variant="outline" size="sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Sexual and Gender-Based Violence Information System
              </h2>
              <p className="text-gray-600 mb-4">
                Welcome to the public dashboard of Nigeria's SGBV Information System. 
                This platform provides transparent access to aggregated statistics on 
                sexual and gender-based violence cases across all Nigerian states.
              </p>
              <p className="text-gray-600 mb-6">
                The data shown here is anonymized and aggregated to protect victim 
                privacy while maintaining transparency in our collective efforts to 
                combat SGBV in Nigeria.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span>Public Access</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Real-time Data</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>Privacy Protected</span>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Need Help or Support?
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">National Helpline</p>
                    <p className="text-sm text-gray-600">0800-123-4567 (24/7)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email Support</p>
                    <p className="text-sm text-gray-600">support@sgbv.gov.ng</p>
                  </div>
                </div>
                <Button className="w-full mt-4">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Find Support Services
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Data Filters</h3>
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All States</option>
                {statistics?.availableStates?.map((state: any) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="1y">Last Year</option>
                <option value="30d">Last 30 Days</option>
                <option value="7d">Last 7 Days</option>
              </select>
              <Button variant="outline" onClick={fetchPublicStatistics}>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.name} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Cases by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Cases by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={casesByTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {casesByTypeData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="cases"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      name="Cases"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* State Comparison */}
        {selectedState === 'all' && stateComparisonData.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Cases by State</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stateComparisonData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cases" fill="#3B82F6" name="Total Cases" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              About This Dashboard
            </h3>
            <p className="text-gray-600 mb-4">
              This public dashboard is part of Nigeria's commitment to transparency 
              and accountability in addressing sexual and gender-based violence. 
              The data is updated regularly and represents anonymized, aggregated 
              information from all participating states.
            </p>
            <div className="flex justify-center gap-8 text-sm text-gray-500">
              <span>Last updated: {formatDate(new Date())}</span>
              <span>•</span>
              <span>Data source: SGBV Information System</span>
              <span>•</span>
              <Link href="/privacy" className="text-green-600 hover:text-green-700">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/coat-of-arms.png"
                  alt="Nigerian Coat of Arms"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <h4 className="text-lg font-semibold">Federal Ministry of Justice</h4>
              </div>
              <p className="text-gray-400 text-sm">
                Committed to justice, safety, and protection for all Nigerians.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About SGBV System
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-white">
                    Resources & Support
                  </Link>
                </li>
                <li>
                  <Link href="/reports" className="hover:text-white">
                    Annual Reports
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Emergency Contacts</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>National Emergency: 112</p>
                <p>SGBV Helpline: 0800-123-4567</p>
                <p>Email: support@sgbv.gov.ng</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Federal Ministry of Justice, Nigeria. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
