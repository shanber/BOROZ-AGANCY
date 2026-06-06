import { Role, MerchantStatus, LeadStage, OrderStatus, ProjectStatus, TaskStatus, SubscriptionPlan } from './constants';

/**
 * User types
 */
export interface UserSession {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  isActive: boolean;
}

export interface UserWithOrg extends UserSession {
  orgMembers: OrganizationMember[];
}

/**
 * Organization types
 */
export interface OrganizationMember {
  id: string;
  userId: string;
  orgId: string;
  role: Role;
  isActive: boolean;
  joinedAt: Date;
  organization: Organization;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  website: string | null;
  isActive: boolean;
  plan?: OrganizationPlanType;
}

export interface OrganizationPlanType {
  id: string;
  orgId: string;
  plan: SubscriptionPlan;
  monthlyLimit: number;
  currentMonth: number;
  renewalDate: Date | null;
}

/**
 * Merchant types
 */
export interface Merchant {
  id: string;
  orgId: string;
  storeName: string;
  storeUrl: string;
  email: string;
  phone: string;
  contactName: string | null;
  status: MerchantStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * Lead types
 */
export interface Lead {
  id: string;
  orgId: string;
  name: string;
  phone: string;
  email: string;
  storeUrl: string | null;
  source: string | null;
  stage: LeadStage;
  notes: string | null;
  merchantId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * Service types
 */
export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  estimatedDays: number;
  isActive: boolean;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Order types
 */
export interface ServiceOrder {
  id: string;
  orgId: string;
  merchantId: string;
  serviceId: string;
  description: string;
  status: OrderStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * Project types
 */
export interface Project {
  id: string;
  orgId: string;
  name: string;
  merchantId: string;
  serviceId: string;
  orderId: string;
  status: ProjectStatus;
  startDate: Date | null;
  dueDate: Date | null;
  completedDate: Date | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * Task types
 */
export interface Task {
  id: string;
  orgId: string;
  projectId: string;
  title: string;
  description: string | null;
  assignedToId: string | null;
  status: TaskStatus;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * File types
 */
export interface FileAsset {
  id: string;
  orgId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number | null;
  fileType: string | null;
  uploadedBy: string | null;
  orderId: string | null;
  projectId: string | null;
  taskId: string | null;
  createdAt: Date;
}

/**
 * Notification types
 */
export interface Notification {
  id: string;
  orgId: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  readAt: Date | null;
}

/**
 * API Response types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface ApiPaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Form types
 */
export interface FormError {
  field: string;
  message: string;
}

export interface FormState {
  errors: FormError[];
  success: boolean;
  message?: string;
}
