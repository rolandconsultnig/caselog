'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface Witness {
  id: string;
  witnessNumber: string;
  firstName: string;
  lastName: string;
  witnessType: string;
  protectionLevel: string;
  credibilityRating: string;
  phoneNumber?: string;
  statementRecorded: boolean;
  createdAt: string;
}

export default function CaseWitnessesPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [witnesses, setWitnesses] = useState<Witness[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWitnesses();
  }, [params.id]);

  const fetchWitnesses = async () => {
    try {
      const response = await fetch(`/api/cases/${params.id}/witnesses`);
      if (response.ok) {
        const data = await response.json();
        setWitnesses(data.witnesses || []);
      }
    } catch (error) {
      console.error('Error fetching witnesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProtectionColor = (level: string) => {
    switch (level) {
      case 'NONE': return 'default';
      case 'LOW': return 'info';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'error';
      case 'CRITICAL': return 'error';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Case Witnesses</h1>
            <p className="text-gray-600 mt-1">
              Manage witnesses for this case
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/cases/${params.id}`}>
              <Button variant="outline">Back to Case</Button>
            </Link>
            <Link href={`/dashboard/cases/${params.id}/witnesses/new`}>
              <Button>
                <span className="mr-2">+</span>
                Add Witness
              </Button>
            </Link>
          </div>
        </div>

        {/* Witnesses List */}
        {loading ? (
          <Card>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading witnesses...</p>
            </div>
          </Card>
        ) : witnesses.length === 0 ? (
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No witnesses added</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start by adding witnesses to this case.
              </p>
              <div className="mt-6">
                <Link href={`/dashboard/cases/${params.id}/witnesses/new`}>
                  <Button>
                    <span className="mr-2">+</span>
                    Add First Witness
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {witnesses.map((witness) => (
              <Card key={witness.id} className="hover:shadow-lg transition-shadow">
                <Link href={`/dashboard/cases/${params.id}/witnesses/${witness.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {witness.firstName} {witness.lastName}
                        </h3>
                        <Badge variant="info">{witness.witnessType}</Badge>
                        <Badge variant={getProtectionColor(witness.protectionLevel)}>
                          Protection: {witness.protectionLevel}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Witness #:</span>
                          <p className="font-medium">{witness.witnessNumber}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Credibility:</span>
                          <p className="font-medium">{witness.credibilityRating}</p>
                        </div>
                        {witness.phoneNumber && (
                          <div>
                            <span className="text-gray-500">Phone:</span>
                            <p className="font-medium">{witness.phoneNumber}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-500">Statement:</span>
                          <p className="font-medium">
                            {witness.statementRecorded ? '✓ Recorded' : '✗ Pending'}
                          </p>
                        </div>
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
                {witnesses.filter(w => w.witnessType === 'EYEWITNESS').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Eyewitnesses</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {witnesses.filter(w => w.statementRecorded).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Statements Recorded</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {witnesses.filter(w => w.protectionLevel === 'HIGH' || w.protectionLevel === 'CRITICAL').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">High Protection</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">
                {witnesses.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Witnesses</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

