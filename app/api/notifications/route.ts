import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const [unreadCount, notifications] = await Promise.all([
      prisma.notification.count({
        where: {
          userId: session.user.id,
          readAt: null,
        },
      }),
      prisma.notification.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          type: true,
          title: true,
          message: true,
          url: true,
          readAt: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({ unreadCount, notifications });
  } catch (error) {
    console.error('Notifications list error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحميل التنبيهات' }, { status: 500 });
  }
}
