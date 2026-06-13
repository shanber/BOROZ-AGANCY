import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import { createNotification } from '@/app/lib/notifications';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.globalRole !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 403 });
    }

    const expertId = params.id;

    const expertProfile = await prisma.expertProfile.findUnique({
      where: { id: expertId },
      include: {
        user: {
          select: {
            orgMembers: {
              where: { isActive: true },
              take: 1,
              select: { orgId: true },
            },
          },
        },
      },
    });

    if (!expertProfile) {
      return NextResponse.json({ error: 'لم يتم العثور على الحساب' }, { status: 404 });
    }

    // Providers don't belong to an organization (orgs are merchant-only),
    // so orgId may be absent — in that case we simply skip the in-app notification.
    const orgId = expertProfile.user.orgMembers[0]?.orgId;

    const updatedProfile = await prisma.$transaction(async (tx) => {
      const profile = await tx.expertProfile.update({
        where: { id: expertId },
        data: {
          approvalStatus: 'SUSPENDED',
          reviewedAt: new Date(),
          reviewedById: session.user.id,
        },
      });

      if (orgId) {
        await createNotification(tx, {
          orgId,
          userId: expertProfile.userId,
          type: 'GENERAL',
          title: 'تم تعليق الحساب',
          message: 'تم تعليق حساب مقدم الخدمة مؤقتًا. للاستفسار، يرجى التواصل مع الدعم.',
          entityType: 'expert',
          entityId: expertId,
          url: '/dashboard/provider/pending',
        });
      }

      return profile;
    });

    return NextResponse.json({ message: 'تم تعليق الحساب', profile: updatedProfile });
  } catch (error) {
    console.error('Suspend Error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تعليق الحساب' }, { status: 500 });
  }
}
