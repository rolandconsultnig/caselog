'use client';

import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, formatDateTime, getCaseStatusColor } from '@/lib/utils';
import { getPermissions } from '@/lib/permissions';
import { TenantType } from '@prisma/client';
import axios from 'axios';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Trash2, ArrowLeft, FileText, Edit } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletionReason, setDeletionReason] = useState('');

  const permissions = session
    ? getPermissions(session.user.accessLevel, session.user.tenantType as TenantType)
    : null;

  const { data: caseData, isLoading } = useQuery({
    queryKey: ['case', params.id],
    queryFn: async () => {
      const response = await axios.get(`/api/cases/${params.id}`);
      return response.data;
    },
    enabled: !!session,
  });

  const approveMutation = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/cases/${params.id}/approve`);
    },
    onSuccess: () => {
      toast.success('Case approved successfully');
      queryClient.invalidateQueries({ queryKey: ['case', params.id] });
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
    onError: () => {
      toast.error('Failed to approve case');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (reason: string) => {
      await axios.post(`/api/cases/${params.id}/reject`, { reason });
    },
    onSuccess: () => {
      toast.success('Case rejected');
      setShowRejectModal(false);
      setRejectionReason('');
      queryClient.invalidateQueries({ queryKey: ['case', params.id] });
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
    onError: () => {
      toast.error('Failed to reject case');
    },
  });

  const deletionRequestMutation = useMutation({
    mutationFn: async (data: { caseId: string; reason: string }) => {
      await axios.post('/api/deletion-requests', data);
    },
    onSuccess: () => {
      toast.success('Deletion request submitted');
      setShowDeleteModal(false);
      setDeletionReason('');
    },
    onError: () => {
      toast.error('Failed to submit deletion request');
    },
  });

  if (!session || isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-gray-500">Loading case details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!caseData) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-gray-500">Case not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const canApprove =
    permissions?.canApprove &&
    (caseData.status === 'DRAFT' || caseData.status === 'PENDING_APPROVAL');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/cases">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cases
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {caseData.caseNumber}
              </h1>
              <p className="text-sm text-gray-600 mt-1">Case Details</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {(permissions?.canCreate || caseData.createdById === session.user.id) && (
              <Link href={`/dashboard/cases/${params.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Case
                </Button>
              </Link>
            )}
            <Badge className={getCaseStatusColor(caseData.status)}>
              {caseData.status.replace(/_/g, ' ')}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Case Actions */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-3">Case Actions</h3>
              <div className="space-y-2">
                {canApprove && (
                  <div className="flex space-x-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setShowRejectModal(true)}
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => approveMutation.mutate()}
                      disabled={approveMutation.isPending}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                )}

                <Link href={`/dashboard/cases/${params.id}/arrest`}>
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="w-4 h-4 mr-1" />
                    Record Arrest
                  </Button>
                </Link>

                {permissions?.canRequestDelete && caseData.status === 'APPROVED' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Request Deletion
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Investigation */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-3">Investigation</h3>
              <div className="space-y-2">
                <Link href={`/dashboard/cases/${params.id}/witnesses`}>
                  <Button variant="outline" size="sm" className="w-full">
                    👥 Witnesses
                  </Button>
                </Link>
                <Link href={`/dashboard/cases/${params.id}/evidence`}>
                  <Button variant="outline" size="sm" className="w-full">
                    🔍 Evidence
                  </Button>
                </Link>
                <Link href={`/dashboard/cases/${params.id}/custody`}>
                  <Button variant="outline" size="sm" className="w-full">
                    🔗 Chain of Custody
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Legal Process */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-3">Legal Process</h3>
              <div className="space-y-2">
                <Link href={`/dashboard/cases/${params.id}/charges`}>
                  <Button variant="outline" size="sm" className="w-full">
                    ⚖️ Legal Charges
                  </Button>
                </Link>
                <Link href={`/dashboard/cases/${params.id}/court`}>
                  <Button variant="outline" size="sm" className="w-full">
                    🏛️ Court Records
                  </Button>
                </Link>
                <Link href={`/dashboard/cases/${params.id}/offence`}>
                  <Button variant="outline" size="sm" className="w-full">
                    📝 Offence & Investigation
                  </Button>
                </Link>
                <Link href={`/dashboard/cases/${params.id}/documents`}>
                  <Button variant="outline" size="sm" className="w-full">
                    📄 Documents
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Support & Communication */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-3">Support & Communication</h3>
              <div className="space-y-2">
                <Link href={`/dashboard/cases/${params.id}/services`}>
                  <Button variant="outline" size="sm" className="w-full">
                    🤝 Services
                  </Button>
                </Link>
                <Link href={`/dashboard/cases/${params.id}/ngo`}>
                  <Button variant="outline" size="sm" className="w-full">
                    🏢 NGO Partners
                  </Button>
                </Link>
                <Link href={`/dashboard/cases/${params.id}/messages`}>
                  <Button variant="outline" size="sm" className="w-full">
                    💬 Team Messages
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Case Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Case Overview</CardTitle>
              <Link href={`/dashboard/cases/${params.id}/overview`}>
                <Button variant="outline" size="sm">
                  View Complete Overview
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Form of SGBV
                </label>
                <p className="text-base text-gray-900 mt-1">
                  {caseData.formOfSGBV?.replace(/_/g, ' ') || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Legal Service Type
                </label>
                <p className="text-base text-gray-900 mt-1">
                  {caseData.legalServiceType?.replace(/_/g, ' ') || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Created By
                </label>
                <p className="text-base text-gray-900 mt-1">
                  {caseData.createdBy?.firstName} {caseData.createdBy?.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Created At
                </label>
                <p className="text-base text-gray-900 mt-1">
                  {formatDateTime(caseData.createdAt)}
                </p>
              </div>
              {caseData.approvedBy && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Approved/Rejected By
                    </label>
                    <p className="text-base text-gray-900 mt-1">
                      {caseData.approvedBy.firstName} {caseData.approvedBy.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Approved/Rejected At
                    </label>
                    <p className="text-base text-gray-900 mt-1">
                      {formatDateTime(caseData.approvedAt)}
                    </p>
                  </div>
                </>
              )}
              {caseData.rejectionReason && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">
                    Rejection Reason
                  </label>
                  <p className="text-base text-red-600 mt-1">
                    {caseData.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Victim Details */}
        {caseData.victim && (
          <Card>
            <CardHeader>
              <CardTitle>Victim Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Name" value={caseData.victim.name} />
                <InfoField label="Gender" value={caseData.victim.gender} />
                <InfoField label="Age" value={caseData.victim.age} />
                <InfoField
                  label="Phone Number"
                  value={caseData.victim.phoneNumber}
                />
                <InfoField label="Email" value={caseData.victim.email} />
                <InfoField
                  label="Marital Status"
                  value={caseData.victim.maritalStatus}
                />
                <InfoField
                  label="Occupation"
                  value={caseData.victim.occupation}
                />
                <InfoField
                  label="Nationality"
                  value={caseData.victim.nationality}
                />
                <InfoField
                  label="Education"
                  value={caseData.victim.educationQualification}
                />
                <InfoField label="Language" value={caseData.victim.language} />
                {caseData.victim.address && (
                  <div className="md:col-span-2">
                    <InfoField label="Address" value={caseData.victim.address} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Perpetrator Details */}
        {caseData.perpetrator && (
          <Card>
            <CardHeader>
              <CardTitle>Perpetrator/Suspect Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Name" value={caseData.perpetrator.name} />
                <InfoField label="Gender" value={caseData.perpetrator.gender} />
                <InfoField label="Age" value={caseData.perpetrator.age} />
                <InfoField
                  label="Phone Number"
                  value={caseData.perpetrator.phoneNumber}
                />
                <InfoField label="Email" value={caseData.perpetrator.email} />
                <InfoField
                  label="Occupation"
                  value={caseData.perpetrator.occupation}
                />
                <InfoField
                  label="Relationship with Victim"
                  value={caseData.perpetrator.relationshipWithVictim}
                />
                <InfoField
                  label="Nationality"
                  value={caseData.perpetrator.nationality}
                />
                {caseData.perpetrator.address && (
                  <div className="md:col-span-2">
                    <InfoField
                      label="Address"
                      value={caseData.perpetrator.address}
                    />
                  </div>
                )}
                {caseData.perpetrator.previousCriminalHistory && (
                  <div className="md:col-span-2">
                    <InfoField
                      label="Previous Criminal History"
                      value={caseData.perpetrator.previousCriminalHistory}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Offence Details */}
        {/* This section is now replaced by a dedicated page */}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Reject Case</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={4}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                variant="secondary"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => rejectMutation.mutate(rejectionReason)}
                disabled={!rejectionReason || rejectMutation.isPending}
              >
                Reject Case
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Request Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Request Case Deletion</h3>
            <textarea
              value={deletionReason}
              onChange={(e) => setDeletionReason(e.target.value)}
              placeholder="Enter reason for deletion request..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={4}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() =>
                  deletionRequestMutation.mutate({
                    caseId: params.id,
                    reason: deletionReason,
                  })
                }
                disabled={!deletionReason || deletionRequestMutation.isPending}
              >
                Submit Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function InfoField({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <p className="text-base text-gray-900 mt-1">{value || 'N/A'}</p>
    </div>
  );
}

