import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Eye, Inbox } from 'lucide-react';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { merchantOrderOwnershipFilter } from '@/app/lib/order-access';
import { getOrderStatusLabel, getOrderStatusStyle } from '@/app/lib/order-status';
import { merchantOfferOrderStatuses } from '@/app/lib/provider-opportunities';
import { resolveServiceLabel } from '@/app/lib/services';

export default async function MerchantOffersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.globalRole !== 'MERCHANT') {
    redirect('/dashboard');
  }

  const ownerFilter = merchantOrderOwnershipFilter(session);

  const orders = await prisma.order.findMany({
    where: {
      AND: [
        ownerFilter,
        { status: { in: [...merchantOfferOrderStatuses] } },
        {
          offers: {
            some: {
              status: { in: ['SUBMITTED', 'ACCEPTED', 'REJECTED'] },
            },
          },
        },
      ],
    },
    orderBy: { updatedAt: 'desc' },
    select: {
      orderNumber: true,
      storeName: true,
      serviceType: true,
      status: true,
      selectedOfferId: true,
      offers: {
        where: { status: { in: ['SUBMITTED', 'ACCEPTED', 'REJECTED'] } },
        select: { id: true },
      },
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2 border-b border-slate-200/60 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#06B6D4]">لوحة تحكم التاجر</p>
        <h1 className="text-2xl font-bold text-[#111827]">العروض</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
          هنا تراجع العروض التي وصلت من الخبراء المدعوين داخل بروز، وتقارنها قبل اختيار العرض المناسب للانتقال إلى مرحلة التنفيذ.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 text-[#06B6D4]">
            <Inbox size={30} />
          </div>
          <h2 className="text-lg font-bold text-[#111827]">لا توجد عروض جاهزة للمراجعة حالياً</h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            عندما يبدأ الخبراء المدعوون بتقديم عروضهم على طلباتك، ستظهر هنا ليمكنك مقارنتها داخل بروز.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {orders.map((order) => (
            <div key={order.orderNumber} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-[#06B6D4]">{order.orderNumber}</div>
                  <h2 className="mt-2 text-lg font-bold text-[#111827]">{resolveServiceLabel(order.serviceType)}</h2>
                  <p className="mt-1 text-sm text-slate-500">{order.storeName}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${getOrderStatusStyle(order.status)}`}>
                  {getOrderStatusLabel(order.status)}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-600">
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="text-[11px] font-bold text-slate-500">عدد العروض</div>
                  <div className="mt-1 font-semibold text-slate-800">{order.offers.length}</div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="text-[11px] font-bold text-slate-500">حالة الاختيار</div>
                  <div className="mt-1 font-semibold text-slate-800">{order.selectedOfferId ? 'تم اختيار عرض' : 'بانتظار قرارك'}</div>
                </div>
              </div>

              <div className="mt-5 text-left">
                <Link
                  href={`/dashboard/offers/${encodeURIComponent(order.orderNumber)}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#06B6D4] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#0891B2]"
                >
                  <Eye size={14} />
                  عرض العروض
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
