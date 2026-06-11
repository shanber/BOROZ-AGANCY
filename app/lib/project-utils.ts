import type { Session } from 'next-auth';
import { Prisma, ProjectStatus, UserRole } from '@prisma/client';
import { getOrderMatchingServiceSlugs } from '@/app/lib/provider-opportunities';
import { resolveServiceLabel } from '@/app/lib/services';

export const projectStatusLabels: Record<ProjectStatus, string> = {
  KICKOFF_PENDING: 'بانتظار تجهيز التنفيذ',
  ACTIVE: 'قيد التنفيذ',
  PAUSED: 'متوقف مؤقتاً',
  DELIVERED: 'تم التسليم',
  REVISION_REQUESTED: 'طلب تعديل',
  PENDING: 'قيد التجهيز',
  IN_PROGRESS: 'قيد التنفيذ',
  ON_HOLD: 'متوقف مؤقتاً',
  COMPLETED: 'مكتمل',
  CANCELLED: 'ملغي',
};

export function getProjectStatusLabel(status?: ProjectStatus | string | null) {
  if (!status) return projectStatusLabels.KICKOFF_PENDING;
  return projectStatusLabels[status as ProjectStatus] || status;
}

export function getProjectStatusStyle(status?: ProjectStatus | string | null) {
  switch (status) {
    case 'ACTIVE':
    case 'IN_PROGRESS':
      return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
    case 'KICKOFF_PENDING':
    case 'PENDING':
      return 'bg-violet-50 text-violet-700 border border-violet-200';
    case 'PAUSED':
    case 'ON_HOLD':
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'DELIVERED':
      return 'bg-teal-50 text-teal-700 border border-teal-200';
    case 'COMPLETED':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'CANCELLED':
    default:
      return 'bg-slate-100 text-slate-600 border border-slate-200';
  }
}

// Project statuses where new messages can be sent. The messages API and the
// project UI share this single list so the UI never allows a submit the API
// rejects (or vice-versa). Messaging stays open through the whole execution +
// revision flow; only terminal states close it (COMPLETED = read-only history,
// CANCELLED = closed).
export const messagingAllowedStatuses = [
  'KICKOFF_PENDING',
  'PENDING',
  'ACTIVE',
  'IN_PROGRESS',
  'IN_EXECUTION',
  'PAUSED',
  'ON_HOLD',
  'DELIVERED',
  'REVISION_REQUESTED',
] as const;

export function canSendProjectMessage(status?: ProjectStatus | string | null) {
  return (messagingAllowedStatuses as readonly string[]).includes(String(status ?? ''));
}

/**
 * Returns null when messaging is allowed, otherwise the Arabic reason to show
 * in a disabled composer (history stays visible either way).
 */
export function getMessagingBlockedReason(status?: ProjectStatus | string | null): string | null {
  if (canSendProjectMessage(status)) return null;
  if (status === 'COMPLETED') {
    return 'اكتمل المشروع، ويمكنك مراجعة سجل المحادثة فقط.';
  }
  return 'لا يمكن إرسال رسائل جديدة بعد إغلاق المشروع، ويمكنك مراجعة سجل المحادثة فقط.';
}

export function projectOwnershipWhere(session: Session) {
  if (session.user.globalRole === 'ADMIN') {
    return {};
  }

  if (session.user.globalRole === 'PROVIDER') {
    return {
      acceptedOffer: {
        expertProfile: {
          userId: session.user.id,
        },
      },
    };
  }

  return {
    order: {
      userId: session.user.id,
    },
  };
}

export function getProjectParticipantWhere(session: Session, projectId?: string) {
  const idFilter = projectId ? { id: projectId } : {};

  if (session.user.globalRole === 'ADMIN') {
    return idFilter;
  }

  if (session.user.globalRole === 'PROVIDER') {
    return {
      ...idFilter,
      acceptedOffer: {
        expertProfile: {
          userId: session.user.id,
        },
      },
    };
  }

  return {
    ...idFilter,
    order: {
      userId: session.user.id,
    },
  };
}

export function getRoleLabel(role?: UserRole | string | null) {
  switch (role) {
    case 'ADMIN':
      return 'إدارة بروز';
    case 'PROVIDER':
      return 'مقدم خدمة';
    case 'MERCHANT':
    default:
      return 'تاجر';
  }
}

export async function ensureProjectFromSelectedOffer(
  tx: Prisma.TransactionClient,
  orderId: string
) {
  const order = await tx.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      orderNumber: true,
      orgId: true,
      merchantId: true,
      serviceId: true,
      serviceType: true,
      storeName: true,
      description: true,
      selectedOfferId: true,
      project: {
        select: { id: true },
      },
      selectedOffer: {
        select: {
          id: true,
          status: true,
          expertProfileId: true,
          price: true,
          deliveryDays: true,
          scopeSummary: true,
          deliverables: true,
          revisionsIncluded: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error('لم يتم العثور على الطلب المرتبط بالمشروع');
  }

  if (order.project) {
    return { projectId: order.project.id, created: false };
  }

  if (!order.selectedOfferId || !order.selectedOffer || order.selectedOffer.status !== 'ACCEPTED') {
    throw new Error('لا يمكن إنشاء مشروع بدون عرض مختار ومعتمد');
  }

  const merchantFallback = !order.orgId && order.merchantId
    ? await tx.merchant.findUnique({
        where: { id: order.merchantId },
        select: { orgId: true },
      })
    : null;

  const resolvedOrgId = order.orgId || merchantFallback?.orgId || null;

  if (!resolvedOrgId) {
    throw new Error('تعذر تجهيز المشروع لأن بيانات المؤسسة المرتبطة بالطلب غير مكتملة');
  }

  const canonicalService = order.serviceId
    ? { id: order.serviceId }
    : await tx.service.findFirst({
        where: {
          slug: { in: getOrderMatchingServiceSlugs(order.serviceType) },
          isActive: true,
        },
        select: { id: true },
      });

  const now = new Date();
  const dueAt = new Date(now.getTime() + order.selectedOffer.deliveryDays * 24 * 60 * 60 * 1000);

  const project = await tx.project.create({
    data: {
      orgId: resolvedOrgId,
      merchantId: order.merchantId || null,
      serviceId: canonicalService?.id || null,
      orderId: order.id,
      acceptedOfferId: order.selectedOffer.id,
      expertProfileId: order.selectedOffer.expertProfileId,
      name: `${resolveServiceLabel(order.serviceType)} - ${order.storeName}`,
      description: order.description,
      scopeSummary: order.selectedOffer.scopeSummary,
      deliverables: order.selectedOffer.deliverables,
      price: order.selectedOffer.price,
      deliveryDays: order.selectedOffer.deliveryDays,
      revisionsIncluded: order.selectedOffer.revisionsIncluded,
      status: 'KICKOFF_PENDING',
      dueDate: dueAt,
    },
    select: {
      id: true,
    },
  });

  return { projectId: project.id, created: true };
}
