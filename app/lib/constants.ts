// ============================================================================
// ENUMS & ROLES
// ============================================================================

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  DESIGNER = 'DESIGNER',
  MARKETER = 'MARKETER',
  CLIENT = 'CLIENT',
}

export enum SubscriptionPlan {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export enum MerchantStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum LeadStage {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  INTERESTED = 'INTERESTED',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  WON = 'WON',
  LOST = 'LOST',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED',
  BLOCKED = 'BLOCKED',
}

// ============================================================================
// BOROZ SERVICES (10 Services)
// ============================================================================

export const BOROZ_SERVICES = [
  {
    id: 'service-01',
    name: 'تخصيص متجر سلة',
    description: 'تخصيص شامل لمتجرك على سلة حسب احتياجاتك',
    basePrice: 2500,
    currency: 'SAR',
    estimatedDays: 10,
    isActive: true,
  },
  {
    id: 'service-02',
    name: 'إدارة المتجر',
    description: 'إدارة يومية وأسبوعية لمتجرك',
    basePrice: 0,
    currency: 'SAR',
    estimatedDays: -1,
    isActive: true,
  },
  {
    id: 'service-03',
    name: 'تصميم واجهات المتجر',
    description: 'تصميم واجهة مستخدم حديثة واحترافية',
    basePrice: 3000,
    currency: 'SAR',
    estimatedDays: 14,
    isActive: true,
  },
  {
    id: 'service-04',
    name: 'تطوير وتحسين المتجر',
    description: 'تطوير وتحسين أداء متجرك',
    basePrice: 5000,
    currency: 'SAR',
    estimatedDays: 30,
    isActive: true,
  },
  {
    id: 'service-05',
    name: 'تصميم البنرات',
    description: 'تصميم بنرات عالية الجودة لمتجرك',
    basePrice: 1500,
    currency: 'SAR',
    estimatedDays: 7,
    isActive: true,
  },
  {
    id: 'service-06',
    name: 'تصميم الهوية البصرية',
    description: 'تصميم هوية بصرية شاملة ومتكاملة',
    basePrice: 3000,
    currency: 'SAR',
    estimatedDays: 14,
    isActive: true,
  },
  {
    id: 'service-07',
    name: 'إدارة الحملات الإعلانية',
    description: 'إدارة وتنفيذ حملات إعلانية فعالة',
    basePrice: 4000,
    currency: 'SAR',
    estimatedDays: 30,
    isActive: true,
  },
  {
    id: 'service-08',
    name: 'كتابة المحتوى التسويقي',
    description: 'كتابة محتوى تسويقي احترافي وجذاب',
    basePrice: 2000,
    currency: 'SAR',
    estimatedDays: 14,
    isActive: true,
  },
  {
    id: 'service-09',
    name: 'إنشاء صفحات الهبوط',
    description: 'تصميم وتطوير صفحات هبوط احترافية',
    basePrice: 2500,
    currency: 'SAR',
    estimatedDays: 7,
    isActive: true,
  },
  {
    id: 'service-10',
    name: 'تحسين SEO للمتجر',
    description: 'تحسين ترتيب متجرك في محركات البحث',
    basePrice: 3500,
    currency: 'SAR',
    estimatedDays: 45,
    isActive: true,
  },
];

// ============================================================================
// STATUS STYLING
// ============================================================================

export const STATUS_COLORS: Record<string, string> = {
  // Orders
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  REVIEW: 'bg-orange-100 text-orange-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',

  // Leads
  NEW: 'bg-slate-100 text-slate-800',
  CONTACTED: 'bg-blue-100 text-blue-800',
  INTERESTED: 'bg-cyan-100 text-cyan-800',
  PROPOSAL: 'bg-purple-100 text-purple-800',
  NEGOTIATION: 'bg-orange-100 text-orange-800',
  WON: 'bg-green-100 text-green-800',
  LOST: 'bg-red-100 text-red-800',

  // Merchant
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-slate-100 text-slate-800',
  SUSPENDED: 'bg-red-100 text-red-800',

  // Tasks
  TODO: 'bg-slate-100 text-slate-800',
  BLOCKED: 'bg-red-100 text-red-800',

  // Projects
  PLANNING: 'bg-slate-100 text-slate-800',
  ON_HOLD: 'bg-orange-100 text-orange-800',
};

// ============================================================================
// API ROUTES
// ============================================================================

export const API_ROUTES = {
  // Auth
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REGISTER: '/api/auth/register',

  // Organizations
  ORGS: '/api/org',
  ORG_DETAIL: (orgId: string) => `/api/org/${orgId}`,
  ORG_MEMBERS: (orgId: string) => `/api/org/${orgId}/members`,

  // Merchants
  MERCHANTS: (orgId: string) => `/api/org/${orgId}/merchants`,
  MERCHANT_DETAIL: (orgId: string, merchantId: string) =>
    `/api/org/${orgId}/merchants/${merchantId}`,

  // Leads
  LEADS: (orgId: string) => `/api/org/${orgId}/leads`,
  LEAD_DETAIL: (orgId: string, leadId: string) =>
    `/api/org/${orgId}/leads/${leadId}`,

  // Orders
  ORDERS: (orgId: string) => `/api/org/${orgId}/orders`,
  ORDER_DETAIL: (orgId: string, orderId: string) =>
    `/api/org/${orgId}/orders/${orderId}`,

  // Services
  SERVICES: '/api/services',
  SERVICE_DETAIL: (serviceId: string) => `/api/services/${serviceId}`,

  // Projects
  PROJECTS: (orgId: string) => `/api/org/${orgId}/projects`,
  PROJECT_DETAIL: (orgId: string, projectId: string) =>
    `/api/org/${orgId}/projects/${projectId}`,

  // Tasks
  TASKS: (orgId: string) => `/api/org/${orgId}/tasks`,
  TASK_DETAIL: (orgId: string, taskId: string) =>
    `/api/org/${orgId}/tasks/${taskId}`,

  // Reports
  REPORTS: (orgId: string) => `/api/org/${orgId}/reports`,
};

// ============================================================================
// DATE FORMATS
// ============================================================================

export const DATE_FORMAT = {
  SHORT: 'dd/MM/yyyy',
  LONG: 'EEEE، dd MMMM yyyy',
  TIME: 'HH:mm:ss',
  DATETIME: 'dd/MM/yyyy HH:mm',
};

// ============================================================================
// PAGINATION
// ============================================================================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// ============================================================================
// VALIDATION
// ============================================================================

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^(\+966|0)[0-9]{9}$/,
  SLUG_REGEX: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  PASSWORD_MIN_LENGTH: 8,
};
