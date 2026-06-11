-- CreateEnum
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserRole') THEN CREATE TYPE "UserRole" AS ENUM ('MERCHANT', 'PROVIDER', 'ADMIN'); END IF; END$$;

-- CreateEnum
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER', 'DESIGNER', 'MARKETER', 'CLIENT', 'EXPERT'); END IF; END$$;

-- CreateEnum
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SubscriptionPlan') THEN CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'STARTER', 'PRO', 'ENTERPRISE'); END IF; END$$;

-- CreateEnum
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'NotificationType') THEN CREATE TYPE "NotificationType" AS ENUM ('OFFER_RECEIVED', 'OFFER_ACCEPTED', 'PROJECT_CREATED', 'PROJECT_STARTED', 'PROJECT_MESSAGE_RECEIVED', 'DELIVERY_SUBMITTED', 'DELIVERY_APPROVED', 'DELIVERY_REVISION_REQUESTED', 'PAYOUT_APPROVED', 'PAYOUT_HELD', 'PAYOUT_PAID', 'GENERAL'); END IF; END$$;

-- CreateEnum
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PayoutStatus') THEN CREATE TYPE "PayoutStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'ON_HOLD', 'PAID', 'CANCELLED'); END IF; END$$;

-- CreateEnum
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MerchantStatus') THEN CREATE TYPE "MerchantStatus" AS ENUM ('NEW', 'CONTACTED', 'QUOTE_SENT', 'NEGOTIATING', 'CLIENT', 'REJECTED'); END IF; END$$;

-- CreateEnum
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'LeadStage') THEN CREATE TYPE "LeadStage" AS ENUM ('NEW', 'CONTACTED', 'QUOTE_SENT', 'NEGOTIATING', 'CLIENT', 'REJECTED'); END IF; END$$;

-- CreateEnum
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ServiceStatus') THEN CREATE TYPE "ServiceStatus" AS ENUM ('AVAILABLE', 'LIMITED', 'COMING_SOON', 'DISABLED'); END IF; END$$;

-- CreateEnum
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ProviderApprovalStatus') THEN CREATE TYPE "ProviderApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'); END IF; END$$;

-- CreateEnum
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'OrderStatus') THEN CREATE TYPE "OrderStatus" AS ENUM ('NEW', 'WAITING_REQUIREMENTS', 'IN_PROGRESS', 'AWAITING_REVIEW', 'COMPLETED', 'CANCELLED'); END IF; END$$;

-- CreateEnum
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ProjectStatus') THEN CREATE TYPE "ProjectStatus" AS ENUM ('KICKOFF_PENDING', 'ACTIVE', 'PAUSED', 'DELIVERED', 'REVISION_REQUESTED', 'PENDING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'); END IF; END$$;

-- CreateEnum
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'DeliveryStatus') THEN CREATE TYPE "DeliveryStatus" AS ENUM ('SUBMITTED', 'APPROVED', 'REVISION_REQUESTED', 'CANCELLED'); END IF; END$$;

-- CreateEnum
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TaskStatus') THEN CREATE TYPE "TaskStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'AWAITING_CLIENT', 'COMPLETED'); END IF; END$$;

-- CreateEnum
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'OfferStatus') THEN CREATE TYPE "OfferStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'WITHDRAWN', 'ACCEPTED', 'REJECTED', 'EXPIRED'); END IF; END$$;

