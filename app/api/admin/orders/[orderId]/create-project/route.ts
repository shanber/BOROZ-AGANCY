import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { ensureProjectFromSelectedOffer } from '@/app/lib/project-utils';
import { clearCachePrefix } from '@/app/lib/server-cache';

export const dynamic = 'force-dynamic';

export async function POST(_request: Request, { params }: { params: { orderId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.globalRole !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح لك بإنشاء مشروع من هذا الطلب' }, { status: 403 });
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: params.orderId }, { orderNumber: params.orderId }],
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        selectedOfferId: true,
        project: {
          select: {
            id: true,
          },
        },
        selectedOffer: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'لم يتم العثور على الطلب' }, { status: 404 });
    }

    if (!order.selectedOfferId || !order.selectedOffer || order.selectedOffer.status !== 'ACCEPTED') {
      return NextResponse.json({ error: 'لا يمكن إنشاء مشروع قبل وجود عرض مختار ومعتمد' }, { status: 409 });
    }

    if (order.status !== 'OFFER_SELECTED' && !order.selectedOfferId) {
      return NextResponse.json({ error: 'هذا الطلب ليس جاهزاً لإنشاء مشروع بعد' }, { status: 409 });
    }

    const result = await prisma.$transaction(async (tx) => {
      return ensureProjectFromSelectedOffer(tx, order.id);
    });

    clearCachePrefix('orders:');
    clearCachePrefix('orders-page:');
    clearCachePrefix('projects:');
    clearCachePrefix('projects-page:');
    clearCachePrefix('admin-requests:');
    clearCachePrefix('admin-requests-page:');

    return NextResponse.json({
      projectId: result.projectId,
      nextStepUrl: `/dashboard/projects/${result.projectId}`,
      message: result.created ? 'تم إنشاء المشروع من العرض المختار' : 'المشروع موجود مسبقاً لهذا الطلب',
    });
  } catch (error) {
    console.error('Admin create project from offer error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'حدث خطأ أثناء إنشاء المشروع' }, { status: 500 });
  }
}
