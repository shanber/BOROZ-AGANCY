import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import { ArrowRight, Briefcase, FileText, ShieldCheck } from 'lucide-react';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { getOrderStatusLabel } from '@/app/lib/order-status';
import { offerInvitationStatusLabels, providerOpportunityOrderStatuses } from '@/app/lib/provider-opportunities';
import { ProviderOfferSubmissionForm } from '@/app/components/provider/ProviderOfferSubmissionForm';

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/provider/opportunities"
            className="rounded-xl border border-slate-200/80 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            title="العودة للفرص"
          >
            <ArrowRight size={18} />
          </Link>
          <div>
            <div className="text-xs font-bold text-[#06B6D4]">{invitation.order.orderNumber}</div>
            <h1 className="mt-1 text-2xl font-bold text-[#111827]">{invitation.order.service?.nameAr || invitation.order.serviceType}</h1>
            <p className="mt-1 text-sm text-slate-500">فرصة موجهة لك من بروز لتقديم عرض منظم داخل المنصة.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#111827]">
              <Briefcase size={18} className="text-[#06B6D4]" />
              مختصر الطلب
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem label="الخدمة المطلوبة" value={invitation.order.service?.nameAr || invitation.order.serviceType} />
              <InfoItem label="حالة الطلب" value={getOrderStatusLabel(invitation.order.status)} />
              <InfoItem label="المتجر" value={invitation.order.storeName} />
              <InfoItem label="الأولوية" value={invitation.order.priority} />
              <InfoItem label="الميزانية التقريبية" value={invitation.order.budget || 'قيد التقدير'} />
              <InfoItem label="رابط المتجر" value={invitation.order.sallaUrl || 'غير متوفر'} />
            </div>

            <div className="mt-5">
              <SectionBlock label="وصف الطلب" value={invitation.order.description} />
            </div>

            <div className="mt-5">
              <SectionBlock label="المتطلبات الإضافية" value={invitation.order.notes || 'لا توجد متطلبات إضافية مرفقة حالياً.'} />
            </div>

            <div className="mt-5">
              <SectionBlock label="المرفقات" value="لا توجد مرفقات مرفوعة لهذا الطلب في النظام الحالي." />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#111827]">
              <FileText size={18} className="text-[#06B6D4]" />
              تقديم عرض منظم
            </div>
            <p className="mb-6 text-sm leading-7 text-slate-500">
              قدّم عرضك بشكل واضح وقابل للمقارنة. لا يرى التاجر إلا العرض النهائي المرسل داخل بروز، ولا يرى أي معلومات داخلية تخص الإدارة.
            </p>
            <ProviderOfferSubmissionForm orderId={invitation.order.orderNumber} existingOffer={existingOffer} />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#111827]">
              <ShieldCheck size={18} className="text-[#06B6D4]" />
              تذكير ببروز
            </div>
            <ul className="space-y-3 text-sm leading-7 text-slate-600">
              <li>يتم تقديم العرض داخل المنصة فقط.</li>
              <li>لا يمكنك رؤية عروض الخبراء الآخرين.</li>
              <li>لا يتم التواصل المباشر مع التاجر قبل اختيار العرض.</li>
              <li>كل عرض يجب أن يوضح السعر والمدة والنطاق والمخرجات.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 text-sm font-bold text-[#111827]">ملخص الدعوة</div>
            <div className="space-y-3 text-sm text-slate-600">
              <InfoItem label="حالة الدعوة" value={offerInvitationStatusLabels[invitation.status]} />
              <InfoItem label="تاريخ الدعوة" value={invitation.invitedAt.toLocaleDateString('en-GB')} />
              <InfoItem label="آخر موعد" value={invitation.expiresAt ? invitation.expiresAt.toLocaleDateString('en-GB') : 'غير محدد'} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-bold text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-800 break-words">{value}</div>
    </div>
  );
}

function SectionBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-bold text-slate-500">{label}</div>
      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
        {value}
      </div>
    </div>
  );
}
