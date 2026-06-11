import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(_request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const notification = await prisma.notification.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      select: { id: true },
    });

    if (!notification) {
      return NextResponse.json({ error: 'لم يتم العثور على التنبيه' }, { status: 404 });
    }

    await prisma.notification.update({
      where: { id: notification.id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json({ message: 'تم تحديث حالة التنبيه' });
  } catch (error) {
    console.error('Notification read error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث التنبيه' }, { status: 500 });
  }
}
