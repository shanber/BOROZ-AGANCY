import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { getProjectParticipantWhere } from '@/app/lib/project-utils';
import { createNotificationsForUsers } from '@/app/lib/notifications';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { projectId: string; deliveryId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }
    if (session.user.globalRole !== 'MERCHANT') {
      return NextResponse.json({ error: 'فقط التاجر يمكنه طلب تعديل على التسليم' }, { status: 403 });
    }

    const project = await prisma.project.findFirst({
      where: getProjectParticipantWhere(session, params.projectId),
      select: {
        id: true,
        orgId: true,
        status: true,
        order: {
          select: {
            orgId: true,
            orderNumber: true,
          },
        },
        acceptedOffer: {
          select: {
            expertProfile: {
              select: { userId: true },
            },
          },
        },
      },
    });
    if (!project) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 403 });
    }
    if (project.status !== 'DELIVERED') {
      return NextResponse.json({ error: 'لا يمكن طلب تعديل في هذه المرحلة' }, { status: 400 });
    }

    const body = await request.json();
    const revisionNote = String(body.revisionNote || '').trim();
    if (!revisionNote) {
      return NextResponse.json({ error: 'يرجى توضيح التعديلات المطلوبة' }, { status: 400 });
    }
    if (revisionNote.length > 2000) {
      return NextResponse.json({ error: 'ملاحظات التعديل طويلة جدًا (الحد الأقصى 2000 حرف)' }, { status: 400 });
    }

    const delivery = await prisma.projectDelivery.findFirst({
      where: { id: params.deliveryId, projectId: params.projectId },
    });
    if (!delivery) {
      return NextResponse.json({ error: 'لم يتم العثور على التسليم' }, { status: 404 });
    }
    if (delivery.status !== 'SUBMITTED') {
      return NextResponse.json({ error: 'يمكن فقط طلب تعديل على تسليم في حالة "تم التسليم"' }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.projectDelivery.update({
        where: { id: delivery.id },
        data: {
          status: 'REVISION_REQUESTED',
          revisionNote,
          revisionRequestedAt: new Date(),
        },
      });

      await tx.project.update({
        where: { id: project.id },
        data: { status: 'REVISION_REQUESTED' },
      });

      const providerId = project.acceptedOffer?.expertProfile?.userId;
      if (providerId) {
        await createNotificationsForUsers(tx, [
          { userId: providerId, orgId: project.orgId },
        ], {
          type: 'DELIVERY_REVISION_REQUESTED',
          title: 'طلب تعديل على التسليم',
          message: `تم طلب تعديل على مشروع ${project.order.orderNumber}`,
          entityType: 'project',
          entityId: project.id,
          url: `/dashboard/projects/${project.id}`,
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delivery revision request error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء طلب التعديل' }, { status: 500 });
  }
}
