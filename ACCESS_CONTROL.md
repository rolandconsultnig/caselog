# Enhanced Access Control System - CaseLogPro2

Complete documentation for the 7-level role-based access control system with 60+ granular permissions.

---

## 🎯 Overview

CaseLogPro2 implements a sophisticated role-based access control (RBAC) system with **7 distinct access levels** and **60+ granular permissions** across 10 functional categories.

---

## 📊 Access Levels Summary

| Level | Role | Primary Function | Permission Count |
|-------|------|------------------|------------------|
| **Level 1** | Read-Only User | View cases and information | 4 permissions |
| **Level 2** | Case Creator | Create and manage own cases | 12 permissions |
| **Level 3** | Approver | Approve/reject and workflow management | 24 permissions |
| **Level 4** | Senior Officer | Advanced case management + deletions | 32 permissions |
| **Level 5** | Director | Full case authority | 38 permissions |
| **Super Admin** | System Administrator | System administration + user management | 60 permissions |
| **App Admin** | Application Administrator | Full system access | 60 permissions |

---

## 🔐 Permission Categories (10 Categories, 60+ Permissions)

### 1. Basic Permissions (4)
- ✅ `canRead` - View cases and information
- ✅ `canCreate` - Create new cases
- ✅ `canEdit` - Edit any case
- ✅ `canEditOwn` - Edit own cases only

### 2. Approval Workflow (4)
- ✅ `canApprove` - Approve cases
- ✅ `canReject` - Reject cases with reasons
- ✅ `canReassign` - Reassign cases to other users
- ✅ `canEscalate` - Escalate cases to higher authority

### 3. Deletion & Archive (4)
- ✅ `canRequestDelete` - Request case deletion
- ✅ `canApproveDelete` - Approve deletion requests
- ✅ `canArchive` - Archive closed cases
- ✅ `canRestore` - Restore archived cases

### 4. Case Management (9)
- ✅ `canAddEvidence` - Add evidence to cases
- ✅ `canEditEvidence` - Edit evidence details
- ✅ `canDeleteEvidence` - Remove evidence
- ✅ `canAddWitness` - Add witness information
- ✅ `canEditWitness` - Edit witness details
- ✅ `canAddOfficer` - Add investigating officers
- ✅ `canUpdateStatus` - Update case status
- ✅ `canCloseCase` - Close cases
- ✅ `canReopenCase` - Reopen closed cases

### 5. Document Management (4)
- ✅ `canUploadDocuments` - Upload case documents
- ✅ `canDownloadDocuments` - Download documents
- ✅ `canDeleteDocuments` - Remove documents
- ✅ `canViewSensitiveInfo` - Access sensitive information

### 6. Communication (4)
- ✅ `canSendNotifications` - Send system notifications
- ✅ `canComment` - Add comments to cases
- ✅ `canMention` - Mention other users
- ✅ `canViewComments` - View case comments

### 7. Reporting & Analytics (5)
- ✅ `canExportData` - Export case data
- ✅ `canGenerateReports` - Create reports
- ✅ `canViewStatistics` - View dashboard statistics
- ✅ `canViewAnalytics` - Access analytics
- ✅ `canScheduleReports` - Schedule automated reports

### 8. User Management (6)
- ✅ `canManageUsers` - Overall user management
- ✅ `canCreateUsers` - Create new users
- ✅ `canEditUsers` - Edit user details
- ✅ `canDeactivateUsers` - Deactivate user accounts
- ✅ `canResetPasswords` - Reset user passwords
- ✅ `canAssignRoles` - Assign access levels

### 9. System Administration (5)
- ✅ `canAccessAdminPanel` - Access admin dashboard
- ✅ `canViewAuditLogs` - View system audit logs
- ✅ `canConfigureSystem` - Configure system settings
- ✅ `canManageIntegrations` - Manage third-party integrations
- ✅ `canViewSystemHealth` - Monitor system health

### 10. Federal/State Oversight (4)
- ✅ `canViewAllStates` - View cases from all states (Federal only)
- ✅ `canViewCrossState` - Cross-state data access
- ✅ `canAuditOtherStates` - Audit other state operations
- ✅ `canGenerateFederalReports` - Generate federal-level reports

### 11. Advanced Features (5)
- ✅ `canBulkOperations` - Perform bulk actions
- ✅ `canImportData` - Import case data
- ✅ `canManageTemplates` - Manage document templates
- ✅ `canConfigureWorkflows` - Configure approval workflows
- ✅ `canManageBiometrics` - Manage biometric settings

### 12. Security & Compliance (4)
- ✅ `canViewSecuritySettings` - View security configuration
- ✅ `canManagePermissions` - Manage role permissions
- ✅ `canViewComplianceReports` - Access compliance reports
- ✅ `canConfigureBackups` - Configure backup settings

---

## 📋 Detailed Access Level Breakdown

### Level 1: Read-Only User (4 Permissions)

**Role Description**: Basic user who can view cases and information but cannot make changes.

**Typical Users**: Interns, observers, external auditors (limited access)

