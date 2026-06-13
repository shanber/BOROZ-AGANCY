import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { getOrderStatusLabel } from '@/app/lib/order-status';
import { offerInvitationStatusLabels, providerOpportunityOrderStatuses } from '@/app/lib/provider-opportunities';
import { ProviderOfferSubmissionForm } from '@/app/components/provider/ProviderOfferSubmissionForm';
import { buildWorkflowCounts, formatRelativeTime } from '@/app/lib/execution';
import { formatCurrency, formatDate } from '@/app/lib/formatters';
import {
  OpsBadge,
  OpsMetaGrid,
  OpsPageHeader,
  OpsSectionHeader,
  OpsSurface,
  OpsWorkflowPipeline,
} from '@/app/components/execution/OpsUI';

function getNextAction(existingOffer: { id: string; status: string; submittedAt: string | null } | null) {
  if (existingOffer) {
    return 'لقد أرسلت عرضك بالفعل. راجع تفاصيل الفرصة فقط إذا احتجت إعادة قراءة المتطلبات أو انتظار قرار الإدارة/التاجر.';
  }

  return 'راجع الوصف والمتطلبات جيداً، ثم قدّم عرضاً واضحاً وقابلاً للمقارنة من داخل بروز فقط.';
}

export default async function ProviderOpportunityDetailPage({ params }: { params: { orderId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.globalRole !== 'PROVIDER') {
    redirect('/login');
  }

  if (session.user.approvalStatus !== 'APPROVED') {
    redirect('/dashboard/provider/pending');
  }

  const provider = await prisma.expertProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!provider) {
    redirect('/dashboard/provider/pending');
  }

  const invitation = await prisma.offerInvitation.findFirst({
    where: {
      expertProfileId: provider.id,
      order: {
        OR: [{ id: params.orderId }, { orderNumber: params.orderId }],
        status: { in: [...providerOpportunityOrderStatuses] },
      },
    },
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          storeName: true,
          sallaUrl: true,
          serviceType: true,
          budget: true,
          priority: true,
          description: true,
          notes: true,
          status: true,
          service: { select: { nameAr: true } },
          offers: {
            where: { expertProfileId: provider.id },
            select: {
              id: true,
              status: true,
              submittedAt: true,
            },
          },
        },
      },
    },
  });

  if (!invitation) {
    notFound();
  }

  const existingOffer = invitation.order.offers[0]
    ? {
        id: invitation.order.offers[0].id,
        status: invitation.order.offers[0].status,
        submittedAt: invitation.order.offers[0].submittedAt
          ? invitation.order.offers[0].submittedAt.toISOString()
          : null,
      }
    : null;

  const pipelineSteps = buildWorkflowCounts([invitation.order.status]);

  return (
    <div className="space-y-6">
      <div className="flex justify-start">
        <Link
          href="/dashboard/provider/opportunities"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B132B] transition-colors hover:bg-slate-50"
        >
          <ArrowRight size={16} />
          العودة إلى الفرص
        </Link>
      </div>

      <OpsPageHeader
        eyebrow={invitation.order.orderNumber}
        title={invitation.order.service?.nameAr || invitation.order.serviceType}
        description="فرصة موجهة لك من بروز لتقديم عرض منظم داخل المنصة. هذه صفحة تقييم وتنفيذ قرار التقديم، وليست صفحة سوق مفتوح."
        actions={<OpsBadge tone="slate" label={getOrderStatusLabel(invitation.order.status)} />}
      >
        <OpsBadge tone="cyan" label={invitation.order.storeName} />
        <OpsBadge tone="amber" label={offerInvitationStatusLabels[invitation.status]} />
      </OpsPageHeader>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <OpsSurface>
            <OpsSectionHeader title="الموقع الحالي في المسار" description="هذه الفرصة وصلت إلى مرحلة العروض بعد مراجعة بروز، ودورك الآن هو تقديم عرض واضح أو الاكتفاء بالمتابعة." />
            <OpsWorkflowPipeline steps={pipelineSteps} />
          </OpsSurface>

          <OpsSurface>
            <OpsSectionHeader title="مختصر الطلب" description="اقرأ هذا الملخص كما سيُبنى عليه عرضك: الخدمة، الأولوية، الميزانية، والسياق الأساسي للتنفيذ." />
            <div className="p-6">
              <OpsMetaGrid
                items={[
                  { label: 'الخدمة المطلوبة', value: invitation.order.service?.nameAr || invitation.order.serviceType },
                  { label: 'حالة الطلب', value: getOrderStatusLabel(invitation.order.status) },
                  { label: 'المتجر', value: invitation.order.storeName },
                  { label: 'الأولوية', value: invitation.order.priority },
                  { label: 'الميزانية التقريبية', value: invitation.order.budget ? formatCurrency(invitation.order.budget) : 'قيد التقدير' },
                  { label: 'رابط المتجر', value: invitation.order.sallaUrl || 'غير متوفر' },
                ]}
              />

              <div className="mt-5 space-y-5">
                <SectionBlock label="وصف الطلب" value={invitation.order.description} />
                <SectionBlock label="المتطلبات الإضافية" value={invitation.order.notes || 'لا توجد متطلبات إضافية مرفقة حالياً.'} />
                <SectionBlock label="المرفقات" value="لا توجد مرفقات مرفوعة لهذا الطلب في النظام الحالي." />
              </div>
            </div>
          </OpsSurface>

          <OpsSurface>
            <OpsSectionHeader title="تقديم عرض منظم" description="قدّم عرضك بصيغة تشغيلية قابلة للمقارنة: سعر، مدة، نطاق، مخرجات، ورسالة مهنية واضحة." />
            <div className="p-6 pt-0">
              <p className="mb-6 text-sm leading-7 text-slate-500">
                لا يرى التاجر إلا العرض النهائي المرسل داخل بروز. لا تشارك أي معلومات خارج سياق التنفيذ أو الإدارة.
              </p>
              <ProviderOfferSubmissionForm orderId={invitation.order.orderNumber} existingOffer={existingOffer} />
            </div>
          </OpsSurface>
        </div>

        <aside className="space-y-6">
          <OpsSurface>
            <OpsSectionHeader title="الخطوة التالية" description="ما الذي يُتوقع منك الآن داخل مساحة عمل الخبير." />
            <div className="space-y-4 p-6">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
                {getNextAction(existingOffer)}
              </div>
              {existingOffer?.submittedAt ? (
                <div className="text-xs font-medium text-slate-400">أُرسل عرضك {formatRelativeTime(existingOffer.submittedAt)}</div>
              ) : null}
            </div>
          </OpsSurface>

          <OpsSurface>
            <OpsSectionHeader title="قواعد بروز" description="الحدود التشغيلية لهذه المرحلة قبل اختيار التاجر لعرضك." />
            <div className="space-y-3 p-6 text-sm leading-7 text-slate-600">
              <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">يتم تقديم العرض داخل المنصة فقط.</div>
              <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">لا يمكنك رؤية عروض الخبراء الآخرين.</div>
              <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">لا يتم التواصل المباشر مع التاجر قبل اختيار العرض.</div>
              <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">كل عرض يجب أن يوضح السعر والمدة والنطاق والمخرجات.</div>
            </div>
          </OpsSurface>

          <OpsSurface>
            <OpsSectionHeader title="ملخص الدعوة" description="سياق الدعوة الحالية وزمنها وحالتها داخل بروز." />
            <div className="p-6">
              <OpsMetaGrid
                columns={2}
                items={[
                  { label: 'حالة الدعوة', value: offerInvitationStatusLabels[invitation.status] },
                  { label: 'تاريخ الدعوة', value: formatDate(invitation.invitedAt) },
                  { label: 'آخر موعد', value: invitation.expiresAt ? formatDate(invitation.expiresAt) : 'غير محدد' },
                  { label: 'حالة عرضك', value: existingOffer ? existingOffer.status : 'لم يتم التقديم بعد' },
                ]}
              />
            </div>
          </OpsSurface>
        </aside>
      </div>
    </div>
  );
}

function SectionBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-bold text-slate-500">{label}</div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
        {value}
      </div>
    </div>
  );
}
