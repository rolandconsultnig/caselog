// 🔐 Authentication Configuration - Human-readable auth settings

import { APP_CONFIG, DEFAULT_CREDENTIALS } from './constants';

export const AUTH_CONFIG = {
  // 🎯 Session Configuration
  session: {
    strategy: 'jwt' as const,
    maxAge: APP_CONFIG.sessionDuration, // 8 hours
    updateAge: 24 * 60 * 60, // 24 hours
  },

  // 🌐 Application URLs
  urls: {
    baseUrl: APP_CONFIG.baseUrl,
    apiBaseUrl: APP_CONFIG.apiBaseUrl,
    callbackUrl: `${APP_CONFIG.baseUrl}/api/auth/callback`,
    signInUrl: '/auth/signin',
    signOutUrl: '/auth/signout',
    errorUrl: '/auth/error',
  },

  // 🔑 Default Credentials
  credentials: {
    defaultPassword: DEFAULT_CREDENTIALS.password,
    stateAdminPattern: DEFAULT_CREDENTIALS.stateAdminPattern,
    federalAdmin: DEFAULT_CREDENTIALS.federalAdmin,
  },

  // 📧 Email Configuration
  email: {
    from: APP_CONFIG.emailFrom,
    support: APP_CONFIG.supportEmail,
    verificationSubject: 'Verify your email - CaselogPro2',
    resetSubject: 'Reset your password - CaselogPro2',
    welcomeSubject: 'Welcome to CaselogPro2',
  },

  // 🔒 Security Settings
  security: {
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: false,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    sessionTimeout: APP_CONFIG.maxSessionAge,
  },

  // 🎨 UI Configuration
  ui: {
    brandName: APP_CONFIG.fullName,
    shortName: APP_CONFIG.name,
    logoUrl: '/images/logo.png',
    faviconUrl: '/favicon.ico',
    primaryColor: '#2563eb',
    theme: 'light',
  },

  // 📱 Redirect Configuration
  redirects: {
    afterLogin: '/dashboard',
    afterLogout: '/auth/signin',
    afterSignUp: '/auth/signin',
    afterPasswordReset: '/auth/signin',
  },

  // 🔍 User Roles and Permissions
  roles: {
    // Minimum role required for dashboard access
    dashboardAccess: ['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'LEVEL_5', 'SUPER_ADMIN', 'APP_ADMIN'],
    
    // Roles that can manage users
    userManagement: ['LEVEL_4', 'LEVEL_5', 'SUPER_ADMIN', 'APP_ADMIN'],
    
    // Roles that can generate reports
    reportGeneration: ['LEVEL_3', 'LEVEL_4', 'LEVEL_5', 'SUPER_ADMIN', 'APP_ADMIN'],
    
    // Roles that can access admin panel
    adminPanel: ['SUPER_ADMIN', 'APP_ADMIN'],
    
    // Roles that can manage system settings
    systemManagement: ['SUPER_ADMIN', 'APP_ADMIN'],
  },

  // 🌍 Multi-tenant Configuration
  tenant: {
    // Federal users can access all states
    federalAccess: ['SUPER_ADMIN', 'APP_ADMIN', 'LEVEL_5'],
    
    // State users can only access their own state
    stateAccess: ['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4'],
    
    // Default tenant type for new users
    defaultTenantType: 'STATE',
    
    // Federal tenant code
    federalTenantCode: 'FED',
  },

  // 📊 Audit Configuration
  audit: {
    logAllActions: true,
    logFailedLogins: true,
    logPasswordChanges: true,
    logRoleChanges: true,
    logTenantChanges: true,
    retentionDays: 365,
  },

  // 🔄 Token Configuration
  tokens: {
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d',
    resetTokenExpiry: '1h',
    verificationTokenExpiry: '24h',
  },

  // 🚀 Feature Flags
  features: {
    emailVerification: true,
    passwordReset: true,
    twoFactorAuth: false, // Can be enabled in future
    socialLogin: false, // Can be enabled for Google, Microsoft, etc.
    rememberMe: true,
    autoLogout: true,
    passwordStrengthIndicator: true,
  },

  // 📝 Messages
  messages: {
    loginSuccess: 'Welcome back! You have successfully logged in.',
    loginError: 'Invalid username or password. Please try again.',
    logoutSuccess: 'You have been successfully logged out.',
    accessDenied: 'You do not have permission to access this resource.',
    sessionExpired: 'Your session has expired. Please log in again.',
    accountLocked: 'Your account has been locked due to multiple failed login attempts.',
    passwordResetSent: 'Password reset instructions have been sent to your email.',
    emailVerified: 'Your email has been successfully verified.',
  },

  // 🎯 Validation Rules
  validation: {
    username: {
      minLength: 3,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9._-]+$/,
      message: 'Username must be 3-50 characters and contain only letters, numbers, dots, hyphens, and underscores',
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    },
    password: {
      minLength: 8,
      maxLength: 128,
      message: 'Password must be at least 8 characters long',
    },
  },
} as const;

