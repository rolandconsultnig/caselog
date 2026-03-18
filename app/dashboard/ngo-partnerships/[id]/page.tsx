'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface ProgressReport {
  title?: string;
  date?: string;
}

interface Partnership {
  id: string;
  partnershipNumber: string;
  caseId: string;
  ngoName: string;
  ngoType: string;
  ngoRegistrationNumber?: string;
  contactPerson: string;
  contactTitle?: string;
  contactEmail?: string;
  contactPhone: string;
  officeAddress?: string;
  referralDate: string;
  referredBy: string;
  referralReason: string;
  servicesRequested: string[];
  supportStartDate: string;
  supportEndDate?: string;
  supportFrequency?: string;
  expectedDuration?: number;
  actualDuration?: number;
  progressReports: ProgressReport[];
  milestonesAchieved: string[];
  challengesFaced?: string;
  fundingSource?: string;
  budgetAllocated?: number;
  amountSpent?: number;
  finalReportSubmitted: boolean;
  finalReportPath?: string;
  satisfactionRating?: string;
  feedbackComments?: string;
  createdAt: string;
  case?: {
    id: string;
    caseNumber: string;
    title: string;
  };
}

export default function NGOPartnershipDetailPage() {
  const params = useParams();
  const router = useRouter();
  useSession();
  const [partnership, setPartnership] = useState<Partnership | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartnership();
  }, [params.id]);

  const fetchPartnership = async () => {
    try {
      const response = await fetch(`/api/ngo-partnerships/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setPartnership(data.partnership);
      }
    } catch (error) {
      console.error('Error fetching partnership:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading partnership details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!partnership) {
    return (
      <DashboardLayout>
        <Card>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Partnership not found</h3>
            <p className="mt-2 text-sm text-gray-500">
              The partnership you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
            </p>
            <div className="mt-6">
              <Link href="/dashboard/ngo-partnerships">
                <Button>Back to Partnerships</Button>
              </Link>
            </div>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  const getStatusBadge = () => {
    if (partnership.finalReportSubmitted) {
      return <Badge variant="success">Completed</Badge>;
    } else if (partnership.supportEndDate) {
      return <Badge variant="warning">Ending Soon</Badge>;
    } else {
      return <Badge variant="info">Active</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{partnership.ngoName}</h1>
              {getStatusBadge()}
            </div>
            <p className="text-gray-600">Partnership #{partnership.partnershipNumber}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/cases/${partnership.caseId}`}>
              <Button variant="outline">View Case</Button>
            </Link>
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        </div>

        {/* NGO Information */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">NGO Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">NGO Type</p>
              <p className="font-medium">{partnership.ngoType.replace('_', ' ')}</p>
            </div>
            {partnership.ngoRegistrationNumber && (
              <div>
                <p className="text-sm text-gray-600">Registration Number</p>
                <p className="font-medium">{partnership.ngoRegistrationNumber}</p>
              </div>
            )}
            {partnership.officeAddress && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Office Address</p>
                <p className="font-medium">{partnership.officeAddress}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Contact Information */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Contact Person</p>
              <p className="font-medium">{partnership.contactPerson}</p>
              {partnership.contactTitle && (
                <p className="text-sm text-gray-500">{partnership.contactTitle}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{partnership.contactPhone}</p>
            </div>
            {partnership.contactEmail && (
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{partnership.contactEmail}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Partnership Details */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Partnership Details</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Referral Reason</p>
              <p className="font-medium">{partnership.referralReason}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Services Requested</p>
              <div className="flex flex-wrap gap-2">
                {partnership.servicesRequested.map((service, index) => (
                  <Badge key={index} variant="default">{service}</Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-medium">
                  {new Date(partnership.supportStartDate).toLocaleDateString()}
                </p>
              </div>
              {partnership.supportEndDate && (
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="font-medium">
                    {new Date(partnership.supportEndDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              {partnership.supportFrequency && (
                <div>
                  <p className="text-sm text-gray-600">Frequency</p>
                  <p className="font-medium">{partnership.supportFrequency.replace('_', ' ')}</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Progress & Milestones */}
        {(partnership.progressReports.length > 0 || partnership.milestonesAchieved.length > 0) && (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Progress & Milestones</h2>
            {partnership.milestonesAchieved.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Milestones Achieved</p>
                <ul className="list-disc list-inside space-y-1">
                  {partnership.milestonesAchieved.map((milestone, index) => (
                    <li key={index} className="text-sm">{milestone}</li>
                  ))}
                </ul>
              </div>
            )}
            {partnership.progressReports.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Progress Reports</p>
                <div className="space-y-2">
                  {partnership.progressReports.map((report, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium">{report.title || `Report ${index + 1}`}</p>
                      <p className="text-xs text-gray-500">{report.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Budget Information */}
        {(partnership.budgetAllocated || partnership.fundingSource) && (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Budget Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {partnership.fundingSource && (
                <div>
                  <p className="text-sm text-gray-600">Funding Source</p>
                  <p className="font-medium">{partnership.fundingSource}</p>
                </div>
              )}
              {partnership.budgetAllocated && (
                <div>
                  <p className="text-sm text-gray-600">Budget Allocated</p>
                  <p className="font-medium">₦{partnership.budgetAllocated.toLocaleString()}</p>
                </div>
              )}
              {partnership.amountSpent && (
                <div>
                  <p className="text-sm text-gray-600">Amount Spent</p>
                  <p className="font-medium">₦{partnership.amountSpent.toLocaleString()}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Feedback & Rating */}
        {(partnership.satisfactionRating || partnership.feedbackComments) && (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Feedback & Rating</h2>
            <div className="space-y-4">
              {partnership.satisfactionRating && (
                <div>
                  <p className="text-sm text-gray-600">Satisfaction Rating</p>
                  <Badge variant={
                    partnership.satisfactionRating === 'EXCELLENT' ? 'success' :
                    partnership.satisfactionRating === 'GOOD' ? 'info' :
                    partnership.satisfactionRating === 'FAIR' ? 'warning' : 'danger'
                  }>
                    {partnership.satisfactionRating}
                  </Badge>
                </div>
              )}
              {partnership.feedbackComments && (
                <div>
                  <p className="text-sm text-gray-600">Comments</p>
                  <p className="font-medium">{partnership.feedbackComments}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Metadata */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Partnership History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Referred By</p>
              <p className="font-medium">{partnership.referredBy}</p>
            </div>
            <div>
              <p className="text-gray-600">Referral Date</p>
              <p className="font-medium">
                {new Date(partnership.referralDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Created</p>
              <p className="font-medium">
                {new Date(partnership.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Final Report</p>
              <p className="font-medium">
                {partnership.finalReportSubmitted ? 'Submitted ✓' : 'Pending'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

