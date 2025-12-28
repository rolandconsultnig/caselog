import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateCaseNumber(tenantCode: string): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `${tenantCode}-${year}-${timestamp}`;
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getAccessLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    LEVEL_1: 'Level 1 (Read Only)',
    LEVEL_2: 'Level 2 (Case Creator)',
    LEVEL_3: 'Level 3 (Approver)',
    LEVEL_4: 'Level 4 (Delete Requester)',
    LEVEL_5: 'Level 5 (Full Authority)',
    SUPER_ADMIN: 'Super Administrator',
    APP_ADMIN: 'Application Administrator',
  };
  return labels[level] || level;
}

export function getCaseStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-800',
    PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    CLOSED: 'bg-blue-100 text-blue-800',
    ARCHIVED: 'bg-purple-100 text-purple-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getCaseStatusLabel(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

export function truncate(str: string, length: number = 50): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

export async function logAudit(data: {
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  description: string;
  caseId?: string;
  metadata?: any;
}) {
  // This would be called from API routes
  const { prisma } = await import('./prisma');
  return prisma.auditLog.create({
    data: {
      userId: data.userId,
      action: data.action as any,
      entityType: data.entityType,
      entityId: data.entityId,
      description: data.description,
      caseId: data.caseId,
      metadata: data.metadata,
    },
  });
}