**Permissions**:
- ✅ Read cases
- ✅ View comments
- ✅ View statistics
- ✅ Download documents

**Use Cases**:
- Review case information
- Monitor case progress
- Generate personal notes
- Download reports for review

**Restrictions**:
- ❌ Cannot create or edit cases
- ❌ Cannot add evidence or witnesses
- ❌ Cannot approve or reject
- ❌ Cannot export data

---

### Level 2: Case Creator (12 Permissions)

**Role Description**: Can create new cases and manage their own submissions.

**Typical Users**: Case officers, data entry clerks, field workers

**Permissions**:
- ✅ All Level 1 permissions
- ✅ Create cases
- ✅ Edit own cases
- ✅ Add evidence
- ✅ Add witnesses
- ✅ Add investigating officers
- ✅ Upload documents
- ✅ Comment on cases
- ✅ Escalate cases

**Use Cases**:
- Document new SGBV cases
- Add victim and perpetrator details
- Upload evidence and documents
- Submit cases for approval
- Track own case submissions

**Restrictions**:
- ❌ Cannot edit others' cases
- ❌ Cannot approve or reject
- ❌ Cannot delete evidence
- ❌ Cannot generate reports

---

### Level 3: Approver (24 Permissions)

**Role Description**: Can approve/reject cases and manage workflow processes.

**Typical Users**: Supervisors, case managers, legal officers

**Permissions**:
- ✅ All Level 2 permissions
- ✅ Edit any case
- ✅ Approve cases
- ✅ Reject cases
- ✅ Reassign cases
- ✅ Edit evidence
- ✅ Edit witnesses
- ✅ Update case status
- ✅ View sensitive information
- ✅ Send notifications
- ✅ Mention users
- ✅ Export data
- ✅ Generate reports
- ✅ View analytics

**Use Cases**:
- Review submitted cases
- Approve or reject with reasons
- Reassign cases to appropriate officers
- Update case workflow status
- Generate departmental reports
- Monitor team performance

**Restrictions**:
- ❌ Cannot request deletions
- ❌ Cannot close cases
- ❌ Cannot manage users
- ❌ Cannot access admin panel

---

### Level 4: Senior Officer (32 Permissions)

**Role Description**: Advanced case management with deletion request authority.

**Typical Users**: Senior prosecutors, department heads, senior investigators

**Permissions**:
- ✅ All Level 3 permissions
- ✅ Request case deletion
- ✅ Archive cases
- ✅ Delete evidence
- ✅ Delete documents
- ✅ Close cases
- ✅ Schedule reports
- ✅ Bulk operations
- ✅ View audit logs

**Use Cases**:
- Manage complex cases
- Request deletion of duplicate/erroneous cases
- Archive completed cases
- Perform bulk status updates
- Generate scheduled reports
- Review audit trails
- Close cases after resolution

**Restrictions**:
- ❌ Cannot approve deletions
- ❌ Cannot reopen cases
- ❌ Cannot manage users
- ❌ Cannot configure system

---

### Level 5: Director (38 Permissions)

**Role Description**: Full case authority including deletion approval and restoration.

**Typical Users**: Directors, state attorneys general, ministry directors

**Permissions**:
- ✅ All Level 4 permissions
- ✅ Approve deletion requests
- ✅ Restore archived cases
- ✅ Reopen closed cases
- ✅ Import data
- ✅ Manage templates
- ✅ View compliance reports

**Use Cases**:
- Final authority on case deletions
- Restore cases when needed
- Reopen cases for new evidence
- Import historical case data
- Manage document templates
- Review compliance status
- Oversee state operations

**Restrictions**:
- ❌ Cannot manage users (except in some states)
- ❌ Cannot access admin panel
- ❌ Cannot configure system settings
- ❌ Cannot view other states (if state user)

---

### Level 6: Super Admin (60 Permissions)

**Role Description**: System administration and user management authority.

**Typical Users**: IT administrators, system managers, state super admins

**Permissions**:
- ✅ All Level 5 permissions
- ✅ Manage users (create, edit, deactivate)
- ✅ Reset passwords
- ✅ Assign roles
- ✅ Access admin panel
- ✅ Configure system
- ✅ Manage integrations
- ✅ View system health
- ✅ Configure workflows
- ✅ Manage biometrics
- ✅ View security settings
- ✅ Manage permissions
- ✅ Configure backups
- ✅ View all states (Federal only)
- ✅ Cross-state access (Federal only)
- ✅ Audit other states (Federal only)

**Use Cases**:
- Create and manage user accounts
- Assign appropriate access levels
- Configure system settings
- Monitor system health
- Manage integrations
- Review security settings
- Configure automated backups
- **Federal**: Oversee all states

**Federal vs State Super Admin**:
- **Federal Super Admin**: Can view and audit all 37 states
- **State Super Admin**: Limited to their own state

---

### Level 7: App Admin (60 Permissions)

**Role Description**: Full application-level administration authority.

**Typical Users**: Federal IT administrators, application managers, system architects

