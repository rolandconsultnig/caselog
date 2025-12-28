'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface CaseFile {
  id: string;
  fileName: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  storageProvider: string;
  accessLevel: string;
  virusScanResult: string;
  uploadedByName: string;
  uploadDate: string;
  description?: string;
  fileUrl?: string;
  tags?: string[];
  category?: string;
}

export default function CaseDocumentsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [documents, setDocuments] = useState<CaseFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, [params.id]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/cases/${params.id}/documents`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'MEDICAL_REPORT': return 'info';
      case 'FORENSIC_REPORT': return 'warning';
      case 'LEGAL_DOCUMENT': return 'default';
      case 'EVIDENCE_PHOTO': return 'success';
      case 'WITNESS_STATEMENT': return 'error';
      default: return 'default';
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'PUBLIC': return 'success';
      case 'INTERNAL': return 'info';
      case 'RESTRICTED': return 'warning';
      case 'CONFIDENTIAL': return 'error';
      default: return 'default';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Case Documents</h1>
            <p className="text-gray-600 mt-1">
              Manage case files, reports, and documentation
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/cases/${params.id}`}>
              <Button variant="outline">Back to Case</Button>
            </Link>
            <Link href={`/dashboard/cases/${params.id}/documents/upload`}>
              <Button>
                <span className="mr-2">📎</span>
                Upload Document
              </Button>
            </Link>
          </div>
        </div>

        {/* Documents List */}
        {loading ? (
          <Card>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading documents...</p>
            </div>
          </Card>
        ) : documents.length === 0 ? (
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No documents uploaded</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start by uploading case documents and reports.
              </p>
              <div className="mt-6">
                <Link href={`/dashboard/cases/${params.id}/documents/upload`}>
                  <Button>
                    <span className="mr-2">📎</span>
                    Upload First Document
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {doc.originalFileName || doc.fileName}
                      </h3>
                      <Badge variant={getFileTypeColor(doc.fileType)}>
                        {doc.fileType.replace(/_/g, ' ')}
                      </Badge>
                      <Badge variant={getAccessLevelColor(doc.accessLevel)}>
                        {doc.accessLevel}
                      </Badge>
                      {doc.virusScanResult === 'CLEAN' && (
                        <Badge variant="success">✓ Scanned</Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">Size:</span>
                        <p className="font-medium">{formatFileSize(doc.fileSize)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Storage:</span>
                        <p className="font-medium">{doc.storageProvider}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Uploaded by:</span>
                        <p className="font-medium">{doc.uploadedByName || 'Unknown'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Date:</span>
                        <p className="font-medium">
                          {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {doc.description && (
                      <div className="text-sm">
                        <span className="text-gray-500">Description:</span>
                        <p className="font-medium">{doc.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.open(`/api/documents/${doc.id}`, '_blank');
                      }}
                    >
                      📥 Download
                    </Button>
                    <Link href={`/dashboard/cases/${params.id}/documents/${doc.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {documents.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Documents</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {documents.filter(d => d.fileType === 'MEDICAL_REPORT').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Medical Reports</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {documents.filter(d => d.fileType === 'FORENSIC_REPORT').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Forensic Reports</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">
                {documents.filter(d => d.virusScanResult === 'CLEAN').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Virus-Scanned</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

