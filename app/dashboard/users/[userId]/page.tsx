'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Activity,
  FileText,
  ArrowLeft,
  Edit,
  Save,
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { getPermissions } from '@/lib/permissions';
import { TenantType } from '@prisma/client';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  accessLevel: string;
  tenant: {
    name: string;
    type: string;
  };
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  casesCreated?: number;
  casesInvestigating?: number;
  casesCoordinating?: number;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const userId = params?.userId as string;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const permissions = session
    ? getPermissions(session.user.accessLevel, session.user.tenantType as TenantType)
    : null;

  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    accessLevel: '',
    isActive: true,
  });

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      setUser(response.data);
      setEditData({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        phoneNumber: response.data.phoneNumber || '',
        accessLevel: response.data.accessLevel,
        isActive: response.data.isActive,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load user');
      router.push('/dashboard/users');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!permissions?.canManageUsers) {
      toast.error('You do not have permission to edit users');
      return;
    }

    setIsSaving(true);
    try {
      await axios.patch(`/api/users/${userId}`, editData);
      toast.success('User updated successfully');
      setIsEditing(false);
      fetchUser();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update user');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading user profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-red-600">User not found</p>
          <Button onClick={() => router.push('/dashboard/users')} className="mt-4">
            Back to Users
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600 mt-1">{user.email}</p>
            </div>
          </div>
          {permissions?.canManageUsers && (
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              )}
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="cases" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Cases
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.firstName}
                        onChange={(e) =>
                          setEditData({ ...editData, firstName: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.lastName}
                        onChange={(e) =>
                          setEditData({ ...editData, lastName: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <p className="text-gray-900">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.phoneNumber}
                        onChange={(e) =>
                          setEditData({ ...editData, phoneNumber: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user.phoneNumber || 'Not provided'}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Access Level
                    </label>
                    {isEditing && permissions?.canManageUsers ? (
                      <select
                        value={editData.accessLevel}
                        onChange={(e) =>
                          setEditData({ ...editData, accessLevel: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      >
                        <option value="LEVEL_1">Level 1 - Read Only</option>
                        <option value="LEVEL_2">Level 2 - Create Cases</option>
                        <option value="LEVEL_3">Level 3 - Approve/Reject</option>
                        <option value="LEVEL_4">Level 4 - Delete Requester</option>
                        <option value="LEVEL_5">Level 5 - Full Authority</option>
                        {session.user.accessLevel === 'SUPER_ADMIN' && (
                          <>
                            <option value="SUPER_ADMIN">Super Admin</option>
                            <option value="APP_ADMIN">App Admin</option>
                          </>
                        )}
                      </select>
                    ) : (
                      <p className="text-gray-900">{user.accessLevel}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tenant/State
                    </label>
                    <p className="text-gray-900">{user.tenant.name}</p>
                    <p className="text-xs text-gray-500">{user.tenant.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Status
                    </label>
                    {isEditing && permissions?.canManageUsers ? (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editData.isActive}
                          onChange={(e) =>
                            setEditData({ ...editData, isActive: e.target.checked })
                          }
                          className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span>Active</span>
                      </label>
                    ) : (
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Login
                    </label>
                    <p className="text-gray-900">
                      {user.lastLogin
                        ? format(new Date(user.lastLogin), 'MMM dd, yyyy HH:mm')
                        : 'Never'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Since
                    </label>
                    <p className="text-gray-900">
                      {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>User's recent actions and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* TODO: Fetch and display audit logs for this user */}
                  <p className="text-gray-500 text-center py-8">
                    Activity log feature coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cases Tab */}
          <TabsContent value="cases">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cases Created</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {user.casesCreated || 0}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Total cases created</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Investigating</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {user.casesInvestigating || 0}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Cases assigned as investigator</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Coordinating</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {user.casesCoordinating || 0}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Cases assigned as coordinator</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

