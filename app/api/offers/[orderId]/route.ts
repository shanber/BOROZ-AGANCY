import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { merchantOrderOwnershipFilter } from '@/app/lib/order-access';
import { getOrderStatusLabel } from '@/app/lib/order-status';
import { getProviderDisplayName } from '@/app/lib/provider-opportunities';
import { resolveServiceLabel } from '@/app/lib/services';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { orderId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.globalRole !== 'MERCHANT') {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 403 });
    }

    const ownerFilter = merchantOrderOwnershipFilter(session);

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
        storeName: true,
        serviceType: true,
        description: true,
        notes: true,
        priority: true,
        budget: true,
        status: true,
        selectedOfferId: true,
        offersClosedAt: true,
        offers: {
          where: {
            status: { in: ['SUBMITTED', 'ACCEPTED', 'REJECTED'] },
          },
          orderBy: [{ acceptedAt: 'desc' }, { submittedAt: 'asc' }],
          select: {
            id: true,
            status: true,
            price: true,
            deliveryDays: true,
            scopeSummary: true,
            deliverables: true,
            revisionsIncluded: true,
            assumptions: true,
            exclusions: true,
            messageToMerchant: true,
            submittedAt: true,
            acceptedAt: true,
            expertProfile: {
              select: {
                specialtyTitle: true,
                yearsOfExperience: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'لم يتم العثور على الطلب' }, { status: 404 });
    }

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        storeName: order.storeName,
        serviceLabel: resolveServiceLabel(order.serviceType),
        description: order.description,
        notes: order.notes || null,
        priority: order.priority,
        budget: order.budget || null,
        status: order.status,
        statusLabel: getOrderStatusLabel(order.status),
        selectedOfferId: order.selectedOfferId,
        offersClosedAt: order.offersClosedAt,
      },
      offers: order.offers.map((offer) => ({
        id: offer.id,
        status: offer.status,
        price: offer.price,
        deliveryDays: offer.deliveryDays,
        scopeSummary: offer.scopeSummary,
        deliverables: offer.deliverables,
        revisionsIncluded: offer.revisionsIncluded,
        assumptions: offer.assumptions,
        exclusions: offer.exclusions,
        messageToMerchant: offer.messageToMerchant,
        submittedAt: offer.submittedAt,
        acceptedAt: offer.acceptedAt,
        providerDisplayName: getProviderDisplayName(offer.expertProfile),
        providerSpecialty: offer.expertProfile.specialtyTitle || null,
        yearsOfExperience: offer.expertProfile.yearsOfExperience || null,
      })),
    });
  } catch (error) {
    console.error('Merchant offers detail error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحميل عروض الطلب' }, { status: 500 });
  }
}
