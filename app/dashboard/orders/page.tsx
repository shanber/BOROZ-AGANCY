import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Eye, Plus, Search } from 'lucide-react';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { resolveServiceLabel } from '@/app/lib/services';
import { formatCurrency, formatShortDate } from '@/app/lib/formatters';
import { getOrderStatusLabel, getOrderStatusStyle } from '@/app/lib/order-status';
import { merchantOrderOwnershipFilter } from '@/app/lib/order-access';
import { getCached } from '@/app/lib/server-cache';

const pageSize = 20;
const merchantOrderStatuses = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'NEEDS_CHANGES',
  'APPROVED_FOR_OFFERS',
  'COLLECTING_OFFERS',
  'OFFER_SELECTED',
  'IN_EXECUTION',
  'DELIVERED',
  'COMPLETED',
  'REJECTED',
  'CANCELLED',
] as const;

function serviceLabel(serviceType: string) {
  return resolveServiceLabel(serviceType);
}

function buildSearchParams(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') searchParams.set(key, String(value));
  });
  return searchParams.toString();
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams?: { search?: string; status?: string; page?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }
  if (session.user.globalRole !== 'MERCHANT') {
    redirect('/dashboard');
  }

  const ownerFilter = merchantOrderOwnershipFilter(session);

  const search = searchParams?.search?.trim() || '';
  const status = searchParams?.status?.trim() || '';
  const page = Math.max(Number(searchParams?.page || '1'), 1);

  const filters: any[] = [ownerFilter];
  if (status) filters.push({ status });
  if (search) {
    filters.push({
      OR: [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { storeName: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  const orders = await getCached(
    `orders-page:${session.user.id}:${search}:${status}:${page}`,
    10000,
    () =>
      prisma.order.findMany({
        where: { AND: filters },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          orderNumber: true,
          storeName: true,
          serviceType: true,
          budget: true,
          priority: true,
          status: true,
          project: {
            select: {
              id: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      })
  );

  const statusOptions = [
    { value: '', label: 'كل الحالات' },
    ...merchantOrderStatuses.map((item) => ({ value: item, label: getOrderStatusLabel(item) })),
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#111827] md:text-2xl">الطلبات</h2>
          <p className="mt-1 text-xs text-[#64748B] md:text-sm">
            متابعة طلبات الخدمات وحالة مراجعتها داخل بروز.
          </p>
        </div>
        <Link href="/dashboard/orders/new">
          <Button className="flex items-center gap-1.5 rounded-xl bg-[#06B6D4] px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#06B6D4]/10 hover:bg-[#0891B2]">
            <Plus size={16} />
            طلب جديد
          </Button>
        </Link>
      </div>

      <form className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_auto]">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            name="search"
            defaultValue={search}
            placeholder="ابحث برقم الطلب أو اسم المتجر..."
            className="input-base bg-white pr-10"
          />
        </div>
        <select name="status" defaultValue={status} className="input-base bg-white">
          {statusOptions.map((option) => (
            <option key={option.value || 'all'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Button type="submit" className="bg-[#06B6D4] px-5 text-sm font-bold text-white hover:bg-[#0891B2]">
          تطبيق
        </Button>
      </form>

      <Card className="overflow-hidden border border-slate-200/80 shadow-sm">
        <div className="w-full overflow-x-auto">
          {orders.length === 0 ? (
            <div className="space-y-2 py-12 text-center text-slate-500">
              <p className="text-sm">لا توجد طلبات تطابق الفلتر أو البحث الحالي.</p>
              <Link href="/dashboard/orders" className="text-xs font-bold text-[#06B6D4] hover:underline">
                إعادة ضبط الفلاتر
              </Link>
            </div>
          ) : (
            <table className="w-full min-w-[750px] border-collapse whitespace-nowrap text-right text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/80 text-slate-500">
                  <th className="px-6 py-3.5 font-bold">رقم الطلب</th>
                  <th className="px-6 py-3.5 font-bold">اسم المتجر</th>
                  <th className="px-6 py-3.5 font-bold">الخدمة المطلوبة</th>
                  <th className="px-6 py-3.5 font-bold text-center">الحالة</th>
                  <th className="px-6 py-3.5 font-bold text-center">الأولوية</th>
                  <th className="px-6 py-3.5 font-bold">تاريخ الطلب</th>
                  <th className="px-6 py-3.5 font-bold text-left">المبلغ</th>
                  <th className="px-6 py-3.5 font-bold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const statusLabel = getOrderStatusLabel(order.status);
                  const hasOffersFlow = ['APPROVED_FOR_OFFERS', 'COLLECTING_OFFERS', 'OFFER_SELECTED'].includes(order.status);
                  const projectId = order.project?.id || null;
                  const hasProject = Boolean(projectId);
                  return (
                    <tr key={order.orderNumber} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-bold text-[#111827]">{order.orderNumber}</td>
                      <td className="px-6 py-4 font-semibold text-slate-700">{order.storeName}</td>
                      <td className="px-6 py-4 text-slate-500">{serviceLabel(order.serviceType)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${getOrderStatusStyle(order.status)}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-bold text-slate-600">
                          {order.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{formatShortDate(order.createdAt).replace(/-/g, '/')}</td>
                      <td className="px-6 py-4 text-left font-bold text-[#111827]">
                        {order.budget ? formatCurrency(order.budget) : 'قيد التقدير'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/dashboard/orders/${order.orderNumber}`}>
                            <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold text-slate-500 transition-all hover:bg-slate-100 hover:text-[#111827]">
                              <Eye size={12} />
                              تفاصيل
                            </button>
                          </Link>
                          {hasOffersFlow ? (
                            <Link href={`/dashboard/offers/${order.orderNumber}`}>
                              <button className="inline-flex items-center gap-1 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-[10px] font-bold text-cyan-700 transition-all hover:bg-cyan-100">
                                العروض
                              </button>
                            </Link>
                          ) : null}
                          {hasProject ? (
                            <Link href={`/dashboard/projects/${projectId}`}>
                              <button className="inline-flex items-center gap-1 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-[10px] font-bold text-violet-700 transition-all hover:bg-violet-100">
                                المشروع
                              </button>
                            </Link>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <Link
          href={`/dashboard/orders?${buildSearchParams({ search, status, page: Math.max(page - 1, 1) })}`}
          className={page <= 1 ? 'pointer-events-none opacity-40' : 'hover:text-[#06B6D4]'}
        >
          السابق
        </Link>
        <span>صفحة {page}</span>
        <Link
          href={`/dashboard/orders?${buildSearchParams({ search, status, page: page + 1 })}`}
          className={orders.length < pageSize ? 'pointer-events-none opacity-40' : 'hover:text-[#06B6D4]'}
        >
          التالي
        </Link>
      </div>
    </div>
  );
}
