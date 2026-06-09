import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { services } from '@/app/lib/demo-data';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import { formatShortDate, formatCurrency } from '@/app/lib/formatters';
import { getOrderStatusLabel } from '@/app/lib/order-status';
import { merchantOrderOwnershipFilter } from '@/app/lib/order-access';
import { clearCachePrefix, getCached } from '@/app/lib/server-cache';

type MerchantContext = {
  userId: string;
  orgId: string | null;
  merchantId: string | null;
  merchantName: string;
  storeName: string;
  email: string;
  phone: string;
  storeUrl: string;
};

function formatDate(date: Date) {
  return formatShortDate(date).replace(/-/g, '/');
}

function serviceLabel(serviceType: string) {
  return services.find((service) => service.key === serviceType)?.label || serviceType || 'خدمة أخرى';
}

function mapOrder(dbOrder: any) {
  return {
    id: dbOrder.orderNumber,
    storeName: dbOrder.storeName,
    managerName: dbOrder.managerName,
    phone: dbOrder.phone,
    email: dbOrder.email || '',
    sallaUrl: dbOrder.sallaUrl || '',
    serviceKey: dbOrder.serviceType,
    serviceLabel: serviceLabel(dbOrder.serviceType),
    statusKey: dbOrder.status || 'SUBMITTED',
    status: getOrderStatusLabel(dbOrder.status),
    priority: dbOrder.priority as any,
    date: formatDate(dbOrder.createdAt),
    price: dbOrder.budget ? formatCurrency(dbOrder.budget) : 'قيد التقدير',
    description: dbOrder.description,
    notes: dbOrder.notes || '',
    adminNote: dbOrder.adminNote || '',
    createdAt: dbOrder.createdAt,
  };
}

function mapOrderListItem(dbOrder: any) {
  return {
    id: dbOrder.orderNumber,
    storeName: dbOrder.storeName,
    serviceKey: dbOrder.serviceType,
    serviceLabel: serviceLabel(dbOrder.serviceType),
    statusKey: dbOrder.status || 'SUBMITTED',
    status: getOrderStatusLabel(dbOrder.status),
    priority: dbOrder.priority as any,
    date: formatDate(dbOrder.createdAt),
    price: dbOrder.budget ? formatCurrency(dbOrder.budget) : 'قيد التقدير',
    createdAt: dbOrder.createdAt,
    updatedAt: dbOrder.updatedAt,
  };
}

async function getMerchantContext(): Promise<MerchantContext | null> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orgMembers: {
        where: { isActive: true },
        take: 1,
        include: {
          organization: {
            include: {
              merchants: {
                where: { deletedAt: null },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  const orgMember = user.orgMembers[0];
  const organization = orgMember?.organization;
  const merchant = organization?.merchants.find((item) => item.email === user.email) || organization?.merchants[0];

  return {
    userId: user.id,
    orgId: organization?.id || null,
    merchantId: merchant?.id || null,
    merchantName: user.name || merchant?.contactName || user.email,
    storeName: merchant?.storeName || organization?.name || 'متجر غير محدد',
    email: user.email,
    phone: user.phone || merchant?.phone || '',
    storeUrl: merchant?.storeUrl || organization?.website || '',
  };
}

function buildMerchantListWhere(ownerFilter: any, searchParams: URLSearchParams) {
  const filters: any[] = [ownerFilter];
  const search = searchParams.get('search')?.trim();
  const status = searchParams.get('status')?.trim();
  const serviceType = searchParams.get('serviceType')?.trim();
  const priority = searchParams.get('priority')?.trim();

  if (status) filters.push({ status });
  if (serviceType) filters.push({ serviceType });
  if (priority) filters.push({ priority });
  if (search) {
    filters.push({
      OR: [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { storeName: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  return { AND: filters };
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    if (searchParams.get('context') === 'merchant') {
      const context = await getMerchantContext();
      if (!context) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      return NextResponse.json({
        merchantName: context.merchantName,
        storeName: context.storeName,
        email: context.email,
        storeUrl: context.storeUrl,
        phone: context.phone,
      });
    }

    const ownerFilter = merchantOrderOwnershipFilter(session);

    if (searchParams.get('summary') === 'dashboard') {
      const summary = await getCached(`orders:summary:${session.user.id}`, 10000, async () => {
        const [statusCounts, recentOrders] = await Promise.all([
          prisma.order.groupBy({
            by: ['status'],
            where: ownerFilter,
            _count: { _all: true },
          }),
          prisma.order.findMany({
            where: ownerFilter,
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
              orderNumber: true,
              storeName: true,
              serviceType: true,
              budget: true,
              status: true,
              priority: true,
              createdAt: true,
              updatedAt: true,
            },
          }),
        ]);

        return {
          counts: Object.fromEntries(statusCounts.map((item) => [item.status, item._count._all])),
          recentOrders: recentOrders.map(mapOrderListItem),
        };
      });

      return NextResponse.json(summary);
    }

    const page = Math.max(Number(searchParams.get('page') || '1'), 1);
    const take = Math.min(Math.max(Number(searchParams.get('limit') || '20'), 1), 50);
    const skip = (page - 1) * take;
    const where = buildMerchantListWhere(ownerFilter, searchParams);

    const dbOrders = await getCached(
      `orders:list:${session.user.id}:${searchParams.toString()}`,
      10000,
      () =>
        prisma.order.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take,
          select: {
            orderNumber: true,
            storeName: true,
            serviceType: true,
            budget: true,
            priority: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        })
    );

    return NextResponse.json(dbOrders.map(mapOrderListItem));
  } catch (error) {
    console.error('Database query failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders from database' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const context = await getMerchantContext();

    if (!context) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { serviceType, description, priority, budget, notes, referenceLinks } = body;

    const missingFields: string[] = [];
    if (!serviceType || !String(serviceType).trim()) missingFields.push('serviceType');
    if (!description || !String(description).trim()) missingFields.push('description');

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          fields: missingFields,
          message: `الحقول التالية مطلوبة: ${missingFields.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const orderNumber = `ORD-${Date.now()}`;
    const extraNotes = [notes, referenceLinks ? `روابط مرجعية: ${referenceLinks}` : null]
      .map((value) => (value ? String(value).trim() : ''))
      .filter(Boolean)
      .join('\n\n');

    const dbOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: context.userId,
        orgId: context.orgId,
        merchantId: context.merchantId,
        storeName: context.storeName,
        managerName: context.merchantName,
        phone: context.phone,
        email: context.email,
        sallaUrl: context.storeUrl || null,
        serviceType: String(serviceType).trim(),
        budget: budget ? String(budget) : null,
        priority: priority || 'عادي',
        description: String(description).trim(),
        notes: extraNotes || null,
        status: 'SUBMITTED',
        source: 'merchant-dashboard',
      },
    });

    clearCachePrefix('orders:');
    clearCachePrefix('orders-page:');
    clearCachePrefix('admin-requests-page:');

    return NextResponse.json(mapOrder(dbOrder), { status: 201 });
  } catch (error) {
    console.error('Failed to create order in database:', error);
    return NextResponse.json(
      {
        error: 'Database error',
        message: 'حدث خطأ أثناء حفظ الطلب في قاعدة البيانات',
      },
      { status: 400 }
    );
  }
}
