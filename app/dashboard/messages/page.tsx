'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { MessageSquare, Search, RefreshCw, Clock } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import Link from 'next/link';

interface Case {
  id: string;
  caseNumber: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  _count?: {
    chatMessages: number;
  };
}

export default function MessagesPage() {
  useSession();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cases');
      // Ensure response.data is an array
      const casesData = Array.isArray(response.data) ? response.data : [];
      setCases(casesData);
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast.error('Failed to fetch cases');
      setCases([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = Array.isArray(cases) ? cases.filter(
    (c) =>
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'default';
      case 'ACTIVE':
        return 'info';
      case 'INVESTIGATION':
        return 'warning';
      case 'CLOSED':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
      case 'URGENT':
        return 'danger';
      case 'HIGH':
        return 'warning';
      case 'MEDIUM':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Case Messages</h1>
            <p className="text-sm text-gray-600 mt-1">
              View and manage messages for all cases
            </p>
          </div>
          <button
            onClick={fetchCases}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Cases</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search cases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
                <p>Loading cases...</p>
              </div>
            ) : filteredCases.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">No cases found</p>
                <p className="text-sm mt-1">Create a case to start messaging</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCases.map((caseItem) => (
                  <Link
                    key={caseItem.id}
                    href={`/dashboard/cases/${caseItem.id}/messages`}
                    className="block"
                  >
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-mono text-gray-600 mb-1">
                              {caseItem.caseNumber}
                            </p>
                            <h3 className="text-base font-semibold text-gray-900 truncate">
                              {caseItem.title}
                            </h3>
                          </div>
                          <MessageSquare className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
                        </div>

                        <div className="flex items-center space-x-2 mb-3">
                          <Badge variant={getStatusColor(caseItem.status)}>
                            {caseItem.status}
                          </Badge>
                          <Badge variant={getPriorityColor(caseItem.priority)}>
                            {caseItem.priority}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(caseItem.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {caseItem._count?.chatMessages !== undefined && (
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="w-3 h-3" />
                              <span>{caseItem._count.chatMessages} messages</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
