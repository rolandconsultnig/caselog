'use client';

import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getPermissions } from '@/lib/permissions';
import { TenantType } from '@prisma/client';
import { Users, Database, Shield, Activity, Settings } from 'lucide-react';

export default function AdminPage() {
  const { data: session } = useSession();

  const permissions = session
    ? getPermissions(session.user.accessLevel, session.user.tenantType as TenantType)
    : null;

  if (!session || !permissions?.canAccessAdminPanel) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-red-600">
            You do not have permission to access the admin panel
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-600 mt-1">
            System administration and management
          </p>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>User Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Manage users, roles, and access levels
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Create and edit users</li>
                <li>• Assign access levels</li>
                <li>• Deactivate accounts</li>
                <li>• Reset passwords</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Database className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Data Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Database and data operations
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Export case data</li>
                <li>• Backup database</li>
                <li>• Data integrity checks</li>
                <li>• Archive old cases</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Security settings and monitoring
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Audit log review</li>
                <li>• Access monitoring</li>
                <li>• Security policies</li>
                <li>• Session management</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Activity Monitoring</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                System activity and performance
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• User activity logs</li>
                <li>• System performance</li>
                <li>• Error tracking</li>
                <li>• Usage statistics</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Settings className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>System Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Application configuration
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Email notifications</li>
                <li>• System preferences</li>
                <li>• Integration settings</li>
                <li>• Maintenance mode</li>
              </ul>
            </CardContent>
          </Card>

          {session.user.tenantType === 'FEDERAL' && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <Database className="w-6 h-6 text-indigo-600" />
                  </div>
                  <CardTitle>Federal Oversight</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Cross-state management and reporting
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• View all state data</li>
                  <li>• National statistics</li>
                  <li>• State comparisons</li>
                  <li>• Federal reports</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Version</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">1.0.0</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Environment</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {process.env.NODE_ENV}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Tenant</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {session.user.tenantName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Tenant Type</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {session.user.tenantType}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left">
                <h4 className="font-semibold text-gray-900 mb-1">Export All Cases</h4>
                <p className="text-sm text-gray-600">
                  Download complete case database
                </p>
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left">
                <h4 className="font-semibold text-gray-900 mb-1">Generate Report</h4>
                <p className="text-sm text-gray-600">
                  Create statistical reports
                </p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

