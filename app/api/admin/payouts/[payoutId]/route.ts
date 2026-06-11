import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: { payoutId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.globalRole !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 403 });
    }

    const payout = await prisma.providerPayout.findUnique({
      where: { id: params.payoutId },
      select: {
        id: true,
        grossAmount: true,
        platformFee: true,
        amount: true,
        status: true,
        holdReason: true,
        createdAt: true,
        reviewedAt: true,
        paidAt: true,
        reviewedBy: {
          select: { name: true },
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
            completedDate: true,
            scopeSummary: true,
            deliverables: true,
            price: true,
            deliveryDays: true,
            revisionsIncluded: true,
            acceptedOffer: {
              select: {
                id: true,
                price: true,
                deliveryDays: true,
                scopeSummary: true,
                deliverables: true,
                messageToMerchant: true,
                expertProfile: {
                  select: {
                    id: true,
                    specialtyTitle: true,
                    user: { select: { id: true, name: true, email: true } },
                  },
                },
              },
            },
            order: {
              select: {
                id: true,
                orderNumber: true,
                storeName: true,
                serviceType: true,
                user: { select: { id: true, name: true, email: true } },
              },
            },
            deliveries: {
              orderBy: { submittedAt: 'desc' },
              select: {
                id: true,
                status: true,
                title: true,
                description: true,
                submittedAt: true,
                approvedAt: true,
                submittedBy: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    if (!payout) {
      return NextResponse.json({ error: 'لم يتم العثور على طلب الصرف' }, { status: 404 });
    }

    return NextResponse.json({ payout });
  } catch (error) {
    console.error('Payout detail error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحميل طلب الصرف' }, { status: 500 });
  }
}
