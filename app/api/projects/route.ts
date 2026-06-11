import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { getProjectStatusLabel } from '@/app/lib/project-utils';
import { getProviderDisplayName } from '@/app/lib/provider-opportunities';
import { resolveServiceLabel } from '@/app/lib/services';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const where =
      session.user.globalRole === 'ADMIN'
        ? {}
        : session.user.globalRole === 'PROVIDER'
        ? {
            acceptedOffer: {
              expertProfile: {
                userId: session.user.id,
              },
            },
          }
        : {
            order: {
              userId: session.user.id,
            },
          };

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
      select: {
        id: true,
        name: true,
        status: true,
        price: true,
        deliveryDays: true,
        createdAt: true,
        dueDate: true,
        order: {
          select: {
            orderNumber: true,
            storeName: true,
            serviceType: true,
            managerName: true,
          },
        },
        acceptedOffer: {
          select: {
            expertProfile: {
              select: {
                specialtyTitle: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      projects.map((project) => ({
        id: project.id,
        title: project.name,
        serviceLabel: resolveServiceLabel(project.order.serviceType),
        status: project.status,
        statusLabel: getProjectStatusLabel(project.status),
        storeName: project.order.storeName,
        managerName: project.order.managerName,
        providerDisplayName: project.acceptedOffer?.expertProfile ? getProviderDisplayName(project.acceptedOffer.expertProfile) : 'خبير بروز',
        price: project.price,
        deliveryDays: project.deliveryDays,
        createdAt: project.createdAt,
        dueAt: project.dueDate,
        orderNumber: project.order.orderNumber,
      }))
    );
  } catch (error) {
    console.error('Projects list error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحميل المشاريع' }, { status: 500 });
  }
}
