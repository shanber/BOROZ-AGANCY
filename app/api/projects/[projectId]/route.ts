import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { getProjectStatusLabel } from '@/app/lib/project-utils';
import { getProviderDisplayName } from '@/app/lib/provider-opportunities';
import { getOrderStatusLabel } from '@/app/lib/order-status';
import { resolveServiceLabel } from '@/app/lib/services';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { projectId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const where =
      session.user.globalRole === 'ADMIN'
        ? { id: params.projectId }
        : session.user.globalRole === 'PROVIDER'
        ? {
            id: params.projectId,
            acceptedOffer: {
              expertProfile: {
                userId: session.user.id,
              },
            },
          }
        : {
            id: params.projectId,
            order: {
              userId: session.user.id,
            },
          };

    const project = await prisma.project.findFirst({
      where,
      select: {
        id: true,
        name: true,
        status: true,
        scopeSummary: true,
        deliverables: true,
        price: true,
        deliveryDays: true,
        revisionsIncluded: true,
        startDate: true,
        dueDate: true,
        createdAt: true,
        acceptedOffer: {
          select: {
            id: true,
            messageToMerchant: true,
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
            id: true,
            orderNumber: true,
            serviceType: true,
            status: true,
            description: true,
            notes: true,
            storeName: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'لم يتم العثور على المشروع' }, { status: 404 });
    }

    return NextResponse.json({
      id: project.id,
      title: project.name,
      status: project.status,
      statusLabel: getProjectStatusLabel(project.status),
      scopeSummary: project.scopeSummary,
      deliverables: project.deliverables,
      price: project.price,
      deliveryDays: project.deliveryDays,
      revisionsIncluded: project.revisionsIncluded,
      startedAt: project.startDate,
      dueAt: project.dueDate,
      createdAt: project.createdAt,
      providerDisplayName: project.acceptedOffer?.expertProfile ? getProviderDisplayName(project.acceptedOffer.expertProfile) : 'خبير بروز',
      providerMessage: project.acceptedOffer?.messageToMerchant || null,
      order: {
        id: project.order.id,
        orderNumber: project.order.orderNumber,
        serviceLabel: resolveServiceLabel(project.order.serviceType),
        status: project.order.status,
        statusLabel: getOrderStatusLabel(project.order.status),
        description: project.order.description,
        notes: project.order.notes || null,
        storeName: project.order.storeName,
      },
    });
  } catch (error) {
    console.error('Project detail error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحميل المشروع' }, { status: 500 });
  }
}
