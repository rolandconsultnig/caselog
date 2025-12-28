import { AccessLevel, TenantType } from '@prisma/client';

export interface Permission {
  // Basic Permissions
  canRead: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canEditOwn: boolean;
  
  // Approval Workflow
  canApprove: boolean;
  canReject: boolean;
  canReassign: boolean;
  canEscalate: boolean;
  
  // Deletion & Archive
  canRequestDelete: boolean;
  canApproveDelete: boolean;
  canArchive: boolean;
  canRestore: boolean;
  
  // Case Management
  canAddEvidence: boolean;
  canEditEvidence: boolean;
  canDeleteEvidence: boolean;
  canAddWitness: boolean;
  canEditWitness: boolean;
  canAddOfficer: boolean;
  canUpdateStatus: boolean;
  canCloseCase: boolean;
  canReopenCase: boolean;
  
  // Document Management
  canUploadDocuments: boolean;
  canDownloadDocuments: boolean;
  canDeleteDocuments: boolean;
  canViewSensitiveInfo: boolean;
  
  // Communication
  canSendNotifications: boolean;
  canComment: boolean;
  canMention: boolean;
  canViewComments: boolean;
  
  // Reporting & Analytics
  canExportData: boolean;
  canGenerateReports: boolean;
  canViewStatistics: boolean;
  canViewAnalytics: boolean;
  canScheduleReports: boolean;
  
  // User Management
  canManageUsers: boolean;
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeactivateUsers: boolean;
  canResetPasswords: boolean;
  canAssignRoles: boolean;
  
  // System Administration
  canAccessAdminPanel: boolean;
  canViewAuditLogs: boolean;
  canConfigureSystem: boolean;
  canManageIntegrations: boolean;
  canViewSystemHealth: boolean;
  
  // Federal/State Oversight
  canViewAllStates: boolean;
  canViewCrossState: boolean;
  canAuditOtherStates: boolean;
  canGenerateFederalReports: boolean;
  
  // Advanced Features
  canBulkOperations: boolean;
  canImportData: boolean;
  canManageTemplates: boolean;
  canConfigureWorkflows: boolean;
  canManageBiometrics: boolean;
  
  // Security & Compliance
  canViewSecuritySettings: boolean;
  canManagePermissions: boolean;
  canViewComplianceReports: boolean;
  canConfigureBackups: boolean;
}

