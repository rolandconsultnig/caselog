'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  Mail,
  Send,
  Inbox,
  Star,
  Archive,
  Trash2,
  Edit,
  Search,
  RefreshCw,
  X,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

interface Email {
  id: string;
  subject: string;
  body: string;
  senderId: string;
  senderName: string;
  senderEmail?: string;
  recipientIds: string[];
  recipientEmails: string[];
  ccIds: string[];
  bccIds: string[];
  attachments: unknown[];
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  isDraft: boolean;
  isDeleted: boolean;
  deletedBy: string[];
  readBy: string[];
  readAt?: string;
  priority: string;
  category: string;
  caseId?: string;
  replyToId?: string;
  threadId?: string;
  sentAt: string;
  createdAt: string;
  updatedAt: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

export default function EmailPage() {
  const { data: session } = useSession();
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState('inbox');
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  // Compose form state
  const [composeForm, setComposeForm] = useState({
    subject: '',
    body: '',
    recipientIds: [] as string[],
    ccIds: [] as string[],
    recipientEmails: [] as string[], // For manually entered emails
    priority: 'NORMAL',
    category: 'GENERAL',
  });

  useEffect(() => {
    fetchEmails();
    fetchUsers();
  }, [folder]);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/email?folder=${folder}`);
      setEmails(response.data);
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast.error('Failed to fetch emails');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      const usersData = response.data.users || [];
      
      // Filter out current user
      const filteredUsers = (usersData as unknown[]).filter((user) => {
        const row = isRecord(user) ? user : {};
        return typeof row.id === 'string' && row.id !== session?.user?.id;
      }) as User[];
      
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const handleSendEmail = async (isDraft = false) => {
    try {
      if (!composeForm.subject || !composeForm.body) {
        toast.error('Subject and body are required');
        return;
      }

      const totalRecipients = composeForm.recipientIds.length + composeForm.recipientEmails.length;
      if (!isDraft && totalRecipients === 0) {
        toast.error('At least one recipient is required');
        return;
      }

      await axios.post('/api/email', {
        subject: composeForm.subject,
        bodyContent: composeForm.body,
        recipientIds: composeForm.recipientIds,
        recipientEmails: composeForm.recipientEmails,
        ccIds: composeForm.ccIds,
        priority: composeForm.priority,
        category: composeForm.category,
        isDraft,
      });

      toast.success(isDraft ? 'Draft saved' : 'Email sent successfully');
      setShowCompose(false);
      setComposeForm({
        subject: '',
        body: '',
        recipientIds: [],
        ccIds: [],
        recipientEmails: [],
        priority: 'NORMAL',
        category: 'GENERAL',
      });
      fetchEmails();
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    }
  };

  const handleEmailAction = async (emailId: string, action: string, value: boolean) => {
    try {
      await axios.patch(`/api/email/${emailId}`, { action, value });
      toast.success(`Email ${action}ed`);
      fetchEmails();
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(null);
      }
    } catch (error) {
      console.error(`Error ${action}ing email:`, error);
      toast.error(`Failed to ${action} email`);
    }
  };

  const handleSelectEmail = async (email: Email) => {
    setSelectedEmail(email);
    if (!email.readBy.includes(session?.user?.id || '')) {
      try {
        await axios.get(`/api/email/${email.id}`);
        fetchEmails();
      } catch (error) {
        console.error('Error marking email as read:', error);
      }
    }
  };

  const addRecipientEmail = (email: string) => {
    if (email && !composeForm.recipientEmails.includes(email)) {
      setComposeForm({
        ...composeForm,
        recipientEmails: [...composeForm.recipientEmails, email]
      });
    }
  };

  const removeRecipientEmail = (email: string) => {
    setComposeForm({
      ...composeForm,
      recipientEmails: composeForm.recipientEmails.filter(e => e !== email)
    });
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const filteredEmails = emails.filter((email) =>
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = emails.filter(
    (e) => !e.readBy.includes(session?.user?.id || '')
  ).length;

  const folders = [
    { name: 'Inbox', icon: Inbox, value: 'inbox', count: unreadCount },
    { name: 'Sent', icon: Send, value: 'sent' },
    { name: 'Drafts', icon: Edit, value: 'drafts' },
    { name: 'Starred', icon: Star, value: 'starred' },
    { name: 'Archived', icon: Archive, value: 'archived' },
    { name: 'Trash', icon: Trash2, value: 'trash' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'danger';
      case 'HIGH':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Internal Email</h1>
            <p className="text-sm text-gray-600 mt-1">
              Secure communication within the organization
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={fetchEmails}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
            <Button
              onClick={() => setShowCompose(true)}
              className="flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Compose</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-1">
                  {folders.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFolder(f.value)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        folder === f.value
                          ? 'bg-green-50 text-green-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <f.icon className="w-4 h-4" />
                        <span>{f.name}</span>
                      </div>
                      {f.count !== undefined && f.count > 0 && (
                        <Badge variant="default" className="ml-auto">
                          {f.count}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Email List */}
          <div className="col-span-9">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="capitalize">{folder}</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search emails..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">
                    <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
                    <p>Loading emails...</p>
                  </div>
                ) : filteredEmails.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium">No emails found</p>
                    <p className="text-sm mt-1">
                      {folder === 'inbox'
                        ? 'Your inbox is empty'
                        : `No emails in ${folder}`}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredEmails.map((email) => {
                      const isUnread = !email.readBy.includes(session?.user?.id || '');
                      return (
                        <div
                          key={email.id}
                          onClick={() => handleSelectEmail(email)}
                          className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                            isUnread ? 'bg-blue-50' : ''
                          } ${selectedEmail?.id === email.id ? 'bg-green-50' : ''}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <p
                                  className={`text-sm truncate ${
                                    isUnread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'
                                  }`}
                                >
                                  {folder === 'sent' ? 
  `To: ${email.recipientIds.length + (email.recipientEmails?.length || 0)} recipient(s)` : 
  email.senderName
}
                                </p>
                                {email.priority !== 'NORMAL' && (
                                  <Badge variant={getPriorityColor(email.priority)} className="text-xs">
                                    {email.priority}
                                  </Badge>
                                )}
                                {email.isStarred && (
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                )}
                              </div>
                              <p
                                className={`text-sm truncate mb-1 ${
                                  isUnread ? 'font-semibold text-gray-900' : 'text-gray-900'
                                }`}
                              >
                                {email.subject}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {email.body.substring(0, 100)}...
                              </p>
                            </div>
                            <div className="ml-4 flex-shrink-0 text-xs text-gray-500">
                              {new Date(email.sentAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Email Detail Modal */}
        {selectedEmail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="border-b">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-xl">{selectedEmail.subject}</CardTitle>
                      {selectedEmail.priority !== 'NORMAL' && (
                        <Badge variant={getPriorityColor(selectedEmail.priority)}>
                          {selectedEmail.priority}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">From:</span> {selectedEmail.senderName}
                        {selectedEmail.senderEmail && ` <${selectedEmail.senderEmail}>`}
                      </p>
                      <p>
                        <span className="font-medium">To:</span>{' '}
                        {selectedEmail.recipientIds?.length > 0 && `${selectedEmail.recipientIds.length} internal user(s)`}
                        {selectedEmail.recipientEmails?.length > 0 && 
                          `${selectedEmail.recipientIds?.length > 0 ? ', ' : ''}${selectedEmail.recipientEmails.length} external email(s)`
                        }
                      </p>
                      {selectedEmail.recipientEmails?.length > 0 && (
                        <p className="text-xs text-gray-500 ml-12">
                          {selectedEmail.recipientEmails.join(', ')}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Date:</span>{' '}
                        {new Date(selectedEmail.sentAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEmailAction(selectedEmail.id, 'star', !selectedEmail.isStarred)}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          selectedEmail.isStarred ? 'text-yellow-500 fill-current' : ''
                        }`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEmailAction(selectedEmail.id, 'archive', true)}
                    >
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEmailAction(selectedEmail.id, 'delete', true)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedEmail(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap">{selectedEmail.body}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Compose Modal */}
        {showCompose && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>New Message</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowCompose(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                    {session?.user?.name}
                    {session?.user?.email && ` <${session.user.email}>`}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    You are the sender of this message
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Users *
                  </label>
                  {Array.isArray(users) && users.length > 0 ? (
                    <select
                      multiple
                      value={composeForm.recipientIds}
                      onChange={(e) =>
                        setComposeForm({
                          ...composeForm,
                          recipientIds: Array.from(e.target.selectedOptions, (option) => option.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 min-h-[80px]"
                    >
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName}
                          {user.email && ` (${user.email})`}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full px-3 py-8 border border-gray-300 rounded-md bg-gray-50 text-center">
                      <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        No other users available in your state
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        You can add external email addresses below
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {users.length > 0 
                      ? 'Hold Ctrl/Cmd to select multiple users from the list above'
                      : 'No internal users available - use external emails below'
                    }
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add External Emails
                  </label>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="email"
                        placeholder="Enter email address (e.g., user@example.com)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const email = (e.target as HTMLInputElement).value.trim();
                            if (isValidEmail(email)) {
                              addRecipientEmail(email);
                              (e.target as HTMLInputElement).value = '';
                            } else {
                              toast.error('Please enter a valid email address');
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          const email = input.value.trim();
                          if (isValidEmail(email)) {
                            addRecipientEmail(email);
                            input.value = '';
                          } else {
                            toast.error('Please enter a valid email address');
                          }
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    
                    {composeForm.recipientEmails.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {composeForm.recipientEmails.map((email) => (
                          <span
                            key={email}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                          >
                            {email}
                            <button
                              type="button"
                              onClick={() => removeRecipientEmail(email)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Add external email addresses • Press Enter or click Add to include
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <Input
                    type="text"
                    value={composeForm.subject}
                    onChange={(e) =>
                      setComposeForm({ ...composeForm, subject: e.target.value })
                    }
                    placeholder="Enter subject"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={composeForm.priority}
                      onChange={(e) =>
                        setComposeForm({ ...composeForm, priority: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    >
                      <option value="LOW">Low</option>
                      <option value="NORMAL">Normal</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={composeForm.category}
                      onChange={(e) =>
                        setComposeForm({ ...composeForm, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    >
                      <option value="GENERAL">General</option>
                      <option value="CASE_RELATED">Case Related</option>
                      <option value="ADMINISTRATIVE">Administrative</option>
                      <option value="URGENT">Urgent</option>
                      <option value="ANNOUNCEMENT">Announcement</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <Textarea
                    value={composeForm.body}
                    onChange={(e) =>
                      setComposeForm({ ...composeForm, body: e.target.value })
                    }
                    placeholder="Type your message here..."
                    rows={10}
                    required
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleSendEmail(true)}
                  >
                    Save Draft
                  </Button>
                  <Button onClick={() => handleSendEmail(false)}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
