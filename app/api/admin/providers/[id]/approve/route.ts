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

    const orgId = expertProfile.user.orgMembers[0]?.orgId;
    if (!orgId) {
      return NextResponse.json({ error: 'لم يتم العثور على المؤسسة المرتبطة بالحساب' }, { status: 400 });
    }

    const updatedProfile = await prisma.$transaction(async (tx) => {
      const profile = await tx.expertProfile.update({
        where: { id: expertId },
        data: {
          approvalStatus: 'APPROVED',
          reviewedAt: new Date(),
          reviewedById: session.user.id,
        },
      });

      await createNotification(tx, {
        orgId,
        userId: expertProfile.userId,
        type: 'GENERAL',
        title: 'تم قبول طلب الانضمام',
        message: 'تم قبول طلب انضمامك كمقدم خدمة في بروز. يمكنك الآن الدخول إلى لوحة التحكم والاطلاع على الفرص المتاحة.',
        entityType: 'expert',
        entityId: expertId,
        url: '/dashboard/provider',
      });

      return profile;
    });

    return NextResponse.json({ message: 'تم الموافقة على الحساب بنجاح', profile: updatedProfile });
  } catch (error) {
    console.error('Approve Error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء الموافقة على الحساب' }, { status: 500 });
  }
}
