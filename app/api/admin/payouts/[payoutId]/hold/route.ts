import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import { createNotificationsForUsers } from '@/app/lib/notifications';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { payoutId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.globalRole !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 403 });
    }

    const body = await request.json();
    const holdReason = String(body.holdReason || '').trim();
    if (!holdReason) {
      return NextResponse.json({ error: 'يرجى ذكر سبب الإيقاف' }, { status: 400 });
    }
    if (holdReason.length > 1000) {
      return NextResponse.json({ error: 'سبب الإيقاف طويل جدًا (الحد الأقصى 1000 حرف)' }, { status: 400 });
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
          },
        },
      },
    });

    if (!payout) {
      return NextResponse.json({ error: 'لم يتم العثور على طلب الصرف' }, { status: 404 });
    }

    if (payout.status !== 'PENDING_REVIEW' && payout.status !== 'APPROVED') {
      return NextResponse.json({ error: 'يمكن فقط إيقاف صرف في حالة "بانتظار المراجعة" أو "معتمد"' }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.providerPayout.update({
        where: { id: payout.id },
        data: {
          status: 'ON_HOLD',
          holdReason,
          reviewedById: session.user.id,
          reviewedAt: new Date(),
        },
      });

      await createNotificationsForUsers(tx, [
        { userId: payout.providerId, orgId: payout.project.orgId },
      ], {
        type: 'PAYOUT_HELD',
        title: 'تم إيقاف صرف مستحقاتك',
        message: `تم إيقاف صرف مستحقاتك مؤقتًا: ${holdReason}`,
        entityType: 'project',
        entityId: payout.project.id,
        url: `/dashboard/projects/${payout.project.id}`,
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payout hold error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إيقاف الصرف' }, { status: 500 });
  }
}
