'use client';

import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { CheckCircle } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import axios from 'axios';
import { toast } from 'sonner';
import { getPermissions } from '@/lib/permissions';
import { TenantType } from '@prisma/client';

interface DeletionRequest {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  reason: string;
  createdAt: string;
  case: {
    caseNumber: string;
    victim?: { name?: string } | null;
  };
  requestedBy: {
    firstName: string;
    lastName: string;
  };
}

export default function DeletionRequestsPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const permissions = session
    ? getPermissions(session.user.accessLevel, session.user.tenantType as TenantType)
    : null;

  const { data: requests, isLoading } = useQuery({
    queryKey: ['deletion-requests'],
    queryFn: async () => {
      const response = await axios.get('/api/deletion-requests');
      return response.data;
    },
    enabled: !!session && !!permissions?.canApproveDelete,
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.post(`/api/deletion-requests/${id}/approve`);
    },
    onSuccess: () => {
      toast.success('Deletion request approved and case deleted');
      queryClient.invalidateQueries({ queryKey: ['deletion-requests'] });
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
    onError: () => {
      toast.error('Failed to approve deletion request');
    },
  });

  if (!session || !permissions?.canApproveDelete) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-red-600">
            You do not have permission to view deletion requests
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deletion Requests</h1>
          <p className="text-sm text-gray-600 mt-1">
            Review and approve case deletion requests
          </p>
        </div>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Deletion Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading requests...</p>
              </div>
            ) : requests?.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case Number</TableHead>
                      <TableHead>Victim</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Date Requested</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(requests as DeletionRequest[]).map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          {request.case.caseNumber}
                        </TableCell>
                        <TableCell>{request.case.victim?.name || 'N/A'}</TableCell>
                        <TableCell>
                          {request.requestedBy.firstName}{' '}
                          {request.requestedBy.lastName}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{request.reason}</span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDateTime(request.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              request.status === 'APPROVED'
                                ? 'success'
                                : request.status === 'REJECTED'
                                ? 'danger'
                                : 'warning'
                            }
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.status === 'PENDING' && (
                            <Button
                              size="sm"
                              onClick={() => approveMutation.mutate(request.id)}
                              disabled={approveMutation.isPending}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No deletion requests found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

