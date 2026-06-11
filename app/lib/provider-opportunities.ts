import { getServerSession } from 'next-auth';
import { OfferInvitationStatus, OfferStatus, ProviderApprovalStatus } from '@prisma/client';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { getOrderStatusLabel } from '@/app/lib/order-status';

export const providerOpportunityOrderStatuses = ['APPROVED_FOR_OFFERS', 'COLLECTING_OFFERS'] as const;
export const merchantOfferOrderStatuses = ['APPROVED_FOR_OFFERS', 'COLLECTING_OFFERS', 'OFFER_SELECTED'] as const;

const orderServiceSlugMap: Record<string, string[]> = {
  'salla-customize': [
    'salla-storefront-customization',
    'store-interface-modification',
    'create-custom-sections',
    'css-customization',
    'js-customization',
    'product-page-optimization',
    'cart-checkout-optimization',
    'ux-optimization',
    'cro-optimization',
    'mobile-experience-optimization',
    'interface-bug-fixing',
  ],
  seo: ['seo-services', 'seo-product-descriptions', 'current-content-optimization', 'seo-articles-writing'],
  'landing-page-design': ['landing-page-design', 'landing-page-copywriting'],
};

export const offerInvitationStatusLabels: Record<OfferInvitationStatus, string> = {
  INVITED: 'تمت دعوتك',
  VIEWED: 'تمت المعاينة',
  DECLINED: 'تم الاعتذار',
  OFFER_SUBMITTED: 'تم تقديم العرض',
  EXPIRED: 'انتهت الدعوة',
};

export type ProviderOpportunitySummary = {
  id: string;
  orderNumber: string;
  serviceType: string;
  serviceLabel: string;
  status: string;
  statusLabel: string;
  invitationStatus: OfferInvitationStatus;
  invitationStatusLabel: string;
  invitedAt: string;
  expiresAt: string | null;
  storeName: string;
  budget: string | null;
  alreadySubmitted: boolean;
};

export type ProviderOpportunityDetail = {
  id: string;
  orderNumber: string;
  serviceType: string;
  serviceLabel: string;
  status: string;
  statusLabel: string;
  storeName: string;
  sallaUrl: string | null;
  budget: string | null;
  priority: string;
  description: string;
  notes: string | null;
  invitationStatus: OfferInvitationStatus;
  invitationStatusLabel: string;
  invitedAt: string;
  expiresAt: string | null;
  existingOffer: {
    id: string;
    status: OfferStatus;
    submittedAt: string | null;
  } | null;
};

export async function getApprovedProviderContext() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.globalRole !== 'PROVIDER') {
    return { error: 'غير مصرح لك بالوصول', status: 403 as const };
  }

  if (session.user.approvalStatus !== ProviderApprovalStatus.APPROVED) {
    return { error: 'لا يمكنك الوصول إلى هذه الصفحة قبل اعتماد الحساب', status: 403 as const };
  }

  const expertProfile = await prisma.expertProfile.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true,
      approvalStatus: true,
      userId: true,
      specialtyTitle: true,
    },
  });

  if (!expertProfile || expertProfile.approvalStatus !== ProviderApprovalStatus.APPROVED) {
    return { error: 'لم يتم العثور على ملف خبير معتمد لهذا الحساب', status: 403 as const };
  }

  return { session, expertProfile };
}

export function getOrderMatchingServiceSlugs(serviceType?: string | null) {
  if (!serviceType) return [];
  return orderServiceSlugMap[serviceType] || [serviceType];
}

export function getProviderDisplayName(expertProfile: {
  specialtyTitle?: string | null;
  user?: { name?: string | null } | null;
}) {
  return expertProfile.specialtyTitle?.trim() || expertProfile.user?.name?.trim() || 'خبير بروز';
}

export function mapOpportunitySummary(invitation: any): ProviderOpportunitySummary {
  const invitationStatus = invitation.status as OfferInvitationStatus;

  return {
    id: invitation.order.id,
    orderNumber: invitation.order.orderNumber,
    serviceType: invitation.order.serviceType,
    serviceLabel: invitation.order.service?.nameAr || invitation.order.serviceType,
    status: invitation.order.status,
    statusLabel: getOrderStatusLabel(invitation.order.status),
    invitationStatus,
    invitationStatusLabel: offerInvitationStatusLabels[invitationStatus],
    invitedAt: invitation.invitedAt.toISOString(),
    expiresAt: invitation.expiresAt ? invitation.expiresAt.toISOString() : null,
    storeName: invitation.order.storeName,
    budget: invitation.order.budget || null,
    alreadySubmitted: Boolean(invitation.order.offers?.length),
  };
}

export function mapOpportunityDetail(invitation: any): ProviderOpportunityDetail {
  const invitationStatus = invitation.status as OfferInvitationStatus;
  const existingOffer = invitation.order.offers?.[0] || null;

  return {
    id: invitation.order.id,
    orderNumber: invitation.order.orderNumber,
    serviceType: invitation.order.serviceType,
    serviceLabel: invitation.order.service?.nameAr || invitation.order.serviceType,
    status: invitation.order.status,
    statusLabel: getOrderStatusLabel(invitation.order.status),
    storeName: invitation.order.storeName,
    sallaUrl: invitation.order.sallaUrl || null,
    budget: invitation.order.budget || null,
    priority: invitation.order.priority,
    description: invitation.order.description,
    notes: invitation.order.notes || null,
    invitationStatus,
    invitationStatusLabel: offerInvitationStatusLabels[invitationStatus],
    invitedAt: invitation.invitedAt.toISOString(),
    expiresAt: invitation.expiresAt ? invitation.expiresAt.toISOString() : null,
    existingOffer: existingOffer
      ? {
          id: existingOffer.id,
          status: existingOffer.status,
          submittedAt: existingOffer.submittedAt ? existingOffer.submittedAt.toISOString() : null,
        }
      : null,
  };
}
