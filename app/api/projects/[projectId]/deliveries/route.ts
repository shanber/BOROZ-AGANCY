import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { getProjectParticipantWhere } from '@/app/lib/project-utils';
import { createNotificationsForUsers } from '@/app/lib/notifications';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { projectId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const project = await prisma.project.findFirst({
      where: getProjectParticipantWhere(session, params.projectId),
      select: { id: true },
    });
    if (!project) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 403 });
    }

    const deliveries = await prisma.projectDelivery.findMany({
      where: { projectId: params.projectId },
      orderBy: { submittedAt: 'desc' },
      select: {
        id: true,
        status: true,
        title: true,
        description: true,
        deliverableLinks: true,
        revisionNote: true,
        submittedAt: true,
        approvedAt: true,
        revisionRequestedAt: true,
        submittedBy: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ deliveries });
  } catch (error) {
    console.error('Deliveries list error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحميل التسليمات' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { projectId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }
    if (session.user.globalRole !== 'PROVIDER') {
      return NextResponse.json({ error: 'فقط مقدم الخدمة يمكنه تسليم العمل' }, { status: 403 });
    }

    const project = await prisma.project.findFirst({
      where: getProjectParticipantWhere(session, params.projectId),
      select: {
        id: true,
        orgId: true,
        status: true,
        orderId: true,
        acceptedOffer: {
          select: {
            expertProfile: {
              select: { userId: true },
            },
          },
        },
        order: {
          select: {
            userId: true,
            orderNumber: true,
          },
        },
      },
    });
    if (!project) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 403 });
    }
    if (
      project.status !== 'ACTIVE' &&
      project.status !== 'IN_PROGRESS' &&
      project.status !== 'REVISION_REQUESTED'
    ) {
      return NextResponse.json({ error: 'لا يمكن تسليم العمل في هذه المرحلة' }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, deliverableLinks } = body;

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json({ error: 'العنوان والوصف مطلوبان' }, { status: 400 });
    }
    if (title.trim().length > 200) {
      return NextResponse.json({ error: 'العنوان طويل جدًا (الحد الأقصى 200 حرف)' }, { status: 400 });
    }
    if (description.trim().length > 5000) {
      return NextResponse.json({ error: 'الوصف طويل جدًا (الحد الأقصى 5000 حرف)' }, { status: 400 });
    }

    const delivery = await prisma.$transaction(async (tx) => {
      const created = await tx.projectDelivery.create({
        data: {
          projectId: project.id,
          submittedById: session.user.id,
          title: title.trim(),
          description: description.trim(),
          deliverableLinks: deliverableLinks?.trim() || null,
          status: 'SUBMITTED',
          submittedAt: new Date(),
        },
      });

      await tx.project.update({
        where: { id: project.id },
        data: { status: 'DELIVERED' },
      });

      const notifyTargets: Array<{ userId: string; orgId: string }> = [];
      if (project.order.userId) {
        notifyTargets.push({ userId: project.order.userId, orgId: project.orgId });
      }
      if (notifyTargets.length > 0) {
        await createNotificationsForUsers(tx, notifyTargets, {
          type: 'DELIVERY_SUBMITTED',
          title: 'تم تسليم العمل',
          message: `تم تسليم العمل في مشروع ${project.order.orderNumber}`,
          entityType: 'project',
          entityId: project.id,
          url: `/dashboard/projects/${project.id}`,
        });
      }

      return created;
    });

    return NextResponse.json({ delivery }, { status: 201 });
  } catch (error) {
    console.error('Delivery submit error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تسليم العمل' }, { status: 500 });
  }
}
