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
        // State admins can only create users for their own state
        // Federal admins can create users for any state
        if (session?.user && session.user.tenantType !== 'FEDERAL') {
          // For state admins, only show their own tenant
          setTenants([{ id: session.user.tenantId, name: session.user.tenantName }]);
          // Pre-select their tenant
          setFormData(prev => ({ ...prev, tenantId: session.user.tenantId }));
        } else if (session?.user) {
          // For federal admins, show all tenants
          const response = await axios.get('/api/tenants');
          setTenants(response.data);
        }
      } catch (error) {
        toast.error('Failed to fetch states/tenants');
      }
    };
    
    if (session) {
      fetchTenants();
    }
  }, [session]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    accessLevel: 'LEVEL_1' as AccessLevel,
    tenantId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const getAvailableAccessLevels = () => {
    if (!session?.user) return [];
    
    const currentUserLevel = session.user.accessLevel;
    
    switch (currentUserLevel) {
      case AccessLevel.LEVEL_4:
        // Level 4 can create users up to Level 3 plus Investigators and Prosecutors
        return [
          AccessLevel.LEVEL_1,
          AccessLevel.LEVEL_2,
          AccessLevel.LEVEL_3,
          AccessLevel.INVESTIGATOR,
          AccessLevel.PROSECUTOR,
        ];
      case AccessLevel.LEVEL_5:
        // Level 5 can create users up to Level 4 plus Investigators and Prosecutors (but not other Level 5)
        return [
          AccessLevel.LEVEL_1,
          AccessLevel.LEVEL_2,
          AccessLevel.LEVEL_3,
          AccessLevel.LEVEL_4,
          AccessLevel.INVESTIGATOR,
          AccessLevel.PROSECUTOR,
        ];
      case AccessLevel.SUPER_ADMIN:
      case AccessLevel.APP_ADMIN:
        // Admins can create all roles
        return Object.values(AccessLevel);
      default:
        // Other levels cannot create users
        return [];
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.tenantId) newErrors.tenantId = 'State/Tenant is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsSubmitting(true);

    try {
      const { confirmPassword, ...submitData } = formData;
      await axios.post('/api/users', submitData);
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
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="+234 XXX XXX XXXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="accessLevel" className="block text-sm font-medium text-gray-700 mb-2">
                  Access Level <span className="text-red-500">*</span>
                </label>
                <select
                  id="accessLevel"
                  value={formData.accessLevel}
                  onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as AccessLevel })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  {getAvailableAccessLevels().map(level => (
                    <option key={level} value={level}>
                      {level.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Determines user permissions and access rights
                </p>
              </div>

              <div>
                <label htmlFor="tenantId" className="block text-sm font-medium text-gray-700 mb-2">
                  State/Tenant <span className="text-red-500">*</span>
                </label>
                {session?.user?.tenantType !== 'FEDERAL' ? (
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                    {session?.user?.tenantName}
                  </div>
                ) : (
                  <select
                    id="tenantId"
                    value={formData.tenantId}
                    onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                      errors.tenantId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a state/tenant</option>
                    {tenants.map(tenant => (
                      <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                    ))}
                  </select>
                )}
                {session?.user && session.user.tenantType !== 'FEDERAL' && (
                  <p className="mt-1 text-xs text-gray-500">
                    You can only create users for your state ({session.user.tenantName})
                  </p>
                )}
                {errors.tenantId && (
                  <p className="mt-1 text-sm text-red-600">{errors.tenantId}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </DashboardLayout>
  );
}

