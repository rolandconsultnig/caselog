'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { Download, Trash2, ArrowLeft, File, Image, Video, FileText, Music } from 'lucide-react';
import { toast } from 'sonner';

interface CaseFile {
  id: string;
  fileName: string;
  originalFileName: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  storageProvider: string;
  accessLevel: string;
  virusScanResult: string;
  virusScanDate?: string;
  uploadedByName: string;
  uploadDate: string;
  description?: string;
  fileUrl?: string;
  tags?: string[];
  category?: string;
  version: number;
  isLatestVersion: boolean;
  downloadCount: number;
  lastAccessedDate?: string;
}

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [document, setDocument] = useState<CaseFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchDocument();
  }, [params.docId]);

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/cases/${params.id}/documents`);
      if (response.ok) {
        const data = await response.json();
        const doc = data.documents?.find((d: CaseFile) => d.id === params.docId);
        if (doc) {
          setDocument(doc);
        } else {
          toast.error('Document not found');
          router.push(`/dashboard/cases/${params.id}/documents`);
        }
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      toast.error('Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.open(`/api/documents/${params.docId}`, '_blank');
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/documents/${params.docId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete failed');
      }

      toast.success('Document deleted successfully');
      router.push(`/dashboard/cases/${params.id}/documents`);
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast.error(error.message || 'Failed to delete document');
    } finally {
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    if (!document) return <File className="w-12 h-12 text-gray-400" />;
    
    if (document.mimeType?.startsWith('image/')) {
      return <Image className="w-12 h-12 text-blue-500" />;
    } else if (document.mimeType?.startsWith('video/')) {
      return <Video className="w-12 h-12 text-purple-500" />;
    } else if (document.mimeType?.startsWith('audio/')) {
      return <Music className="w-12 h-12 text-green-500" />;
    } else if (document.mimeType === 'application/pdf') {
      return <FileText className="w-12 h-12 text-red-500" />;
    }
    return <File className="w-12 h-12 text-gray-400" />;
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'PUBLIC': return 'success';
      case 'INTERNAL': return 'info';
      case 'RESTRICTED': return 'warning';
      case 'CONFIDENTIAL': return 'danger';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Card>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading document...</p>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  if (!document) {
    return (
      <DashboardLayout>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600">Document not found</p>
            <Link href={`/dashboard/cases/${params.id}/documents`}>
              <Button className="mt-4">Back to Documents</Button>
            </Link>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/cases/${params.id}/documents`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{document.originalFileName || document.fileName}</h1>
              <p className="text-gray-600 mt-1">Document Details</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            {(session?.user?.accessLevel === 'APP_ADMIN' || 
              session?.user?.accessLevel === 'SUPER_ADMIN' ||
              parseInt(session?.user?.accessLevel?.replace('LEVEL_', '') || '0') >= 4) && (
              <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                <Trash2 className="w-4 h-4 mr-2" />
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Preview */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">File Preview</h2>
                <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg">
                  {getFileIcon()}
                  <p className="mt-4 text-gray-600 text-center">
                    {document.mimeType || 'Unknown file type'}
                  </p>
                  {document.mimeType?.startsWith('image/') && (
                    <img
                      src={`/api/documents/${params.docId}/view`}
                      alt={document.originalFileName}
                      className="mt-4 max-w-full max-h-96 rounded-lg shadow-lg"
                    />
                  )}
                  {document.mimeType === 'application/pdf' && (
                    <div className="mt-4 w-full">
                      <iframe
                        src={`/api/documents/${params.docId}/view`}
                        className="w-full h-[600px] rounded-lg border"
                        title={document.originalFileName}
                      />
                    </div>
                  )}
                  {document.mimeType?.startsWith('video/') && (
                    <video
                      src={`/api/documents/${params.docId}/view`}
                      controls
                      className="mt-4 max-w-full max-h-96 rounded-lg shadow-lg"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {document.mimeType?.startsWith('audio/') && (
                    <audio
                      src={`/api/documents/${params.docId}/view`}
                      controls
                      className="mt-4 w-full"
                    >
                      Your browser does not support the audio tag.
                    </audio>
                  )}
                </div>
              </div>
            </Card>

            {/* Description */}
            {document.description && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <p className="text-gray-700">{document.description}</p>
                </div>
              </Card>
            )}

            {/* Tags */}
            {document.tags && document.tags.length > 0 && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {document.tags.map((tag, index) => (
                      <Badge key={index} variant="info">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* File Information */}
            <Card>
              <div className="p-6">
                <h3 className="font-semibold mb-4">File Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">File Name:</span>
                    <p className="font-medium">{document.originalFileName || document.fileName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">File Type:</span>
                    <p className="font-medium">{document.fileType.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">File Size:</span>
                    <p className="font-medium">{formatFileSize(document.fileSize)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">MIME Type:</span>
                    <p className="font-medium">{document.mimeType || 'Unknown'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Storage:</span>
                    <p className="font-medium">{document.storageProvider}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Access Level:</span>
                    <Badge variant={getAccessLevelColor(document.accessLevel)} className="mt-1">
                      {document.accessLevel}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-500">Version:</span>
                    <p className="font-medium">{document.version}</p>
                  </div>
                  {document.category && (
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <p className="font-medium">{document.category}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Upload Information */}
            <Card>
              <div className="p-6">
                <h3 className="font-semibold mb-4">Upload Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Uploaded By:</span>
                    <p className="font-medium">{document.uploadedByName || 'Unknown'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Upload Date:</span>
                    <p className="font-medium">
                      {new Date(document.uploadDate).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Downloads:</span>
                    <p className="font-medium">{document.downloadCount}</p>
                  </div>
                  {document.lastAccessedDate && (
                    <div>
                      <span className="text-gray-500">Last Accessed:</span>
                      <p className="font-medium">
                        {new Date(document.lastAccessedDate).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Security Information */}
            <Card>
              <div className="p-6">
                <h3 className="font-semibold mb-4">Security</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Virus Scan:</span>
                    <Badge
                      variant={document.virusScanResult === 'CLEAN' ? 'success' : 'warning'}
                      className="mt-1"
                    >
                      {document.virusScanResult === 'CLEAN' ? 'Clean' : document.virusScanResult}
                    </Badge>
                  </div>
                  {document.virusScanDate && (
                    <div>
                      <span className="text-gray-500">Scan Date:</span>
                      <p className="font-medium">
                        {new Date(document.virusScanDate).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

