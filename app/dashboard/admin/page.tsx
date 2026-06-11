import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import { ClipboardCheck, Users, FolderOpen, Upload, WalletMinimal, ArrowLeft } from 'lucide-react';

async function getQueueCounts() {
  const [pendingRequests, pendingProviders, activeProjects, pendingDeliveries, pendingPayouts] =
    await Promise.all([
      prisma.order.count({ where: { status: 'SUBMITTED' } }),
      prisma.expertProfile.count({ where: { approvalStatus: 'PENDING' } }),
      prisma.project.count({ where: { status: 'ACTIVE' } }),
      prisma.projectDelivery.count({ where: { status: 'SUBMITTED' } }),
      prisma.providerPayout.count({ where: { status: 'PENDING_REVIEW' } }),
    ]);

  return { pendingRequests, pendingProviders, activeProjects, pendingDeliveries, pendingPayouts };
}

const queueCards = [
  {
    key: 'requests',
    title: 'طلبات تحتاج مراجعة',
    countKey: 'pendingRequests' as const,
    icon: ClipboardCheck,
    href: '/dashboard/admin/requests',
    color: 'text-blue-600 bg-blue-50',
    emptyLabel: 'لا توجد طلبات بانتظار المراجعة',
  },
  {
    key: 'providers',
    title: 'خبراء بانتظار الاعتماد',
    countKey: 'pendingProviders' as const,
    icon: Users,
    href: '/dashboard/admin/providers',
    color: 'text-amber-600 bg-amber-50',
    emptyLabel: 'جميع الخبراء معتمدون',
  },
  {
    key: 'projects',
    title: 'مشاريع نشطة',
    countKey: 'activeProjects' as const,
    icon: FolderOpen,
    href: '/dashboard/projects',
    color: 'text-emerald-600 bg-emerald-50',
    emptyLabel: 'لا توجد مشاريع نشطة حالياً',
  },
  {
    key: 'deliveries',
    title: 'تسليمات بانتظار الإجراء',
    countKey: 'pendingDeliveries' as const,
    icon: Upload,
    href: '/dashboard/projects',
    color: 'text-purple-600 bg-purple-50',
    emptyLabel: 'لا توجد تسليمات معلقة',
  },
  {
    key: 'payouts',
    title: 'مدفوعات بانتظار مراجعة الصرف',
    countKey: 'pendingPayouts' as const,
    icon: WalletMinimal,
    href: '/dashboard/admin/payouts',
    color: 'text-rose-600 bg-rose-50',
    emptyLabel: 'جميع المدفوعات بانتظار المراجعة',
  },
];

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.globalRole !== 'ADMIN') {
    redirect('/dashboard');
  }

  const counts = await getQueueCounts();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900">
          مرحباً مسؤول بروز
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          نظرة عامة على طلبات المنصة والمهام التي تحتاج متابعة
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {queueCards.map((card) => {
          const Icon = card.icon;
          const count = counts[card.countKey];
          return (
            <Link
              key={card.key}
              href={card.href}
              className="block bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
                  <Icon size={20} />
                </div>
                <span className="text-2xl font-bold font-numeric text-slate-900 tabular-nums">
                  {count}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-display font-semibold text-slate-900">
                {card.title}
              </h3>
              {count === 0 && (
                <p className="mt-1 text-xs text-slate-400">{card.emptyLabel}</p>
              )}
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                <span>عرض الكل</span>
                <ArrowLeft size={14} />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-display font-bold text-slate-900 mb-3">المختصر</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {queueCards.map((card) => {
            const count = counts[card.countKey];
            return (
              <div key={card.key} className="text-center">
                <div className="text-xl font-bold font-numeric text-slate-900 tabular-nums">{count}</div>
                <div className="text-[10px] font-medium text-slate-500 mt-0.5">{card.title}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
