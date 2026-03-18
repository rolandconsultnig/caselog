'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface CaseOffence {
  id: string;
  offenceName: string;
  offenceCode: string;
  applicableLaw: string;
  penalty: string;
  pleaType: string;
  verdictType?: string;
  sentenceType?: string;
  courtDate?: string;
  trialStatus: string;
  createdAt: string;
}

export default function CaseChargesPage() {
  const params = useParams();
  const [charges, setCharges] = useState<CaseOffence[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCharges = useCallback(async () => {
    try {
      const response = await fetch(`/api/cases/${params.id}/charges`);
      if (response.ok) {
        const data = await response.json();
        setCharges(data.charges || []);
      }
    } catch (error) {
      console.error('Error fetching charges:', error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchCharges();
  }, [fetchCharges]);

  const getPleaColor = (plea: string) => {
    switch (plea) {
      case 'GUILTY': return 'danger';
      case 'NOT_GUILTY': return 'success';
      case 'NO_CONTEST': return 'warning';
      default: return 'default';
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'GUILTY': return 'danger';
      case 'NOT_GUILTY': return 'success';
      case 'ACQUITTED': return 'success';
      case 'CONVICTED': return 'danger';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FILED': return 'info';
      case 'PENDING': return 'warning';
      case 'TRIAL': return 'default';
      case 'VERDICT': return 'success';
      case 'DISMISSED': return 'danger';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Legal Charges</h1>
            <p className="text-gray-600 mt-1">
              Manage charges, pleas, and court proceedings
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/cases/${params.id}`}>
              <Button variant="outline">Back to Case</Button>
            </Link>
            <Link href={`/dashboard/cases/${params.id}/charges/new`}>
              <Button>
                <span className="mr-2">+</span>
                Add Charge
              </Button>
            </Link>
          </div>
        </div>

        {/* Charges List */}
        {loading ? (
          <Card>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading charges...</p>
            </div>
          </Card>
        ) : charges.length === 0 ? (
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
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M12 7l3 9m0 0l6-2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No charges filed</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start by adding legal charges to this case.
              </p>
              <div className="mt-6">
                <Link href={`/dashboard/cases/${params.id}/charges/new`}>
                  <Button>
                    <span className="mr-2">+</span>
                    Add First Charge
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {charges.map((charge) => (
              <Card key={charge.id} className="hover:shadow-lg transition-shadow">
                <Link href={`/dashboard/cases/${params.id}/charges/${charge.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold">
                          {charge.offenceName}
                        </h3>
                        <Badge variant={getStatusColor(charge.trialStatus)}>
                          {charge.trialStatus}
                        </Badge>
                        {charge.pleaType && (
                          <Badge variant={getPleaColor(charge.pleaType)}>
                            Plea: {charge.pleaType}
                          </Badge>
                        )}
                        {charge.verdictType && (
                          <Badge variant={getVerdictColor(charge.verdictType)}>
                            {charge.verdictType}
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Offence Code:</span>
                          <p className="font-medium">{charge.offenceCode}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Applicable Law:</span>
                          <p className="font-medium">{charge.applicableLaw}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Penalty:</span>
                          <p className="font-medium">{charge.penalty}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {charge.courtDate && (
                          <div>
                            <span className="text-gray-500">Court Date:</span>
                            <p className="font-medium">
                              {new Date(charge.courtDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {charge.sentenceType && (
                          <div>
                            <span className="text-gray-500">Sentence:</span>
                            <p className="font-medium">{charge.sentenceType}</p>
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-gray-500 mt-2">
                        Filed on {new Date(charge.createdAt).toLocaleDateString()}
                      </div>
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
                {charges.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Charges</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {charges.filter(c => c.verdictType === 'NOT_GUILTY' || c.verdictType === 'ACQUITTED').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Acquittals</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {charges.filter(c => c.verdictType === 'GUILTY' || c.verdictType === 'CONVICTED').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Convictions</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">
                {charges.filter(c => c.trialStatus === 'TRIAL').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">In Trial</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

