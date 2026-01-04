// 🎯 Application Constants - Human-readable configuration

export const APP_CONFIG = {
  // 📱 Application Information
  name: 'CaselogPro2',
  fullName: 'Sexual and Gender-Based Violence Information System',
  description: 'National SGBV Case Management System for Nigerian States and Federal Ministry of Justice',
  version: '1.0.0',
  
  // 🌐 URLs and Endpoints
  baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3550',
  apiBaseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3550',
  
  // 🔐 Authentication
  sessionDuration: 8 * 60 * 60, // 8 hours in seconds
  maxSessionAge: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
  
  // 📊 Pagination
  defaultPageSize: 20,
  maxPageSize: 100,
  
  // 📱 UI Configuration
  loadingTimeout: 30000, // 30 seconds
  toastDuration: 4000, // 4 seconds
  
  // 🗄️ Database Configuration
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  
  // 📧 Email Configuration
  emailFrom: process.env.EMAIL_FROM || 'noreply@sgbv.gov.ng',
  supportEmail: 'support@sgbv.gov.ng',
  
  // 🏛️ Organization
  organization: {
    name: 'Federal Ministry of Justice',
    acronym: 'FMOJ',
    country: 'Nigeria',
  }
} as const;

// 🎨 UI Theme Colors
export const THEME_COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
  },
  chart: ['#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#8b5cf6'],
} as const;

// 📋 Case Status Configuration
export const CASE_STATUS = {
  NEW: { label: 'New', color: THEME_COLORS.primary[600], description: 'Newly created case' },
  PENDING_APPROVAL: { label: 'Pending Approval', color: THEME_COLORS.warning[600], description: 'Awaiting approval' },
  APPROVED: { label: 'Approved', color: THEME_COLORS.success[600], description: 'Case approved by supervisor' },
  ACTIVE: { label: 'Active', color: THEME_COLORS.success[500], description: 'Case is actively being investigated' },
  UNDER_INVESTIGATION: { label: 'Under Investigation', color: THEME_COLORS.primary[500], description: 'Investigation in progress' },
  CLOSED: { label: 'Closed', color: 'gray', description: 'Case closed' },
  ARCHIVED: { label: 'Archived', color: 'gray', description: 'Case archived' },
} as const;

// 🎯 Case Priority Configuration
export const CASE_PRIORITY = {
  LOW: { label: 'Low', color: THEME_COLORS.success[500], order: 1 },
  MEDIUM: { label: 'Medium', color: THEME_COLORS.warning[500], order: 2 },
  HIGH: { label: 'High', color: THEME_COLORS.error[500], order: 3 },
  URGENT: { label: 'Urgent', color: 'red', order: 4 },
} as const;

// 👥 User Access Levels
export const ACCESS_LEVELS = {
  LEVEL_1: { 
    label: 'Level 1 - Basic Access', 
    description: 'Basic case viewing and editing',
    permissions: ['read', 'edit_own']
  },
  LEVEL_2: { 
    label: 'Level 2 - Case Worker', 
    description: 'Can create and manage cases',
    permissions: ['read', 'create', 'edit_own', 'update_status']
  },
  LEVEL_3: { 
    label: 'Level 3 - Supervisor', 
    description: 'Can approve cases and assign investigators',
    permissions: ['read', 'create', 'edit', 'approve', 'assign']
  },
  LEVEL_4: { 
    label: 'Level 4 - Administrator', 
    description: 'Full state administration and user management',
    permissions: ['all']
  },
  LEVEL_5: { 
    label: 'Level 5 - Director', 
    description: 'Federal oversight and advanced permissions',
    permissions: ['all', 'federal']
  },
  SUPER_ADMIN: { 
    label: 'Super Administrator', 
    description: 'System administration and full access',
    permissions: ['all', 'federal', 'system']
  },
  APP_ADMIN: { 
    label: 'Application Administrator', 
    description: 'Application configuration and maintenance',
    permissions: ['all', 'federal', 'system', 'app_config']
  },
} as const;

// 🏛️ Tenant Types
export const TENANT_TYPES = {
  FEDERAL: { 
    label: 'Federal Ministry of Justice', 
    description: 'Federal level oversight and administration',
    scope: 'national'
  },
  STATE: { 
    label: 'State Government', 
    description: 'State level case management',
    scope: 'state'
  },
} as const;

// 📊 Report Types
export const REPORT_TYPES = {
  SUMMARY: { 
    label: 'Summary Report', 
    description: 'Overview of key metrics and statistics',
    icon: 'BarChart3'
  },
  CASES: { 
    label: 'Detailed Cases Report', 
    description: 'Comprehensive case details and information',
    icon: 'FileText'
  },
  ANALYTICS: { 
    label: 'Analytics Report', 
    description: 'Trends and analytical insights',
    icon: 'TrendingUp'
  },
  EXPORT: { 
    label: 'Data Export', 
    description: 'Export data in various formats',
    icon: 'Download'
  },
} as const;

// 📧 Email Templates
export const EMAIL_TEMPLATES = {
  WELCOME: {
    subject: 'Welcome to CaselogPro2 - SGBV Case Management System',
    template: 'welcome',
  },
  PASSWORD_RESET: {
    subject: 'Password Reset Request - CaselogPro2',
    template: 'password-reset',
  },
  CASE_ASSIGNED: {
    subject: 'New Case Assigned - CaselogPro2',
    template: 'case-assigned',
  },
  CASE_APPROVED: {
    subject: 'Case Approved - CaselogPro2',
    template: 'case-approved',
  },
} as const;

