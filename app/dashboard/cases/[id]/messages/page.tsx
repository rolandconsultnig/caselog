'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import Link from 'next/link';
import { Paperclip, Reply, Check, CheckCheck, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  messageText: string;
  messageType: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  createdAt: string;
  editedAt?: string;
  editedBy?: string;
  isEdited: boolean;
  reactions: Array<{
    emoji: string;
    userId: string;
    userName: string;
    timestamp: string;
  }>;
  isPinned: boolean;
  pinnedByName?: string;
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
  }>;
  replyToMessageId?: string;
  threadId?: string;
  isThreadStarter?: boolean;
  threadRepliesCount?: number;
  readBy?: string[];
  readReceipts?: Array<{
    userId: string;
    userName: string;
    readAt: string;
  }>;
}

export default function CaseMessagesPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [showThread, setShowThread] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    fetchMessages();
    setupRealTimeUpdates();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [params.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const setupRealTimeUpdates = () => {
    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Setup Server-Sent Events for real-time updates
    const eventSource = new EventSource(`/api/cases/${params.id}/messages/stream`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'message' && data.message) {
          setMessages((prev) => {
            // Check if message already exists
            if (prev.find((m) => m.id === data.message.id)) {
              return prev;
            }
            return [...prev, data.message];
          });
          // Mark as read
          markAsRead(data.message.id);
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      // Reconnect after 3 seconds
      setTimeout(() => {
        if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
          setupRealTimeUpdates();
        }
      }, 3000);
    };
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/cases/${params.id}/messages`);
      if (response.ok) {
        const data = await response.json();
        const fetchedMessages = data.messages || [];
        setMessages(fetchedMessages);
        
        // Mark all messages as read
        fetchedMessages.forEach((msg: ChatMessage) => {
          if (!msg.readBy?.includes(session?.user?.id || '')) {
            markAsRead(msg.id);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/cases/${params.id}/messages/${messageId}/read`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;

    setUploading(true);
    try {
      let attachments: any[] = [];

      // Upload file if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('relatedEntityType', 'case');
        formData.append('relatedEntityId', params.id as string);
        formData.append('description', 'Message attachment');
        formData.append('accessLevel', 'INTERNAL');

        const uploadResponse = await fetch(`/api/cases/${params.id}/documents`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          attachments = [{
            fileName: selectedFile.name,
            fileUrl: uploadData.document?.fileUrl || '',
            fileSize: selectedFile.size,
          }];
        }
      }

      const response = await fetch(`/api/cases/${params.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageText: newMessage,
          messageType: selectedFile ? 'FILE_SHARE' : 'TEXT',
          attachments,
          replyToMessageId: replyingTo?.id || null,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        setSelectedFile(null);
        setReplyingTo(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        fetchMessages();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/api/cases/${params.id}/messages/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Message deleted');
        fetchMessages();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const editMessage = async (messageId: string, newText: string) => {
    try {
      const response = await fetch(`/api/cases/${params.id}/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageText: newText }),
      });

      if (response.ok) {
        toast.success('Message updated');
        setEditingMessageId(null);
        fetchMessages();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update message');
      }
    } catch (error) {
      console.error('Error editing message:', error);
      toast.error('Failed to update message');
    }
  };

  const addReaction = async (messageId: string, emoji: string) => {
    try {
      await fetch(`/api/cases/${params.id}/messages/${messageId}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emoji }),
      });
      fetchMessages();
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const pinMessage = async (messageId: string) => {
    try {
      await fetch(`/api/cases/${params.id}/messages/${messageId}/pin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pinned: true }),
      });
      fetchMessages();
    } catch (error) {
      console.error('Error pinning message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'SYSTEM': return 'info';
      case 'IMPORTANT': return 'error';
      case 'FILE_SHARE': return 'warning';
      default: return 'default';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pinnedMessages = messages.filter(m => m.isPinned);
  const regularMessages = messages.filter(m => !m.isPinned);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Team Messages</h1>
            <p className="text-gray-600 mt-1">
              Collaborate with your team on this case
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/cases/${params.id}`}>
              <Button variant="outline">Back to Case</Button>
            </Link>
          </div>
        </div>

        {/* Pinned Messages */}
        {pinnedMessages.length > 0 && (
          <Card>
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">
                📌 Pinned Messages ({pinnedMessages.length})
              </h3>
              <div className="space-y-2">
                {pinnedMessages.map((message) => (
                  <div key={message.id} className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{message.senderName}</span>
                        <Badge variant="info" className="text-xs">
                          {message.senderRole}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => pinMessage(message.id)}
                        className="text-xs"
                      >
                        Unpin
                      </Button>
                    </div>
                    <p className="text-sm mt-1">{message.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Messages Area */}
        <Card className="h-96 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 text-sm">Loading messages...</p>
              </div>
            ) : regularMessages.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No messages yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start the conversation about this case.
                </p>
              </div>
            ) : (
              regularMessages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {message.senderName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{message.senderName}</span>
                      <Badge variant="info" className="text-xs">
                        {message.senderRole}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatTime(message.createdAt)}
                      </span>
                      {message.isEdited && (
                        <span className="text-xs text-gray-400">(edited)</span>
                      )}
                    </div>

                    {message.messageType !== 'TEXT' && (
                      <Badge variant={getMessageTypeColor(message.messageType)} className="text-xs mb-2">
                        {message.messageType.replace(/_/g, ' ')}
                      </Badge>
                    )}

                    {editingMessageId === message.id ? (
                      <div className="space-y-2">
                        <Textarea
                          defaultValue={message.messageText}
                          onBlur={(e) => {
                            if (e.target.value !== message.messageText) {
                              editMessage(message.id, e.target.value);
                            } else {
                              setEditingMessageId(null);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              setEditingMessageId(null);
                            }
                          }}
                          autoFocus
                          className="w-full"
                        />
                      </div>
                    ) : (
                      <p className="text-sm mb-2">{message.messageText}</p>
                    )}
                    
                    {/* Reply indicator */}
                    {message.replyToMessageId && (
                      <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <Reply className="w-3 h-3" />
                        <span>Replying to message</span>
                      </div>
                    )}

                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="space-y-1 mb-2">
                        {message.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                            <span>📎</span>
                            <span className="flex-1">{attachment.fileName}</span>
                            <span className="text-gray-500">
                              ({(attachment.fileSize / 1024).toFixed(1)} KB)
                            </span>
                            <Button variant="outline" size="sm" className="text-xs">
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reactions */}
                    <div className="flex items-center gap-2 mt-2">
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {Object.entries(
                            message.reactions.reduce((acc: any, r: any) => {
                              if (!acc[r.emoji]) {
                                acc[r.emoji] = { emoji: r.emoji, count: 0, users: [] };
                              }
                              acc[r.emoji].count++;
                              acc[r.emoji].users.push(r.userName);
                              return acc;
                            }, {})
                          ).map(([emoji, data]: [string, any]) => (
                            <button
                              key={emoji}
                              onClick={() => addReaction(message.id, emoji)}
                              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1"
                              title={data.users.join(', ')}
                            >
                              {emoji} {data.count}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-1">
                        <button
                          onClick={() => addReaction(message.id, '👍')}
                          className="text-xs text-gray-400 hover:text-gray-600 p-1"
                          title="Like"
                        >
                          👍
                        </button>
                        <button
                          onClick={() => addReaction(message.id, '❤️')}
                          className="text-xs text-gray-400 hover:text-gray-600 p-1"
                          title="Love"
                        >
                          ❤️
                        </button>
                        <button
                          onClick={() => addReaction(message.id, '✅')}
                          className="text-xs text-gray-400 hover:text-gray-600 p-1"
                          title="Noted"
                        >
                          ✅
                        </button>
                        <button
                          onClick={() => setReplyingTo(message)}
                          className="text-xs text-gray-400 hover:text-gray-600 p-1"
                          title="Reply"
                        >
                          <Reply className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Read receipts */}
                      {message.readReceipts && message.readReceipts.length > 0 && (
                        <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                          {message.readReceipts.length === message.readBy?.length ? (
                            <CheckCheck className="w-3 h-3 text-blue-600" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                          <span>{message.readReceipts.length} read</span>
                        </div>
                      )}

                      {/* Thread indicator */}
                      {message.isThreadStarter && message.threadRepliesCount && message.threadRepliesCount > 0 && (
                        <button
                          onClick={() => setShowThread(showThread === message.id ? null : message.id)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          {message.threadRepliesCount} replies
                        </button>
                      )}

                      {/* Message actions */}
                      {message.senderId === session?.user?.id && (
                        <div className="ml-auto flex gap-1">
                          <button
                            onClick={() => setEditingMessageId(message.id)}
                            className="text-xs text-gray-400 hover:text-gray-600"
                            title="Edit"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteMessage(message.id)}
                            className="text-xs text-gray-400 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => pinMessage(message.id)}
                            className="text-xs"
                            title={message.isPinned ? 'Unpin' : 'Pin'}
                          >
                            📌
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Preview */}
          {replyingTo && (
            <div className="border-t border-gray-200 p-3 bg-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Reply className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">
                    Replying to <span className="font-medium">{replyingTo.senderName}</span>
                  </span>
                  <span className="text-xs text-gray-500 truncate max-w-xs">
                    {replyingTo.messageText.substring(0, 50)}...
                  </span>
                </div>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            {selectedFile && (
              <div className="mb-2 flex items-center gap-2 p-2 bg-gray-50 rounded">
                <Paperclip className="w-4 h-4 text-gray-600" />
                <span className="text-sm flex-1">{selectedFile.name}</span>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="self-end"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={replyingTo ? `Reply to ${replyingTo.senderName}...` : 'Type your message...'}
                className="flex-1 min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button
                onClick={sendMessage}
                disabled={(!newMessage.trim() && !selectedFile) || uploading}
                className="self-end"
              >
                {uploading ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {messages.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Messages</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {pinnedMessages.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Pinned Messages</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {messages.filter(m => m.messageType === 'IMPORTANT').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Important Messages</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">
                {new Set(messages.map(m => m.senderName)).size}
              </p>
              <p className="text-sm text-gray-600 mt-1">Team Members</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