// 🎯 Helper Functions
export const getLoginRedirectUrl = (role: string) => {
  // Redirect based on user role
  switch (role) {
    case 'SUPER_ADMIN':
    case 'APP_ADMIN':
      return '/dashboard/admin';
    case 'LEVEL_5':
      return '/dashboard/federal';
    default:
      return '/dashboard';
  }
};

export const hasPermission = (userRole: string, requiredRole: string[]) => {
  return requiredRole.includes(userRole);
};

export const canAccessDashboard = (userRole: string) => {
  return AUTH_CONFIG.roles.dashboardAccess.includes(
    userRole as (typeof AUTH_CONFIG.roles.dashboardAccess)[number]
  );
};

export const canManageUsers = (userRole: string) => {
  return AUTH_CONFIG.roles.userManagement.includes(
    userRole as (typeof AUTH_CONFIG.roles.userManagement)[number]
  );
};

export const canGenerateReports = (userRole: string) => {
  return AUTH_CONFIG.roles.reportGeneration.includes(
    userRole as (typeof AUTH_CONFIG.roles.reportGeneration)[number]
  );
};

export const canAccessAdminPanel = (userRole: string) => {
  return AUTH_CONFIG.roles.adminPanel.includes(
    userRole as (typeof AUTH_CONFIG.roles.adminPanel)[number]
  );
};

export const isFederalUser = (userRole: string) => {
  return AUTH_CONFIG.tenant.federalAccess.includes(
    userRole as (typeof AUTH_CONFIG.tenant.federalAccess)[number]
  );
};

export const isStateUser = (userRole: string) => {
  return AUTH_CONFIG.tenant.stateAccess.includes(
    userRole as (typeof AUTH_CONFIG.tenant.stateAccess)[number]
  );
};

// 🔐 Password Validation
export const validatePassword = (password: string) => {
  const config = AUTH_CONFIG.security;
  const errors: string[] = [];

  if (password.length < config.passwordMinLength) {
    errors.push(`Password must be at least ${config.passwordMinLength} characters long`);
  }

  if (config.passwordRequireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (config.passwordRequireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (config.passwordRequireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (config.passwordRequireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 📧 Email Templates
export const getEmailTemplate = (type: 'welcome' | 'reset' | 'verification') => {
  const templates = {
    welcome: {
      subject: AUTH_CONFIG.email.welcomeSubject,
      body: `Welcome to ${AUTH_CONFIG.ui.brandName}! Your account has been successfully created.`,
    },
    reset: {
      subject: AUTH_CONFIG.email.resetSubject,
      body: `You requested a password reset for your ${AUTH_CONFIG.ui.brandName} account.`,
    },
    verification: {
      subject: AUTH_CONFIG.email.verificationSubject,
      body: `Please verify your email address for your ${AUTH_CONFIG.ui.brandName} account.`,
    },
  };

  return templates[type];
};
