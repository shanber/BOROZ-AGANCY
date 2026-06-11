import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import { createNotification } from '@/app/lib/notifications';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.globalRole !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 403 });
    }

    const expertId = params.id;
    const body = await req.json();
    const { rejectionReason } = body;

    if (!rejectionReason || rejectionReason.trim().length === 0) {
      return NextResponse.json({ error: 'الرجاء إدخال سبب الرفض' }, { status: 400 });
    }

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
          approvalStatus: 'REJECTED',
          rejectionReason: rejectionReason,
          reviewedAt: new Date(),
          reviewedById: session.user.id,
        },
      });

      await createNotification(tx, {
        orgId,
        userId: expertProfile.userId,
        type: 'GENERAL',
        title: 'لم يتم قبول طلب الانضمام',
        message: 'تم رفض طلب انضمامك كمقدم خدمة. يمكنك مراجعة السبب من صفحة حالة الحساب.',
        entityType: 'expert',
        entityId: expertId,
        url: '/dashboard/provider/pending',
      });

      return profile;
    });

    return NextResponse.json({ message: 'تم رفض الحساب', profile: updatedProfile });
  } catch (error) {
    console.error('Reject Error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء رفض الحساب' }, { status: 500 });
  }
}
