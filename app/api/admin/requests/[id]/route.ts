import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import { orderReviewStatuses } from '@/app/lib/order-status';
import { clearCachePrefix } from '@/app/lib/server-cache';

type ReviewAction = 'UNDER_REVIEW' | 'APPROVED_FOR_OFFERS' | 'NEEDS_CHANGES' | 'REJECTED';

const allowedActions: ReviewAction[] = [
  'UNDER_REVIEW',
  'APPROVED_FOR_OFFERS',
  'NEEDS_CHANGES',
  'REJECTED',
];

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.globalRole !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 403 });
    }

    const body = await request.json();
    const action = String(body.action || '') as ReviewAction;
    const adminNote = body.adminNote ? String(body.adminNote).trim() : '';
    const internalNote = body.internalNote ? String(body.internalNote).trim() : '';

    if (!allowedActions.includes(action) || !orderReviewStatuses.includes(action)) {
      return NextResponse.json({ error: 'إجراء غير صالح' }, { status: 400 });
    }

    if ((action === 'NEEDS_CHANGES' || action === 'REJECTED') && !adminNote) {
      return NextResponse.json(
        { error: 'ملاحظة الإدارة مطلوبة لهذا الإجراء' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: params.id }, { orderNumber: params.id }],
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'لم يتم العثور على الطلب' }, { status: 404 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: action,
        adminNote: adminNote || (action === 'NEEDS_CHANGES' || action === 'REJECTED' ? order.adminNote : null),
        internalNote: internalNote || order.internalNote,
        reviewedAt: new Date(),
        reviewedById: session.user.id,
      },
    });

    clearCachePrefix('orders:');
    clearCachePrefix('orders-page:');
    clearCachePrefix('admin-requests:');
    clearCachePrefix('admin-requests-page:');

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error('Admin request review error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث حالة الطلب' },
      { status: 500 }
    );
  }
}
