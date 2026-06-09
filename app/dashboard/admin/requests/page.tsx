import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Eye, Search } from 'lucide-react';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { services } from '@/app/lib/demo-data';
import { formatCurrency, formatShortDate } from '@/app/lib/formatters';
import { getOrderStatusLabel, getOrderStatusStyle, orderReviewStatuses } from '@/app/lib/order-status';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getCached } from '@/app/lib/server-cache';

const pageSize = 20;

function serviceLabel(serviceType: string) {
  return services.find((service) => service.key === serviceType)?.label || serviceType || 'خدمة أخرى';
}

function buildSearchParams(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') searchParams.set(key, String(value));
  });
  return searchParams.toString();
}

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams?: {
    search?: string;
    status?: string;
    serviceType?: string;
    priority?: string;
    page?: string;
  };
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.globalRole !== 'ADMIN') {
    redirect('/dashboard');
  }

  const search = searchParams?.search?.trim() || '';
  const status = searchParams?.status?.trim() || '';
  const serviceType = searchParams?.serviceType?.trim() || '';
  const priority = searchParams?.priority?.trim() || '';
  const page = Math.max(Number(searchParams?.page || '1'), 1);

  const filters: any[] = [];
  if (status && orderReviewStatuses.includes(status as any)) filters.push({ status });
  if (serviceType) filters.push({ serviceType });
  if (priority) filters.push({ priority });
  if (search) {
    filters.push({
      OR: [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { storeName: { contains: search, mode: 'insensitive' } },
        { managerName: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  const requests = await getCached(
    `admin-requests-page:${search}:${status}:${serviceType}:${priority}:${page}`,
    10000,
    () =>
      prisma.order.findMany({
        where: filters.length ? { AND: filters } : undefined,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          orderNumber: true,
          storeName: true,
          managerName: true,
          serviceType: true,
          budget: true,
          priority: true,
          status: true,
          createdAt: true,
          reviewedAt: true,
        },
      })
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2 border-b border-slate-200/60 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#06B6D4]">
          لوحة تحكم الإدارة
        </p>
        <h1 className="text-2xl font-bold text-[#111827]">مراجعة الطلبات</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
          مراجعة طلبات التجار قبل اعتمادها للمرحلة التالية. لا تظهر هذه الطلبات لمقدمي الخدمات في هذه المرحلة.
        </p>
      </div>

      <form className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_190px_220px_170px_auto]">
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
          <option value="">كل الحالات</option>
          {orderReviewStatuses.map((item) => (
            <option key={item} value={item}>
              {getOrderStatusLabel(item)}
            </option>
          ))}
        </select>
        <select name="serviceType" defaultValue={serviceType} className="input-base bg-white">
          <option value="">كل الخدمات</option>
          {services.map((service) => (
            <option key={service.key} value={service.key}>
              {service.label}
            </option>
          ))}
        </select>
        <select name="priority" defaultValue={priority} className="input-base bg-white">
          <option value="">كل الأولويات</option>
          <option value="عادي">عادي</option>
          <option value="مهم">مهم</option>
          <option value="عاجل">عاجل</option>
        </select>
        <Button type="submit" className="bg-[#06B6D4] px-5 text-sm font-bold text-white hover:bg-[#0891B2]">
          تطبيق
        </Button>
      </form>

      <Card className="overflow-hidden border border-slate-200/80 shadow-sm">
        <div className="w-full overflow-x-auto">
          {requests.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm font-semibold text-slate-500">
              لا توجد طلبات تطابق الفلاتر الحالية.
            </div>
          ) : (
            <table className="w-full min-w-[900px] border-collapse text-right text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/80 text-slate-500">
                  <th className="px-5 py-3.5 font-bold">رقم الطلب</th>
                  <th className="px-5 py-3.5 font-bold">المتجر</th>
                  <th className="px-5 py-3.5 font-bold">الخدمة</th>
                  <th className="px-5 py-3.5 font-bold">الميزانية</th>
                  <th className="px-5 py-3.5 font-bold text-center">الأولوية</th>
                  <th className="px-5 py-3.5 font-bold text-center">الحالة</th>
                  <th className="px-5 py-3.5 font-bold">تاريخ الإنشاء</th>
                  <th className="px-5 py-3.5 font-bold">آخر مراجعة</th>
                  <th className="px-5 py-3.5 font-bold text-center">المراجعة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((request) => {
                  const statusLabel = getOrderStatusLabel(request.status);
                  return (
                    <tr key={request.id} className="transition-colors hover:bg-slate-50/60">
                      <td className="px-5 py-4 font-bold text-[#111827]">{request.orderNumber}</td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-800">{request.storeName}</div>
                        <div className="mt-0.5 text-[10px] text-slate-500">{request.managerName}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-650">{serviceLabel(request.serviceType)}</td>
                      <td className="px-5 py-4 font-bold text-slate-800">
                        {request.budget ? formatCurrency(request.budget) : 'قيد التقدير'}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-650">
                          {request.priority}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${getOrderStatusStyle(request.status)}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500">{formatShortDate(request.createdAt).replace(/-/g, '/')}</td>
                      <td className="px-5 py-4 text-slate-500">
                        {request.reviewedAt ? formatShortDate(request.reviewedAt).replace(/-/g, '/') : 'لم تراجع بعد'}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Link
                          href={`/dashboard/admin/requests/${request.orderNumber}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-650 transition-colors hover:bg-slate-100 hover:text-[#111827]"
                        >
                          <Eye size={12} />
                          مراجعة
                        </Link>
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
          href={`/dashboard/admin/requests?${buildSearchParams({ search, status, serviceType, priority, page: Math.max(page - 1, 1) })}`}
          className={page <= 1 ? 'pointer-events-none opacity-40' : 'hover:text-[#06B6D4]'}
        >
          السابق
        </Link>
        <span>صفحة {page}</span>
        <Link
          href={`/dashboard/admin/requests?${buildSearchParams({ search, status, serviceType, priority, page: page + 1 })}`}
          className={requests.length < pageSize ? 'pointer-events-none opacity-40' : 'hover:text-[#06B6D4]'}
        >
          التالي
        </Link>
      </div>
    </div>
  );
}
