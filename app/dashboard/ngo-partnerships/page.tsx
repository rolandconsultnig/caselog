'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface NGOPartnership {
  id: string;
  partnershipNumber: string;
  ngoName: string;
  contactPerson: string;
  contactPhone: string;
  supportStartDate: string;
  supportEndDate?: string;
  supportFrequency?: string;
  finalReportSubmitted: boolean;
  satisfactionRating?: string;
  caseId: string;
}

export default function NGOPartnershipsPage() {
  const { data: session } = useSession();
  const [partnerships, setPartnerships] = useState<NGOPartnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('active');

  useEffect(() => {
    fetchPartnerships();
  }, [filter]);

  const fetchPartnerships = async () => {
    try {
      const params = new URLSearchParams();
      if (filter === 'active') {
        params.append('active', 'true');
      } else if (filter === 'completed') {
        params.append('completed', 'true');
      }
      
      const response = await fetch(`/api/ngo-partnerships?${params}`);
      if (response.ok) {
        const data = await response.json();
        setPartnerships(data.partnerships);
      }
    } catch (error) {
      console.error('Error fetching partnerships:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (partnership: NGOPartnership) => {
    if (partnership.finalReportSubmitted) {
      return <Badge variant="success">Completed</Badge>;
    } else if (partnership.supportEndDate) {
      return <Badge variant="warning">Ending Soon</Badge>;
    } else {
      return <Badge variant="info">Active</Badge>;
    }
  };

  const getSatisfactionColor = (rating?: string) => {
    switch (rating) {
      case 'EXCELLENT': return 'success';
      case 'GOOD': return 'info';
      case 'FAIR': return 'warning';
      case 'POOR': return 'error';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">NGO Partnerships</h1>
            <p className="text-gray-600 mt-1">
              Manage partnerships with civil society organizations
            </p>
          </div>
          <Link href="/dashboard/ngo-partnerships/new">
            <Button>
              <span className="mr-2">+</span>
              New Partnership
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All Partnerships
            </Button>
            <Button
              variant={filter === 'active' ? 'primary' : 'outline'}
              onClick={() => setFilter('active')}
            >
              Active
            </Button>
            <Button
              variant={filter === 'completed' ? 'primary' : 'outline'}
              onClick={() => setFilter('completed')}
            >
              Completed
            </Button>
          </div>
        </Card>

        {/* Partnerships List */}
        {loading ? (
          <Card>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading partnerships...</p>
            </div>
          </Card>
        ) : partnerships.length === 0 ? (
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No partnerships</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new NGO partnership.
              </p>
              <div className="mt-6">
                <Link href="/dashboard/ngo-partnerships/new">
                  <Button>
                    <span className="mr-2">+</span>
                    New Partnership
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {partnerships.map((partnership) => (
              <Card key={partnership.id} className="hover:shadow-lg transition-shadow">
                <Link href={`/dashboard/ngo-partnerships/${partnership.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{partnership.ngoName}</h3>
                        {getStatusBadge(partnership)}
                        {partnership.satisfactionRating && (
                          <Badge variant={getSatisfactionColor(partnership.satisfactionRating)}>
                            {partnership.satisfactionRating}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Partnership #:</span>
                          <p className="font-medium">{partnership.partnershipNumber}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Contact:</span>
                          <p className="font-medium">{partnership.contactPerson}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Phone:</span>
                          <p className="font-medium">{partnership.contactPhone}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Start Date:</span>
                          <p className="font-medium">
                            {new Date(partnership.supportStartDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {partnership.supportFrequency && (
                        <div className="mt-3 flex items-center gap-2 text-sm">
                          <svg
                            className="h-4 w-4 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-gray-600">
                            Frequency: {partnership.supportFrequency.replace('_', ' ')}
                          </span>
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
                {partnerships.filter(p => !p.finalReportSubmitted && !p.supportEndDate).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Active</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {partnerships.filter(p => p.finalReportSubmitted).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Completed</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {partnerships.filter(p => p.satisfactionRating === 'EXCELLENT').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Excellent Rating</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">
                {partnerships.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