**Permissions**:
- ✅ All Super Admin permissions
- ✅ Full system configuration
- ✅ Database management
- ✅ Integration management
- ✅ Federal oversight (if Federal tenant)

**Use Cases**:
- Application-level configuration
- Database maintenance
- Integration setup
- Federal oversight
- System architecture changes
- Emergency interventions

**Difference from Super Admin**:
- More technical/system-level access
- Can modify application configuration
- Typically Federal-level only
- Reserved for technical staff

---

## 🔄 Permission Inheritance

Each level inherits permissions from lower levels:

```
Level 1 (4 permissions)
  ↓
Level 2 (12 permissions) = Level 1 + 8 new
  ↓
Level 3 (24 permissions) = Level 2 + 12 new
  ↓
Level 4 (32 permissions) = Level 3 + 8 new
  ↓
Level 5 (38 permissions) = Level 4 + 6 new
  ↓
Super Admin (60 permissions) = Level 5 + 22 new
  ↓
App Admin (60 permissions) = Super Admin + technical access
```

---

## 🌍 Federal vs State Access

### State Users (All Levels)
- ✅ Access to own state cases only
- ✅ Manage own state users (Super Admin)
- ✅ State-level statistics
- ❌ Cannot view other states
- ❌ Cannot access federal data

### Federal Users (All Levels)
- ✅ Access to ALL state cases
- ✅ Cross-state querying
- ✅ National statistics
- ✅ Audit any state
- ✅ Generate federal reports
- ✅ Oversight authority

---

## 📊 Permission Matrix

| Permission | L1 | L2 | L3 | L4 | L5 | SA | AA |
|------------|----|----|----|----|----|----|-----|
| **Basic** |
| Read | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit | ❌ | Own | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Workflow** |
| Approve | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Reject | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Reassign | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Escalate | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Deletion** |
| Request Delete | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Approve Delete | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Archive | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Restore | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Case Mgmt** |
| Add Evidence | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit Evidence | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Delete Evidence | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Close Case | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Reopen Case | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Documents** |
| Upload | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Download | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Delete | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| View Sensitive | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Reporting** |
| Export Data | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Generate Reports | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Statistics | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Schedule Reports | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Admin** |
| Manage Users | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Admin Panel | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| View Audit Logs | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Configure System | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Federal** |
| View All States | ❌ | ❌ | ❌ | ❌ | ❌ | Fed | Fed |
| Audit States | ❌ | ❌ | ❌ | ❌ | ❌ | Fed | Fed |

**Legend**: ✅ = Yes, ❌ = No, Own = Own cases only, Fed = Federal users only, SA = Super Admin, AA = App Admin

---

## 🎯 Use Case Examples

### Scenario 1: New Case Submission
1. **Level 2** creates case → Status: DRAFT
2. **Level 2** adds evidence and witnesses
3. **Level 2** submits for approval → Status: PENDING_APPROVAL
4. **Level 3** reviews and approves → Status: APPROVED

### Scenario 2: Case Deletion
1. **Level 4** requests deletion with reason
2. System creates deletion request
3. **Level 5** reviews request
4. **Level 5** approves → Case deleted + audit logged

### Scenario 3: Federal Oversight
1. **Federal Super Admin** logs in
2. Views dashboard with all 37 states
3. Filters cases from Lagos State
4. Generates federal report
5. Audits Lagos operations

### Scenario 4: User Management
1. **Super Admin** creates new user
2. Assigns Level 2 access
3. User receives credentials
4. User logs in with limited permissions
5. **Super Admin** can upgrade later

---

## 🔒 Security Considerations

### Permission Checks
- Every API call validates permissions
- UI elements hidden based on permissions
- Database queries filtered by tenant
- Audit logs track all actions

### Best Practices
1. **Principle of Least Privilege**: Users get minimum required access
2. **Regular Reviews**: Audit user permissions quarterly
3. **Separation of Duties**: No single user has all powers
4. **Time-Limited Access**: Temporary elevated access when needed
5. **Audit Everything**: All actions logged and traceable

---

## 📝 Implementation

### Checking Permissions in Code

```typescript
import { getPermissions } from '@/lib/permissions';

// Get user permissions
const permissions = getPermissions(user.accessLevel, user.tenantType);

// Check specific permission
if (permissions.canApprove) {
  // Show approve button
}

// Check multiple permissions
if (permissions.canEdit && permissions.canViewSensitiveInfo) {
  // Allow editing sensitive fields
}
```

### API Route Protection

```typescript
// In API route
const permissions = getPermissions(session.user.accessLevel, session.user.tenantType);

if (!permissions.canCreate) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

### UI Component Conditional Rendering

```typescript
{permissions.canApprove && (
  <Button onClick={handleApprove}>Approve Case</Button>
)}
```

---

## 📚 Related Documentation

- **[README.md](./README.md)** - Main project documentation
- **[SETUP.md](./SETUP.md)** - Installation and setup
- **[API.md](./API.md)** - API endpoints and authentication
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Development guidelines

---

**Version**: 2.0.0 (Enhanced)
**Last Updated**: November 2024
**Total Permissions**: 60+
**Access Levels**: 7

