'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function NewServicePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    caseId: '',
    victimId: '',
    serviceType: 'MEDICAL',
    serviceName: '',
    providerName: '',
    providerType: 'GOVERNMENT',
    providerContact: '',
    providerEmail: '',
    providerPhone: '',
    providerAddress: '',
    referralReason: '',
    urgency: 'MEDIUM',
    appointmentScheduled: false,
    appointmentDate: '',
    appointmentTime: '',
    appointmentLocation: '',
    estimatedCost: '',
    fundingSource: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/dashboard/services/${data.service.id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create service referral');
      }
    } catch (error) {
      console.error('Error creating service:', error);
      alert('Failed to create service referral');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">New Service Referral</h1>
          <p className="text-gray-600 mt-1">
            Create a new service referral for a victim
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Case Information */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Case Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Case ID *
                </label>
                <input
                  type="text"
                  name="caseId"
                  required
                  value={formData.caseId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="case-123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Victim ID (Optional)
                </label>
                <input
                  type="text"
                  name="victimId"
                  value={formData.victimId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="victim-123"
                />
              </div>
            </div>
          </Card>

          {/* Service Details */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Service Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type *
                </label>
                <select
                  name="serviceType"
                  required
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MEDICAL">Medical</option>
                  <option value="PSYCHOLOGICAL">Psychological</option>
                  <option value="LEGAL">Legal</option>
                  <option value="SHELTER">Shelter</option>
                  <option value="FINANCIAL">Financial</option>
                  <option value="VOCATIONAL">Vocational</option>
                  <option value="EDUCATIONAL">Educational</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  name="serviceName"
                  required
                  value={formData.serviceName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Medical Examination"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referral Reason *
                </label>
                <textarea
                  name="referralReason"
                  required
                  value={formData.referralReason}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe why this service is needed..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urgency *
                </label>
                <select
                  name="urgency"
                  required
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Provider Information */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Provider Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider Name *
                </label>
                <input
                  type="text"
                  name="providerName"
                  required
                  value={formData.providerName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Lagos State Hospital"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider Type *
                </label>
                <select
                  name="providerType"
                  required
                  value={formData.providerType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="GOVERNMENT">Government</option>
                  <option value="NGO">NGO</option>
                  <option value="PRIVATE">Private</option>
                  <option value="INDIVIDUAL">Individual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="providerContact"
                  value={formData.providerContact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Dr. Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="providerPhone"
                  value={formData.providerPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+234-800-000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="providerEmail"
                  value={formData.providerEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="contact@provider.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="providerAddress"
                  value={formData.providerAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Provider Street, Lagos"
                />
              </div>
            </div>
          </Card>

          {/* Appointment Details */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Appointment Details (Optional)</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="appointmentScheduled"
                  checked={formData.appointmentScheduled}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Schedule appointment now
                </label>
              </div>

              {formData.appointmentScheduled && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      name="appointmentTime"
                      value={formData.appointmentTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="appointmentLocation"
                      value={formData.appointmentLocation}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Room 101"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Cost Information */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Cost Information (Optional)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Cost (₦)
                </label>
                <input
                  type="number"
                  name="estimatedCost"
                  value={formData.estimatedCost}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="50000.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Funding Source
                </label>
                <input
                  type="text"
                  name="fundingSource"
                  value={formData.fundingSource}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Government Fund"
                />
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Referral'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