export function getPermissions(
  accessLevel: AccessLevel,
  tenantType: TenantType
): Permission {
  const basePermissions: Permission = {
    // Basic Permissions
    canRead: false,
    canCreate: false,
    canEdit: false,
    canEditOwn: false,
    
    // Approval Workflow
    canApprove: false,
    canReject: false,
    canReassign: false,
    canEscalate: false,
    
    // Deletion & Archive
    canRequestDelete: false,
    canApproveDelete: false,
    canArchive: false,
    canRestore: false,
    
    // Case Management
    canAddEvidence: false,
    canEditEvidence: false,
    canDeleteEvidence: false,
    canAddWitness: false,
    canEditWitness: false,
    canAddOfficer: false,
    canUpdateStatus: false,
    canCloseCase: false,
    canReopenCase: false,
    
    // Document Management
    canUploadDocuments: false,
    canDownloadDocuments: false,
    canDeleteDocuments: false,
    canViewSensitiveInfo: false,
    
    // Communication
    canSendNotifications: false,
    canComment: false,
    canMention: false,
    canViewComments: false,
    
    // Reporting & Analytics
    canExportData: false,
    canGenerateReports: false,
    canViewStatistics: false,
    canViewAnalytics: false,
    canScheduleReports: false,
    
    // User Management
    canManageUsers: false,
    canCreateUsers: false,
    canEditUsers: false,
    canDeactivateUsers: false,
    canResetPasswords: false,
    canAssignRoles: false,
    
    // System Administration
    canAccessAdminPanel: false,
    canViewAuditLogs: false,
    canConfigureSystem: false,
    canManageIntegrations: false,
    canViewSystemHealth: false,
    
    // Federal/State Oversight
    canViewAllStates: false,
    canViewCrossState: false,
    canAuditOtherStates: false,
    canGenerateFederalReports: false,
    
    // Advanced Features
    canBulkOperations: false,
    canImportData: false,
    canManageTemplates: false,
    canConfigureWorkflows: false,
    canManageBiometrics: false,
    
    // Security & Compliance
    canViewSecuritySettings: false,
    canManagePermissions: false,
    canViewComplianceReports: false,
    canConfigureBackups: false,
  };

  switch (accessLevel) {
    case AccessLevel.LEVEL_1:
      // Read-Only User - Can view cases and basic information
      return {
        ...basePermissions,
        canRead: true,
        canViewComments: true,
        canViewStatistics: true,
        canDownloadDocuments: true,
      };

    case AccessLevel.LEVEL_2:
      // Case Creator - Can create and manage own cases
      return {
        ...basePermissions,
        canRead: true,
        canCreate: true,
        canEditOwn: true,
        canAddEvidence: true,
        canAddWitness: true,
        canAddOfficer: true,
        canUploadDocuments: true,
        canDownloadDocuments: true,
        canComment: true,
        canViewComments: true,
        canViewStatistics: true,
        canEscalate: true,
      };

    case AccessLevel.LEVEL_3:
      // Approver - Can approve/reject cases and manage workflow
      return {
        ...basePermissions,
        canRead: true,
        canCreate: true,
        canEdit: true,
        canEditOwn: true,
        canApprove: true,
        canReject: true,
        canReassign: true,
        canEscalate: true,
        canAddEvidence: true,
        canEditEvidence: true,
        canAddWitness: true,
        canEditWitness: true,
        canAddOfficer: true,
        canUpdateStatus: true,
        canUploadDocuments: true,
        canDownloadDocuments: true,
        canViewSensitiveInfo: true,
        canSendNotifications: true,
        canComment: true,
        canMention: true,
        canViewComments: true,
        canExportData: true,
        canGenerateReports: true,
        canViewStatistics: true,
        canViewAnalytics: true,
      };

    case AccessLevel.LEVEL_4:
      // Senior Officer - Can request deletions and advanced case management
      return {
        ...basePermissions,
        canRead: true,
        canCreate: true,
        canEdit: true,
        canEditOwn: true,
        canApprove: true,
        canReject: true,
        canReassign: true,
        canEscalate: true,
        canRequestDelete: true,
        canArchive: true,
        canAddEvidence: true,
        canEditEvidence: true,
        canDeleteEvidence: true,
        canAddWitness: true,
        canEditWitness: true,
        canAddOfficer: true,
        canUpdateStatus: true,
        canCloseCase: true,
        canUploadDocuments: true,
        canDownloadDocuments: true,
        canDeleteDocuments: true,
        canViewSensitiveInfo: true,
        canSendNotifications: true,
        canComment: true,
        canMention: true,
        canViewComments: true,
        canExportData: true,
        canGenerateReports: true,
        canViewStatistics: true,
        canViewAnalytics: true,
        canScheduleReports: true,
        canBulkOperations: true,
        canViewAuditLogs: true,
      };

    case AccessLevel.LEVEL_5:
      // Director - Full case authority including deletion approval
      return {
        ...basePermissions,
        canRead: true,
        canCreate: true,
        canEdit: true,
        canEditOwn: true,
        canApprove: true,
        canReject: true,
        canReassign: true,
        canEscalate: true,
        canRequestDelete: true,
        canApproveDelete: true,
        canArchive: true,
        canRestore: true,
        canAddEvidence: true,
        canEditEvidence: true,
        canDeleteEvidence: true,
        canAddWitness: true,
        canEditWitness: true,
        canAddOfficer: true,
        canUpdateStatus: true,
        canCloseCase: true,
        canReopenCase: true,
        canUploadDocuments: true,
        canDownloadDocuments: true,
        canDeleteDocuments: true,
        canViewSensitiveInfo: true,
        canSendNotifications: true,
        canComment: true,
        canMention: true,
        canViewComments: true,
        canExportData: true,
        canGenerateReports: true,
        canViewStatistics: true,
        canViewAnalytics: true,
        canScheduleReports: true,
        canBulkOperations: true,
        canImportData: true,
        canManageTemplates: true,
        canViewAuditLogs: true,
        canViewComplianceReports: true,
      };

    case AccessLevel.SUPER_ADMIN:
      // Super Administrator - System administration and user management
      return {
        ...basePermissions,
        canRead: true,
        canCreate: true,
        canEdit: true,
        canEditOwn: true,
        canApprove: true,
        canReject: true,
        canReassign: true,
        canEscalate: true,
        canRequestDelete: true,
        canApproveDelete: true,
        canArchive: true,
        canRestore: true,
        canAddEvidence: true,
        canEditEvidence: true,
        canDeleteEvidence: true,
        canAddWitness: true,
        canEditWitness: true,
        canAddOfficer: true,
        canUpdateStatus: true,
        canCloseCase: true,
        canReopenCase: true,
        canUploadDocuments: true,
        canDownloadDocuments: true,
        canDeleteDocuments: true,
        canViewSensitiveInfo: true,
        canSendNotifications: true,
        canComment: true,
        canMention: true,
        canViewComments: true,
        canExportData: true,
        canGenerateReports: true,
        canViewStatistics: true,
        canViewAnalytics: true,
        canScheduleReports: true,
        canManageUsers: true,
        canCreateUsers: true,
        canEditUsers: true,
        canDeactivateUsers: true,
        canResetPasswords: true,
        canAssignRoles: true,
        canAccessAdminPanel: true,
        canViewAuditLogs: true,
        canConfigureSystem: true,
        canManageIntegrations: true,
        canViewSystemHealth: true,
        canViewAllStates: tenantType === TenantType.FEDERAL,
        canViewCrossState: tenantType === TenantType.FEDERAL,
        canAuditOtherStates: tenantType === TenantType.FEDERAL,
        canGenerateFederalReports: tenantType === TenantType.FEDERAL,
        canBulkOperations: true,
        canImportData: true,
        canManageTemplates: true,
        canConfigureWorkflows: true,
        canManageBiometrics: true,
        canViewSecuritySettings: true,
        canManagePermissions: true,
        canViewComplianceReports: true,
        canConfigureBackups: true,
      };

    case AccessLevel.APP_ADMIN:
      // Application Administrator - Full system access
      return {
        ...basePermissions,
        canRead: true,
        canCreate: true,
        canEdit: true,
        canEditOwn: true,
        canApprove: true,
        canReject: true,
        canReassign: true,
        canEscalate: true,
        canRequestDelete: true,
        canApproveDelete: true,
        canArchive: true,
        canRestore: true,
        canAddEvidence: true,
        canEditEvidence: true,
        canDeleteEvidence: true,
        canAddWitness: true,
        canEditWitness: true,
        canAddOfficer: true,
        canUpdateStatus: true,
        canCloseCase: true,
        canReopenCase: true,
        canUploadDocuments: true,
        canDownloadDocuments: true,
        canDeleteDocuments: true,
        canViewSensitiveInfo: true,
        canSendNotifications: true,
        canComment: true,
        canMention: true,
        canViewComments: true,
        canExportData: true,
        canGenerateReports: true,
        canViewStatistics: true,
        canViewAnalytics: true,
        canScheduleReports: true,
        canManageUsers: true,
        canCreateUsers: true,
        canEditUsers: true,
        canDeactivateUsers: true,
        canResetPasswords: true,
        canAssignRoles: true,
        canAccessAdminPanel: true,
        canViewAuditLogs: true,
        canConfigureSystem: true,
        canManageIntegrations: true,
        canViewSystemHealth: true,
        canViewAllStates: tenantType === TenantType.FEDERAL,
        canViewCrossState: tenantType === TenantType.FEDERAL,
        canAuditOtherStates: tenantType === TenantType.FEDERAL,
        canGenerateFederalReports: tenantType === TenantType.FEDERAL,
        canBulkOperations: true,
        canImportData: true,
        canManageTemplates: true,
        canConfigureWorkflows: true,
        canManageBiometrics: true,
        canViewSecuritySettings: true,
        canManagePermissions: true,
        canViewComplianceReports: true,
        canConfigureBackups: true,
      };

    case AccessLevel.INVESTIGATOR:
      // Investigator - Focused on case investigation and evidence management
      return {
        ...basePermissions,
        canRead: true,
        canEditOwn: true,
        canAddEvidence: true,
        canEditEvidence: true,
        canDeleteEvidence: true,
        canAddWitness: true,
        canEditWitness: true,
        canAddOfficer: true,
        canUpdateStatus: true,
        canUploadDocuments: true,
        canDownloadDocuments: true,
        canComment: true,
        canViewComments: true,
        canViewStatistics: true,
      };

    case AccessLevel.PROSECUTOR:
      // Prosecutor - Focused on legal proceedings and case review
      return {
        ...basePermissions,
        canRead: true,
        canUpdateStatus: true,
        canUploadDocuments: true,
        canDownloadDocuments: true,
        canViewSensitiveInfo: true,
        canSendNotifications: true,
        canComment: true,
        canViewComments: true,
        canExportData: true,
        canGenerateReports: true,
        canViewStatistics: true,
        canViewAnalytics: true,
      };

    default:
      return basePermissions;
  }
}

export function canAccessCase(
  userTenantId: string,
  caseTenantId: string,
  tenantType: TenantType
): boolean {
  // Federal users can access all cases
  if (tenantType === TenantType.FEDERAL) {
    return true;
  }
  // State users can only access their own cases
  return userTenantId === caseTenantId;
}

export function hasMinimumLevel(
  userLevel: AccessLevel,
  requiredLevel: AccessLevel
): boolean {
  const levelHierarchy = {
    [AccessLevel.LEVEL_1]: 1,
    [AccessLevel.LEVEL_2]: 2,
    [AccessLevel.LEVEL_3]: 3,
    [AccessLevel.LEVEL_4]: 4,
    [AccessLevel.LEVEL_5]: 5,
    [AccessLevel.SUPER_ADMIN]: 6,
    [AccessLevel.APP_ADMIN]: 7,
    [AccessLevel.INVESTIGATOR]: 4, // Equivalent to Senior Officer
    [AccessLevel.PROSECUTOR]: 4, // Equivalent to Senior Officer
  };

  return levelHierarchy[userLevel] >= levelHierarchy[requiredLevel];
}

