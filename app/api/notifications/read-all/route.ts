import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        readAt: null,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json({ message: 'تم تحديد كل التنبيهات كمقروءة' });
  } catch (error) {
    console.error('Notifications read-all error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث التنبيهات' }, { status: 500 });
  }
}
