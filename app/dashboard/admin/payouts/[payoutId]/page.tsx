import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import { ArrowRight, FileText, FolderOpen, CheckCircle, Ban, DollarSign } from 'lucide-react';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { getProviderDisplayName } from '@/app/lib/provider-opportunities';
import { getProjectStatusLabel } from '@/app/lib/project-utils';
import { PayoutReviewActions } from './PayoutReviewActions';
import { resolveServiceLabel } from '@/app/lib/services';

const statusLabels: Record<string, string> = {
  PENDING_REVIEW: 'بانتظار مراجعة الصرف',
  APPROVED: 'معتمد للصرف',
  ON_HOLD: 'موقوف مؤقتًا',
  PAID: 'تم الصرف',
  CANCELLED: 'ملغي',
};

const statusStyles: Record<string, string> = {
  PENDING_REVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
  APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  ON_HOLD: 'bg-red-50 text-red-700 border-red-200',
  PAID: 'bg-blue-50 text-blue-700 border-blue-200',
  CANCELLED: 'bg-slate-100 text-slate-500 border-slate-200',
};

const deliveryStatusLabels: Record<string, string> = {
  SUBMITTED: 'تم التسليم',
  APPROVED: 'مقبول',
  REVISION_REQUESTED: 'طلب تعديل',
  CANCELLED: 'ملغي',
};

