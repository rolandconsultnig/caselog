'use client';

import { ReactNode, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import LadyJusticeAI from '@/components/LadyJusticeAI';
import {
  FileText,
  Users,
  Settings,
  LogOut,
  BarChart3,
  Menu,
  X,
  Scale,
  UserSearch,
  Gavel,
  Search,
  MessageSquare,
  Mail,
  Bell,
  Home,
  FolderOpen,
  Shield,
  ClipboardList,
  Building,
  TrendingUp,
  Archive,
  UserPlus,
  Calendar,
} from 'lucide-react';
import { useState } from 'react';
import { getAccessLevelLabel } from '@/lib/utils';
import { getPermissions } from '@/lib/permissions';
import { TenantType } from '@prisma/client';
import Image from 'next/image';
import { getStateLogo } from '@/lib/state-logos';


interface DashboardLayoutProps {
  children: ReactNode;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  caseId?: string;
}

type ReadState = {
  readIds: string[];
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStateName, setSelectedStateName] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [emailsUnreadCount, setEmailsUnreadCount] = useState(0);
  const [chatsUnreadCount, setChatsUnreadCount] = useState(0);
  const [now, setNow] = useState(() => new Date());

  const getReadStateKey = (userId: string) => `caselog.notifications.read.${userId}`;

  const getReadState = (userId: string): ReadState => {
    try {
      const raw = localStorage.getItem(getReadStateKey(userId));
      if (!raw) return { readIds: [] };
      const parsed = JSON.parse(raw) as unknown;
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'readIds' in parsed &&
        Array.isArray((parsed as { readIds?: unknown }).readIds)
      ) {
        return { readIds: (parsed as { readIds: string[] }).readIds };
      }
      return { readIds: [] };
    } catch {
      return { readIds: [] };
    }
  };

  const setReadState = (userId: string, next: ReadState) => {
    try {
      localStorage.setItem(getReadStateKey(userId), JSON.stringify(next));
    } catch {
      return;
    }
  };

  const markLocalRead = (notificationId: string) => {
    const userId = session?.user?.id;
    if (!userId) return;
    const current = getReadState(userId);
    if (current.readIds.includes(notificationId)) return;
    setReadState(userId, { readIds: [...current.readIds, notificationId] });
  };

  // All hooks must be called before any conditional returns
  useEffect(() => {
    // Get selected state from session storage
    const stateName = sessionStorage.getItem('selectedTenantName');
    if (stateName) {
      setSelectedStateName(stateName);
    }
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetchNotifications();
    fetchUnreadSummary();
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadSummary();
    }, 30000);
    return () => clearInterval(interval);
  }, [session?.user?.id]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Basic keyboard shortcuts (no dependencies)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Q for logout
      if (event.ctrlKey && event.key === 'q') {
        event.preventDefault();
        signOut({ callbackUrl: '/' });
      }
      // Ctrl+K for search
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        router.push('/dashboard/search');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Permission-dependent keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+N for new case (if permission allows)
      if (session?.user && event.ctrlKey && event.key === 'n') {
        const permissions = getPermissions(
          session.user.accessLevel,
          session.user.tenantType as TenantType
        );
        if (permissions.canCreate) {
          event.preventDefault();
          router.push('/dashboard/cases/new');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [session]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        const nextNotifications = (data.notifications || []) as Notification[];

        const userId = session?.user?.id;
        const readIds = userId ? getReadState(userId).readIds : [];
        const normalized = nextNotifications.map((n) => ({
          ...n,
          read: n.read || readIds.includes(n.id),
        }));

        setNotifications(normalized);
        setUnreadCount(normalized.filter((n) => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadSummary = async () => {
    try {
      const response = await fetch('/api/notifications/summary');
      if (!response.ok) return;
      const data = (await response.json()) as { emailsUnread?: number; chatsUnread?: number };
      setEmailsUnreadCount(typeof data.emailsUnread === 'number' ? data.emailsUnread : 0);
      setChatsUnreadCount(typeof data.chatsUnread === 'number' ? data.chatsUnread : 0);
    } catch (error) {
      console.error('Error fetching unread summary:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });
      markLocalRead(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getCategoryInfo = (category: string) => {
    const categoryMap: Record<
      string,
      {
        title: string;
        icon: React.ComponentType<{ className?: string }>;
        color: string;
      }
    > = {
      overview: { title: 'Overview', icon: Home, color: 'text-blue-600' },
      cases: { title: 'Case Management', icon: FolderOpen, color: 'text-green-600' },
      legal: { title: 'Legal Process', icon: Scale, color: 'text-purple-600' },
      communication: { title: 'Communication', icon: MessageSquare, color: 'text-indigo-600' },
      services: { title: 'Support Services', icon: Shield, color: 'text-pink-600' },
      analytics: { title: 'Analytics & Reports', icon: TrendingUp, color: 'text-orange-600' },
      administration: { title: 'Administration', icon: Settings, color: 'text-red-600' },
    };
    return categoryMap[category] || { title: category, icon: FolderOpen, color: 'text-gray-600' };
  };

  // Early return after all hooks are called
  if (!session?.user) {
    return null;
  }

  const totalUnreadCount = unreadCount + emailsUnreadCount + chatsUnreadCount;

  const permissions = getPermissions(
    session.user.accessLevel,
    session.user.tenantType as TenantType
  );

  const navigation = [
    // Overview Section
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      show: true,
      category: 'overview',
      description: 'Main dashboard and analytics',
    },
    
    // Case Management Section
    {
      name: 'All Cases',
      href: '/dashboard/cases',
      icon: FolderOpen,
      show: permissions.canRead,
      category: 'cases',
      description: 'View and manage all cases',
    },
    {
      name: 'Create Case',
      href: '/dashboard/cases/new',
      icon: FileText,
      show: permissions.canCreate,
      category: 'cases',
      description: 'Create new SGBV case',
    },
    {
      name: 'Search Cases',
      href: '/dashboard/search',
      icon: Search,
      show: permissions.canRead,
      category: 'cases',
      description: 'Search case database',
    },
    
    // Legal Process Section
    {
      name: 'Witnesses',
      href: '/dashboard/witnesses',
      icon: Users,
      show: permissions.canRead,
      category: 'legal',
      description: 'Manage witness information',
    },
    {
      name: 'Investigation',
      href: '/dashboard/investigator',
      icon: UserSearch,
      show: permissions.canRead,
      category: 'legal',
      description: 'Investigation dashboard',
    },
    {
      name: 'Court Records',
      href: '/dashboard/court',
      icon: Scale,
      show: permissions.canRead,
      category: 'legal',
      description: 'Court and legal documents',
    },
    {
      name: 'Prosecution',
      href: '/dashboard/prosecutor',
      icon: Gavel,
      show: permissions.canRead,
      category: 'legal',
      description: 'Prosecution management',
    },
    
    // Communication Section
    {
      name: 'Messages',
      href: '/dashboard/messages',
      icon: MessageSquare,
      show: permissions.canRead,
      category: 'communication',
      description: 'Internal messaging',
    },
    {
      name: 'Email',
      href: '/dashboard/email',
      icon: Mail,
      show: permissions.canRead,
      category: 'communication',
      description: 'Email communications',
    },
    
    // Support Services Section
    {
      name: 'Victim Services',
      href: '/dashboard/services',
      icon: Shield,
      show: permissions.canRead,
      category: 'services',
      description: 'Support services for victims',
    },
    {
      name: 'NGO Partners',
      href: '/dashboard/ngo-partnerships',
      icon: Building,
      show: permissions.canRead,
      category: 'services',
      description: 'Partner organizations',
    },
    
    // Analytics Section
    {
      name: 'Statistics',
      href: '/dashboard/statistics',
      icon: TrendingUp,
      show: permissions.canRead,
      category: 'analytics',
      description: 'Data analytics and insights',
    },
    {
      name: 'Reports',
      href: '/dashboard/reports',
      icon: BarChart3,
      show: permissions.canGenerateReports,
      category: 'analytics',
      description: 'Generate reports',
    },
    
    // Administration Section
    {
      name: 'User Management',
      href: '/dashboard/users',
      icon: UserPlus,
      show: permissions.canManageUsers,
      category: 'administration',
      description: 'Manage user accounts',
    },
    {
      name: 'Content Management',
      href: '/dashboard/cms/news',
      icon: ClipboardList,
      show: session?.user?.accessLevel && ['APP_ADMIN', 'SUPER_ADMIN'].includes(session.user.accessLevel),
      category: 'administration',
      description: 'Manage content and news',
    },
    {
      name: 'Data Requests',
      href: '/dashboard/deletion-requests',
      icon: Archive,
      show: permissions.canApproveDelete,
      category: 'administration',
      description: 'Handle data deletion requests',
    },
    {
      name: 'System Settings',
      href: '/dashboard/admin',
      icon: Settings,
      show: permissions.canAccessAdminPanel,
      category: 'administration',
      description: 'System configuration',
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
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-lg ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo - Top Center */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex items-center justify-center space-x-4">
              <span className="relative w-12 h-12 flex-shrink-0">
                <Image 
                  src={session?.user?.tenantName ? getStateLogo(session.user.tenantName) : '/coat-of-arms.png'} 
                  alt={session?.user?.tenantName ? `${session.user.tenantName} Logo` : 'Nigerian Coat of Arms'} 
                  fill
                  sizes="50px"
                  className="object-contain"
                />
              </span>
              <div className="text-center">
                <h1 className="text-xl font-bold text-gray-900">Sexual and Gender-Based Violence Information System</h1>
                <p className="text-sm text-gray-600 font-medium">Case Management</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          
          
          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            {Object.entries(
              navigation.reduce((acc, item) => {
                if (item.show) {
                  if (!acc[item.category]) acc[item.category] = [];
                  acc[item.category].push(item);
                }
                return acc;
              }, {} as Record<string, typeof navigation>)
            ).map(([category, items]) => {
              const categoryInfo = getCategoryInfo(category);
              const CategoryIcon = categoryInfo.icon;

              return (
                <div key={category} className="mb-4">
                  {/* Category Header - Always visible but more subtle */}
                  <div className="flex items-center space-x-2 px-3 py-1 mb-2">
                    <CategoryIcon className={`w-4 h-4 ${categoryInfo.color}`} />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      {categoryInfo.title}
                    </span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>

                  {/* Category Items - Always visible */}
                  <div className="space-y-1">
                    {items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          pathname === item.href
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md transform scale-105'
                            : 'text-gray-700 bg-white hover:bg-gray-50 hover:shadow-sm hover:text-gray-900 border border-gray-200'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                        title={item.description}
                      >
                        <item.icon className={`w-5 h-5 flex-shrink-0 ${
                          pathname === item.href ? 'text-white' : categoryInfo.color
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="truncate font-medium">{item.name}</div>
                          {item.description && (
                            <div className={`text-xs truncate ${
                              pathname === item.href ? 'text-green-100' : 'text-gray-500'
                            }`}>
                              {item.description}
                            </div>
                          )}
                        </div>
                        {pathname === item.href && (
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>

          
          {/* Logout */}
          <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </div>
              <span className="text-xs text-gray-400 group-hover:text-red-500">
                Ctrl+Q
              </span>
            </button>
            <div className="mt-2 text-xs text-gray-400 text-center">
              Current session active
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 lg:ml-0 ml-4">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-gray-900">
                  {navigation.find((item) => item.href === pathname)?.name || 'Dashboard'}
                </h2>
                {session?.user?.tenantName && (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
                    <span className="relative w-5 h-5 flex-shrink-0">
                      <Image
                        src={getStateLogo(session.user.tenantName)}
                        alt={`${session.user.tenantName} Logo`}
                        fill
                        sizes="20px"
                        className="object-contain"
                      />
                    </span>
                    <span className="text-sm font-medium text-green-800">
                      {session.user.tenantName}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-xs font-medium text-gray-900">
                    {now.toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-600">
                    {now.toLocaleTimeString()}
                  </div>
                </div>
                <button
                  onClick={() => router.push('/dashboard/calendar')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                  type="button"
                >
                  <Calendar className="w-6 h-6" />
                </button>
              </div>
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {totalUnreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {totalUnreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => {
                              if (!notification.read) {
                                markAsRead(notification.id);
                              }
                              if (notification.caseId) {
                                setNotificationsOpen(false);
                                router.push(`/dashboard/cases/${notification.caseId}`);
                              }
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {new Date(notification.createdAt).toLocaleString()}
                                </p>
                              </div>
                              {!notification.read && (
                                <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>No notifications</p>
                        </div>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-200 text-center">
                        <button
                          onClick={() => {
                            setNotificationsOpen(false);
                            window.location.href = '/dashboard/notifications';
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View All Notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Info Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {session.user.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-gray-500 group-hover:text-gray-600">
                      {getAccessLevelLabel(session.user.accessLevel)}
                    </p>
                  </div>
                </button>
                
                {/* User Info Tooltip */}
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {session.user.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{session.user.name}</p>
                        <p className="text-sm text-gray-600">{session.user.email}</p>
                      </div>
                    </div>
                    
                    {/* Current State Display */}
                    {selectedStateName && (
                      <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                          <span className="relative w-8 h-8 flex-shrink-0">
                            <Image
                              src={getStateLogo(selectedStateName)}
                              alt={`${selectedStateName} Logo`}
                              fill
                              sizes="32px"
                              className="object-contain"
                            />
                          </span>
                          <div>
                            <p className="text-xs font-semibold text-green-700 uppercase tracking-wider">Current State</p>
                            <p className="text-sm font-bold text-gray-900">{selectedStateName}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Access Level:</span>
                        <span className="font-medium text-gray-900">{getAccessLevelLabel(session.user.accessLevel)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
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

