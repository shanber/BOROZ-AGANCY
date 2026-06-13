import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Clock3, Eye, Inbox } from 'lucide-react';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { getOrderStatusLabel } from '@/app/lib/order-status';
import { offerInvitationStatusLabels, providerOpportunityOrderStatuses } from '@/app/lib/provider-opportunities';
import { formatRelativeTime } from '@/app/lib/execution';
import { OpsBadge, OpsEmptyState, OpsPageHeader, OpsSectionHeader, OpsSurface } from '@/app/components/execution/OpsUI';

export default async function ProviderOpportunitiesPage() {
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

  const invitations = await prisma.offerInvitation.findMany({
    where: {
      expertProfileId: provider.id,
      order: {
        status: { in: [...providerOpportunityOrderStatuses] },
      },
    },
    orderBy: [{ invitedAt: 'desc' }],
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          storeName: true,
          serviceType: true,
          status: true,
          service: { select: { nameAr: true } },
          offers: {
            where: { expertProfileId: provider.id },
            select: { id: true },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <OpsPageHeader
        eyebrow="Invited Opportunities"
        title="الفرص المتاحة"
        description="هذه ليست سوقاً مفتوحة. كل فرصة هنا وصلت إليك بدعوة مباشرة بعد مراجعة بروز للطلب واعتماده للعروض."
      >
        <OpsBadge tone="slate" label={`دعوات نشطة ${invitations.length}`} />
      </OpsPageHeader>

      <OpsSurface>
        <OpsSectionHeader title="الدعوات المفتوحة" description="كل بطاقة هنا تعني أن بإمكانك اتخاذ قرار: مراجعة الفرصة، تقديم عرض، أو الاكتفاء بالمتابعة." />
        {invitations.length === 0 ? (
          <OpsEmptyState
            icon={Inbox}
            title="لا توجد فرص متاحة حالياً"
            description="عندما تقوم بروز بدعوتك لتقديم عرض على طلب مناسب لتخصصك، ستظهر الفرصة هنا مباشرة."
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 p-6 xl:grid-cols-2">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="rounded-[24px] border border-slate-200 bg-white p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{invitation.order.orderNumber}</div>
                    <h2 className="mt-2 text-lg font-bold text-[#0B132B]">{invitation.order.service?.nameAr || invitation.order.serviceType}</h2>
                    <p className="mt-1 text-sm text-slate-500">{invitation.order.storeName}</p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                    {getOrderStatusLabel(invitation.order.status)}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-[11px] font-bold text-slate-500">حالة الدعوة</div>
                    <div className="mt-1 font-semibold text-slate-800">{offerInvitationStatusLabels[invitation.status]}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-[11px] font-bold text-slate-500">تاريخ الدعوة</div>
                    <div className="mt-1 font-semibold text-slate-800">{formatRelativeTime(invitation.invitedAt)}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:col-span-2">
                    <div className="text-[11px] font-bold text-slate-500">آخر موعد</div>
                    <div className="mt-1 font-semibold text-slate-800">{invitation.expiresAt ? invitation.expiresAt.toLocaleDateString('en-GB') : 'غير محدد'}</div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Clock3 size={14} className="text-[#06B6D4]" />
                    فرصة تشغيلية موجهة
                  </div>
                  <Link
                    href={`/dashboard/provider/opportunities/${encodeURIComponent(invitation.order.orderNumber)}`}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#0B132B] transition-colors hover:bg-slate-50"
                  >
                    <Eye size={14} />
                    {invitation.order.offers.length > 0 ? 'عرض التفاصيل' : 'فتح الفرصة'}
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
