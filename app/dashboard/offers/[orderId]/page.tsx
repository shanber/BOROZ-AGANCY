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
import { formatCurrency, formatDate } from '@/app/lib/formatters';
import { buildWorkflowCounts, formatRelativeTime } from '@/app/lib/execution';
import {
  OpsBadge,
  OpsEmptyState,
  OpsMetaGrid,
  OpsPageHeader,
  OpsSectionHeader,
  OpsSurface,
  OpsWorkflowPipeline,
} from '@/app/components/execution/OpsUI';

function getPrimaryAction(order: { status: string; selectedOfferId: string | null; project: { id: string; status: string } | null }) {
  if (order.project?.id) {
    return {
      href: `/dashboard/projects/${order.project.id}`,
      label: 'فتح المشروع',
      description: 'تم الانتقال إلى التنفيذ ويمكنك متابعة المشروع مباشرة.',
    };
  }

  if (['APPROVED_FOR_OFFERS', 'COLLECTING_OFFERS'].includes(order.status) && !order.selectedOfferId) {
    return {
      href: '#offers-grid',
      label: 'قارن العروض',
      description: 'راجع السعر والنطاق والمدة ثم اختر العرض الأنسب.',
    };
  }

  if (order.status === 'OFFER_SELECTED') {
    return {
      href: '#selection-status',
      label: 'بانتظار تهيئة التنفيذ',
      description: 'تم اختيار العرض، وسيتم تجهيز المشروع التنفيذي داخل بروز.',
    };
  }

  return {
    href: '#offers-grid',
    label: 'متابعة لاحقاً',
    description: 'ستظهر العروض هنا عندما يبدأ الخبراء بإرسالها.',
  };
}

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
  const primaryAction = getPrimaryAction(order);
  const pipelineSteps = buildWorkflowCounts([order.status]);

  return (
    <div className="space-y-6">
      <div className="flex justify-start">
        <Link
          href="/dashboard/offers"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B132B] transition-colors hover:bg-slate-50"
        >
          <ArrowRight size={16} />
          العودة إلى العروض
        </Link>
      </div>

      <OpsPageHeader
        eyebrow={order.orderNumber}
        title="مقارنة العروض"
        description="هذه الشاشة هي لحظة القرار قبل بدء التنفيذ: قارن العرض بالنطاق والمدة والسعر، ثم اختر عرضاً واحداً لينتقل الطلب إلى المشروع."
        actions={<span className={`rounded-full px-3 py-1 text-xs font-bold ${getOrderStatusStyle(order.status)}`}>{getOrderStatusLabel(order.status)}</span>}
      >
        <OpsBadge tone="slate" label={resolveServiceLabel(order.serviceType)} />
        <OpsBadge tone="cyan" label={`عدد العروض ${order.offers.length}`} />
      </OpsPageHeader>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_340px]">
        <div className="space-y-6">
          <OpsSurface>
            <OpsSectionHeader title="الموقع الحالي في المسار" description="هذا الطلب دخل مرحلة العروض، وسيغادرها فقط بعد اختيار عرض واحد للانتقال إلى التنفيذ." />
            <OpsWorkflowPipeline steps={pipelineSteps} />
          </OpsSurface>

          <OpsSurface>
            <OpsSectionHeader title="ملخص الطلب" description="السياق الذي يبني عليه الخبير عرضه، والذي يجب أن تقارن به كل عرض وارد." />
            <div className="p-6">
              <OpsMetaGrid
                items={[
                  { label: 'الخدمة', value: resolveServiceLabel(order.serviceType) },
                  { label: 'الحالة', value: getOrderStatusLabel(order.status) },
                  { label: 'الأولوية', value: order.priority },
                  { label: 'الميزانية', value: order.budget ? formatCurrency(order.budget) : 'قيد التقدير' },
                ]}
              />
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <SectionCard label="وصف الطلب" value={order.description} />
                <SectionCard label="المتطلبات الإضافية" value={order.notes || 'لا توجد ملاحظات إضافية حالياً.'} />
              </div>
            </div>
          </OpsSurface>

          {order.status === 'OFFER_SELECTED' ? (
            <div id="selection-status">
            <OpsSurface>
              <OpsSectionHeader title="تم اختيار العرض" description="اكتمل قرار الاختيار لهذه المرحلة، والخطوة التالية هي تجهيز التنفيذ داخل المشروع." />
              <div className="space-y-4 p-6">
                <div className="rounded-[24px] border border-violet-200 bg-violet-50 px-5 py-5 text-sm leading-7 text-violet-900">
                  تم اختيار العرض النهائي لهذا الطلب، ولن يتم قبول عروض إضافية جديدة عليه.
                </div>
                {order.project?.id ? (
                  <Link
                    href={`/dashboard/projects/${order.project.id}`}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#0B132B] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#16213C]"
                  >
                    الانتقال إلى المشروع
                  </Link>
                ) : null}
              </div>
            </OpsSurface>
            </div>
          ) : null}

          <div id="offers-grid">
          <OpsSurface>
            <OpsSectionHeader title="العروض المستلمة" description="كل بطاقة أدناه تمثل عرضاً تنفيذياً مستقلاً. ركّز على منطق التنفيذ، لا على الشكل التسويقي." />
            {order.offers.length === 0 ? (
              <OpsEmptyState
                icon={FileText}
                title="لا توجد عروض معروضة حالياً"
                description="سيتم عرض العروض هنا فور استلامها من الخبراء المدعوين لنفس هذا الطلب."
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 p-6 xl:grid-cols-2">
                {order.offers.map((offer) => {
                  const isSelected = order.selectedOfferId === offer.id || offer.status === 'ACCEPTED';
                  return (
                    <div key={offer.id} className="min-w-0 overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6">
                      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="break-words text-lg font-bold text-[#0B132B]">{getProviderDisplayName(offer.expertProfile)}</div>
                          <div className="mt-1 break-words text-sm text-slate-500">{offer.expertProfile.specialtyTitle || 'خبير متخصص داخل بروز'}</div>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${getOrderStatusStyle(offer.status === 'ACCEPTED' ? 'OFFER_SELECTED' : order.status)}`}>
                          {offer.status === 'ACCEPTED' ? 'تم اختياره' : offer.status === 'REJECTED' ? 'لم يتم اختياره' : 'عرض قابل للمقارنة'}
                        </span>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                        <InfoPill label="السعر" value={formatCurrency(offer.price)} />
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
                        <div className="space-y-2 text-xs font-bold text-slate-500">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-[#06B6D4]" />
                            المقارنة تتم داخل بروز بدون مشاركة وسائل تواصل مباشرة
                          </div>
                          <div className="text-slate-400">{offer.submittedAt ? `أُرسل ${formatRelativeTime(offer.submittedAt)}` : 'تم حفظ العرض داخل النظام'}</div>
                        </div>
                        {order.status === 'OFFER_SELECTED' && !isSelected ? (
                          <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
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
          </OpsSurface>
          </div>
        </div>

        <aside className="space-y-6">
          <OpsSurface>
            <OpsSectionHeader title="الخطوة التالية" description="ما الذي يجب أن تفعله الآن حتى يتقدم الطلب إلى التنفيذ." />
            <div className="space-y-4 p-6">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
                {primaryAction.description}
              </div>
              <Link
                href={primaryAction.href}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0B132B] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#16213C]"
              >
                {primaryAction.label}
              </Link>
            </div>
          </OpsSurface>

          <OpsSurface>
            <OpsSectionHeader title="قرار الاختيار" description="قواعد هذه المرحلة قبل فتح المشروع التنفيذي." />
            <div className="space-y-3 p-6 text-sm leading-7 text-slate-600">
              <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">
                اختر عرضاً واحداً فقط. بعد الاختيار ينتقل الطلب إلى التنفيذ ويغلق مسار المقارنة.
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">
                لا تعتمد على السعر فقط. قارن بين النطاق، المخرجات، المدة، وعدد المراجعات قبل اتخاذ القرار.
              </div>
              {order.offersClosedAt ? (
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-slate-500">
                  تم إغلاق العروض في {formatDate(order.offersClosedAt)}.
                </div>
              ) : null}
            </div>
          </OpsSurface>

          <OpsSurface>
            <OpsSectionHeader title="سياق سريع" description="مؤشرات تساعدك على المقارنة دون إخفاء تعقيد التنفيذ الحقيقي." />
            <div className="p-6">
              <OpsMetaGrid
                columns={2}
                items={[
                  { label: 'حالة الطلب', value: getOrderStatusLabel(order.status) },
                  { label: 'المرحلة', value: 'العروض' },
                  { label: 'عدد العروض', value: String(order.offers.length) },
                  { label: 'المشروع', value: order.project ? 'تم إنشاؤه' : 'غير منشأ بعد' },
                ]}
              />
            </div>
          </OpsSurface>
        </aside>
      </div>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
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
      <div className="max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
        {previewValue}
      </div>
      {isLong ? (
        <details className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
          <summary className="cursor-pointer list-none text-xs font-bold text-[#06B6D4]">عرض المزيد</summary>
          <div className="mt-3 max-w-full whitespace-pre-wrap break-words text-sm leading-7 text-slate-700 [overflow-wrap:anywhere]">
            {normalizedValue}
          </div>
        </details>
      ) : null}
    </div>
  );
}
