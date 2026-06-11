import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getApprovedProviderContext, providerOpportunityOrderStatuses } from '@/app/lib/provider-opportunities';
import { clearCachePrefix } from '@/app/lib/server-cache';
import { createNotification } from '@/app/lib/notifications';

export const dynamic = 'force-dynamic';

const FIELD_LIMITS = {
  scopeSummary: 500,
  deliverables: 800,
  assumptions: 500,
  exclusions: 500,
  messageToMerchant: 500,
};

function parsePositiveNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parseNonNegativeInteger(value: unknown) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

export async function POST(request: Request, { params }: { params: { orderId: string } }) {
  try {
    const providerContext = await getApprovedProviderContext();
    if ('error' in providerContext) {
      return NextResponse.json({ error: providerContext.error }, { status: providerContext.status });
    }

    const invitation = await prisma.offerInvitation.findFirst({
      where: {
        expertProfileId: providerContext.expertProfile.id,
        order: {
          OR: [{ id: params.orderId }, { orderNumber: params.orderId }],
          status: { in: [...providerOpportunityOrderStatuses] },
        },
      },
      include: {
        order: {
          select: {
            id: true,
            status: true,
            orgId: true,
            userId: true,
            orderNumber: true,
          },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: 'لا يمكنك تقديم عرض على هذا الطلب' }, { status: 404 });
    }

    const existingOffer = await prisma.offer.findUnique({
      where: {
        orderId_expertProfileId: {
          orderId: invitation.order.id,
          expertProfileId: providerContext.expertProfile.id,
        },
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (existingOffer && ['DRAFT', 'SUBMITTED', 'ACCEPTED'].includes(existingOffer.status)) {
      return NextResponse.json({ error: 'لقد تم تقديم عرض فعّال مسبقاً على هذا الطلب' }, { status: 409 });
    }

    const body = await request.json();
    const price = parsePositiveNumber(body.price);
    const deliveryDays = parsePositiveNumber(body.deliveryDays);
    const revisionsIncluded = parseNonNegativeInteger(body.revisionsIncluded);
    const scopeSummary = String(body.scopeSummary || '').trim();
    const deliverables = String(body.deliverables || '').trim();
    const assumptions = String(body.assumptions || '').trim();
    const exclusions = String(body.exclusions || '').trim();
    const messageToMerchant = String(body.messageToMerchant || '').trim();

    const fields: string[] = [];
    if (!price) fields.push('price');
    if (!deliveryDays) fields.push('deliveryDays');
    if (!scopeSummary || scopeSummary.length < 20) fields.push('scopeSummary');
    if (!deliverables || deliverables.length < 10) fields.push('deliverables');
    if (revisionsIncluded === null) fields.push('revisionsIncluded');
    if (scopeSummary.length > FIELD_LIMITS.scopeSummary) fields.push('scopeSummaryLimit');
    if (deliverables.length > FIELD_LIMITS.deliverables) fields.push('deliverablesLimit');
    if (assumptions.length > FIELD_LIMITS.assumptions) fields.push('assumptionsLimit');
    if (exclusions.length > FIELD_LIMITS.exclusions) fields.push('exclusionsLimit');
    if (messageToMerchant.length > FIELD_LIMITS.messageToMerchant) fields.push('messageToMerchantLimit');

    if (fields.length > 0) {
      const messages: Record<string, string> = {
        price: 'يرجى إدخال سعر واضح للعرض.',
        deliveryDays: 'يرجى تحديد مدة التنفيذ بالأيام.',
        scopeSummary: 'يرجى كتابة ملخص واضح لنطاق العمل.',
        deliverables: 'يرجى تحديد المخرجات التي سيتسلمها التاجر.',
        revisionsIncluded: 'يرجى تحديد عدد المراجعات المتضمنة.',
        scopeSummaryLimit: `ملخص نطاق العمل يجب ألا يتجاوز ${FIELD_LIMITS.scopeSummary} حرفاً.`,
        deliverablesLimit: `المخرجات يجب ألا تتجاوز ${FIELD_LIMITS.deliverables} حرفاً.`,
        assumptionsLimit: `الافتراضات يجب ألا تتجاوز ${FIELD_LIMITS.assumptions} حرفاً.`,
        exclusionsLimit: `الاستثناءات يجب ألا تتجاوز ${FIELD_LIMITS.exclusions} حرفاً.`,
        messageToMerchantLimit: `رسالة التاجر يجب ألا تتجاوز ${FIELD_LIMITS.messageToMerchant} حرفاً.`,
      };

      return NextResponse.json(
        {
          error: 'بيانات العرض غير مكتملة',
          fields,
          message: messages[fields[0]] || 'يرجى استكمال بيانات العرض المطلوبة.',
        },
        { status: 400 }
      );
    }

    const submittedAt = new Date();

    const offer = await prisma.$transaction(async (tx) => {
      const savedOffer = await tx.offer.upsert({
        where: {
          orderId_expertProfileId: {
            orderId: invitation.order.id,
            expertProfileId: providerContext.expertProfile.id,
          },
        },
        update: {
          status: 'SUBMITTED',
          price: price!,
          deliveryDays: Math.round(deliveryDays!),
          scopeSummary,
          deliverables,
          revisionsIncluded: revisionsIncluded!,
          assumptions,
          exclusions,
          messageToMerchant,
          submittedAt,
        },
        create: {
          orderId: invitation.order.id,
          expertProfileId: providerContext.expertProfile.id,
          status: 'SUBMITTED',
          price: price!,
          deliveryDays: Math.round(deliveryDays!),
          scopeSummary,
          deliverables,
          revisionsIncluded: revisionsIncluded!,
          assumptions,
          exclusions,
          messageToMerchant,
          submittedAt,
        },
      });

      await tx.offerInvitation.update({
        where: { id: invitation.id },
        data: { status: 'OFFER_SUBMITTED' },
      });

      if (invitation.order.status === 'APPROVED_FOR_OFFERS') {
        await tx.order.update({
          where: { id: invitation.order.id },
          data: {
            status: 'COLLECTING_OFFERS',
            offersOpenedAt: invitation.order.status === 'APPROVED_FOR_OFFERS' ? new Date() : undefined,
          },
        });
        }

      if (invitation.order.userId && invitation.order.orgId) {
        await createNotification(tx, {
          orgId: invitation.order.orgId,
          userId: invitation.order.userId,
          type: 'OFFER_RECEIVED',
          title: 'وصل عرض جديد',
          message: 'وصلك عرض جديد على طلبك. راجع العروض واختر الأنسب داخل بروز.',
          entityType: 'OFFER',
          entityId: savedOffer.id,
          url: `/dashboard/offers/${encodeURIComponent(invitation.order.orderNumber)}`,
          dedupeWindowMinutes: 1,
        });
      }

      return savedOffer;
    });

    clearCachePrefix('orders:');
    clearCachePrefix('orders-page:');

    return NextResponse.json({
      id: offer.id,
      status: offer.status,
      submittedAt: offer.submittedAt,
      message: 'تم تقديم العرض بنجاح',
    });
  } catch (error) {
    console.error('Provider offer submission error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال العرض' },
      { status: 500 }
    );
  }
}
