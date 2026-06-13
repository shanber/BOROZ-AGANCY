import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import { ArrowRight, Calendar, Mail, Phone, Store, User } from 'lucide-react';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { resolveServiceLabel } from '@/app/lib/services';
import { formatCurrency, formatDate, formatShortDate } from '@/app/lib/formatters';
import { getOrderStatusLabel, getOrderStatusStyle } from '@/app/lib/order-status';
import { getOrderMatchingServiceSlugs, getProviderDisplayName } from '@/app/lib/provider-opportunities';
import RequestReviewActions from './RequestReviewActions';
import InviteProvidersPanel from './InviteProvidersPanel';
import CreateProjectFromOfferButton from './CreateProjectFromOfferButton';
import { buildWorkflowCounts } from '@/app/lib/execution';
import {
  OpsBadge,
  OpsMetaGrid,
  OpsPageHeader,
  OpsSectionHeader,
  OpsSurface,
  OpsWorkflowPipeline,
} from '@/app/components/execution/OpsUI';

function serviceLabel(serviceType: string) {
  return resolveServiceLabel(serviceType);
}

function getNextOpsAction(order: {
  status: string;
  selectedOfferId: string | null;
  selectedOffer: { id: string; status: string } | null;
  project: { id: string; status: string } | null;
}) {
  if (order.project) {
    return 'تم إنشاء مشروع مرتبط بهذا الطلب. راقب التنفيذ وتدخل فقط إذا ظهرت حاجة تشغيلية أو تصعيد.';
  }

  if (order.selectedOfferId && order.selectedOffer?.status === 'ACCEPTED') {
    return 'تم اختيار عرض ولكن لم يُنشأ مشروع بعد. الخطوة التالية هي إنشاء المشروع لتفعيل مسار التنفيذ.';
  }

  if (['APPROVED_FOR_OFFERS', 'COLLECTING_OFFERS'].includes(order.status)) {
    return 'الطلب في مرحلة جمع العروض. راقب جودة الخبراء المدعوين وعدد العروض قبل أي تدخل إضافي.';
  }

  if (order.status === 'UNDER_REVIEW') {
    return 'هذا الطلب يحتاج قرار مراجعة: اعتماد للعروض، طلب تعديل، أو رفض.';
  }

  if (order.status === 'NEEDS_CHANGES') {
    return 'بانتظار التاجر لتحديث الطلب وإعادته إلى خط المراجعة.';
  }

  return 'ابدأ مراجعة الطلب وتحقق من جاهزيته لدخول مسار التنفيذ.';
}

