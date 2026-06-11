import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { clearCachePrefix } from '@/app/lib/server-cache';
import { createNotification, createNotificationsForUsers } from '@/app/lib/notifications';

export const dynamic = 'force-dynamic';

export async function PATCH(_request: Request, { params }: { params: { projectId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح لك ببدء مرحلة التنفيذ' }, { status: 401 });
    }

    const isAdmin = session.user.globalRole === 'ADMIN';
    const isApprovedProvider = session.user.globalRole === 'PROVIDER' && session.user.approvalStatus === 'APPROVED';

    if (!isAdmin && !isApprovedProvider) {
      return NextResponse.json({ error: 'غير مصرح لك ببدء مرحلة التنفيذ' }, { status: 403 });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: params.projectId,
        ...(isAdmin
          ? {}
          : {
              acceptedOffer: {
                expertProfile: {
                  userId: session.user.id,
                },
              },
            }),
      },
      select: {
        id: true,
        orgId: true,
        status: true,
        startDate: true,
        orderId: true,
        order: {
          select: {
            userId: true,
            status: true,
            orderNumber: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'لم يتم العثور على المشروع' }, { status: 404 });
    }

    if (!(project.status === 'KICKOFF_PENDING' || project.status === 'PENDING')) {
      return NextResponse.json({ error: 'لا يمكن بدء التنفيذ إلا عندما يكون المشروع بانتظار الانطلاق' }, { status: 409 });
    }

    if (project.order.status !== 'OFFER_SELECTED') {
      return NextResponse.json({ error: 'لا يمكن بدء التنفيذ لأن الطلب لم يصل إلى مرحلة العرض المختار بعد' }, { status: 409 });
    }

    const now = new Date();

    await prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: { id: project.id },
        data: {
          status: 'ACTIVE',
          startDate: project.startDate || now,
        },
      });

      await tx.order.update({
        where: { id: project.orderId },
        data: {
          status: 'IN_EXECUTION',
        },
      });

      if (project.order.userId) {
        await createNotification(tx, {
          orgId: project.orgId,
          userId: project.order.userId,
          type: 'PROJECT_STARTED',
          title: 'بدأ تنفيذ المشروع',
          message: 'بدأ مقدم الخدمة تنفيذ المشروع داخل بروز.',
          entityType: 'PROJECT',
          entityId: project.id,
          url: `/dashboard/projects/${project.id}`,
          dedupeWindowMinutes: 2,
        });
      }

      const adminUsers = await tx.user.findMany({
        where: {
          globalRole: 'ADMIN',
          isActive: true,
          id: { not: session.user.id },
        },
        select: { id: true },
      });

      await createNotificationsForUsers(
        tx,
        adminUsers.map((user) => ({ userId: user.id, orgId: project.orgId })),
        {
          type: 'PROJECT_STARTED',
          title: 'بدأ تنفيذ مشروع',
          message: 'بدأ تنفيذ مشروع جديد داخل بروز.',
          entityType: 'PROJECT',
          entityId: project.id,
          url: `/dashboard/projects/${project.id}`,
          dedupeWindowMinutes: 2,
        }
      );
    });

    clearCachePrefix('orders:');
    clearCachePrefix('orders-page:');
    clearCachePrefix('projects:');
    clearCachePrefix('projects-page:');
    clearCachePrefix('admin-requests:');
    clearCachePrefix('admin-requests-page:');

    return NextResponse.json({ message: 'تم بدء التنفيذ بنجاح داخل بروز' });
  } catch (error) {
    console.error('Project kickoff error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء بدء مرحلة التنفيذ' }, { status: 500 });
  }
}
