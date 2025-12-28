'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface Evidence {
  id: string;
  evidenceNumber: string;
  evidenceType: string;
  description: string;
  storageLocation: string;
  chainOfCustody: boolean;
  forensicAnalysis: boolean;
  createdAt: string;
}

export default function CaseEvidencePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvidence();
  }, [params.id]);

  const fetchEvidence = async () => {
    try {
      const response = await fetch(`/api/cases/${params.id}/evidence`);
      if (response.ok) {
        const data = await response.json();
        setEvidence(data.evidence || []);
      }
    } catch (error) {
      console.error('Error fetching evidence:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEvidenceTypeColor = (type: string) => {
    switch (type) {
      case 'PHYSICAL': return 'default';
      case 'DIGITAL': return 'info';
      case 'DOCUMENTARY': return 'warning';
      case 'FORENSIC': return 'error';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Case Evidence</h1>
            <p className="text-gray-600 mt-1">
              Manage evidence and chain of custody for this case
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/cases/${params.id}`}>
              <Button variant="outline">Back to Case</Button>
            </Link>
            <Link href={`/dashboard/cases/${params.id}/evidence/new`}>
              <Button>
                <span className="mr-2">+</span>
                Add Evidence
              </Button>
            </Link>
          </div>
        </div>

        {/* Evidence List */}
        {loading ? (
          <Card>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading evidence...</p>
            </div>
          </Card>
        ) : evidence.length === 0 ? (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No evidence added</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start by adding evidence to this case.
              </p>
              <div className="mt-6">
                <Link href={`/dashboard/cases/${params.id}/evidence/new`}>
                  <Button>
                    <span className="mr-2">+</span>
                    Add First Evidence
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {evidence.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <Link href={`/dashboard/cases/${params.id}/evidence/${item.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          Evidence #{item.evidenceNumber}
                        </h3>
                        <Badge variant={getEvidenceTypeColor(item.evidenceType)}>
                          {item.evidenceType}
                        </Badge>
                        {item.chainOfCustody && (
                          <Badge variant="success">🔗 CoC Maintained</Badge>
                        )}
                        {item.forensicAnalysis && (
                          <Badge variant="info">🔬 Analyzed</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Storage:</span>
                          <p className="font-medium">{item.storageLocation}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Description:</span>
                          <p className="font-medium truncate">{item.description}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Date Added:</span>
                          <p className="font-medium">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex gap-2">
                      <Link href={`/dashboard/cases/${params.id}/custody?evidenceId=${item.id}`}>
                        <Button variant="outline" size="sm">
                          🔗 CoC
                        </Button>
                      </Link>
                      <svg
                        className="h-5 w-5 text-gray-400 mt-2"
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
                {evidence.filter(e => e.evidenceType === 'PHYSICAL').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Physical Evidence</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {evidence.filter(e => e.chainOfCustody).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Chain of Custody</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {evidence.filter(e => e.forensicAnalysis).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Forensic Analysis</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">
                {evidence.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Evidence</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

