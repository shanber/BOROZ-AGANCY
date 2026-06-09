import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import { services } from '@/app/lib/demo-data';
import { formatCurrency, formatShortDate } from '@/app/lib/formatters';
import { getOrderStatusLabel } from '@/app/lib/order-status';
import { merchantOrderOwnershipFilter } from '@/app/lib/order-access';

function serviceLabel(serviceType: string) {
  return services.find((service) => service.key === serviceType)?.label || serviceType || 'خدمة أخرى';
}

function formatDate(date: Date) {
  return formatShortDate(date).replace(/-/g, '/');
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ownerFilter = merchantOrderOwnershipFilter(session);

  const order = await prisma.order.findFirst({
    where: {
      AND: [
        ownerFilter,
        {
          OR: [{ id: params.id }, { orderNumber: params.id }],
        },
      ],
    },
    select: {
      orderNumber: true,
      storeName: true,
      managerName: true,
      phone: true,
      email: true,
      sallaUrl: true,
      serviceType: true,
      budget: true,
      priority: true,
      status: true,
      description: true,
      notes: true,
      adminNote: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: order.orderNumber,
    storeName: order.storeName,
    managerName: order.managerName,
    phone: order.phone,
    email: order.email || '',
    sallaUrl: order.sallaUrl || '',
    serviceKey: order.serviceType,
    serviceLabel: serviceLabel(order.serviceType),
    statusKey: order.status || 'SUBMITTED',
    status: getOrderStatusLabel(order.status),
    priority: order.priority as any,
    date: formatDate(order.createdAt),
    price: order.budget ? formatCurrency(order.budget) : 'قيد التقدير',
    description: order.description,
    notes: order.notes || '',
    adminNote: order.adminNote || '',
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  });
}
