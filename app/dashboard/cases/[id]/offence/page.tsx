'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import axios from 'axios';
export default function OffenceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    offenceName: '',
    offenceCode: '',
    dateOfOffence: '',
    placeOfOffence: '',
    applicableLaw: '',
    penalty: '',
    dateReported: '',
    suspectArrested: false,
    dateArrested: '',
    investigationStatus: 'OPEN',
    natureOfOffence: '',
    investigatingOfficer: '',
    officerContact: '',
    officerEmail: '',
    investigationProgress: '',
  });

  useEffect(() => {
    const fetchOffenceDetails = async () => {
      try {
        const response = await axios.get(`/api/cases/${params.id}/offence`);
        if (response.data.offence) {
          // Format dates for input fields
          const { offence, ...rest } = response.data;
          const formattedOffence = {
            ...offence,
            dateOfOffence: offence.dateOfOffence ? new Date(offence.dateOfOffence).toISOString().split('T')[0] : '',
            dateReported: offence.dateReported ? new Date(offence.dateReported).toISOString().split('T')[0] : '',
            dateArrested: offence.dateArrested ? new Date(offence.dateArrested).toISOString().split('T')[0] : '',
          };
          setFormData(formattedOffence);
        }
      } catch (error) {
        toast.error('Failed to fetch offence details');
      }
    };

    if (session) {
      fetchOffenceDetails();
    }
  }, [session, params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`/api/cases/${params.id}/offence`, formData);
      toast.success('Offence and Investigation details saved successfully');
      router.push(`/dashboard/cases/${params.id}`);
    } catch (error) {
      toast.error('Failed to save details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/dashboard/cases/${params.id}`}>
              <Button type="button" variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Case
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Offence & Investigation Details</h1>
            </div>
          </div>
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Details'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Offence Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Offence Name *" name="offenceName" value={formData.offenceName} onChange={handleChange} required />
                  <InputField label="Offence Code" name="offenceCode" value={formData.offenceCode} onChange={handleChange} />
                  <InputField label="Date of Offence" name="dateOfOffence" type="date" value={formData.dateOfOffence} onChange={handleChange} />
                  <InputField label="Place of Offence" name="placeOfOffence" value={formData.placeOfOffence} onChange={handleChange} />
                  <InputField label="Applicable Law" name="applicableLaw" value={formData.applicableLaw} onChange={handleChange} placeholder="e.g., Section 1 VAPPA" />
                  <InputField label="Penalty" name="penalty" value={formData.penalty} onChange={handleChange} />
                  <div className="md:col-span-2">
                    <TextAreaField label="Nature of Offence *" name="natureOfOffence" value={formData.natureOfOffence} onChange={handleChange} required />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investigation Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Date Reported" name="dateReported" type="date" value={formData.dateReported} onChange={handleChange} />
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" name="suspectArrested" checked={formData.suspectArrested} onChange={handleChange} className="h-4 w-4" />
                    <label>Suspect Arrested</label>
                  </div>
                  {formData.suspectArrested && <InputField label="Date Arrested" name="dateArrested" type="date" value={formData.dateArrested} onChange={handleChange} />}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Investigation Status</label>
                    <select name="investigationStatus" value={formData.investigationStatus} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="OPEN">Open</option>
                      <option value="ACTIVE">Active</option>
                      <option value="MONITORING">Monitoring</option>
                      <option value="CLOSED">Closed</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Investigating Officer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InputField label="Investigating Officer (IPO) *" name="investigatingOfficer" value={formData.investigatingOfficer} onChange={handleChange} required />
                <InputField label="Officer Contact Phone" name="officerContact" value={formData.officerContact} onChange={handleChange} />
                <InputField label="Officer Email" name="officerEmail" type="email" value={formData.officerEmail} onChange={handleChange} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Investigation Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <TextAreaField label="Progress Notes" name="investigationProgress" value={formData.investigationProgress} onChange={handleChange} rows={10} placeholder="Detail the progress of the investigation..." />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}

const InputField = ({ label, name, type = 'text', value, onChange, required = false, placeholder = '' }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input id={name} name={name} type={type} value={value} onChange={onChange} required={required} placeholder={placeholder} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
  </div>
);

const TextAreaField = ({ label, name, value, onChange, required = false, rows = 3, placeholder = '' }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea id={name} name={name} value={value} onChange={onChange} required={required} rows={rows} placeholder={placeholder} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
  </div>
);
