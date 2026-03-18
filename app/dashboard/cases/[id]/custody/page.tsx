'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import Image from 'next/image';

interface ChainOfCustody {
  id: string;
  evidenceId: string;
  evidenceNumber: string;
  transferredFrom: string;
  transferredTo: string;
  transferDate: string;
  purpose: string;
  condition: string;
  receivedBy: string;
  receivedBySignature?: string;
  notes?: string;
}

export default function CaseCustodyPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [custodyRecords, setCustodyRecords] = useState<ChainOfCustody[]>([]);
  const [loading, setLoading] = useState(true);
  const evidenceId = searchParams?.get('evidenceId');

  const fetchCustodyRecords = useCallback(async () => {
    try {
      const url = evidenceId
        ? `/api/cases/${params.id}/custody?evidenceId=${evidenceId}`
        : `/api/cases/${params.id}/custody`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setCustodyRecords(data.custodyRecords || []);
      }
    } catch (error) {
      console.error('Error fetching custody records:', error);
    } finally {
      setLoading(false);
    }
  }, [evidenceId, params.id]);

  useEffect(() => {
    fetchCustodyRecords();
  }, [fetchCustodyRecords]);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'EXCELLENT': return 'success';
      case 'GOOD': return 'info';
      case 'FAIR': return 'warning';
      case 'POOR': return 'danger';
      case 'DAMAGED': return 'danger';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Chain of Custody</h1>
            <p className="text-gray-600 mt-1">
              Track evidence custody transfers and maintain integrity
            </p>
            {evidenceId && (
              <p className="text-sm text-blue-600 mt-2">
                Showing records for Evidence ID: {evidenceId}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/cases/${params.id}`}>
              <Button variant="outline">Back to Case</Button>
            </Link>
            <Link href={`/dashboard/cases/${params.id}/custody/new${evidenceId ? `?evidenceId=${evidenceId}` : ''}`}>
              <Button>
                <span className="mr-2">+</span>
                Add Transfer
              </Button>
            </Link>
          </div>
        </div>

        {/* Custody Timeline */}
        {loading ? (
          <Card>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading custody records...</p>
            </div>
          </Card>
        ) : custodyRecords.length === 0 ? (
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No custody records</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start by adding custody transfer records.
              </p>
              <div className="mt-6">
                <Link href={`/dashboard/cases/${params.id}/custody/new${evidenceId ? `?evidenceId=${evidenceId}` : ''}`}>
                  <Button>
                    <span className="mr-2">+</span>
                    Add First Transfer
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Timeline visualization */}
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              {custodyRecords
                .sort((a, b) => new Date(b.transferDate).getTime() - new Date(a.transferDate).getTime())
                .map((record, index) => (
                <div key={record.id} className="relative flex items-start mb-8">
                  <div className="absolute left-6 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow"></div>

                  <div className="ml-16 w-full">
                    <Card className="hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">
                              Transfer #{custodyRecords.length - index}
                            </h3>
                            <Badge variant="info">{record.evidenceNumber}</Badge>
                            <Badge variant={getConditionColor(record.condition)}>
                              {record.condition}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-gray-500">From:</span>
                              <p className="font-medium">{record.transferredFrom}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">To:</span>
                              <p className="font-medium">{record.transferredTo}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Date:</span>
                              <p className="font-medium">
                                {new Date(record.transferDate).toLocaleDateString()} at{' '}
                                {new Date(record.transferDate).toLocaleTimeString()}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500">Received By:</span>
                              <p className="font-medium">{record.receivedBy}</p>
                            </div>
                          </div>

                          <div className="text-sm">
                            <span className="text-gray-500">Purpose:</span>
                            <p className="font-medium">{record.purpose}</p>
                          </div>

                          {record.notes && (
                            <div className="text-sm mt-2">
                              <span className="text-gray-500">Notes:</span>
                              <p className="font-medium">{record.notes}</p>
                            </div>
                          )}

                          {record.receivedBySignature && (
                            <div className="mt-3 p-2 bg-gray-50 rounded">
                              <span className="text-xs text-gray-500">Signature:</span>
                              <div className="mt-1">
                                <Image
                                  src={record.receivedBySignature}
                                  alt="Signature"
                                  width={240}
                                  height={64}
                                  className="h-8 w-auto border border-gray-300 rounded"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="ml-4">
                          <Link href={`/dashboard/cases/${params.id}/custody/${record.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {custodyRecords.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Transfers</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {custodyRecords.filter(c => c.condition === 'EXCELLENT' || c.condition === 'GOOD').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Good Condition</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {custodyRecords.filter(c => c.condition === 'DAMAGED' || c.condition === 'POOR').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Damaged Items</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">
                {new Set(custodyRecords.map(c => c.evidenceId)).size}
              </p>
              <p className="text-sm text-gray-600 mt-1">Evidence Items</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

