import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Clock3, Eye, Inbox } from 'lucide-react';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { getOrderStatusLabel } from '@/app/lib/order-status';
import { offerInvitationStatusLabels, providerOpportunityOrderStatuses } from '@/app/lib/provider-opportunities';

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
      <div className="flex flex-col gap-2 border-b border-slate-200/60 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#06B6D4]">لوحة مقدم الخدمة</p>
        <h1 className="text-2xl font-bold text-[#111827]">الفرص المتاحة</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
          هذه الطلبات تمت دعوتك لها بشكل مباشر من بروز بعد مراجعتها واعتمادها للعروض. لا تظهر لك إلا الفرص المرتبطة بدعوة صريحة لحسابك.
        </p>
      </div>

      {invitations.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 text-[#06B6D4]">
            <Inbox size={30} />
          </div>
          <h2 className="text-lg font-bold text-[#111827]">لا توجد فرص متاحة حالياً</h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            عندما تقوم بروز بدعوتك لتقديم عرض على طلب مناسب لتخصصك، ستظهر الفرصة هنا.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {invitations.map((invitation) => (
            <div key={invitation.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-[#06B6D4]">{invitation.order.orderNumber}</div>
                  <h2 className="mt-2 text-lg font-bold text-[#111827]">{invitation.order.service?.nameAr || invitation.order.serviceType}</h2>
                  <p className="mt-1 text-sm text-slate-500">{invitation.order.storeName}</p>
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                  {getOrderStatusLabel(invitation.order.status)}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="text-[11px] font-bold text-slate-500">حالة الدعوة</div>
                  <div className="mt-1 font-semibold text-slate-800">{offerInvitationStatusLabels[invitation.status]}</div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="text-[11px] font-bold text-slate-500">تاريخ الدعوة</div>
                  <div className="mt-1 font-semibold text-slate-800">{invitation.invitedAt.toLocaleDateString('en-GB')}</div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 sm:col-span-2">
                  <div className="text-[11px] font-bold text-slate-500">آخر موعد</div>
                  <div className="mt-1 font-semibold text-slate-800">{invitation.expiresAt ? invitation.expiresAt.toLocaleDateString('en-GB') : 'غير محدد'}</div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Clock3 size={14} className="text-[#06B6D4]" />
                  فرصة موجهة داخل بروز
                </div>
                <Link
                  href={`/dashboard/provider/opportunities/${encodeURIComponent(invitation.order.orderNumber)}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#06B6D4] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#0891B2]"
                >
                  <Eye size={14} />
                  {invitation.order.offers.length > 0 ? 'عرض التفاصيل' : 'عرض التفاصيل وتقديم عرض'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
