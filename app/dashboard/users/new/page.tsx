'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import axios from 'axios';
import { AccessLevel } from '@prisma/client';

interface Tenant {
  id: string;
  name: string;
}

export default function NewUserPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get('/api/tenants');
        setTenants(response.data);
      } catch (error) {
        toast.error('Failed to fetch states/tenants');
      }
    };
    fetchTenants();
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    accessLevel: AccessLevel.LEVEL_1,
    tenantId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post('/api/users', formData);
      toast.success('User created successfully');
      router.push('/dashboard/users');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/users">
              <Button type="button" variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Users
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Create New User</h1>
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save User'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="First Name" name="firstName" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
              <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
              <InputField label="Email" name="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              <InputField label="Password" name="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Access Level *</label>
                <select
                  required
                  value={formData.accessLevel}
                  onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as AccessLevel })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  {Object.values(AccessLevel).map(level => (
                    <option key={level} value={level}>{level.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State/Tenant *</label>
                <select
                  required
                  value={formData.tenantId}
                  onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a tenant</option>
                  {tenants.map(tenant => (
                    <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </DashboardLayout>
  );
}

const InputField = ({ label, name, type = 'text', value, onChange, required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">{label} {required && '*'}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded-md"
    />
  </div>
);
