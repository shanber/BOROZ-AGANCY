import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { getOrderStatusLabel } from '@/app/lib/order-status';
import { merchantOrderOwnershipFilter } from '@/app/lib/order-access';
import { merchantOfferOrderStatuses } from '@/app/lib/provider-opportunities';
import { resolveServiceLabel } from '@/app/lib/services';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.globalRole !== 'MERCHANT') {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 403 });
    }

    const ownerFilter = merchantOrderOwnershipFilter(session);

    const orders = await prisma.order.findMany({
      where: {
        AND: [
          ownerFilter,
          {
            status: { in: [...merchantOfferOrderStatuses] },
          },
          {
            offers: {
              some: {
                status: { in: ['SUBMITTED', 'ACCEPTED', 'REJECTED'] },
              },
            },
          },
        ],
      },
      orderBy: [{ updatedAt: 'desc' }],
      select: {
        id: true,
        orderNumber: true,
        storeName: true,
        serviceType: true,
        status: true,
        selectedOfferId: true,
        createdAt: true,
        offers: {
          where: {
            status: { in: ['SUBMITTED', 'ACCEPTED', 'REJECTED'] },
          },
          select: { id: true },
        },
      },
    });

    return NextResponse.json(
      orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        storeName: order.storeName,
        serviceLabel: resolveServiceLabel(order.serviceType),
        status: order.status,
        statusLabel: getOrderStatusLabel(order.status),
        offersCount: order.offers.length,
        selectedOfferId: order.selectedOfferId,
        createdAt: order.createdAt,
      }))
    );
  } catch (error) {
    console.error('Merchant offers list error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحميل العروض' }, { status: 500 });
  }
}
