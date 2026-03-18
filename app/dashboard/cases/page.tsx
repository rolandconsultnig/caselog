'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
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
import { Search, Eye, Plus } from 'lucide-react';
import { formatDate, getCaseStatusColor } from '@/lib/utils';
import Link from 'next/link';
import axios from 'axios';
import { getPermissions } from '@/lib/permissions';
import { TenantType } from '@prisma/client';

type CaseListItem = {
  id: string;
  caseNumber?: string;
  caseType?: string;
  status?: string;
  createdAt: string;
  tenant?: { code?: string } | null;
  victims?: Array<{ firstName?: string; lastName?: string }>;
};

export default function CasesPage() {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const permissions = session
    ? getPermissions(session.user.accessLevel, session.user.tenantType as TenantType)
    : null;

  const { data, isLoading } = useQuery({
    queryKey: ['cases', page, search, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      });
      const response = await axios.get(`/api/cases?${params}`);
      return response.data;
    },
    enabled: !!session,
  });

  if (!session) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cases</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage and view SGBV cases
            </p>
          </div>
          {permissions?.canCreate && (
            <div className="flex gap-2">
              <Link href="/dashboard/cases/new/simple">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Quick Create Case
                </Button>
              </Link>
              <Link href="/dashboard/cases/new">
                <Button variant="outline">
                  Advanced Form
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by case number, victim name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="DRAFT">Draft</option>
                  <option value="PENDING_APPROVAL">Pending Approval</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cases Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {data?.pagination?.total || 0} Case(s) Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading cases...</p>
              </div>
            ) : data?.cases?.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Case Number</TableHead>
                        <TableHead>Victim</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        {session.user.tenantType === 'FEDERAL' && (
                          <TableHead>State</TableHead>
                        )}
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.cases.map((caseItem: CaseListItem) => (
                        <TableRow key={caseItem.id}>
                          <TableCell className="font-medium">
                            {caseItem.caseNumber}
                          </TableCell>
                          <TableCell>
                            {caseItem.victims?.[0] 
                              ? `${caseItem.victims[0].firstName} ${caseItem.victims[0].lastName}`
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {caseItem.caseType?.replace(/_/g, ' ') || 'N/A'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className={getCaseStatusColor(caseItem.status)}>
                              {caseItem.status?.replace(/_/g, ' ') || 'N/A'}
                            </Badge>
                          </TableCell>
                          {session.user.tenantType === 'FEDERAL' && (
                            <TableCell>
                              <span className="text-sm font-medium text-green-600">
                                {caseItem.tenant?.code}
                              </span>
                            </TableCell>
                          )}
                          <TableCell className="text-sm text-gray-600">
                            {formatDate(caseItem.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Link href={`/dashboard/cases/${caseItem.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {data.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-600">
                      Showing page {data.pagination.page} of{' '}
                      {data.pagination.totalPages}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page === data.pagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No cases found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

