'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface CaseCivilSociety {
  id: string;
  ngoName: string;
  ngoType: string;
  supportType: string;
  supportFrequency: string;
  startDate: string;
  endDate?: string;
  ngoContact: string;
  ngoSatisfactionRating?: string;
  partnershipStatus: string;
  fundingProvided?: number;
}

export default function CaseNGOPage() {
  const params = useParams();
  const [ngoPartnerships, setNgoPartnerships] = useState<CaseCivilSociety[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNGOPartnerships = useCallback(async () => {
    try {
      const response = await fetch(`/api/cases/${params.id}/ngo`);
      if (response.ok) {
        const data = await response.json();
        setNgoPartnerships(data.ngoPartnerships || []);
      }
    } catch (error) {
      console.error('Error fetching NGO partnerships:', error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchNGOPartnerships();
  }, [fetchNGOPartnerships]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'PENDING': return 'warning';
      case 'COMPLETED': return 'info';
      case 'TERMINATED': return 'danger';
      default: return 'default';
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'DAILY': return 'danger';
      case 'WEEKLY': return 'warning';
      case 'MONTHLY': return 'info';
      case 'QUARTERLY': return 'default';
      case 'ONE_TIME': return 'success';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">NGO Partnerships</h1>
            <p className="text-gray-600 mt-1">
              Manage civil society partnerships and NGO support
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/cases/${params.id}`}>
              <Button variant="outline">Back to Case</Button>
            </Link>
            <Link href={`/dashboard/cases/${params.id}/ngo/new`}>
              <Button>
                <span className="mr-2">🏢</span>
                Add NGO Partnership
              </Button>
            </Link>
          </div>
        </div>

        {/* NGO Partnerships List */}
        {loading ? (
          <Card>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading NGO partnerships...</p>
            </div>
          </Card>
        ) : ngoPartnerships.length === 0 ? (
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No NGO partnerships</h3>
              <p className="mt-1 text-sm text-gray-500">
                Connect with NGOs to provide additional victim support.
              </p>
              <div className="mt-6">
                <Link href={`/dashboard/cases/${params.id}/ngo/new`}>
                  <Button>
                    <span className="mr-2">🏢</span>
                    Add First Partnership
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {ngoPartnerships.map((partnership) => (
              <Card key={partnership.id} className="hover:shadow-lg transition-shadow">
                <Link href={`/dashboard/cases/${params.id}/ngo/${partnership.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold">
                          {partnership.ngoName}
                        </h3>
                        <Badge variant={getStatusColor(partnership.partnershipStatus)}>
                          {partnership.partnershipStatus}
                        </Badge>
                        <Badge variant={getFrequencyColor(partnership.supportFrequency)}>
                          {partnership.supportFrequency}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <p className="font-medium">{partnership.ngoType}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Support:</span>
                          <p className="font-medium">{partnership.supportType.replace(/_/g, ' ')}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Contact:</span>
                          <p className="font-medium">{partnership.ngoContact}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Start Date:</span>
                          <p className="font-medium">
                            {new Date(partnership.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        {partnership.endDate && (
                          <div>
                            <span className="text-gray-500">End Date:</span>
                            <p className="font-medium">
                              {new Date(partnership.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>

                      {partnership.fundingProvided && (
                        <div className="text-sm mb-2">
                          <span className="text-gray-500">Funding Provided:</span>
                          <p className="font-medium">₦{partnership.fundingProvided.toLocaleString()}</p>
                        </div>
                      )}

                      {partnership.ngoSatisfactionRating && (
                        <div className="mt-3">
                          <span className="text-sm text-gray-500">NGO Satisfaction:</span>
                          <Badge variant={partnership.ngoSatisfactionRating === 'EXCELLENT' || partnership.ngoSatisfactionRating === 'GOOD' ? 'success' : 'warning'}>
                            {partnership.ngoSatisfactionRating}
                          </Badge>
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
                {ngoPartnerships.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">NGO Partnerships</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {ngoPartnerships.filter(p => p.partnershipStatus === 'ACTIVE').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Active Partnerships</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {ngoPartnerships.filter(p => p.supportFrequency === 'DAILY').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Daily Support</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">
                {ngoPartnerships.reduce((sum, p) => sum + (p.fundingProvided || 0), 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Funding (₦)</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

