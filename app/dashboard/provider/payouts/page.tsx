import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import { WalletMinimal, CheckCircle2, Clock, AlertTriangle, TrendingUp, Percent } from 'lucide-react';
import prisma from '@/app/lib/prisma';
import { formatCurrency, formatShortDate } from '@/app/lib/formatters';
import { getPlatformCommissionRate } from '@/app/lib/platform-settings';

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

const projectStatusLabels: Record<string, string> = {
  KICKOFF_PENDING: 'بانتظار البدء',
  ACTIVE: 'قيد التنفيذ',
  IN_PROGRESS: 'قيد التنفيذ',
  PAUSED: 'متوقف',
  ON_HOLD: 'معلق',
  DELIVERED: 'تم التسليم',
  REVISION_REQUESTED: 'طلب تعديل',
  PENDING: 'قيد التنفيذ',
};

const projectStatusStyles: Record<string, string> = {
  KICKOFF_PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
  PAUSED: 'bg-slate-100 text-slate-600 border-slate-200',
  ON_HOLD: 'bg-orange-50 text-orange-700 border-orange-200',
  DELIVERED: 'bg-teal-50 text-teal-700 border-teal-200',
  REVISION_REQUESTED: 'bg-rose-50 text-rose-700 border-rose-200',
  PENDING: 'bg-blue-50 text-blue-700 border-blue-200',
};

const EXPECTED_STATUSES = [
  'KICKOFF_PENDING',
  'ACTIVE',
  'IN_PROGRESS',
  'DELIVERED',
  'REVISION_REQUESTED',
  'PAUSED',
  'ON_HOLD',
  'PENDING',
] as const;

async function calcNet(gross: number): Promise<number> {
  const rate = await getPlatformCommissionRate();
  return Math.round((gross - gross * (rate / 100)) * 100) / 100;
}

