import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ProviderApprovalStatus } from '@prisma/client';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { clearCachePrefix } from '@/app/lib/server-cache';
import { providerOpportunityOrderStatuses } from '@/app/lib/provider-opportunities';

export const dynamic = 'force-dynamic';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.globalRole !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح لك بتنفيذ هذا الإجراء' }, { status: 403 });
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: params.id }, { orderNumber: params.id }],
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        offersOpenedAt: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'لم يتم العثور على الطلب' }, { status: 404 });
    }

    if (![...providerOpportunityOrderStatuses].includes(order.status as any)) {
      return NextResponse.json(
        { error: 'لا يمكن دعوة الخبراء إلا عندما يكون الطلب معتمداً للعروض أو في مرحلة جمع العروض' },
        { status: 409 }
      );
    }

    const body = await request.json();
    const rawExpertProfileIds: unknown[] = Array.isArray(body.expertProfileIds) ? body.expertProfileIds : [];
    const expertProfileIds = Array.from(
      new Set(rawExpertProfileIds.map((value: unknown) => String(value || '').trim()).filter(Boolean))
    );

    if (expertProfileIds.length === 0) {
      return NextResponse.json({ error: 'يرجى اختيار خبير واحد على الأقل لإرسال الدعوة' }, { status: 400 });
    }

    let expiresAt: Date | null = null;
    if (body.expiresAt) {
      const parsedDate = new Date(String(body.expiresAt));
      if (Number.isNaN(parsedDate.getTime())) {
        return NextResponse.json({ error: 'تاريخ انتهاء الدعوة غير صالح' }, { status: 400 });
      }
      expiresAt = parsedDate;
    }

    const approvedExperts = await prisma.expertProfile.findMany({
      where: {
        id: { in: expertProfileIds },
        approvalStatus: ProviderApprovalStatus.APPROVED,
      },
      select: { id: true },
    });

    if (approvedExperts.length === 0) {
      return NextResponse.json({ error: 'لم يتم العثور على خبراء معتمدين صالحين للدعوة' }, { status: 400 });
    }

    const approvedIds = approvedExperts.map((expert) => expert.id);

    const existingInvitations = await prisma.offerInvitation.findMany({
      where: {
        orderId: order.id,
        expertProfileId: { in: approvedIds },
      },
      select: { expertProfileId: true },
    });

    const existingIds = new Set(existingInvitations.map((invitation) => invitation.expertProfileId));
    const newInvitationIds = approvedIds.filter((id) => !existingIds.has(id));

    if (newInvitationIds.length === 0) {
      return NextResponse.json(
        { error: 'تمت دعوة الخبراء المحددين مسبقاً لهذا الطلب' },
        { status: 409 }
      );
    }

    const now = new Date();

    const result = await prisma.$transaction(async (tx) => {
      const created = await tx.offerInvitation.createMany({
        data: newInvitationIds.map((expertProfileId) => ({
          orderId: order.id,
          expertProfileId,
          status: 'INVITED',
          invitedAt: now,
          expiresAt,
        })),
      });

      if (created.count > 0 && order.status === 'APPROVED_FOR_OFFERS') {
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: 'COLLECTING_OFFERS',
            offersOpenedAt: order.offersOpenedAt || now,
          },
        });
      }

      return created;
    });

    clearCachePrefix('orders:');
    clearCachePrefix('orders-page:');
    clearCachePrefix('admin-requests:');
    clearCachePrefix('admin-requests-page:');

    return NextResponse.json({
      invitedCount: result.count,
      skippedCount: approvedIds.length - newInvitationIds.length,
      message: `تم إرسال ${result.count} دعوة بنجاح`,
    });
  } catch (error) {
    console.error('Invite providers error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إرسال دعوات الخبراء' }, { status: 500 });
  }
}
