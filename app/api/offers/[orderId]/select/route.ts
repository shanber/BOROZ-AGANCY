import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { merchantOrderOwnershipFilter } from '@/app/lib/order-access';
import { clearCachePrefix } from '@/app/lib/server-cache';
import { ensureProjectFromSelectedOffer } from '@/app/lib/project-utils';
import { createNotification } from '@/app/lib/notifications';

export const dynamic = 'force-dynamic';

export async function POST(request: Request, { params }: { params: { orderId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.globalRole !== 'MERCHANT') {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 403 });
    }

    const ownerFilter = merchantOrderOwnershipFilter(session);
    const body = await request.json();
    const offerId = String(body.offerId || '').trim();

    if (!offerId) {
      return NextResponse.json({ error: 'يرجى تحديد العرض المراد اختياره' }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        AND: [
          ownerFilter,
          { OR: [{ id: params.orderId }, { orderNumber: params.orderId }] },
        ],
      },
      select: {
        id: true,
        orderNumber: true,
        orgId: true,
        status: true,
        selectedOfferId: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'لم يتم العثور على الطلب' }, { status: 404 });
    }

    if (!['APPROVED_FOR_OFFERS', 'COLLECTING_OFFERS'].includes(order.status)) {
      return NextResponse.json({ error: 'لا يمكن اختيار عرض في الحالة الحالية للطلب' }, { status: 409 });
    }

    if (order.selectedOfferId) {
      return NextResponse.json({ error: 'تم اختيار عرض لهذا الطلب مسبقاً' }, { status: 409 });
    }

    const offer = await prisma.offer.findFirst({
      where: {
        id: offerId,
        orderId: order.id,
        status: 'SUBMITTED',
      },
      select: {
        id: true,
        expertProfile: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!offer) {
      return NextResponse.json({ error: 'العرض المحدد غير صالح أو لم يعد متاحاً' }, { status: 404 });
    }

    const now = new Date();

    const result = await prisma.$transaction(async (tx) => {
      await tx.offer.update({
        where: { id: offer.id },
        data: {
          status: 'ACCEPTED',
          acceptedAt: now,
        },
      });

      await tx.offer.updateMany({
        where: {
          orderId: order.id,
          id: { not: offer.id },
          status: { in: ['SUBMITTED', 'DRAFT'] },
        },
        data: {
          status: 'REJECTED',
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          selectedOfferId: offer.id,
          status: 'OFFER_SELECTED',
          offersClosedAt: now,
        },
      });

      const projectResult = await ensureProjectFromSelectedOffer(tx, order.id);

      if (offer.expertProfile.userId && order.orgId) {
        await createNotification(tx, {
          orgId: order.orgId,
          userId: offer.expertProfile.userId,
          type: 'OFFER_ACCEPTED',
          title: 'تم قبول عرضك',
          message: 'تم قبول عرضك، وتم إنشاء مشروع جديد داخل بروز.',
          entityType: 'PROJECT',
          entityId: projectResult.projectId,
          url: `/dashboard/projects/${projectResult.projectId}`,
          dedupeWindowMinutes: 2,
        });
      }

      return projectResult;
    });

    clearCachePrefix('orders:');
    clearCachePrefix('orders-page:');
    clearCachePrefix('admin-requests:');
    clearCachePrefix('admin-requests-page:');
    clearCachePrefix('projects:');
    clearCachePrefix('projects-page:');

    return NextResponse.json({
      message: 'تم اختيار العرض بنجاح',
      selectedOffer: { id: offer.id, status: 'ACCEPTED' },
      projectId: result.projectId,
      nextStepUrl: `/dashboard/projects/${result.projectId}`,
    });
  } catch (error) {
    console.error('Select offer error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء اختيار العرض' }, { status: 500 });
  }
}
