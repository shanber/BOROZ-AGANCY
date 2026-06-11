import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import { createNotificationsForUsers } from '@/app/lib/notifications';

export const dynamic = 'force-dynamic';

export async function POST(
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
        status: true,
        providerId: true,
        project: {
          select: {
            id: true,
            orgId: true,
            order: {
              select: { orderNumber: true },
            },
          },
        },
      },
    });

    if (!payout) {
      return NextResponse.json({ error: 'لم يتم العثور على طلب الصرف' }, { status: 404 });
    }

    if (payout.status !== 'APPROVED') {
      return NextResponse.json({ error: 'يمكن فقط تأكيد صرف للحالة "معتمد للصرف"' }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.providerPayout.update({
        where: { id: payout.id },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          reviewedById: session.user.id,
          reviewedAt: new Date(),
        },
      });

      await createNotificationsForUsers(tx, [
        { userId: payout.providerId, orgId: payout.project.orgId },
      ], {
        type: 'PAYOUT_PAID',
        title: 'تم صرف مستحقاتك',
        message: `تم صرف مستحقات مشروع ${payout.project.order.orderNumber}`,
        entityType: 'project',
        entityId: payout.project.id,
        url: `/dashboard/projects/${payout.project.id}`,
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payout mark-paid error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تأكيد الصرف' }, { status: 500 });
  }
}
