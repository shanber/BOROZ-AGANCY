import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import {
  getApprovedProviderContext,
  mapOpportunityDetail,
  providerOpportunityOrderStatuses,
} from '@/app/lib/provider-opportunities';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { orderId: string } }) {
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
            orderNumber: true,
            storeName: true,
            sallaUrl: true,
            serviceType: true,
            budget: true,
            priority: true,
            description: true,
            notes: true,
            status: true,
            service: {
              select: {
                nameAr: true,
              },
            },
            offers: {
              where: { expertProfileId: providerContext.expertProfile.id },
              select: {
                id: true,
                status: true,
                submittedAt: true,
              },
            },
          },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: 'هذه الفرصة غير متاحة لك أو لم تعد تستقبل عروضاً' }, { status: 404 });
    }

    if (invitation.status === 'INVITED') {
      await prisma.offerInvitation.update({
        where: { id: invitation.id },
        data: { status: 'VIEWED' },
      });
      invitation.status = 'VIEWED';
    }

    return NextResponse.json(mapOpportunityDetail(invitation));
  } catch (error) {
    console.error('Provider opportunity detail error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحميل تفاصيل الفرصة' },
      { status: 500 }
    );
  }
}