// 🔍 Search Configuration
export const SEARCH_CONFIG = {
  minQueryLength: 2,
  maxResults: 50,
  debounceDelay: 300, // milliseconds
  highlightTag: 'mark',
} as const;

// 📱 File Upload Configuration
export const FILE_UPLOAD = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
  maxFiles: 10,
} as const;

// 🎯 Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
  PASSWORD_WEAK: 'Password must contain uppercase, lowercase, and numbers',
  PHONE_INVALID: 'Please enter a valid phone number',
  DATE_INVALID: 'Please enter a valid date',
  FILE_TOO_LARGE: 'File size must be less than 10MB',
  FILE_TYPE_INVALID: 'File type not allowed',
} as const;

// 🌍 Nigerian States Configuration
export const NIGERIAN_STATES = [
  { code: 'AB', name: 'Abia State', capital: 'Umuahia' },
  { code: 'AD', name: 'Adamawa State', capital: 'Yola' },
  { code: 'AK', name: 'Akwa Ibom State', capital: 'Uyo' },
  { code: 'AN', name: 'Anambra State', capital: 'Awka' },
  { code: 'BA', name: 'Bauchi State', capital: 'Bauchi' },
  { code: 'BY', name: 'Bayelsa State', capital: 'Yenagoa' },
  { code: 'BE', name: 'Benue State', capital: 'Makurdi' },
  { code: 'BO', name: 'Borno State', capital: 'Maiduguri' },
  { code: 'CR', name: 'Cross River State', capital: 'Calabar' },
  { code: 'DE', name: 'Delta State', capital: 'Asaba' },
  { code: 'EB', name: 'Ebonyi State', capital: 'Abakaliki' },
  { code: 'ED', name: 'Edo State', capital: 'Benin City' },
  { code: 'EK', name: 'Ekiti State', capital: 'Ado Ekiti' },
  { code: 'EN', name: 'Enugu State', capital: 'Enugu' },
  { code: 'FC', name: 'Federal Capital Territory', capital: 'Abuja' },
  { code: 'GM', name: 'Gombe State', capital: 'Gombe' },
  { code: 'IM', name: 'Imo State', capital: 'Owerri' },
  { code: 'JI', name: 'Jigawa State', capital: 'Dutse' },
  { code: 'KD', name: 'Kaduna State', capital: 'Kaduna' },
  { code: 'KN', name: 'Kano State', capital: 'Kano' },
  { code: 'KT', name: 'Katsina State', capital: 'Katsina' },
  { code: 'KB', name: 'Kebbi State', capital: 'Birnin Kebbi' },
  { code: 'KG', name: 'Kogi State', capital: 'Lokoja' },
  { code: 'KW', name: 'Kwara State', capital: 'Ilorin' },
  { code: 'LA', name: 'Lagos State', capital: 'Ikeja' },
  { code: 'NA', name: 'Nasarawa State', capital: 'Keffi' },
  { code: 'NI', name: 'Niger State', capital: 'Minna' },
  { code: 'OG', name: 'Ogun State', capital: 'Abeokuta' },
  { code: 'OD', name: 'Ondo State', capital: 'Akure' },
  { code: 'OS', name: 'Osun State', capital: 'Osogbo' },
  { code: 'OY', name: 'Oyo State', capital: 'Ibadan' },
  { code: 'PL', name: 'Plateau State', capital: 'Jos' },
  { code: 'RV', name: 'Rivers State', capital: 'Port Harcourt' },
  { code: 'SO', name: 'Sokoto State', capital: 'Sokoto' },
  { code: 'TR', name: 'Taraba State', capital: 'Jalingo' },
  { code: 'YO', name: 'Yobe State', capital: 'Damaturu' },
  { code: 'ZM', name: 'Zamfara State', capital: 'Gusau' },
] as const;

// 🔐 Default Credentials (for development/testing)
export const DEFAULT_CREDENTIALS = {
  password: 'admin123',
  stateAdminPattern: '{state}.admin',
  federalAdmin: 'nadmin.admin',
} as const;

// 📊 Export Formats
export const EXPORT_FORMATS = {
  EXCEL: { 
    label: 'Excel (.xlsx)', 
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extension: '.xlsx'
  },
  PDF: { 
    label: 'PDF (.pdf)', 
    mimeType: 'application/pdf',
    extension: '.pdf'
  },
  CSV: { 
    label: 'CSV (.csv)', 
    mimeType: 'text/csv',
    extension: '.csv'
  },
} as const;

// 🎯 Helper Functions
export const getCaseStatusLabel = (status: keyof typeof CASE_STATUS) => CASE_STATUS[status].label;
export const getCaseStatusColor = (status: keyof typeof CASE_STATUS) => CASE_STATUS[status].color;
export const getAccessLevelLabel = (level: keyof typeof ACCESS_LEVELS) => ACCESS_LEVELS[level].label;
export const getStateByCode = (code: string) => NIGERIAN_STATES.find(state => state.code === code);
export const getStateByName = (name: string) => NIGERIAN_STATES.find(state => state.name === name);
