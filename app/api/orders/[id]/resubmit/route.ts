import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import { merchantOrderOwnershipFilter } from '@/app/lib/order-access';

const allowedFields = [
  'storeName',
  'managerName',
  'phone',
  'email',
  'sallaUrl',
  'budget',
  'priority',
  'description',
  'notes',
  'serviceType',
] as const;

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }
    if (session.user.globalRole !== 'MERCHANT') {
      return NextResponse.json({ error: 'غير مصرح لك بالتعديل' }, { status: 403 });
    }

    const ownerFilter = merchantOrderOwnershipFilter(session);

    const existingOrder = await prisma.order.findFirst({
      where: {
        AND: [
          ownerFilter,
          { OR: [{ id: params.id }, { orderNumber: params.id }] },
        ],
      },
      select: { id: true, status: true, orderNumber: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 });
    }

    if (existingOrder.status !== 'NEEDS_CHANGES') {
      return NextResponse.json(
        { error: 'يمكن تعديل الطلب فقط عندما يكون بحاجة إلى تعديل' },
        { status: 409 }
      );
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined && typeof body[field] === 'string') {
        const trimmed = body[field].trim();
        if (trimmed.length > 0) {
          updateData[field] = trimmed;
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'يجب تعديل حقل واحد على الأقل قبل إعادة الإرسال' },
        { status: 400 }
      );
    }

    const updated = await prisma.order.update({
      where: { id: existingOrder.id },
      data: {
        ...updateData,
        status: 'SUBMITTED',
        reviewedAt: null,
        reviewedById: null,
      },
      select: { orderNumber: true, status: true },
    });

    return NextResponse.json({
      message: 'تم إرسال الطلب للمراجعة مرة أخرى',
      orderNumber: updated.orderNumber,
      status: updated.status,
    });
  } catch (error) {
    console.error('Order resubmit error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إعادة إرسال الطلب' }, { status: 500 });
  }
}
