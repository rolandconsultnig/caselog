'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface CaseService {
  id: string;
  serviceType: string;
  providerName: string;
  providerType: string;
  serviceUrgency: string;
  serviceStatus: string;
  paymentStatus: string;
  satisfactionLevel?: string;
  referralDate: string;
  completionDate?: string;
  cost?: number;
}

export default function CaseServicesPage() {
  const params = useParams();
  useRouter();
  useSession();
  const [services, setServices] = useState<CaseService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, [params.id]);

  const fetchServices = async () => {
    try {
      const response = await fetch(`/api/cases/${params.id}/services`);
      if (response.ok) {
        const data = await response.json();
        setServices(data.services || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'LOW': return 'default';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'danger';
      case 'CRITICAL': return 'danger';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REFERRED': return 'info';
      case 'IN_PROGRESS': return 'warning';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'default';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'PAID': return 'success';
      case 'WAIVED': return 'info';
      case 'OVERDUE': return 'danger';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Service Referrals</h1>
            <p className="text-gray-600 mt-1">
              Manage victim support services and NGO partnerships
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/cases/${params.id}`}>
              <Button variant="outline">Back to Case</Button>
            </Link>
            <Link href={`/dashboard/cases/${params.id}/services/new`}>
              <Button>
                <span className="mr-2">🤝</span>
                Add Service Referral
              </Button>
            </Link>
          </div>
        </div>

        {/* Services List */}
        {loading ? (
          <Card>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading service referrals...</p>
            </div>
          </Card>
        ) : services.length === 0 ? (
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No service referrals</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start by referring the victim to support services.
              </p>
              <div className="mt-6">
                <Link href={`/dashboard/cases/${params.id}/services/new`}>
                  <Button>
                    <span className="mr-2">🤝</span>
                    Add First Referral
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <Link href={`/dashboard/cases/${params.id}/services/${service.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold">
                          {service.serviceType.replace(/_/g, ' ')}
                        </h3>
                        <Badge variant={getUrgencyColor(service.serviceUrgency)}>
                          {service.serviceUrgency}
                        </Badge>
                        <Badge variant={getStatusColor(service.serviceStatus)}>
                          {service.serviceStatus.replace(/_/g, ' ')}
                        </Badge>
                        <Badge variant={getPaymentColor(service.serviceStatus === 'COMPLETED' ? service.paymentStatus : 'PENDING')}>
                          {service.serviceStatus === 'COMPLETED' ? service.paymentStatus : 'PENDING'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Provider:</span>
                          <p className="font-medium">{service.providerName}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <p className="font-medium">{service.providerType}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Referral Date:</span>
                          <p className="font-medium">
                            {new Date(service.referralDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {service.completionDate && (
                          <div>
                            <span className="text-gray-500">Completed:</span>
                            <p className="font-medium">
                              {new Date(service.completionDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {service.cost && (
                          <div>
                            <span className="text-gray-500">Cost:</span>
                            <p className="font-medium">₦{service.cost.toLocaleString()}</p>
                          </div>
                        )}
                      </div>

                      {service.satisfactionLevel && (
                        <div className="mt-3">
                          <span className="text-sm text-gray-500">Satisfaction:</span>
                          <Badge variant={service.satisfactionLevel === 'VERY_SATISFIED' || service.satisfactionLevel === 'SATISFIED' ? 'success' : 'warning'}>
                            {service.satisfactionLevel.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                      )}
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
                {services.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Service Referrals</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {services.filter(s => s.serviceStatus === 'COMPLETED').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Completed Services</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {services.filter(s => s.serviceUrgency === 'CRITICAL' || s.serviceUrgency === 'HIGH').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">High Priority</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">
                {services.filter(s => s.paymentStatus === 'PAID').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Paid Services</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

