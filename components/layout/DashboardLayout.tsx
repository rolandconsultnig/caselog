'use client';

import { ReactNode, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LadyJusticeAI from '@/components/LadyJusticeAI';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  Shield,
  BarChart3,
  Trash2,
  Menu,
  X,
  MapPin,
  Briefcase,
  Scale,
  UserSearch,
  Gavel,
  Search,
} from 'lucide-react';
import { useState } from 'react';
import { getAccessLevelLabel } from '@/lib/utils';
import { getPermissions } from '@/lib/permissions';
import { TenantType } from '@prisma/client';
import Image from 'next/image';

const logoMap: { [key: string]: string } = {
  'Federal Ministry of Justice': '/coat-of-arms.png',
  'Lagos State': '/coat-of-arms.png',
  'FCT': '/coat-of-arms.png',
  'Default': '/coat-of-arms.png',
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStateName, setSelectedStateName] = useState('');

  useEffect(() => {
    // Get selected state from session storage
    const stateName = sessionStorage.getItem('selectedTenantName');
    if (stateName) {
      setSelectedStateName(stateName);
    }
  }, []);

  if (!session?.user) {
    return null;
  }

  const permissions = getPermissions(
    session.user.accessLevel,
    session.user.tenantType as TenantType
  );

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      show: true,
      category: 'main',
    },
    {
      name: 'Cases',
      href: '/dashboard/cases',
      icon: FileText,
      show: permissions.canRead,
      category: 'main',
    },
    {
      name: 'Search',
      href: '/dashboard/search',
      icon: Search,
      show: permissions.canRead,
      category: 'main',
    },
    {
      name: 'Create Case',
      href: '/dashboard/cases/new',
      icon: FileText,
      show: permissions.canCreate,
      category: 'main',
    },
    {
      name: 'Witnesses',
      href: '/dashboard/witnesses',
      icon: Users,
      show: permissions.canRead,
      category: 'case-management',
    },
    {
      name: 'Court',
      href: '/dashboard/court',
      icon: Scale,
      show: permissions.canRead,
      category: 'case-management',
    },
    {
      name: 'Investigator',
      href: '/dashboard/investigator',
      icon: UserSearch,
      show: permissions.canRead,
      category: 'case-management',
    },
    {
      name: 'Prosecutor',
      href: '/dashboard/prosecutor',
      icon: Gavel,
      show: permissions.canRead,
      category: 'case-management',
    },
    {
      name: 'Services',
      href: '/dashboard/services',
      icon: Shield,
      show: permissions.canRead,
      category: 'services',
    },
    {
      name: 'NGO Partnerships',
      href: '/dashboard/ngo-partnerships',
      icon: Briefcase,
      show: permissions.canRead,
      category: 'services',
    },
    {
      name: 'Reports',
      href: '/dashboard/reports',
      icon: BarChart3,
      show: permissions.canGenerateReports,
      category: 'analytics',
    },
    {
      name: 'CMS - News',
      href: '/dashboard/cms/news',
      icon: FileText,
      show: session?.user?.accessLevel && ['LEVEL_3', 'LEVEL_4', 'LEVEL_5', 'APP_ADMIN', 'SUPER_ADMIN'].includes(session.user.accessLevel),
      category: 'admin',
    },
    {
      name: 'Statistics',
      href: '/dashboard/statistics',
      icon: BarChart3,
      show: permissions.canRead,
      category: 'analytics',
    },
    {
      name: 'Deletion Requests',
      href: '/dashboard/deletion-requests',
      icon: Trash2,
      show: permissions.canApproveDelete,
      category: 'admin',
    },
    {
      name: 'Users',
      href: '/dashboard/users',
      icon: Users,
      show: permissions.canManageUsers,
      category: 'admin',
    },
    {
      name: 'Admin Panel',
      href: '/dashboard/admin',
      icon: Settings,
      show: permissions.canAccessAdminPanel,
      category: 'admin',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Sexual and Gender-Based Violence Information System</h1>
                <p className="text-xs text-gray-500">Case Management</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 bg-green-50 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
            <p className="text-xs text-gray-600">{session.user.email}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs font-medium text-green-700">
                {getAccessLevelLabel(session.user.accessLevel)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{session.user.tenantName}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
            {/* Main Navigation */}
            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Main
              </h3>
              <div className="space-y-1">
                {navigation
                  .filter((item) => item.show && item.category === 'main')
                  .map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? 'bg-green-100 text-green-900'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Case Management */}
            {navigation.some((item) => item.show && item.category === 'case-management') && (
              <div>
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Case Management
                </h3>
                <div className="space-y-1">
                  {navigation
                    .filter((item) => item.show && item.category === 'case-management')
                    .map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          pathname === item.href
                            ? 'bg-green-100 text-green-900'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* Services */}
            {navigation.some((item) => item.show && item.category === 'services') && (
              <div>
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Services
                </h3>
                <div className="space-y-1">
                  {navigation
                    .filter((item) => item.show && item.category === 'services')
                    .map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          pathname === item.href
                            ? 'bg-green-100 text-green-900'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* Analytics */}
            {navigation.some((item) => item.show && item.category === 'analytics') && (
              <div>
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Analytics
                </h3>
                <div className="space-y-1">
                  {navigation
                    .filter((item) => item.show && item.category === 'analytics')
                    .map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          pathname === item.href
                            ? 'bg-green-100 text-green-900'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* Administration */}
            {navigation.some((item) => item.show && item.category === 'admin') && (
              <div>
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Administration
                </h3>
                <div className="space-y-1">
                  {navigation
                    .filter((item) => item.show && item.category === 'admin')
                    .map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          pathname === item.href
                            ? 'bg-green-100 text-green-900'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* User Settings */}
            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Account
              </h3>
              <div className="space-y-1">
                {navigation
                  .filter((item) => item.show && item.category === 'user')
                  .map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? 'bg-green-100 text-green-900'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
              </div>
            </div>
          </nav>

          {/* Selected State Display */}
          {selectedStateName && (
            <div className="px-4 py-3 border-t border-gray-200">
              <div className="bg-green-50 rounded-md p-3">
                <div className="flex items-center space-x-2 text-green-700">
                  <Image
                    src={logoMap[selectedStateName] || logoMap.Default}
                    alt={`${selectedStateName} Logo`}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                  <div>
                    <p className="text-xs font-medium">Current State</p>
                    <p className="text-sm font-bold">{selectedStateName}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Logout */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-red-700 hover:bg-red-50 w-full transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        {/* Coat of Arms - Top Center */}
        <div className="bg-white border-b border-gray-200 py-2">
          <div className="flex justify-center">
            <img 
              src="/coat-of-arms.png" 
              alt="Nigerian Coat of Arms" 
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 lg:ml-0 ml-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {navigation.find((item) => item.href === pathname)?.name || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{session.user.tenantName}</p>
                <p className="text-xs text-gray-500">{session.user.tenantCode}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>

      {/* Lady Justice AI Assistant */}
      <LadyJusticeAI />
    </div>
  );
}

export default DashboardLayout;

