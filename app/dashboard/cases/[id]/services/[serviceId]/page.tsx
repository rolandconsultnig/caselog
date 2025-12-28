'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { ArrowLeft, Calendar, DollarSign, Star, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface CaseService {
  id: string;
  serviceType: string;
  serviceName: string;
  providerName: string;
  providerType: string;
  providerContact?: string;
  providerAddress?: string;
  providerEmail?: string;
  providerPhone?: string;
  urgency: string;
  serviceStatus: string;
  paymentStatus?: string;
  referralDate: string;
  referralReason: string;
  appointmentScheduled: boolean;
  appointmentDate?: string;
  appointmentTime?: string;
  appointmentLocation?: string;
  appointmentConfirmed: boolean;
  appointmentAttended?: boolean;
  appointmentOutcome?: string;
  serviceStartDate?: string;
  serviceEndDate?: string;
  cost?: number;
  fundingSource?: string;
  satisfactionLevel?: string;
  satisfactionNotes?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  followUpNotes?: string;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [service, setService] = useState<CaseService | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'appointment' | 'tracking' | 'cost' | 'satisfaction'>('overview');
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showCostForm, setShowCostForm] = useState(false);
  const [showSatisfactionForm, setShowSatisfactionForm] = useState(false);

  useEffect(() => {
    fetchService();
  }, [params.serviceId]);

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/cases/${params.id}/services`);
      if (response.ok) {
        const data = await response.json();
        const foundService = data.services?.find((s: CaseService) => s.id === params.serviceId);
        if (foundService) {
          setService(foundService);
        } else {
          toast.error('Service not found');
          router.push(`/dashboard/cases/${params.id}/services`);
        }
      }
    } catch (error) {
      console.error('Error fetching service:', error);
      toast.error('Failed to load service');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (field: string, value: any) => {
    try {
      const response = await fetch(`/api/cases/${params.id}/services/${params.serviceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Update failed');
      }

      toast.success('Service updated successfully');
      fetchService();
    } catch (error: any) {
      console.error('Error updating service:', error);
      toast.error(error.message || 'Failed to update service');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Card>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading service...</p>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  if (!service) {
    return (
      <DashboardLayout>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600">Service not found</p>
            <Link href={`/dashboard/cases/${params.id}/services`}>
              <Button className="mt-4">Back to Services</Button>
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
            <Link href={`/dashboard/cases/${params.id}/services`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{service.serviceName}</h1>
              <p className="text-gray-600 mt-1">{service.serviceType}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant={service.serviceStatus === 'COMPLETED' ? 'success' : 'warning'}>
              {service.serviceStatus}
            </Badge>
            <Badge variant={service.urgency === 'CRITICAL' ? 'error' : 'default'}>
              {service.urgency}
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {(['overview', 'appointment', 'tracking', 'cost', 'satisfaction'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm capitalize
                  ${activeTab === tab
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Service Information</h2>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500">Service Type:</span>
                      <p className="font-medium">{service.serviceType}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Service Name:</span>
                      <p className="font-medium">{service.serviceName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Provider:</span>
                      <p className="font-medium">{service.providerName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Provider Type:</span>
                      <p className="font-medium">{service.providerType}</p>
                    </div>
                    {service.providerContact && (
                      <div>
                        <span className="text-gray-500">Contact:</span>
                        <p className="font-medium">{service.providerContact}</p>
                      </div>
                    )}
                    {service.providerAddress && (
                      <div>
                        <span className="text-gray-500">Address:</span>
                        <p className="font-medium">{service.providerAddress}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Referral Date:</span>
                      <p className="font-medium">
                        {new Date(service.referralDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Referral Details</h2>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500">Referral Reason:</span>
                      <p className="font-medium">{service.referralReason}</p>
                    </div>
                    {service.serviceStartDate && (
                      <div>
                        <span className="text-gray-500">Start Date:</span>
                        <p className="font-medium">
                          {new Date(service.serviceStartDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {service.serviceEndDate && (
                      <div>
                        <span className="text-gray-500">End Date:</span>
                        <p className="font-medium">
                          {new Date(service.serviceEndDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {service.followUpRequired && (
                      <div>
                        <span className="text-gray-500">Follow-up Required:</span>
                        <Badge variant="warning" className="ml-2">Yes</Badge>
                      </div>
                    )}
                    {service.followUpDate && (
                      <div>
                        <span className="text-gray-500">Follow-up Date:</span>
                        <p className="font-medium">
                          {new Date(service.followUpDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Appointment Tab */}
          {activeTab === 'appointment' && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Appointment Scheduling</h2>
                  {!service.appointmentScheduled && (
                    <Button onClick={() => setShowAppointmentForm(!showAppointmentForm)}>
                      {showAppointmentForm ? 'Cancel' : 'Schedule Appointment'}
                    </Button>
                  )}
                </div>

                {showAppointmentForm ? (
                  <AppointmentForm
                    service={service}
                    onSave={(data) => {
                      handleUpdate('appointment', data);
                      setShowAppointmentForm(false);
                    }}
                    onCancel={() => setShowAppointmentForm(false)}
                  />
                ) : service.appointmentScheduled ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.appointmentDate && (
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-500">Appointment Date</p>
                            <p className="font-medium">
                              {new Date(service.appointmentDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                      {service.appointmentTime && (
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-500">Appointment Time</p>
                            <p className="font-medium">{service.appointmentTime}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {service.appointmentLocation && (
                      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{service.appointmentLocation}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Badge variant={service.appointmentConfirmed ? 'success' : 'warning'}>
                        {service.appointmentConfirmed ? 'Confirmed' : 'Pending Confirmation'}
                      </Badge>
                      {service.appointmentAttended !== undefined && (
                        <Badge variant={service.appointmentAttended ? 'success' : 'error'}>
                          {service.appointmentAttended ? 'Attended' : 'Not Attended'}
                        </Badge>
                      )}
                    </div>
                    {service.appointmentOutcome && (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Appointment Outcome:</p>
                        <p className="font-medium">{service.appointmentOutcome}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No appointment scheduled</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Tracking Tab */}
          {activeTab === 'tracking' && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Service Delivery Tracking</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Service Status</p>
                      <Badge variant={service.serviceStatus === 'COMPLETED' ? 'success' : 'warning'} className="mt-2">
                        {service.serviceStatus}
                      </Badge>
                    </div>
                    {service.serviceStartDate && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Start Date</p>
                        <p className="font-medium mt-2">
                          {new Date(service.serviceStartDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {service.serviceEndDate && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">End Date</p>
                        <p className="font-medium mt-2">
                          {new Date(service.serviceEndDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                  <ServiceTrackingForm
                    service={service}
                    onUpdate={(data) => handleUpdate('tracking', data)}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Cost Tab */}
          {activeTab === 'cost' && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Cost Management</h2>
                  <Button onClick={() => setShowCostForm(!showCostForm)}>
                    {showCostForm ? 'Cancel' : 'Update Cost'}
                  </Button>
                </div>

                {showCostForm ? (
                  <CostForm
                    service={service}
                    onSave={(data) => {
                      handleUpdate('cost', data);
                      setShowCostForm(false);
                    }}
                    onCancel={() => setShowCostForm(false)}
                  />
                ) : (
                  <div className="space-y-4">
                    {service.cost ? (
                      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                        <DollarSign className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-500">Total Cost</p>
                          <p className="text-2xl font-bold text-green-600">
                            ₦{service.cost.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <DollarSign className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>No cost information recorded</p>
                      </div>
                    )}
                    {service.fundingSource && (
                      <div>
                        <p className="text-sm text-gray-500">Funding Source:</p>
                        <p className="font-medium">{service.fundingSource}</p>
                      </div>
                    )}
                    {service.paymentStatus && (
                      <div>
                        <p className="text-sm text-gray-500">Payment Status:</p>
                        <Badge variant={service.paymentStatus === 'PAID' ? 'success' : 'warning'}>
                          {service.paymentStatus}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Satisfaction Tab */}
          {activeTab === 'satisfaction' && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Satisfaction Rating</h2>
                  {service.serviceStatus === 'COMPLETED' && !service.satisfactionLevel && (
                    <Button onClick={() => setShowSatisfactionForm(!showSatisfactionForm)}>
                      {showSatisfactionForm ? 'Cancel' : 'Rate Service'}
                    </Button>
                  )}
                </div>

                {showSatisfactionForm ? (
                  <SatisfactionForm
                    service={service}
                    onSave={(data) => {
                      handleUpdate('satisfaction', data);
                      setShowSatisfactionForm(false);
                    }}
                    onCancel={() => setShowSatisfactionForm(false)}
                  />
                ) : service.satisfactionLevel ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                      <Star className="w-8 h-8 text-yellow-600 fill-yellow-600" />
                      <div>
                        <p className="text-sm text-gray-500">Satisfaction Level</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {service.satisfactionLevel}
                        </p>
                      </div>
                    </div>
                    {service.satisfactionNotes && (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Notes:</p>
                        <p className="font-medium">{service.satisfactionNotes}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Star className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No satisfaction rating recorded</p>
                    {service.serviceStatus !== 'COMPLETED' && (
                      <p className="text-sm mt-2">Complete the service to rate it</p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// Form Components
function AppointmentForm({ service, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    appointmentDate: service.appointmentDate ? new Date(service.appointmentDate).toISOString().split('T')[0] : '',
    appointmentTime: service.appointmentTime || '',
    appointmentLocation: service.appointmentLocation || '',
    appointmentConfirmed: service.appointmentConfirmed || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, appointmentScheduled: true });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Appointment Date *
        </label>
        <input
          type="date"
          value={formData.appointmentDate}
          onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Appointment Time *
        </label>
        <input
          type="time"
          value={formData.appointmentTime}
          onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location *
        </label>
        <input
          type="text"
          value={formData.appointmentLocation}
          onChange={(e) => setFormData({ ...formData, appointmentLocation: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.appointmentConfirmed}
            onChange={(e) => setFormData({ ...formData, appointmentConfirmed: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Appointment Confirmed</span>
        </label>
      </div>
      <div className="flex gap-2">
        <Button type="submit">Schedule Appointment</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function ServiceTrackingForm({ service, onUpdate }: any) {
  const [formData, setFormData] = useState({
    serviceStatus: service.serviceStatus || 'REFERRED',
    serviceStartDate: service.serviceStartDate ? new Date(service.serviceStartDate).toISOString().split('T')[0] : '',
    serviceEndDate: service.serviceEndDate ? new Date(service.serviceEndDate).toISOString().split('T')[0] : '',
    appointmentAttended: service.appointmentAttended,
    appointmentOutcome: service.appointmentOutcome || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Status *
        </label>
        <select
          value={formData.serviceStatus}
          onChange={(e) => setFormData({ ...formData, serviceStatus: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          <option value="REFERRED">Referred</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Start Date
          </label>
          <input
            type="date"
            value={formData.serviceStartDate}
            onChange={(e) => setFormData({ ...formData, serviceStartDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service End Date
          </label>
          <input
            type="date"
            value={formData.serviceEndDate}
            onChange={(e) => setFormData({ ...formData, serviceEndDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      {service.appointmentScheduled && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Attended
            </label>
            <select
              value={formData.appointmentAttended === undefined ? '' : formData.appointmentAttended.toString()}
              onChange={(e) => setFormData({ ...formData, appointmentAttended: e.target.value === 'true' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Not Set</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Outcome
            </label>
            <textarea
              value={formData.appointmentOutcome}
              onChange={(e) => setFormData({ ...formData, appointmentOutcome: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </>
      )}
      <Button type="submit">Update Tracking</Button>
    </form>
  );
}

function CostForm({ service, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    cost: service.cost?.toString() || '',
    fundingSource: service.fundingSource || '',
    paymentStatus: service.paymentStatus || 'PENDING',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      cost: formData.cost ? parseFloat(formData.cost) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cost (₦)
        </label>
        <input
          type="number"
          step="0.01"
          value={formData.cost}
          onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Funding Source
        </label>
        <input
          type="text"
          value={formData.fundingSource}
          onChange={(e) => setFormData({ ...formData, fundingSource: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Status
        </label>
        <select
          value={formData.paymentStatus}
          onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="WAIVED">Waived</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit">Save Cost Information</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function SatisfactionForm({ service, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    satisfactionLevel: service.satisfactionLevel || '',
    satisfactionNotes: service.satisfactionNotes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Satisfaction Level *
        </label>
        <select
          value={formData.satisfactionLevel}
          onChange={(e) => setFormData({ ...formData, satisfactionLevel: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select rating</option>
          <option value="EXCELLENT">Excellent ⭐⭐⭐⭐⭐</option>
          <option value="GOOD">Good ⭐⭐⭐⭐</option>
          <option value="SATISFACTORY">Satisfactory ⭐⭐⭐</option>
          <option value="POOR">Poor ⭐⭐</option>
          <option value="VERY_POOR">Very Poor ⭐</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Satisfaction Notes
        </label>
        <textarea
          value={formData.satisfactionNotes}
          onChange={(e) => setFormData({ ...formData, satisfactionNotes: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Additional comments about the service..."
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Submit Rating</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

