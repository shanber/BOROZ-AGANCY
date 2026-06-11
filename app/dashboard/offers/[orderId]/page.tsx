import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import { ArrowRight, CheckCircle2, FileText } from 'lucide-react';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { merchantOrderOwnershipFilter } from '@/app/lib/order-access';
import { getOrderStatusLabel, getOrderStatusStyle } from '@/app/lib/order-status';
import { getProviderDisplayName } from '@/app/lib/provider-opportunities';
import { resolveServiceLabel } from '@/app/lib/services';
import { MerchantOfferSelectButton } from '@/app/components/offers/MerchantOfferSelectButton';

export default async function MerchantOfferComparisonPage({ params }: { params: { orderId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.globalRole !== 'MERCHANT') {
    redirect('/dashboard');
  }

  const ownerFilter = merchantOrderOwnershipFilter(session);

  const order = await prisma.order.findFirst({
    where: {
      AND: [ownerFilter, { OR: [{ id: params.orderId }, { orderNumber: params.orderId }] }],
    },
    select: {
      id: true,
      orderNumber: true,
      serviceType: true,
      description: true,
      notes: true,
      budget: true,
      priority: true,
      status: true,
      selectedOfferId: true,
      offersClosedAt: true,
      project: {
        select: {
          id: true,
          status: true,
        },
      },
      offers: {
        where: {
          status: { in: ['SUBMITTED', 'ACCEPTED', 'REJECTED'] },
        },
        orderBy: [{ acceptedAt: 'desc' }, { submittedAt: 'asc' }],
        select: {
          id: true,
          status: true,
          price: true,
          deliveryDays: true,
          scopeSummary: true,
          deliverables: true,
          revisionsIncluded: true,
          assumptions: true,
          exclusions: true,
          messageToMerchant: true,
          submittedAt: true,
          expertProfile: {
            select: {
              specialtyTitle: true,
              yearsOfExperience: true,
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

  if (!order) {
    notFound();
  }

  const canSelect = ['APPROVED_FOR_OFFERS', 'COLLECTING_OFFERS'].includes(order.status) && !order.selectedOfferId;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/offers"
            className="rounded-xl border border-slate-200/80 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            title="العودة للعروض"
          >
            <ArrowRight size={18} />
          </Link>
          <div>
            <div className="text-xs font-bold text-[#06B6D4]">{order.orderNumber}</div>
            <h1 className="mt-1 text-2xl font-bold text-[#111827]">مقارنة العروض</h1>
            <p className="mt-1 text-sm text-slate-500">راجع العروض الواردة على هذا الطلب واختر العرض المناسب داخل بروز.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="text-sm font-bold text-[#111827]">ملخص الطلب</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <InfoPill label="الخدمة" value={resolveServiceLabel(order.serviceType)} />
              <InfoPill label="الحالة" value={getOrderStatusLabel(order.status)} />
              <InfoPill label="الأولوية" value={order.priority} />
              <InfoPill label="الميزانية" value={order.budget || 'قيد التقدير'} />
            </div>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${getOrderStatusStyle(order.status)}`}>
            {getOrderStatusLabel(order.status)}
          </span>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <SectionCard label="وصف الطلب" value={order.description} />
          <SectionCard label="المتطلبات الإضافية" value={order.notes || 'لا توجد ملاحظات إضافية حالياً.'} />
        </div>
      </div>

      {order.status === 'OFFER_SELECTED' ? (
        <div className="rounded-2xl border border-violet-200 bg-violet-50 px-5 py-4 text-sm font-bold text-violet-800">
          <div>تم اختيار العرض، وسيتم تجهيز مرحلة التنفيذ بواسطة بروز.</div>
          {order.project?.id ? (
            <div className="mt-3">
              <Link
                href={`/dashboard/projects/${order.project.id}`}
                className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2 text-xs font-bold text-violet-800 transition-colors hover:bg-violet-100"
              >
                الانتقال إلى المشروع
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}

      {order.offers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 text-[#06B6D4]">
            <FileText size={28} />
          </div>
          <h2 className="text-lg font-bold text-[#111827]">لا توجد عروض معروضة حالياً</h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">سيتم عرض العروض هنا فور استلامها من الخبراء المدعوين.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {order.offers.map((offer) => {
            const isSelected = order.selectedOfferId === offer.id || offer.status === 'ACCEPTED';
            return (
              <div key={offer.id} className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="break-words text-lg font-bold text-[#111827]">{getProviderDisplayName(offer.expertProfile)}</div>
                    <div className="mt-1 break-words text-sm text-slate-500">{offer.expertProfile.specialtyTitle || 'خبير متخصص داخل بروز'}</div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${getOrderStatusStyle(offer.status === 'ACCEPTED' ? 'OFFER_SELECTED' : order.status)}`}>
                    {offer.status === 'ACCEPTED' ? 'تم اختياره' : offer.status === 'REJECTED' ? 'لم يتم اختياره' : 'عرض متاح للمقارنة'}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <InfoPill label="السعر" value={`${offer.price} ر.س`} />
                  <InfoPill label="مدة التنفيذ" value={`${offer.deliveryDays} يوم`} />
                  <InfoPill label="عدد المراجعات" value={`${offer.revisionsIncluded}`} />
                  <InfoPill label="الخبرة" value={offer.expertProfile.yearsOfExperience ? `${offer.expertProfile.yearsOfExperience} سنوات` : 'غير محدد'} />
                </div>

                <div className="mt-5 space-y-4">
                  <SectionCard label="ملخص النطاق" value={offer.scopeSummary} />
                  <SectionCard label="المخرجات" value={offer.deliverables} />
                  <SectionCard label="الافتراضات" value={offer.assumptions || 'لم يتم تحديده'} />
                  <SectionCard label="الاستثناءات" value={offer.exclusions || 'لم يتم تحديده'} />
                  <SectionCard label="رسالة الخبير" value={offer.messageToMerchant || 'لم يتم تحديده'} />
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <CheckCircle2 size={14} className="text-[#06B6D4]" />
                    المقارنة تتم داخل بروز بدون مشاركة وسائل تواصل مباشرة
                  </div>
                  {order.status === 'OFFER_SELECTED' && !isSelected ? (
                    <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
                      تم إغلاق هذا العرض بعد اختيار عرض آخر
                    </div>
                  ) : (
                    <MerchantOfferSelectButton
                      orderId={order.orderNumber}
                      offerId={offer.id}
                      disabled={!canSelect}
                      selected={isSelected}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <div className="text-[11px] font-bold text-slate-500">{label}</div>
      <div className="mt-1 max-w-full break-words text-sm font-semibold text-slate-800 [overflow-wrap:anywhere]">{value}</div>
    </div>
  );
}

function SectionCard({ label, value }: { label: string; value: string }) {
  const normalizedValue = value.trim() || 'لم يتم تحديده';
  const isLong = normalizedValue.length > 280;
  const previewValue = isLong ? `${normalizedValue.slice(0, 280)}...` : normalizedValue;

  return (
    <div className="min-w-0 max-w-full">
      <div className="mb-2 text-[11px] font-bold text-slate-500">{label}</div>
      <div className="max-w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-7 text-slate-700 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
        {previewValue}
      </div>
      {isLong ? (
        <details className="mt-3 rounded-xl border border-slate-100 bg-white p-3">
          <summary className="cursor-pointer list-none text-xs font-bold text-[#06B6D4]">عرض المزيد</summary>
          <div className="mt-3 max-w-full whitespace-pre-wrap break-words text-sm leading-7 text-slate-700 [overflow-wrap:anywhere]">
            {normalizedValue}
          </div>
        </details>
      ) : null}
    </div>
  );
}
