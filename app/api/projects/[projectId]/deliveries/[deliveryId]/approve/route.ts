import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { getProjectParticipantWhere } from '@/app/lib/project-utils';
import { createNotificationsForUsers } from '@/app/lib/notifications';

export const dynamic = 'force-dynamic';

export async function POST(
  _request: Request,
  { params }: { params: { projectId: string; deliveryId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }
    if (session.user.globalRole !== 'MERCHANT') {
      return NextResponse.json({ error: 'فقط التاجر يمكنه قبول التسليم' }, { status: 403 });
    }

    const project = await prisma.project.findFirst({
      where: getProjectParticipantWhere(session, params.projectId),
      select: {
        id: true,
        orgId: true,
        status: true,
        price: true,
        acceptedOffer: {
          select: {
            id: true,
            price: true,
            expertProfileId: true,
            expertProfile: {
              select: { userId: true },
            },
          },
        },
        order: {
          select: {
            orgId: true,
            orderNumber: true,
          },
        },
      },
    });
    if (!project) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 403 });
    }
    if (project.status !== 'DELIVERED' && project.status !== 'REVISION_REQUESTED') {
      return NextResponse.json({ error: 'لا يمكن قبول التسليم في هذه المرحلة' }, { status: 400 });
    }

    const delivery = await prisma.projectDelivery.findFirst({
      where: { id: params.deliveryId, projectId: params.projectId },
    });
    if (!delivery) {
      return NextResponse.json({ error: 'لم يتم العثور على التسليم' }, { status: 404 });
    }
    if (delivery.status !== 'SUBMITTED') {
      return NextResponse.json({ error: 'يمكن فقط قبول التسليم في حالة "تم التسليم"' }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.projectDelivery.update({
        where: { id: delivery.id },
        data: {
          status: 'APPROVED',
          approvedAt: new Date(),
        },
      });

      await tx.project.update({
        where: { id: project.id },
        data: { status: 'COMPLETED', completedDate: new Date() },
      });

      const acceptedOffer = project.acceptedOffer;
      const providerId = acceptedOffer?.expertProfile?.userId;
      if (providerId && acceptedOffer) {
        const { getPlatformCommissionRate, calcPayoutAmounts } = await import('@/app/lib/platform-settings');
        const commissionRate = await getPlatformCommissionRate();
        const grossAmount = project.price ?? acceptedOffer.price;
        const { platformFee, amount } = calcPayoutAmounts(grossAmount, commissionRate);

        const existingPayout = await tx.providerPayout.findUnique({
          where: { projectId: project.id },
          select: { status: true },
        });

        if (existingPayout) {
          if (existingPayout.status === 'APPROVED' || existingPayout.status === 'PAID') {
            // Do not overwrite approved/paid payout
          } else {
            await tx.providerPayout.update({
              where: { projectId: project.id },
              data: {
                providerId,
                grossAmount,
                platformFee,
                amount,
                status: 'PENDING_REVIEW',
              },
            });
          }
        } else {
          await tx.providerPayout.create({
            data: {
              projectId: project.id,
              providerId,
              grossAmount,
              platformFee,
              amount,
              status: 'PENDING_REVIEW',
            },
          });
        }

        await createNotificationsForUsers(tx, [
          { userId: providerId, orgId: project.orgId },
        ], {
          type: 'DELIVERY_APPROVED',
          title: 'تم قبول التسليم',
          message: `تم اعتماد تسليم مشروع ${project.order.orderNumber}`,
          entityType: 'project',
          entityId: project.id,
          url: `/dashboard/projects/${project.id}`,
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delivery approve error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء قبول التسليم' }, { status: 500 });
  }
}
