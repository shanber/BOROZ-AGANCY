import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Eye } from 'lucide-react';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { getProviderDisplayName } from '@/app/lib/provider-opportunities';

const pageSize = 20;

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

export default async function AdminPayoutsPage({
  searchParams,
}: {
  searchParams?: { status?: string; page?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.globalRole !== 'ADMIN') {
    redirect('/dashboard');
  }

  const statusFilter = searchParams?.status?.trim() || '';
  const page = Math.max(Number(searchParams?.page || '1'), 1);

  const where = statusFilter ? { status: statusFilter as any } : {};

  const [payouts, totalCount] = await Promise.all([
    prisma.providerPayout.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        grossAmount: true,
        platformFee: true,
        amount: true,
        status: true,
        holdReason: true,
        createdAt: true,
        paidAt: true,
        project: {
          select: {
            id: true,
            name: true,
            acceptedOffer: {
              select: {
                expertProfile: {
                  select: {
                    specialtyTitle: true,
                    user: { select: { name: true } },
                  },
                },
              },
            },
            order: {
              select: {
                storeName: true,
                user: { select: { name: true, email: true } },
              },
            },
          },
        },
      },
    }),
    prisma.providerPayout.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">إدارة الصرف</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/dashboard/admin/payouts"
          className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
            !statusFilter ? 'bg-[#06B6D4] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          الكل ({totalCount})
        </Link>
        {Object.entries(statusLabels).map(([key, label]) => (
          <Link
            key={key}
            href={`/dashboard/admin/payouts?status=${key}`}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
              statusFilter === key ? 'bg-[#06B6D4] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-500">
              <th className="px-4 py-3">المشروع</th>
              <th className="px-4 py-3">التاجر</th>
              <th className="px-4 py-3">مقدم الخدمة</th>
              <th className="px-4 py-3">إجمالي المشروع</th>
              <th className="px-4 py-3">عمولة بروز</th>
              <th className="px-4 py-3">صافي مستحق الخبير</th>
              <th className="px-4 py-3">الحالة</th>
              <th className="px-4 py-3">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p) => (
              <tr key={p.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50/50">
                <td className="px-4 py-3 font-semibold text-slate-800">{p.project.name}</td>
                <td className="px-4 py-3 text-slate-600">{p.project.order?.user?.name || p.project.order?.storeName || '-'}</td>
                <td className="px-4 py-3 text-slate-600">
                  {p.project.acceptedOffer?.expertProfile ? getProviderDisplayName(p.project.acceptedOffer.expertProfile) : '-'}
                </td>
                <td className="px-4 py-3 font-semibold text-slate-800">{p.grossAmount.toLocaleString()} ر.س</td>
                <td className="px-4 py-3 text-slate-600">{p.platformFee.toLocaleString()} ر.س</td>
                <td className="px-4 py-3 font-semibold text-emerald-600">{p.amount.toLocaleString()} ر.س</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusStyles[p.status] || ''}`}>
                    {statusLabels[p.status] || p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/admin/payouts/${p.id}`}
                    className="flex items-center gap-1 text-xs font-bold text-[#06B6D4] hover:underline"
                  >
                    <Eye size={14} />
                    مراجعة
                  </Link>
                </td>
              </tr>
            ))}
            {payouts.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                  لا توجد طلبات صرف في هذه الحالة.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/dashboard/admin/payouts?${new URLSearchParams({ ...(statusFilter ? { status: statusFilter } : {}), page: String(p) }).toString()}`}
              className={`rounded-lg px-3 py-1.5 text-sm font-bold transition-colors ${
                p === page ? 'bg-[#06B6D4] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