export default async function AdminRequestDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.globalRole !== 'ADMIN') {
    redirect('/dashboard');
  }

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id: params.id }, { orderNumber: params.id }],
    },
    select: {
      id: true,
      orderNumber: true,
      storeName: true,
      managerName: true,
      phone: true,
      email: true,
      sallaUrl: true,
      serviceType: true,
      serviceId: true,
      budget: true,
      priority: true,
      status: true,
      selectedOfferId: true,
      description: true,
      notes: true,
      adminNote: true,
      internalNote: true,
      project: {
        select: {
          id: true,
          status: true,
        },
      },
      selectedOffer: {
        select: {
          id: true,
          status: true,
        },
      },
      reviewedAt: true,
      reviewedById: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!order) {
    notFound();
  }

  const reviewer = order.reviewedById
    ? await prisma.user.findUnique({
        where: { id: order.reviewedById },
        select: { name: true },
      })
    : null;

  const statusLabel = getOrderStatusLabel(order.status);
  const reviewerName = order.reviewedAt ? reviewer?.name || 'مسؤول بروز' : 'لم تتم المراجعة بعد';
  const matchingServiceSlugs = getOrderMatchingServiceSlugs(order.serviceType);

  const [matchingProviders, invitations] = await Promise.all([
    prisma.expertProfile.findMany({
      where: {
        approvalStatus: 'APPROVED',
        services: matchingServiceSlugs.length
          ? {
              some: {
                isActive: true,
                service: {
                  slug: { in: matchingServiceSlugs },
                },
              },
            }
          : undefined,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        services: {
          where: matchingServiceSlugs.length
            ? {
                isActive: true,
                service: {
                  slug: { in: matchingServiceSlugs },
                },
              }
            : { isActive: true },
          include: {
            service: {
              select: {
                nameAr: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.offerInvitation.findMany({
      where: { orderId: order.id },
      include: {
        expertProfile: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            services: {
              where: matchingServiceSlugs.length
                ? {
                    isActive: true,
                    service: {
                      slug: { in: matchingServiceSlugs },
                    },
                  }
                : { isActive: true },
              include: {
                service: {
                  select: {
                    nameAr: true,
                  },
                },
              },
            },
            offers: {
              where: { orderId: order.id },
              select: {
                price: true,
                deliveryDays: true,
                status: true,
                submittedAt: true,
              },
            },
          },
        },
      },
      orderBy: { invitedAt: 'desc' },
    }),
  ]);

  const invitationMap = new Map(invitations.map((invitation) => [invitation.expertProfileId, invitation]));
  const mergedProviders = new Map(matchingProviders.map((provider) => [provider.id, provider]));

  invitations.forEach((invitation) => {
    if (!mergedProviders.has(invitation.expertProfile.id)) {
      mergedProviders.set(invitation.expertProfile.id, invitation.expertProfile);
    }
  });

  const providerInvitationRows = Array.from(mergedProviders.values()).map((provider) => {
    const invitation = invitationMap.get(provider.id);
    const offer = invitation?.expertProfile.offers[0] || null;

    return {
      id: provider.id,
      name: getProviderDisplayName(provider),
      email: provider.user.email || 'غير متوفر',
      specialtyTitle: provider.specialtyTitle || '',
      services: provider.services.map((service) => service.service.nameAr),
      alreadyInvited: Boolean(invitation),
      invitationStatus: invitation ? invitation.status : null,
      invitedAt: invitation ? formatShortDate(invitation.invitedAt).replace(/-/g, '/') : null,
      expiresAt: invitation?.expiresAt ? formatShortDate(invitation.expiresAt).replace(/-/g, '/') : null,
      offer: offer
        ? {
            price: offer.price,
            deliveryDays: offer.deliveryDays,
            status: offer.status,
            submittedAt: offer.submittedAt ? formatShortDate(offer.submittedAt).replace(/-/g, '/') : null,
          }
        : null,
    };
  });

  const pipelineSteps = buildWorkflowCounts([order.status]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-in">
      <div className="flex justify-start">
        <Link
          href="/dashboard/admin/requests"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B132B] transition-colors hover:bg-slate-50"
        >
          <ArrowRight size={16} />
          العودة إلى صف الطلبات
        </Link>
      </div>

      <OpsPageHeader
        eyebrow={order.orderNumber}
        title="مراجعة الطلب"
        description="هذه الصفحة هي مركز القرار التشغيلي للطلب: تقييم الجاهزية، تحديد الحالة، دعوة الخبراء، ثم نقل الطلب إلى التنفيذ عند اكتمال شروطه."
        actions={<span className={`rounded-full px-3 py-1 text-xs font-bold ${getOrderStatusStyle(order.status)}`}>{statusLabel}</span>}
      >
        <OpsBadge tone="slate" label={serviceLabel(order.serviceType)} />
        <OpsBadge tone="cyan" label={order.storeName} />
      </OpsPageHeader>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_360px]">
        <div className="space-y-6">
          <OpsSurface>
            <OpsSectionHeader title="الموقع الحالي في المسار" description="يتحرك الطلب من المراجعة إلى العروض ثم الاختيار والتنفيذ. هذه الشاشة مسؤولة عن أول انتقالات المسار." />
            <OpsWorkflowPipeline steps={pipelineSteps} />
          </OpsSurface>

          <OpsSurface>
            <OpsSectionHeader title="تفاصيل الطلب" description="المعطيات الأساسية التي تُبنى عليها قرارات الإدارة بشأن جاهزية الطلب للعروض والتنفيذ." />
            <div className="space-y-5 p-6">
              <OpsMetaGrid
                items={[
                  { label: 'نوع الخدمة', value: serviceLabel(order.serviceType) },
                  { label: 'الميزانية', value: order.budget ? formatCurrency(order.budget) : 'قيد التقدير' },
                  { label: 'الأولوية', value: order.priority },
                  { label: 'الحالة', value: statusLabel },
                  { label: 'تاريخ الإنشاء', value: formatDate(order.createdAt) },
                  { label: 'آخر تحديث', value: formatDate(order.updatedAt) },
                ]}
              />

              <InfoBlock label="وصف الطلب" value={order.description} />
              {order.notes ? <InfoBlock label="ملاحظات إضافية" value={order.notes} /> : null}
            </div>
          </OpsSurface>

          <OpsSurface>
            <OpsSectionHeader title="بيانات التاجر والمتجر" description="مرجع تشغيلي للإدارة أثناء المراجعة، دون أي تغيير على الصلاحيات أو قنوات التواصل الحالية." />
            <div className="p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <IconInfo icon={User} label="التاجر" value={order.managerName} />
                <IconInfo icon={Store} label="المتجر" value={order.storeName} />
                <IconInfo icon={Mail} label="البريد" value={order.email || 'غير متوفر'} />
                <IconInfo icon={Phone} label="الجوال" value={order.phone || 'غير متوفر'} ltr />
                <IconInfo icon={Calendar} label="رابط المتجر" value={order.sallaUrl || 'غير متوفر'} />
              </div>
            </div>
          </OpsSurface>

          <InviteProvidersPanel
            orderNumber={order.orderNumber}
            requestStatus={order.status}
            providers={providerInvitationRows}
          />
        </div>

        <div className="space-y-6">
          <OpsSurface>
            <OpsSectionHeader title="الخطوة التالية" description="ما الذي يحتاجه هذا الطلب الآن حتى يتقدم داخل صف التشغيل." />
            <div className="space-y-4 p-6">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
                {getNextOpsAction(order)}
              </div>
              {!order.project && order.selectedOfferId && order.selectedOffer?.status === 'ACCEPTED' ? (
                <CreateProjectFromOfferButton orderNumber={order.orderNumber} />
              ) : null}
              {order.project ? (
                <Link
                  href={`/dashboard/projects/${order.project.id}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0B132B] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#16213C]"
                >
                  فتح المشروع
                </Link>
              ) : null}
            </div>
          </OpsSurface>

          <RequestReviewActions
            orderNumber={order.orderNumber}
            currentStatus={statusLabel}
            currentStatusKey={order.status as any}
            initialAdminNote={order.adminNote}
            initialInternalNote={order.internalNote}
          />

          <OpsSurface>
            <OpsSectionHeader title="سجل المراجعة" description="ملاحظات المراجعة الحالية وحالة الانتقال إلى المشروع أو التاجر أو العروض." />
            <div className="space-y-4 p-6 text-sm text-slate-600">
              <OpsMetaGrid
                columns={2}
                items={[
                  { label: 'راجع بواسطة', value: reviewerName },
                  { label: 'تاريخ المراجعة', value: order.reviewedAt ? formatDate(order.reviewedAt) : 'لم تتم المراجعة بعد' },
                ]}
              />
              {order.adminNote ? <InfoBlock label="ملاحظة للتاجر" value={order.adminNote} tone="amber" /> : null}
              {order.internalNote ? <InfoBlock label="ملاحظة داخلية" value={order.internalNote} /> : null}
              {!order.project && order.selectedOfferId && order.selectedOffer?.status === 'ACCEPTED' ? (
                <div className="rounded-[24px] border border-violet-200 bg-violet-50 px-4 py-4 text-sm leading-7 text-violet-900">
                  تم اختيار العرض، لكن لم يتم إنشاء مشروع بعد.
                </div>
              ) : null}
              {order.project ? (
                <div className="rounded-[24px] border border-violet-200 bg-violet-50 px-4 py-4 text-sm leading-7 text-violet-900">
                  تم إنشاء مشروع لهذا الطلب ويمكن متابعة التنفيذ من صفحة المشروع.
                </div>
              ) : null}
            </div>
          </OpsSurface>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ label, value, tone = 'slate' }: { label: string; value: string; tone?: 'slate' | 'amber' }) {
  const style = tone === 'amber'
    ? 'border-amber-200 bg-amber-50 text-amber-800'
    : 'border-slate-200 bg-slate-50 text-slate-700';

  return (
    <div>
      <span className="mb-2 block text-[11px] font-bold text-slate-500">{label}</span>
      <p className={`rounded-2xl border p-4 text-sm leading-7 ${style}`}>{value}</p>
    </div>
  );
}

function IconInfo({
  icon: Icon,
  label,
  value,
  ltr = false,
}: {
  icon: typeof User;
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
        <Icon size={14} />
        {label}
      </div>
      <div className={`mt-2 text-sm font-semibold text-[#0B132B] ${ltr ? 'direction-ltr text-left' : 'break-words'}`}>{value}</div>
    </div>
  );
}
