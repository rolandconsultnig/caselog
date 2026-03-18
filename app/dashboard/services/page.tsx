'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface Service {
  id: string;
  serviceNumber: string;
  serviceName: string;
  serviceType: string;
  providerName: string;
  serviceStatus: string;
  urgency: string;
  referralDate: string;
  appointmentDate?: string;
  caseId: string;
}

export default function ServicesPage() {
  useSession();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchServices();
  }, [filter]);

  const fetchServices = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('status', filter);
      }
      
      const response = await fetch(`/api/services?${params}`);
      if (response.ok) {
        const data = await response.json();
        setServices(data.services);
      }
    } catch {
      console.error('Error fetching services');
    } finally {
      setLoading(false);
    }
  };

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Service Referrals</h1>
            <p className="text-gray-600 mt-1">
              Manage victim service referrals and appointments
            </p>
          </div>
          <Link href="/dashboard/services/new">
            <Button>
              <span className="mr-2">+</span>
              New Referral
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All Services
            </Button>
            <Button
              variant={filter === 'PENDING' ? 'primary' : 'outline'}
              onClick={() => setFilter('PENDING')}
            >
              Pending
            </Button>
            <Button
              variant={filter === 'ACTIVE' ? 'primary' : 'outline'}
              onClick={() => setFilter('ACTIVE')}
            >
              Active
            </Button>
            <Button
              variant={filter === 'COMPLETED' ? 'primary' : 'outline'}
              onClick={() => setFilter('COMPLETED')}
            >
              Completed
            </Button>
          </div>
        </Card>

        {/* Services List */}
        {loading ? (
          <Card>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading services...</p>
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No services</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new service referral.
              </p>
              <div className="mt-6">
                <Link href="/dashboard/services/new">
                  <Button>
                    <span className="mr-2">+</span>
                    New Referral
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <Link href={`/dashboard/services/${service.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{service.serviceName}</h3>
                        <Badge variant={getStatusColor(service.serviceStatus)}>
                          {service.serviceStatus}
                        </Badge>
                        <Badge variant={getUrgencyColor(service.urgency)}>
                          {service.urgency}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Service #:</span>
                          <p className="font-medium">{service.serviceNumber}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <p className="font-medium">{service.serviceType}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Provider:</span>
                          <p className="font-medium">{service.providerName}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Referral Date:</span>
                          <p className="font-medium">
                            {new Date(service.referralDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {service.appointmentDate && (
                        <div className="mt-3 flex items-center gap-2 text-sm">
                          <svg
                            className="h-4 w-4 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-gray-600">
                            Appointment: {new Date(service.appointmentDate).toLocaleString()}
                          </span>
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
                {services.filter(s => s.serviceStatus === 'PENDING').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Pending</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {services.filter(s => s.serviceStatus === 'ACTIVE').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Active</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {services.filter(s => s.serviceStatus === 'COMPLETED').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Completed</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">
                {services.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