export default async function AdminPayoutReviewPage({
  params,
}: {
  params: { payoutId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.globalRole !== 'ADMIN') {
    redirect('/dashboard');
  }

  const payout = await prisma.providerPayout.findUnique({
    where: { id: params.payoutId },
    select: {
      id: true,
      grossAmount: true,
      platformFee: true,
      amount: true,
      status: true,
      holdReason: true,
      createdAt: true,
      reviewedAt: true,
      paidAt: true,
      reviewedBy: {
        select: { name: true },
      },
      project: {
        select: {
          id: true,
          name: true,
          status: true,
          completedDate: true,
          scopeSummary: true,
          deliverables: true,
          price: true,
          deliveryDays: true,
          revisionsIncluded: true,
          acceptedOffer: {
            select: {
              id: true,
              price: true,
              deliveryDays: true,
              revisionsIncluded: true,
              scopeSummary: true,
              deliverables: true,
              messageToMerchant: true,
              expertProfile: {
                select: {
                  id: true,
                  specialtyTitle: true,
                  user: { select: { id: true, name: true, email: true } },
                },
              },
            },
          },
          order: {
            select: {
              id: true,
              orderNumber: true,
              storeName: true,
              serviceType: true,
              description: true,
              user: { select: { id: true, name: true, email: true } },
            },
          },
          deliveries: {
            orderBy: { submittedAt: 'desc' },
            select: {
              id: true,
              status: true,
              title: true,
              description: true,
              submittedAt: true,
              approvedAt: true,
              submittedBy: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  if (!payout) {
    notFound();
  }

  const p = payout.project;
  const acceptedOffer = p.acceptedOffer;
  const providerName = acceptedOffer?.expertProfile ? getProviderDisplayName(acceptedOffer.expertProfile) : 'خبير بروز';

  const checklist = [
    { label: 'التاجر قام بقبول التسليم', passed: p.deliveries.some((d) => d.status === 'APPROVED') },
    { label: 'حالة المشروع مكتملة', passed: p.status === 'COMPLETED' },
    { label: 'لا يوجد طلب تعديل نشط', passed: p.deliveries[0]?.status !== 'REVISION_REQUESTED' },
    { label: 'العرض المختار موجود', passed: !!acceptedOffer },
    { label: 'قيمة الصرف واضحة', passed: payout.grossAmount > 0 },
    { label: 'عمولة بروز واضحة', passed: payout.platformFee > 0 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/admin/payouts"
          className="rounded-xl border border-slate-200/80 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowRight size={18} />
        </Link>
        <div>
          <div className="text-xs font-bold text-[#06B6D4]">إدارة الصرف</div>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">{p.name}</h1>
          <p className="mt-1 text-sm text-slate-500">مراجعة طلب صرف مستحقات مقدم الخدمة.</p>
        </div>
        <span className={`mr-auto rounded-full px-3 py-1 text-xs font-bold ${statusStyles[payout.status]}`}>
          {statusLabels[payout.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#111827]">
              <FolderOpen size={18} className="text-[#06B6D4]" />
              ملخص المشروع
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoPill label="الخدمة" value={resolveServiceLabel(p.order.serviceType)} />
              <InfoPill label="حالة المشروع" value={getProjectStatusLabel(p.status)} />
              <InfoPill label="قيمة العرض" value={acceptedOffer ? `${acceptedOffer.price} ر.س` : 'غير محدد'} />
              <InfoPill label="المدة" value={acceptedOffer ? `${acceptedOffer.deliveryDays} يوم` : 'غير محدد'} />
              <InfoPill label="المتجر" value={p.order.storeName} />
              <InfoPill label="تاريخ التسليم" value={p.completedDate ? p.completedDate.toLocaleDateString('en-GB') : '-'} />
            </div>
            <div className="mt-4 space-y-3">
              <SectionCard label="وصف الطلب" value={p.order.description} />
              {p.scopeSummary ? <SectionCard label="نطاق العمل" value={p.scopeSummary} /> : null}
              {p.deliverables ? <SectionCard label="المخرجات" value={p.deliverables} /> : null}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#111827]">
              <FileText size={18} className="text-[#06B6D4]" />
              معلومات الأطراف
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoPill label="التاجر" value={p.order.user?.name || '-'} />
              <InfoPill label="البريد الإلكتروني للتاجر" value={p.order.user?.email || '-'} />
              <InfoPill label="مقدم الخدمة" value={providerName} />
              <InfoPill label="البريد الإلكتروني لمقدم الخدمة" value={acceptedOffer?.expertProfile?.user?.email || '-'} />
            </div>
          </div>

          {p.deliveries.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#111827]">
                <FileText size={18} className="text-[#06B6D4]" />
                سجل التسليمات
              </div>
              <div className="space-y-3">
                {p.deliveries.map((d) => (
                  <div key={d.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800">{d.title}</span>
                      <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${
                        d.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        d.status === 'SUBMITTED' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {deliveryStatusLabels[d.status] || d.status}
                      </span>
                    </div>
                    <p className="mb-1 text-xs leading-6 text-slate-600">{d.description}</p>
                    <div className="text-[11px] text-slate-400">
                      تم بواسطة {d.submittedBy.name || 'مقدم الخدمة'} • {d.submittedAt.toLocaleDateString('en-GB')}
                      {d.approvedAt ? ` • تم القبول: ${d.approvedAt.toLocaleDateString('en-GB')}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#111827]">
              <DollarSign size={18} className="text-[#06B6D4]" />
              الملخص المالي
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-bold text-slate-600">إجمالي قيمة المشروع</span>
                <span className="text-sm font-bold text-slate-800">{payout.grossAmount.toLocaleString()} ر.س</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-bold text-slate-600">عمولة بروز {payout.grossAmount > 0 ? `(${((payout.platformFee / payout.grossAmount) * 100).toFixed(2)}%)` : ''}</span>
                <span className="text-sm font-bold text-[#06B6D4]">- {payout.platformFee.toLocaleString()} ر.س</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                <span className="text-sm font-bold text-emerald-700">صافي مستحق الخبير</span>
                <span className="text-lg font-bold text-emerald-700">{payout.amount.toLocaleString()} ر.س</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#111827]">
              <CheckCircle size={18} className="text-[#06B6D4]" />
              قائمة التحقق
            </div>
            <div className="space-y-2">
              {checklist.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  {item.passed ? (
                    <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                  ) : (
                    <Ban size={16} className="text-red-400 shrink-0" />
                  )}
                  <span className={`text-xs font-medium ${item.passed ? 'text-slate-700' : 'text-red-500'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {payout.status === 'ON_HOLD' && payout.holdReason && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <div className="mb-1 text-sm font-bold text-red-700">سبب الإيقاف</div>
              <p className="text-sm leading-7 text-red-600">{payout.holdReason}</p>
            </div>
          )}

          {payout.reviewedBy && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-1 text-xs font-bold text-slate-500">آخر مراجعة بواسطة</div>
              <div className="text-sm font-semibold text-slate-800">{payout.reviewedBy.name || 'المشرف'}</div>
              {payout.reviewedAt && (
                <div className="text-xs text-slate-400">{payout.reviewedAt.toLocaleDateString('en-GB')}</div>
              )}
            </div>
          )}

          <PayoutReviewActions
            payoutId={payout.id}
            status={payout.status}
            checklistPassed={checklist.every((c) => c.passed)}
          />
        </div>
      </div>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <div className="text-[11px] font-bold text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-800">{value}</div>
    </div>
  );
}

function SectionCard({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-bold text-slate-500">{label}</div>
      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-7 text-slate-700">{value}</div>
    </div>
  );
}