export default async function ProviderPayoutsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.globalRole !== 'PROVIDER') {
    redirect('/login');
  }
  if (session.user.approvalStatus !== 'APPROVED') {
    redirect('/dashboard/provider/pending');
  }

  const profile = await prisma.expertProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!profile) {
    redirect('/dashboard/provider/pending');
  }

  // Official payouts
  const payouts = await prisma.providerPayout.findMany({
    where: { providerId: session.user.id },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          order: {
            select: {
              storeName: true,
              orderNumber: true,
              serviceType: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Expected earnings from active projects without a payout record
  const expectedProjects = await prisma.project.findMany({
    where: {
      expertProfileId: profile.id,
      deletedAt: null,
      status: { in: EXPECTED_STATUSES as unknown as any[] },
      price: { not: null },
      payout: null,
    },
    include: {
      order: {
        select: {
          orderNumber: true,
          storeName: true,
          serviceType: true,
        },
      },
      acceptedOffer: {
        select: {
          deliveryDays: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const pendingSum = payouts
    .filter((p) => p.status === 'PENDING_REVIEW')
    .reduce((sum, p) => sum + p.amount, 0);

  const approvedSum = payouts
    .filter((p) => p.status === 'APPROVED')
    .reduce((sum, p) => sum + p.amount, 0);

  const paidSum = payouts
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  const commissionRate = await getPlatformCommissionRate();
  const expectedNets = await Promise.all(expectedProjects.map((p) => calcNet(p.price!)));
  const expectedSum = expectedNets.reduce((a, b) => a + b, 0);

  const hasAnyContent = payouts.length > 0 || expectedProjects.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-900">المستحقات</h1>
        <p className="text-sm text-slate-500 mt-1">المبالغ الرسمية والمتوقعة الخاصة بك داخل بروز.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 mb-1">
            <TrendingUp size={14} />
            المبالغ المتوقعة
          </div>
          <p className="text-lg font-bold font-numeric text-slate-900 tabular-nums">
            {formatCurrency(expectedSum)}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            {commissionRate}% عمولة بروز • من المشاريع النشطة قبل اعتماد التسليم
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-[11px] font-medium text-amber-600 mb-1">
            <Clock size={14} />
            بانتظار المراجعة
          </div>
          <p className="text-lg font-bold font-numeric text-slate-900 tabular-nums">
            {formatCurrency(pendingSum)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-600 mb-1">
            <CheckCircle2 size={14} />
            معتمد للصرف
          </div>
          <p className="text-lg font-bold font-numeric text-slate-900 tabular-nums">
            {formatCurrency(approvedSum)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-[11px] font-medium text-blue-600 mb-1">
            <CheckCircle2 size={14} />
            تم الصرف
          </div>
          <p className="text-lg font-bold font-numeric text-slate-900 tabular-nums">
            {formatCurrency(paidSum)}
          </p>
        </div>
      </div>

      {/* Expected earnings section */}
      {expectedProjects.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-display font-bold text-slate-900">مبالغ متوقعة من المشاريع الجارية</h2>
            <p className="text-xs text-slate-500 mt-1">
              هذه مبالغ تقديرية وقد تختلف عند إنشاء طلب الصرف إذا تغيرت إعدادات العمولة. لا تصبح مستحقة للصرف إلا بعد اعتماد التسليم من التاجر ومراجعة بروز.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-500">
                  <th className="px-5 py-3">المشروع</th>
                  <th className="px-5 py-3">رقم الطلب</th>
                  <th className="px-5 py-3">حالة المشروع</th>
                  <th className="px-5 py-3">إجمالي المشروع</th>
                  <th className="px-5 py-3">المتوقع لك ({commissionRate}% عمولة)</th>
                  <th className="px-5 py-3">مدة التسليم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expectedProjects.map((p, idx) => {
                  const gross = p.price!;
                  const net = expectedNets[idx];
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-slate-800">
                        <Link
                          href={`/dashboard/projects/${p.id}`}
                          className="hover:text-blue-600 hover:underline"
                        >
                          {p.name}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{p.order.orderNumber}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${projectStatusStyles[p.status] || ''}`}>
                          {projectStatusLabels[p.status] || p.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-numeric tabular-nums text-slate-600">{gross.toLocaleString()} ر.س</td>
                      <td className="px-5 py-3.5">
                        <span className="font-bold font-numeric tabular-nums text-emerald-600">{net.toLocaleString()} ر.س</span>
                        <span className="mr-1 text-[10px] text-slate-400">(غير مستحق بعد)</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs">
                        {p.acceptedOffer?.deliveryDays ? `${p.acceptedOffer.deliveryDays} يوم` : '-'}
                        {p.dueDate && <span className="block">{formatShortDate(p.dueDate)}</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <Percent size={12} className="text-amber-500" />
              عمولة بروز الحالية: {commissionRate}%. هذه مبالغ تقديرية وقد تختلف عند إنشاء طلب الصرف إذا تغيرت إعدادات العمولة.
            </p>
          </div>
        </div>
      )}

      {/* Official payouts section */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-display font-bold text-slate-900">المستحقات الرسمية</h2>
          <p className="text-xs text-slate-500 mt-1">
            المبالغ المعتمدة وجاهزة للصرف أو تم صرفها بالفعل.
          </p>
        </div>
        {payouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-3">
              <WalletMinimal size={28} className="text-slate-400" />
            </div>
            <p className="text-sm text-slate-500">لا توجد مستحقات رسمية مسجلة حتى الآن.</p>
            <p className="text-xs text-slate-400 mt-1">
              عند إكمال مشروع واعتماد التسليم النهائي، سيتم إنشاء مستحقاتك هنا.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-500">
                  <th className="px-5 py-3">المشروع</th>
                  <th className="px-5 py-3">رقم الطلب</th>
                  <th className="px-5 py-3">إجمالي المشروع</th>
                  <th className="px-5 py-3">صافي المستحق</th>
                  <th className="px-5 py-3">الحالة</th>
                  <th className="px-5 py-3">تاريخ الإنشاء</th>
                  <th className="px-5 py-3">تاريخ الصرف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-slate-800">
                      <Link
                        href={`/dashboard/projects/${p.project.id}`}
                        className="hover:text-blue-600 hover:underline"
                      >
                        {p.project.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{p.project.order?.orderNumber || '-'}</td>
                    <td className="px-5 py-3.5 font-numeric tabular-nums text-slate-600">{p.grossAmount.toLocaleString()} ر.س</td>
                    <td className="px-5 py-3.5 font-bold font-numeric tabular-nums text-emerald-600">{p.amount.toLocaleString()} ر.س</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusStyles[p.status] || ''}`}>
                        {statusLabels[p.status] || p.status}
                      </span>
                      {p.status === 'ON_HOLD' && p.holdReason && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-red-600">
                          <AlertTriangle size={10} />
                          {p.holdReason}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">{formatShortDate(p.createdAt)}</td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">{p.paidAt ? formatShortDate(p.paidAt) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Empty state when nothing at all */}
      {!hasAnyContent && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <WalletMinimal size={32} className="text-slate-300" />
          </div>
          <p className="text-sm text-slate-500">لا توجد مستحقات أو مبالغ متوقعة حتى الآن.</p>
          <p className="text-xs text-slate-400 mt-1">
            عند بدء المشاريع واعتماد التسليم، ستظهر مستحقاتك هنا.
          </p>
        </div>
      )}
    </div>
  );
}