-- CreateEnum
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'OfferInvitationStatus') THEN CREATE TYPE "OfferInvitationStatus" AS ENUM ('INVITED', 'VIEWED', 'DECLINED', 'OFFER_SUBMITTED', 'EXPIRED'); END IF; END$$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "city" TEXT,
    "country" TEXT,
    "storeName" TEXT,
    "storeUrl" TEXT,
    "businessType" TEXT,
    "companyName" TEXT,
    "storeNotes" TEXT,
    "preferredContact" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "globalRole" "UserRole" NOT NULL DEFAULT 'MERCHANT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "website" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "organization_members" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PROJECT_MANAGER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "organization_plans" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE',
    "monthlyLimit" INTEGER NOT NULL DEFAULT 10,
    "currentMonth" INTEGER NOT NULL DEFAULT 0,
    "renewalDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "notifications" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'GENERAL',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "url" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "merchants" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "storeName" TEXT NOT NULL,
    "storeUrl" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "contactName" TEXT,
    "status" "MerchantStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "merchants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "leads" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "storeUrl" TEXT,
    "source" TEXT,
    "stage" "LeadStage" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "merchantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "service_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "services" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT,
    "name" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "descriptionAr" TEXT,
    "descriptionEn" TEXT,
    "status" "ServiceStatus" NOT NULL DEFAULT 'AVAILABLE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "expert_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "specialtyTitle" TEXT,
    "bio" TEXT,
    "yearsOfExperience" INTEGER,
    "portfolioUrl" TEXT,
    "linkedinUrl" TEXT,
    "availability" TEXT,
    "priceRangeMin" DOUBLE PRECISION,
    "priceRangeMax" DOUBLE PRECISION,
    "preferredProjectTypes" TEXT,
    "sallaExperience" TEXT,
    "approvalStatus" "ProviderApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expert_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "portfolio_items" (
    "id" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "projectUrl" TEXT,
    "fileUrl" TEXT,
    "serviceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolio_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "expert_services" (
    "id" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "startingPrice" DOUBLE PRECISION,
    "typicalDeliveryDays" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expert_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "service_orders" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "service_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "projects" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "merchantId" TEXT,
    "serviceId" TEXT,
    "orderId" TEXT NOT NULL,
    "acceptedOfferId" TEXT,
    "expertProfileId" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'KICKOFF_PENDING',
    "startDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "description" TEXT,
    "scopeSummary" TEXT,
    "deliverables" TEXT,
    "price" DOUBLE PRECISION,
    "deliveryDays" INTEGER,
    "revisionsIncluded" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "project_messages" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "senderUserId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "project_deliveries" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "submittedById" TEXT NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'SUBMITTED',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deliverableLinks" TEXT,
    "revisionNote" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "revisionRequestedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "provider_payouts" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "platformFee" DOUBLE PRECISION NOT NULL,
    "grossAmount" DOUBLE PRECISION NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "holdReason" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_payouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "tasks" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assignedToId" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "file_assets" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "fileType" TEXT,
    "uploadedBy" TEXT,
    "orderId" TEXT,
    "projectId" TEXT,
    "taskId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "landing_pages" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "ctaText" TEXT NOT NULL DEFAULT '╪¬┘ê╪º╪╡┘ä ┘à╪╣┘å╪º',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "landing_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "landing_page_submissions" (
    "id" TEXT NOT NULL,
    "landingPageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT,
    "storeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "landing_page_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "salla_stores" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "storeUrl" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "connectedAt" TIMESTAMP(3),
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salla_stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "activity_logs" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "serviceOrderId" TEXT,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "userId" TEXT,
    "orgId" TEXT,
    "merchantId" TEXT,
    "storeName" TEXT NOT NULL,
    "managerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "sallaUrl" TEXT,
    "serviceType" TEXT NOT NULL,
    "serviceId" TEXT,
    "budget" TEXT,
    "priority" TEXT NOT NULL DEFAULT '╪╣╪º╪»┘è',
    "description" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "adminNote" TEXT,
    "internalNote" TEXT,
    "selectedOfferId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "source" TEXT NOT NULL DEFAULT 'website',
    "offersOpenedAt" TIMESTAMP(3),
    "offersClosedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "offers" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "expertProfileId" TEXT NOT NULL,
    "status" "OfferStatus" NOT NULL DEFAULT 'SUBMITTED',
    "price" DOUBLE PRECISION NOT NULL,
    "deliveryDays" INTEGER NOT NULL,
    "scopeSummary" TEXT NOT NULL,
    "deliverables" TEXT NOT NULL,
    "revisionsIncluded" INTEGER NOT NULL,
    "assumptions" TEXT NOT NULL,
    "exclusions" TEXT NOT NULL,
    "messageToMerchant" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "offer_invitations" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "expertProfileId" TEXT NOT NULL,
    "status" "OfferInvitationStatus" NOT NULL DEFAULT 'INVITED',
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offer_invitations_pkey" PRIMARY KEY ("id")
);


