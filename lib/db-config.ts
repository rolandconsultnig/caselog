// 🗄️ Database Configuration - Human-readable database settings

import { APP_CONFIG } from './constants';

export const DB_CONFIG = {
  // 🔗 Connection Configuration
  connection: {
    url: process.env.DATABASE_URL,
    poolTimeout: 30000, // 30 seconds
    connectionTimeout: 10000, // 10 seconds
    idleTimeout: 600000, // 10 minutes
    maxConnections: 20,
    minConnections: 5,
  },

  // 📊 Query Configuration
  queries: {
    timeout: 30000, // 30 seconds
    retryAttempts: APP_CONFIG.retryAttempts,
    retryDelay: APP_CONFIG.retryDelay,
    defaultPageSize: APP_CONFIG.defaultPageSize,
    maxPageSize: APP_CONFIG.maxPageSize,
  },

  // 🗂️ Table Configuration
  tables: {
    users: {
      tableName: 'User',
      indexes: ['email', 'username', 'tenantId', 'accessLevel'],
      uniqueFields: ['email', 'username'],
    },
    cases: {
      tableName: 'Case',
      indexes: ['caseNumber', 'status', 'tenantId', 'createdById', 'createdAt'],
      uniqueFields: ['caseNumber', 'mojCaseNumber'],
    },
    tenants: {
      tableName: 'Tenant',
      indexes: ['code', 'type'],
      uniqueFields: ['code'],
    },
    auditLogs: {
      tableName: 'AuditLog',
      indexes: ['userId', 'action', 'entityType', 'createdAt'],
    },
  },

  // 🔍 Search Configuration
  search: {
    minQueryLength: 2,
    maxResults: 50,
    fuzzySearch: true,
    highlightResults: true,
  },

  // 📈 Analytics Configuration
  analytics: {
    retentionDays: 365,
    aggregationIntervals: ['hourly', 'daily', 'weekly', 'monthly'],
    defaultInterval: 'daily',
  },

  // 🗃️ Backup Configuration
  backup: {
    enabled: process.env.NODE_ENV === 'production',
    frequency: 'daily',
    retentionDays: 30,
    compression: true,
  },

  // 🚀 Performance Configuration
  performance: {
    enableQueryCache: true,
    cacheTimeout: 300000, // 5 minutes
    enableConnectionPooling: true,
    enableLazyLoading: true,
    batchInsertSize: 1000,
  },

  // 🔒 Security Configuration
  security: {
    encryptSensitiveFields: true,
    auditAllQueries: false,
    logSlowQueries: true,
    slowQueryThreshold: 5000, // 5 seconds
    enableRowLevelSecurity: true,
  },

  // 🌍 Multi-tenant Configuration
  tenant: {
    enableTenantIsolation: true,
    defaultTenantFilter: true,
    tenantIdField: 'tenantId',
    federalTenantCode: 'FED',
  },

  // 📊 Reporting Configuration
  reporting: {
    maxReportRows: 100000,
    defaultDateRange: 30, // days
    maxDateRange: 365, // days
    enableCaching: true,
    cacheTimeout: 600000, // 10 minutes
  },

  // 🧪 Testing Configuration
  testing: {
    testDatabaseUrl: process.env.DATABASE_TEST_URL,
    enableTestIsolation: true,
    cleanupAfterTest: true,
    seedTestData: true,
  },
} as const;

// 🎯 Helper Functions
export const getTableName = (model: keyof typeof DB_CONFIG.tables) => {
  return DB_CONFIG.tables[model].tableName;
};

export const getTableIndexes = (model: keyof typeof DB_CONFIG.tables) => {
  return DB_CONFIG.tables[model].indexes;
};

export const getUniqueFields = (model: keyof typeof DB_CONFIG.tables) => {
  const table = DB_CONFIG.tables[model];
  return 'uniqueFields' in table ? table.uniqueFields : [];
};

export const getRetryConfig = () => {
  return {
    attempts: DB_CONFIG.queries.retryAttempts,
    delay: DB_CONFIG.queries.retryDelay,
  };
};

export const getPaginationConfig = () => {
  return {
    defaultPageSize: DB_CONFIG.queries.defaultPageSize,
    maxPageSize: DB_CONFIG.queries.maxPageSize,
  };
};

export const isSlowQuery = (duration: number) => {
  return duration > DB_CONFIG.security.slowQueryThreshold;
};

export const shouldEncryptField = (fieldName: string) => {
  const sensitiveFields = ['password', 'email', 'phoneNumber', 'address'];
  return DB_CONFIG.security.encryptSensitiveFields && sensitiveFields.includes(fieldName);
};

// 🗄️ Database Health Check
export const performHealthCheck = async () => {
  const checks = {
    connection: false,
    queryExecution: false,
    indexing: false,
    memory: false,
  };

  try {
    // These would be actual database health checks
    // For now, returning mock results
    checks.connection = true;
    checks.queryExecution = true;
    checks.indexing = true;
    checks.memory = true;
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  return {
    healthy: Object.values(checks).every(Boolean),
    checks,
    timestamp: new Date().toISOString(),
  };
};

// 📊 Query Builder Helpers
export const buildTenantFilter = (tenantId: string, isFederal: boolean = false) => {
  if (isFederal) {
    return {}; // Federal users can see all tenants
  }
  return { tenantId };
};

export const buildDateFilter = (startDate?: string, endDate?: string) => {
  const filter: { gte?: Date; lte?: Date } = {};
  
  if (startDate) {
    filter.gte = new Date(startDate);
  }
  
  if (endDate) {
    filter.lte = new Date(endDate);
  }
  
  return Object.keys(filter).length > 0 ? { createdAt: filter } : {};
};

export const buildSearchFilter = (searchTerm: string, searchFields: string[]) => {
  if (!searchTerm || searchTerm.length < DB_CONFIG.search.minQueryLength) {
    return {};
  }

  const searchConditions = searchFields.map(field => ({
    [field]: {
      contains: searchTerm,
      mode: 'insensitive' as const,
    },
  }));

  return {
    OR: searchConditions,
  };
};

// 🚀 Performance Monitoring
export const logQueryPerformance = (query: string, duration: number, rowCount?: number) => {
  const logData = {
    query: query.substring(0, 100), // First 100 chars
    duration,
    rowCount,
    isSlow: isSlowQuery(duration),
    timestamp: new Date().toISOString(),
  };

  if (logData.isSlow) {
    console.warn('Slow query detected:', logData);
  }

  // In production, you'd send this to your monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Send to monitoring service
  }
};

// 🗃️ Backup Utilities
export const createBackupPlan = () => {
  return {
    enabled: DB_CONFIG.backup.enabled,
    frequency: DB_CONFIG.backup.frequency,
    retentionDays: DB_CONFIG.backup.retentionDays,
    compression: DB_CONFIG.backup.compression,
    nextBackup: calculateNextBackupTime(),
  };
};

const calculateNextBackupTime = () => {
  const now = new Date();
  const nextBackup = new Date(now);
  nextBackup.setDate(nextBackup.getDate() + 1);
  nextBackup.setHours(2, 0, 0, 0); // 2 AM
  return nextBackup;
};

// 🔐 Security Utilities
export const sanitizeQuery = (query: string) => {
  // Remove potential SQL injection patterns
  return query.replace(/['";\\]/g, '');
};

export const validateTenantAccess = (userTenantId: string, resourceTenantId: string, isFederal: boolean) => {
  return isFederal || userTenantId === resourceTenantId;
};
