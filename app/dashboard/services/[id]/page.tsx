'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface Service {
  id: string;
  serviceNumber: string;
  caseId: string;
  victimId?: string;
  serviceType: string;
  serviceCategory?: string;
  serviceName: string;
  providerName: string;
  providerType: string;
  providerContact?: string;
  providerAddress?: string;
  providerEmail?: string;
  providerPhone?: string;
  referralDate: string;
  referredBy: string;
  referredByName: string;
  referralReason: string;
  urgency: string;
  appointmentScheduled: boolean;
  appointmentDate?: string;
  appointmentTime?: string;
  appointmentLocation?: string;
  serviceStartDate?: string;
  serviceEndDate?: string;
  sessionsPlanned?: number;
  sessionsCompleted: number;
  estimatedCost?: number;
  actualCost?: number;
  fundingSource?: string;
  paymentStatus: string;
  serviceStatus: string;
  outcomeAchieved?: string;
  satisfactionLevel?: string;
  feedbackComments?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  createdAt: string;
  case?: {
    id: string;
    caseNumber: string;
    title: string;
  };
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  useSession();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchService();
  }, [params.id]);

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/services/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setService(data.service);
      }
    } catch (error) {
      console.error('Error fetching service:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!service) {
    return (
      <DashboardLayout>
        <Card>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Service not found</h3>
            <p className="mt-2 text-sm text-gray-500">
              The service you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
            </p>
            <div className="mt-6">
              <Link href="/dashboard/services">
                <Button>Back to Services</Button>
              </Link>
            </div>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'ACTIVE': return 'info';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'error';
      case 'DECLINED': return 'error';
      default: return 'default';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'info';
      case 'HIGH': return 'warning';
      case 'URGENT': return 'error';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{service.serviceName}</h1>
              <Badge variant={getStatusColor(service.serviceStatus)}>
                {service.serviceStatus}
              </Badge>
              <Badge variant={getUrgencyColor(service.urgency)}>
                {service.urgency}
              </Badge>
            </div>
            <p className="text-gray-600">Service #{service.serviceNumber}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/cases/${service.caseId}`}>
              <Button variant="outline">View Case</Button>
            </Link>
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        </div>

        {/* Service Details */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Service Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Service Type</p>
              <p className="font-medium">{service.serviceType}</p>
            </div>
            {service.serviceCategory && (
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium">{service.serviceCategory}</p>
              </div>
            )}
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Referral Reason</p>
              <p className="font-medium">{service.referralReason}</p>
            </div>
          </div>
        </Card>

        {/* Provider Information */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Provider Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Provider Name</p>
              <p className="font-medium">{service.providerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Provider Type</p>
              <p className="font-medium">{service.providerType}</p>
            </div>
            {service.providerContact && (
              <div>
                <p className="text-sm text-gray-600">Contact Person</p>
                <p className="font-medium">{service.providerContact}</p>
              </div>
            )}
            {service.providerPhone && (
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{service.providerPhone}</p>
              </div>
            )}
            {service.providerEmail && (
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{service.providerEmail}</p>
              </div>
            )}
            {service.providerAddress && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{service.providerAddress}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Appointment Details */}
        {service.appointmentScheduled && (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {service.appointmentDate && (
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">
                    {new Date(service.appointmentDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              {service.appointmentTime && (
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium">{service.appointmentTime}</p>
                </div>
              )}
              {service.appointmentLocation && (
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{service.appointmentLocation}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Service Timeline */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Service Timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Referral Date</p>
              <p className="font-medium">
                {new Date(service.referralDate).toLocaleDateString()}
              </p>
            </div>
            {service.serviceStartDate && (
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-medium">
                  {new Date(service.serviceStartDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {service.serviceEndDate && (
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="font-medium">
                  {new Date(service.serviceEndDate).toLocaleDateString()}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Sessions Progress</p>
              <p className="font-medium">
                {service.sessionsCompleted}
                {service.sessionsPlanned && ` / ${service.sessionsPlanned}`}
                {' '}completed
              </p>
            </div>
          </div>
        </Card>

        {/* Cost Information */}
        {(service.estimatedCost || service.actualCost || service.fundingSource) && (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Cost Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {service.estimatedCost && (
                <div>
                  <p className="text-sm text-gray-600">Estimated Cost</p>
                  <p className="font-medium">₦{service.estimatedCost.toLocaleString()}</p>
                </div>
              )}
              {service.actualCost && (
                <div>
                  <p className="text-sm text-gray-600">Actual Cost</p>
                  <p className="font-medium">₦{service.actualCost.toLocaleString()}</p>
                </div>
              )}
              {service.fundingSource && (
                <div>
                  <p className="text-sm text-gray-600">Funding Source</p>
                  <p className="font-medium">{service.fundingSource}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <Badge variant={
                  service.paymentStatus === 'PAID' ? 'success' :
                  service.paymentStatus === 'PENDING' ? 'warning' :
                  service.paymentStatus === 'PARTIAL' ? 'info' : 'default'
                }>
                  {service.paymentStatus}
                </Badge>
              </div>
            </div>
          </Card>
        )}

        {/* Outcome & Feedback */}
        {(service.outcomeAchieved || service.satisfactionLevel || service.feedbackComments) && (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Outcome & Feedback</h2>
            <div className="space-y-4">
              {service.outcomeAchieved && (
                <div>
                  <p className="text-sm text-gray-600">Outcome Achieved</p>
                  <p className="font-medium">{service.outcomeAchieved}</p>
                </div>
              )}
              {service.satisfactionLevel && (
                <div>
                  <p className="text-sm text-gray-600">Satisfaction Level</p>
                  <Badge variant={
                    service.satisfactionLevel === 'VERY_SATISFIED' ? 'success' :
                    service.satisfactionLevel === 'SATISFIED' ? 'info' :
                    service.satisfactionLevel === 'NEUTRAL' ? 'warning' : 'error'
                  }>
                    {service.satisfactionLevel.replace('_', ' ')}
                  </Badge>
                </div>
              )}
              {service.feedbackComments && (
                <div>
                  <p className="text-sm text-gray-600">Feedback Comments</p>
                  <p className="font-medium">{service.feedbackComments}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Follow-up */}
        {service.followUpRequired && (
          <Card>
            <div className="flex items-start gap-3">
              <svg
                className="h-6 w-6 text-blue-600 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-semibold">Follow-up Required</p>
                {service.followUpDate && (
                  <p className="text-sm text-gray-600 mt-1">
                    Scheduled for: {new Date(service.followUpDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Metadata */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Referral Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Referred By</p>
              <p className="font-medium">{service.referredByName}</p>
            </div>
            <div>
              <p className="text-gray-600">Created</p>
              <p className="font-medium">
                {new Date(service.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