-- Missing columns for existing tables (never added by migrations 1-5)
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "selectedOfferId" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "offersOpenedAt" TIMESTAMP(3);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "offersClosedAt" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "bio" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "country" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "storeName" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "storeUrl" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "businessType" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "companyName" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "storeNotes" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "preferredContact" TEXT;
ALTER TABLE "expert_profiles" ADD COLUMN IF NOT EXISTS "availability" TEXT;
ALTER TABLE "expert_profiles" ADD COLUMN IF NOT EXISTS "priceRangeMin" DOUBLE PRECISION;
ALTER TABLE "expert_profiles" ADD COLUMN IF NOT EXISTS "priceRangeMax" DOUBLE PRECISION;
ALTER TABLE "expert_profiles" ADD COLUMN IF NOT EXISTS "preferredProjectTypes" TEXT;
ALTER TABLE "expert_profiles" ADD COLUMN IF NOT EXISTS "sallaExperience" TEXT;
-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "organization_members_orgId_idx" ON "organization_members"("orgId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "organization_members_userId_idx" ON "organization_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "organization_members_userId_orgId_key" ON "organization_members"("userId", "orgId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "organization_plans_orgId_key" ON "organization_plans"("orgId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "organization_plans_orgId_idx" ON "organization_plans"("orgId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "notifications_orgId_idx" ON "notifications"("orgId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "notifications_isRead_idx" ON "notifications"("isRead");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "merchants_orgId_idx" ON "merchants"("orgId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "merchants_status_idx" ON "merchants"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "merchants_deletedAt_idx" ON "merchants"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "merchants_orgId_email_key" ON "merchants"("orgId", "email");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "leads_orgId_idx" ON "leads"("orgId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "leads_stage_idx" ON "leads"("stage");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "leads_merchantId_idx" ON "leads"("merchantId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "leads_deletedAt_idx" ON "leads"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "leads_orgId_email_key" ON "leads"("orgId", "email");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "service_categories_name_key" ON "service_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "service_categories_nameAr_key" ON "service_categories"("nameAr");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "service_categories_nameEn_key" ON "service_categories"("nameEn");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "service_categories_slug_key" ON "service_categories"("slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "service_categories_isActive_idx" ON "service_categories"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "services_name_key" ON "services"("name");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "services_nameAr_key" ON "services"("nameAr");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "services_nameEn_key" ON "services"("nameEn");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "services_slug_key" ON "services"("slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "services_isActive_idx" ON "services"("isActive");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "services_categoryId_idx" ON "services"("categoryId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "services_status_idx" ON "services"("status");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "expert_profiles_userId_key" ON "expert_profiles"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "expert_profiles_approvalStatus_idx" ON "expert_profiles"("approvalStatus");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "portfolio_items_expertId_idx" ON "portfolio_items"("expertId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "expert_services_expertId_serviceId_key" ON "expert_services"("expertId", "serviceId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "service_orders_orgId_idx" ON "service_orders"("orgId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "service_orders_merchantId_idx" ON "service_orders"("merchantId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "service_orders_serviceId_idx" ON "service_orders"("serviceId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "service_orders_status_idx" ON "service_orders"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "service_orders_deletedAt_idx" ON "service_orders"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "projects_orderId_key" ON "projects"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "projects_acceptedOfferId_key" ON "projects"("acceptedOfferId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "projects_orgId_idx" ON "projects"("orgId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "projects_merchantId_idx" ON "projects"("merchantId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "projects_acceptedOfferId_idx" ON "projects"("acceptedOfferId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "projects_expertProfileId_idx" ON "projects"("expertProfileId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "projects_status_idx" ON "projects"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "projects_deletedAt_idx" ON "projects"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "projects_orgId_orderId_key" ON "projects"("orgId", "orderId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "project_messages_projectId_createdAt_idx" ON "project_messages"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "project_messages_senderUserId_idx" ON "project_messages"("senderUserId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "project_messages_isInternal_idx" ON "project_messages"("isInternal");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "project_deliveries_projectId_status_idx" ON "project_deliveries"("projectId", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "project_deliveries_submittedById_idx" ON "project_deliveries"("submittedById");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "provider_payouts_projectId_key" ON "provider_payouts"("projectId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "provider_payouts_providerId_idx" ON "provider_payouts"("providerId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "provider_payouts_status_idx" ON "provider_payouts"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "tasks_orgId_idx" ON "tasks"("orgId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "tasks_projectId_idx" ON "tasks"("projectId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "tasks_assignedToId_idx" ON "tasks"("assignedToId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "tasks_status_idx" ON "tasks"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "tasks_deletedAt_idx" ON "tasks"("deletedAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "file_assets_orgId_idx" ON "file_assets"("orgId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "file_assets_orderId_idx" ON "file_assets"("orderId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "file_assets_projectId_idx" ON "file_assets"("projectId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "file_assets_taskId_idx" ON "file_assets"("taskId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "landing_pages_orgId_idx" ON "landing_pages"("orgId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "landing_pages_isPublished_idx" ON "landing_pages"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "landing_pages_orgId_slug_key" ON "landing_pages"("orgId", "slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "landing_page_submissions_landingPageId_idx" ON "landing_page_submissions"("landingPageId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "landing_page_submissions_email_idx" ON "landing_page_submissions"("email");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "salla_stores_merchantId_key" ON "salla_stores"("merchantId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "salla_stores_merchantId_idx" ON "salla_stores"("merchantId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "activity_logs_orgId_idx" ON "activity_logs"("orgId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "activity_logs_userId_idx" ON "activity_logs"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "activity_logs_createdAt_idx" ON "activity_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "orders_selectedOfferId_key" ON "orders"("selectedOfferId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "orders_userId_idx" ON "orders"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "orders_orgId_idx" ON "orders"("orgId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "orders_merchantId_idx" ON "orders"("merchantId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "orders_serviceId_idx" ON "orders"("serviceId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "orders_selectedOfferId_idx" ON "orders"("selectedOfferId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "orders_userId_createdAt_idx" ON "orders"("userId", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "orders_status_createdAt_idx" ON "orders"("status", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "orders_serviceType_createdAt_idx" ON "orders"("serviceType", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "offers_orderId_idx" ON "offers"("orderId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "offers_expertProfileId_idx" ON "offers"("expertProfileId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "offers_status_idx" ON "offers"("status");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "offers_orderId_expertProfileId_key" ON "offers"("orderId", "expertProfileId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "offer_invitations_orderId_idx" ON "offer_invitations"("orderId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "offer_invitations_expertProfileId_idx" ON "offer_invitations"("expertProfileId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "offer_invitations_status_idx" ON "offer_invitations"("status");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "offer_invitations_orderId_expertProfileId_key" ON "offer_invitations"("orderId", "expertProfileId");

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'organization_members_userId_fkey') THEN ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'organization_members_orgId_fkey') THEN ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'organization_plans_orgId_fkey') THEN ALTER TABLE "organization_plans" ADD CONSTRAINT "organization_plans_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'notifications_orgId_fkey') THEN ALTER TABLE "notifications" ADD CONSTRAINT "notifications_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'notifications_userId_fkey') THEN ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'merchants_orgId_fkey') THEN ALTER TABLE "merchants" ADD CONSTRAINT "merchants_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'leads_orgId_fkey') THEN ALTER TABLE "leads" ADD CONSTRAINT "leads_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'leads_merchantId_fkey') THEN ALTER TABLE "leads" ADD CONSTRAINT "leads_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'services_categoryId_fkey') THEN ALTER TABLE "services" ADD CONSTRAINT "services_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "service_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'services_organizationId_fkey') THEN ALTER TABLE "services" ADD CONSTRAINT "services_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'expert_profiles_userId_fkey') THEN ALTER TABLE "expert_profiles" ADD CONSTRAINT "expert_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portfolio_items_expertId_fkey') THEN ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'expert_services_expertId_fkey') THEN ALTER TABLE "expert_services" ADD CONSTRAINT "expert_services_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'expert_services_serviceId_fkey') THEN ALTER TABLE "expert_services" ADD CONSTRAINT "expert_services_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_orders_orgId_fkey') THEN ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_orders_merchantId_fkey') THEN ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_orders_serviceId_fkey') THEN ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_orgId_fkey') THEN ALTER TABLE "projects" ADD CONSTRAINT "projects_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_merchantId_fkey') THEN ALTER TABLE "projects" ADD CONSTRAINT "projects_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_serviceId_fkey') THEN ALTER TABLE "projects" ADD CONSTRAINT "projects_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_orderId_fkey') THEN ALTER TABLE "projects" ADD CONSTRAINT "projects_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_acceptedOfferId_fkey') THEN ALTER TABLE "projects" ADD CONSTRAINT "projects_acceptedOfferId_fkey" FOREIGN KEY ("acceptedOfferId") REFERENCES "offers"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_expertProfileId_fkey') THEN ALTER TABLE "projects" ADD CONSTRAINT "projects_expertProfileId_fkey" FOREIGN KEY ("expertProfileId") REFERENCES "expert_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'project_messages_projectId_fkey') THEN ALTER TABLE "project_messages" ADD CONSTRAINT "project_messages_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'project_messages_senderUserId_fkey') THEN ALTER TABLE "project_messages" ADD CONSTRAINT "project_messages_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'project_deliveries_projectId_fkey') THEN ALTER TABLE "project_deliveries" ADD CONSTRAINT "project_deliveries_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'project_deliveries_submittedById_fkey') THEN ALTER TABLE "project_deliveries" ADD CONSTRAINT "project_deliveries_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'provider_payouts_projectId_fkey') THEN ALTER TABLE "provider_payouts" ADD CONSTRAINT "provider_payouts_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'provider_payouts_providerId_fkey') THEN ALTER TABLE "provider_payouts" ADD CONSTRAINT "provider_payouts_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'provider_payouts_reviewedById_fkey') THEN ALTER TABLE "provider_payouts" ADD CONSTRAINT "provider_payouts_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tasks_orgId_fkey') THEN ALTER TABLE "tasks" ADD CONSTRAINT "tasks_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tasks_projectId_fkey') THEN ALTER TABLE "tasks" ADD CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tasks_assignedToId_fkey') THEN ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'file_assets_orgId_fkey') THEN ALTER TABLE "file_assets" ADD CONSTRAINT "file_assets_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'file_assets_orderId_fkey') THEN ALTER TABLE "file_assets" ADD CONSTRAINT "file_assets_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "service_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'file_assets_projectId_fkey') THEN ALTER TABLE "file_assets" ADD CONSTRAINT "file_assets_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'file_assets_taskId_fkey') THEN ALTER TABLE "file_assets" ADD CONSTRAINT "file_assets_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'landing_pages_orgId_fkey') THEN ALTER TABLE "landing_pages" ADD CONSTRAINT "landing_pages_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'landing_page_submissions_landingPageId_fkey') THEN ALTER TABLE "landing_page_submissions" ADD CONSTRAINT "landing_page_submissions_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "landing_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'salla_stores_merchantId_fkey') THEN ALTER TABLE "salla_stores" ADD CONSTRAINT "salla_stores_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'activity_logs_orgId_fkey') THEN ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'activity_logs_userId_fkey') THEN ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'activity_logs_serviceOrderId_fkey') THEN ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_serviceOrderId_fkey" FOREIGN KEY ("serviceOrderId") REFERENCES "service_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_userId_fkey') THEN ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_serviceId_fkey') THEN ALTER TABLE "orders" ADD CONSTRAINT "orders_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_selectedOfferId_fkey') THEN ALTER TABLE "orders" ADD CONSTRAINT "orders_selectedOfferId_fkey" FOREIGN KEY ("selectedOfferId") REFERENCES "offers"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'offers_orderId_fkey') THEN ALTER TABLE "offers" ADD CONSTRAINT "offers_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'offers_expertProfileId_fkey') THEN ALTER TABLE "offers" ADD CONSTRAINT "offers_expertProfileId_fkey" FOREIGN KEY ("expertProfileId") REFERENCES "expert_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'offer_invitations_orderId_fkey') THEN ALTER TABLE "offer_invitations" ADD CONSTRAINT "offer_invitations_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'offer_invitations_expertProfileId_fkey') THEN ALTER TABLE "offer_invitations" ADD CONSTRAINT "offer_invitations_expertProfileId_fkey" FOREIGN KEY ("expertProfileId") REFERENCES "expert_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END$$;


-- New enum values for existing enums (safe on both shadow and production)
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'DELIVERY_SUBMITTED';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'DELIVERY_APPROVED';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'DELIVERY_REVISION_REQUESTED';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'PAYOUT_APPROVED';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'PAYOUT_HELD';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'PAYOUT_PAID';
ALTER TYPE "ProjectStatus" ADD VALUE IF NOT EXISTS 'REVISION_REQUESTED';
