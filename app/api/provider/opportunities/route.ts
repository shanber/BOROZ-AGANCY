import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import {
  getApprovedProviderContext,
  mapOpportunitySummary,
  providerOpportunityOrderStatuses,
} from '@/app/lib/provider-opportunities';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const providerContext = await getApprovedProviderContext();
    if ('error' in providerContext) {
      return NextResponse.json({ error: providerContext.error }, { status: providerContext.status });
    }

    const invitations = await prisma.offerInvitation.findMany({
      where: {
        expertProfileId: providerContext.expertProfile.id,
        order: {
          status: { in: [...providerOpportunityOrderStatuses] },
        },
      },
      orderBy: [{ invitedAt: 'desc' }],
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            storeName: true,
            serviceType: true,
            budget: true,
            status: true,
            service: {
              select: {
                nameAr: true,
              },
            },
            offers: {
              where: { expertProfileId: providerContext.expertProfile.id },
              select: { id: true },
            },
          },
        },
      },
    });

    return NextResponse.json(invitations.map(mapOpportunitySummary));
  } catch (error) {
    console.error('Provider opportunities list error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحميل الفرص المتاحة' },
      { status: 500 }
    );
  }
}
