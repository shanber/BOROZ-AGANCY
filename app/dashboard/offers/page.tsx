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
import { OpsBadge, OpsEmptyState, OpsPageHeader, OpsSectionHeader, OpsSurface } from '@/app/components/execution/OpsUI';

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
      <OpsPageHeader
        eyebrow="Offers"
        title="العروض"
        description="كل عرض هنا هو خطوة قرار تشغيلية قبل بدء التنفيذ: مقارنة، اختيار، ثم تحويل المشروع إلى مسار عمل فعلي."
      >
        <OpsBadge tone="slate" label={`طلبات بعروض ${orders.length}`} />
      </OpsPageHeader>

      <OpsSurface>
        <OpsSectionHeader title="الطلبات التي تحتوي عروضاً" description="اختر العرض المناسب فقط عندما تكون جاهزاً لنقل الطلب إلى التنفيذ الفعلي." />
        {orders.length === 0 ? (
          <OpsEmptyState
            icon={Inbox}
            title="لا توجد عروض جاهزة للمراجعة حالياً"
            description="عندما يبدأ الخبراء المدعوون بتقديم عروضهم على طلباتك، ستظهر هنا للمقارنة والاختيار."
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 p-6 xl:grid-cols-2">
            {orders.map((order) => (
              <div key={order.orderNumber} className="rounded-[24px] border border-slate-200 bg-white p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{order.orderNumber}</div>
                    <h2 className="mt-2 text-lg font-bold text-[#0B132B]">{resolveServiceLabel(order.serviceType)}</h2>
                    <p className="mt-1 text-sm text-slate-500">{order.storeName}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${getOrderStatusStyle(order.status)}`}>
                    {getOrderStatusLabel(order.status)}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-600">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-[11px] font-bold text-slate-500">عدد العروض</div>
                    <div className="mt-1 font-semibold text-slate-800">{order.offers.length}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-[11px] font-bold text-slate-500">حالة الاختيار</div>
                    <div className="mt-1 font-semibold text-slate-800">{order.selectedOfferId ? 'تم اختيار عرض' : 'بانتظار قرارك'}</div>
                  </div>
                </div>

                <div className="mt-5 text-left">
                  <Link
                    href={`/dashboard/offers/${encodeURIComponent(order.orderNumber)}`}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#0B132B] transition-colors hover:bg-slate-50"
                  >
                    <Eye size={14} />
                    عرض العروض
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </OpsSurface>
    </div>
  );
}
