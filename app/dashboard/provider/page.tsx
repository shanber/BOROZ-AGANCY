import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import {
  Briefcase,
  MailOpen,
  FolderOpen,
  WalletMinimal,
  RefreshCw,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react';
import prisma from '@/app/lib/prisma';
import { formatCurrency, formatShortDate } from '@/app/lib/formatters';
import { Notification } from '@prisma/client';

async function getProviderData(userId: string) {
  const profile = await prisma.expertProfile.findUnique({
    where: { userId },
    include: {
      services: {
        where: { isActive: true },
        include: { service: { select: { nameAr: true, name: true } } },
        take: 10,
      },
    },
  });
  if (!profile) return null;

  const [
    invitationCount,
    sentOfferCount,
    activeProjectCount,
    pendingPayoutCount,
    pendingPayoutSum,
    recentInvitations,
    activeProjects,
    revisionDeliveries,
    recentNotifications,
  ] = await Promise.all([
    prisma.offerInvitation.count({
      where: { expertProfileId: profile.id, status: { in: ['INVITED', 'VIEWED'] } },
    }),
    prisma.offer.count({
      where: { expertProfileId: profile.id, status: 'SUBMITTED' },
    }),
    prisma.project.count({
      where: {
        expertProfileId: profile.id,
        deletedAt: null,
        status: { in: ['KICKOFF_PENDING', 'ACTIVE', 'PAUSED', 'IN_PROGRESS', 'ON_HOLD'] },
      },
    }),
    prisma.providerPayout.count({
      where: { providerId: userId, status: 'PENDING_REVIEW' },
    }),
    prisma.providerPayout.aggregate({
      where: { providerId: userId, status: 'PENDING_REVIEW' },
      _sum: { amount: true },
    }),
    prisma.offerInvitation.findMany({
      where: { expertProfileId: profile.id, status: { in: ['INVITED', 'VIEWED'] } },
      include: {
        order: { select: { id: true, storeName: true, serviceType: true, createdAt: true } },
      },
      orderBy: { invitedAt: 'desc' },
      take: 5,
    }),
    prisma.project.findMany({
      where: {
        expertProfileId: profile.id,
        deletedAt: null,
        status: { in: ['KICKOFF_PENDING', 'ACTIVE', 'PAUSED', 'IN_PROGRESS', 'ON_HOLD'] },
      },
      include: {
        order: { select: { storeName: true, serviceType: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
    prisma.projectDelivery.count({
      where: {
        status: 'REVISION_REQUESTED',
        project: { expertProfileId: profile.id, deletedAt: null },
      },
    }),
    prisma.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ]);

  return {
    profile,
    invitationCount,
    sentOfferCount,
    activeProjectCount,
    pendingPayoutCount,
    pendingPayoutSum: pendingPayoutSum._sum.amount ?? 0,
    recentInvitations,
    activeProjects,
    revisionDeliveries,
    recentNotifications,
  };
}

function getProjectStatusLabel(status: string): string {
  const map: Record<string, string> = {
    KICKOFF_PENDING: 'بانتظار البدء',
    ACTIVE: 'قيد التنفيذ',
    PAUSED: 'متوقف',
    IN_PROGRESS: 'قيد التنفيذ',
    ON_HOLD: 'معلق',
    DELIVERED: 'تم التسليم',
    REVISION_REQUESTED: 'طلب تعديل',
    COMPLETED: 'مكتمل',
    CANCELLED: 'ملغي',
  };
  return map[status] || status;
}

function getProjectStatusStyle(status: string): string {
  const map: Record<string, string> = {
    KICKOFF_PENDING: 'text-amber-600 bg-amber-50',
    ACTIVE: 'text-emerald-600 bg-emerald-50',
    PAUSED: 'text-slate-600 bg-slate-100',
    IN_PROGRESS: 'text-blue-600 bg-blue-50',
    ON_HOLD: 'text-orange-600 bg-orange-50',
    DELIVERED: 'text-emerald-600 bg-emerald-50',
    REVISION_REQUESTED: 'text-rose-600 bg-rose-50',
  };
  return map[status] || 'text-slate-600 bg-slate-100';
}

export default async function ProviderDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.globalRole !== 'PROVIDER') {
    redirect('/login');
  }
  if (session.user.approvalStatus !== 'APPROVED') {
    redirect('/dashboard/provider/pending');
  }

  const data = await getProviderData(session.user.id);
  if (!data) {
    redirect('/dashboard/provider/pending');
  }

  const {
    profile,
    invitationCount,
    sentOfferCount,
    activeProjectCount,
    pendingPayoutCount,
    pendingPayoutSum,
    recentInvitations,
    activeProjects,
    revisionDeliveries,
    recentNotifications,
  } = data;

  const activeServices = profile.services.filter((s) => s.isActive);
  const displayServices = activeServices.slice(0, 3);

  const hasUnreadNotifications = recentNotifications.length > 0;
  const profileCompletion = [
    profile.specialtyTitle,
    profile.bio,
    profile.portfolioUrl,
    profile.priceRangeMin,
  ].filter(Boolean).length;
  const completionPercent = Math.round((profileCompletion / 4) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-900">
          لوحة مقدم الخدمة
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          تابع فرصك، عروضك، مشاريعك، وتسليماتك من مكان واحد.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Link
          href="/dashboard/provider/opportunities"
          className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <MailOpen size={18} className="text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-slate-500 truncate">الفرص المدعو لها</p>
              <p className="text-lg font-bold font-numeric text-slate-900 tabular-nums">{invitationCount}</p>
            </div>
          </div>
        </Link>
        <Link
          href="/dashboard/provider/opportunities"
          className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
              <Briefcase size={18} className="text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-slate-500 truncate">العروض المرسلة</p>
              <p className="text-lg font-bold font-numeric text-slate-900 tabular-nums">{sentOfferCount}</p>
            </div>
          </div>
        </Link>
        <Link
          href="/dashboard/projects"
          className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <FolderOpen size={18} className="text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-slate-500 truncate">المشاريع النشطة</p>
              <p className="text-lg font-bold font-numeric text-slate-900 tabular-nums">{activeProjectCount}</p>
            </div>
          </div>
        </Link>
        <Link
          href="/dashboard/provider/payouts"
          className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
              <WalletMinimal size={18} className="text-rose-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-slate-500 truncate">المستحقات بانتظار المراجعة</p>
              <p className="text-lg font-bold font-numeric text-slate-900 tabular-nums">
                {pendingPayoutCount > 0 ? formatCurrency(pendingPayoutSum) : '0'}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Content: 2-column on lg+ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left: Operational content (2/3) */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Recent Opportunities */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-display font-bold text-slate-900">أحدث الفرص المدعو لها</h2>
              <Link
                href="/dashboard/provider/opportunities"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                عرض الكل
                <ChevronLeft size={14} />
              </Link>
            </div>
            <div className="p-5">
              {recentInvitations.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {recentInvitations.map((inv) => (
                    <Link
                      key={inv.id}
                      href={`/dashboard/provider/opportunities/${inv.order.id}`}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{inv.order.storeName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{inv.order.serviceType}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-slate-400">{formatShortDate(inv.order.createdAt)}</span>
                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                          <ChevronLeft size={14} className="text-blue-600" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MailOpen size={22} className="text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500">لا توجد فرص مدعو لها حالياً.</p>
                  <p className="text-xs text-slate-400 mt-1">سيتم إشعارك عند دعوتك لفرصة مناسبة لتخصصك.</p>
                </div>
              )}
            </div>
          </div>

          {/* Active Projects */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-display font-bold text-slate-900">مشاريعي النشطة</h2>
              <Link
                href="/dashboard/projects"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                عرض الكل
                <ChevronLeft size={14} />
              </Link>
            </div>
            <div className="p-5">
              {activeProjects.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {activeProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/dashboard/projects/${project.id}`}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{project.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {project.order?.storeName} — {project.order?.serviceType}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${getProjectStatusStyle(project.status)}`}>
                          {getProjectStatusLabel(project.status)}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center">
                          <ChevronLeft size={14} className="text-slate-400" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FolderOpen size={22} className="text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500">لا توجد مشاريع نشطة حالياً.</p>
                  <p className="text-xs text-slate-400 mt-1">عند قبول عرضك على أحد الطلبات، سيتم إنشاء المشروع هنا.</p>
                </div>
              )}
            </div>
          </div>

          {/* Revision Requests */}
          {revisionDeliveries > 0 && (
            <Link
              href="/dashboard/projects"
              className="block bg-white rounded-xl border border-rose-200 p-4 hover:border-rose-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                  <RefreshCw size={18} className="text-rose-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">طلبات تعديل تحتاج إجراء</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    لديك {revisionDeliveries} طلب تعديل على تسليماتك بانتظار المراجعة
                  </p>
                </div>
                <span className="text-xs font-bold text-rose-600 whitespace-nowrap">{revisionDeliveries}</span>
              </div>
            </Link>
          )}
        </div>

        {/* Right: Profile & Status sidebar (1/3) */}
        <div className="space-y-4 md:space-y-6">
          {/* Professional Profile Card */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-display font-bold text-slate-900">ملفك المهني</h2>
            </div>
            <div className="p-5 space-y-4">
              {/* Specialty */}
              <div>
                <p className="text-[11px] font-medium text-slate-500 mb-0.5">التخصص الرئيسي</p>
                <p className="text-sm font-semibold text-slate-900">
                  {profile.specialtyTitle || 'لم يتم التعيين'}
                </p>
              </div>

              {/* Price range if both defined */}
              {profile.priceRangeMin != null && profile.priceRangeMax != null && (
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-0.5">نطاق السعر</p>
                  <p className="text-sm font-semibold font-numeric text-slate-900 tabular-nums">
                    {formatCurrency(profile.priceRangeMin)} — {formatCurrency(profile.priceRangeMax)}
                  </p>
                </div>
              )}

              {/* Active services count + chips */}
              <div>
                <p className="text-[11px] font-medium text-slate-500 mb-1.5">
                  الخدمات المفعّلة ({activeServices.length})
                </p>
                {displayServices.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {displayServices.map((s) => (
                      <span
                        key={s.id}
                        className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded-md"
                      >
                        {s.service.nameAr || s.service.name}
                      </span>
                    ))}
                    {activeServices.length > 3 && (
                      <span className="text-[11px] font-medium text-slate-400 px-1 py-1">
                        +{activeServices.length - 3}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">لا توجد خدمات مفعّلة</p>
                )}
              </div>

              {/* Availability & Completion */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      profile.availability === 'available' ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  />
                  <span className="text-xs font-medium text-slate-600">
                    {profile.availability === 'available' ? 'متاح' : profile.availability || 'غير محدد'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  إكتمال الملف {completionPercent}%
                </span>
              </div>

              {/* Completion bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>

              {/* CTA */}
              <Link
                href="/dashboard/settings"
                className="block w-full text-center text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg py-2.5 transition-colors"
              >
                إدارة الملف المهني
              </Link>
            </div>
          </div>

          {/* Payout Status Card */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-display font-bold text-slate-900">حالة المستحقات</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">بانتظار المراجعة</span>
                <span className="text-sm font-bold font-numeric text-slate-900 tabular-nums">
                  {pendingPayoutCount > 0 ? formatCurrency(pendingPayoutSum) : '0'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">عدد المدفوعات</span>
                <span className="text-sm font-bold font-numeric text-slate-900 tabular-nums">{pendingPayoutCount}</span>
              </div>
              <Link
                href="/dashboard/provider/payouts"
                className="block w-full text-center text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg py-2.5 transition-colors mt-1"
              >
                عرض التفاصيل
              </Link>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-display font-bold text-slate-900">آخر التنبيهات</h2>
            </div>
            <div className="p-5">
              {hasUnreadNotifications ? (
                <div className="divide-y divide-slate-100">
                  {recentNotifications.map((n: Notification) => (
                    <div key={n.id} className="py-2.5 first:pt-0 last:pb-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{n.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 size={20} className="text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500">لا توجد تنبيهات جديدة</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
