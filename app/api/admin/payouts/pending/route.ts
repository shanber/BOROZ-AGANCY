import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.globalRole !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 403 });
    }

    const payouts = await prisma.providerPayout.findMany({
      where: { status: 'PENDING_REVIEW' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        grossAmount: true,
        platformFee: true,
        amount: true,
        status: true,
        createdAt: true,
        reviewedAt: true,
        project: {
          select: {
            id: true,
            name: true,
            completedDate: true,
            acceptedOffer: {
              select: {
                expertProfile: {
                  select: {
                    specialtyTitle: true,
                    user: { select: { name: true } },
                  },
                },
              },
            },
            order: {
              select: {
                storeName: true,
                user: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ payouts });
  } catch (error) {
    console.error('Pending payouts error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحميل طلبات الصرف' }, { status: 500 });
  }
}
