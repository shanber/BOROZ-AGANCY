import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import {
  BriefcaseBusiness,
  CheckCircle2,
  FolderKanban,
  ListTodo,
  MailOpen,
  WalletMinimal,
} from 'lucide-react';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { formatCurrency } from '@/app/lib/formatters';
import {
  formatRelativeTime,
  getProjectHealth,
  getProjectProgress,
} from '@/app/lib/execution';
import { getProjectStatusLabel } from '@/app/lib/project-utils';
import { resolveServiceLabel } from '@/app/lib/services';
import {
  OpsBadge,
  OpsEmptyState,
  OpsHealthBadge,
  OpsPageHeader,
  OpsProgressBar,
  OpsSectionHeader,
  OpsSurface,
  OpsTimeline,
} from '@/app/components/execution/OpsUI';

function getTaskStatusLabel(status: string) {
  switch (status) {
    case 'NOT_STARTED':
      return 'لم يبدأ';
    case 'IN_PROGRESS':
      return 'قيد التنفيذ';
    case 'AWAITING_CLIENT':
      return 'بانتظار العميل';
    case 'COMPLETED':
      return 'مكتمل';
    default:
      return status;
  }
}

async function getExpertWorkspaceData(userId: string) {
  const profile = await prisma.expertProfile.findUnique({
    where: { userId },
    include: {
      services: {
        where: { isActive: true },
        include: { service: { select: { nameAr: true, name: true } } },
        take: 6,
      },
    },
  });

  if (!profile) return null;

  const [
    invitations,
    submittedOffers,
    activeProjects,
    pendingPayouts,
    notifications,
    currentTasks,
    revisionRequests,
  ] = await Promise.all([
    prisma.offerInvitation.findMany({
      where: { expertProfileId: profile.id, status: { in: ['INVITED', 'VIEWED'] } },
      orderBy: { invitedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        invitedAt: true,
        order: {
          select: {
            id: true,
            storeName: true,
            serviceType: true,
            orderNumber: true,
          },
        },
      },
    }),
    prisma.offer.findMany({
      where: { expertProfileId: profile.id, status: 'SUBMITTED' },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        price: true,
        deliveryDays: true,
        submittedAt: true,
        updatedAt: true,
        order: {
          select: {
            id: true,
            orderNumber: true,
            storeName: true,
            serviceType: true,
          },
        },
      },
    }),
    prisma.project.findMany({
      where: {
        deletedAt: null,
        expertProfileId: profile.id,
        status: { in: ['KICKOFF_PENDING', 'PENDING', 'ACTIVE', 'IN_PROGRESS', 'PAUSED', 'ON_HOLD', 'REVISION_REQUESTED', 'DELIVERED'] },
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        status: true,
        dueDate: true,
        updatedAt: true,
        order: {
          select: {
            storeName: true,
            serviceType: true,
          },
        },
      },
    }),
    prisma.providerPayout.findMany({
      where: { providerId: userId, status: 'PENDING_REVIEW' },
      orderBy: { createdAt: 'asc' },
      take: 5,
      select: {
        id: true,
        amount: true,
        createdAt: true,
        project: {
          select: {
            name: true,
            order: { select: { storeName: true } },
          },
        },
      },
    }),
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: {
        id: true,
        title: true,
        message: true,
        url: true,
        createdAt: true,
        type: true,
      },
    }),
    prisma.task.findMany({
      where: {
        assignedToId: userId,
        deletedAt: null,
        status: { not: 'COMPLETED' },
      },
      orderBy: [{ dueDate: 'asc' }, { updatedAt: 'desc' }],
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        dueDate: true,
        project: { select: { id: true, name: true } },
      },
    }),
    prisma.projectDelivery.count({
      where: {
        status: 'REVISION_REQUESTED',
        project: { expertProfileId: profile.id, deletedAt: null },
      },
    }),
  ]);

  const recentActivity = notifications.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.message,
    href: item.url,
    time: formatRelativeTime(item.createdAt),
    tone:
      item.type === 'DELIVERY_REVISION_REQUESTED'
        ? ('amber' as const)
        : item.type === 'DELIVERY_SUBMITTED'
        ? ('emerald' as const)
        : item.type === 'PAYOUT_APPROVED' || item.type === 'PAYOUT_PAID'
        ? ('indigo' as const)
        : ('slate' as const),
  }));

  return {
    profile,
    invitations,
    submittedOffers,
    activeProjects,
    pendingPayouts,
    currentTasks,
    recentActivity,
    revisionRequests,
  };
}

export default async function ProviderDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.globalRole !== 'PROVIDER') {
    redirect('/login');
  }

  if (session.user.approvalStatus !== 'APPROVED') {
    redirect('/dashboard/provider/pending');
  }

  const data = await getExpertWorkspaceData(session.user.id);
  if (!data) {
    redirect('/dashboard/provider/pending');
  }

  const activeServices = data.profile.services.map((item) => item.service.nameAr || item.service.name).slice(0, 3);

  return (
    <div className="space-y-6">
      <OpsPageHeader
        eyebrow="Expert Workspace"
        title="مساحة عمل الخبير"
        description="أدر الدعوات والعروض والمشاريع والمستحقات من واجهة تنفيذ واحدة واضحة ومباشرة."
      >
        <OpsBadge tone="cyan" label={`دعوات تحتاج رد ${data.invitations.length}`} />
        <OpsBadge tone="amber" label={`طلبات تعديل ${data.revisionRequests}`} />
        <OpsBadge tone="slate" label={`خدمات مفعلة ${activeServices.length}`} />
      </OpsPageHeader>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-6">
          <OpsSurface>
            <OpsSectionHeader
              title="Invitations"
              description="الفرص التي بانتظار مراجعتك وتقديم عرضك عليها."
              action={<Link href="/dashboard/provider/opportunities" className="text-sm font-semibold text-[#06B6D4] hover:text-[#0891B2]">عرض الكل</Link>}
            />
            {data.invitations.length === 0 ? (
              <OpsEmptyState
                icon={MailOpen}
                title="لا توجد دعوات حالياً"
                description="عندما تتم دعوتك إلى فرصة مناسبة لتخصصك، ستظهر هنا مباشرة."
              />
            ) : (
              <div className="space-y-3 p-6">
                {data.invitations.map((invitation) => (
                  <Link key={invitation.id} href={`/dashboard/provider/opportunities/${invitation.order.id}`} className="block rounded-[22px] border border-slate-200 p-4 transition-colors hover:bg-slate-50">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{invitation.order.orderNumber}</div>
                        <div className="mt-2 text-sm font-bold text-[#0B132B]">{invitation.order.storeName}</div>
                        <div className="mt-1 text-sm text-slate-500">{resolveServiceLabel(invitation.order.serviceType)}</div>
                      </div>
                      <div className="text-xs font-medium text-slate-400">{formatRelativeTime(invitation.invitedAt)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </OpsSurface>

          <OpsSurface>
            <OpsSectionHeader
              title="Offers Submitted"
              description="العروض المرسلة التي ما زالت في مرحلة القرار أو المراجعة."
              action={<Link href="/dashboard/provider/opportunities" className="text-sm font-semibold text-[#06B6D4] hover:text-[#0891B2]">إدارة العروض</Link>}
            />
            {data.submittedOffers.length === 0 ? (
              <OpsEmptyState
                icon={BriefcaseBusiness}
                title="لا توجد عروض مرسلة حالياً"
                description="ابدأ من الدعوات المفتوحة لتقديم عروض مناسبة وفتح مشاريع جديدة."
              />
            ) : (
              <div className="space-y-3 p-6">
                {data.submittedOffers.map((offer) => (
                  <div key={offer.id} className="rounded-[22px] border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{offer.order.orderNumber}</div>
                        <div className="mt-2 text-sm font-bold text-[#0B132B]">{offer.order.storeName}</div>
                        <div className="mt-1 text-sm text-slate-500">{resolveServiceLabel(offer.order.serviceType)}</div>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-[#0B132B]">{formatCurrency(offer.price)}</div>
                        <div className="mt-1 text-[11px] font-medium text-slate-400">{offer.deliveryDays} يوم</div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs font-medium text-slate-500">آخر تحديث {formatRelativeTime(offer.submittedAt || offer.updatedAt)}</div>
                  </div>
                ))}
              </div>
            )}
          </OpsSurface>

          <OpsSurface>
            <OpsSectionHeader
              title="Active Projects"
              description="المشاريع المفتوحة التي تحتاج تنفيذ أو متابعة أو إعادة تسليم."
              action={<Link href="/dashboard/projects" className="text-sm font-semibold text-[#06B6D4] hover:text-[#0891B2]">فتح المشاريع</Link>}
            />
            {data.activeProjects.length === 0 ? (
              <OpsEmptyState
                icon={FolderKanban}
                title="لا توجد مشاريع نشطة"
                description="عندما يتم اختيار أحد عروضك، سينتقل العمل هنا كمسار تنفيذ فعلي."
              />
            ) : (
              <div className="space-y-4 p-6">
                {data.activeProjects.map((project) => {
                  const health = getProjectHealth({ status: project.status, dueDate: project.dueDate });
                  const progress = getProjectProgress(project.status);

                  return (
                    <div key={project.id} className="rounded-[24px] border border-slate-200 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold text-[#0B132B]">{project.name}</div>
                          <div className="mt-1 text-sm text-slate-500">
                            {project.order?.storeName || 'بدون متجر مرتبط'} - {resolveServiceLabel(project.order?.serviceType || '')}
                          </div>
                        </div>
                        <OpsHealthBadge health={health} />
                      </div>
                      <div className="mt-4">
                        <OpsProgressBar value={progress} label="Progress %" />
                      </div>
                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <div className="text-[11px] font-semibold text-slate-500">Current Phase</div>
                          <div className="mt-2 text-sm font-semibold text-[#0B132B]">{getProjectStatusLabel(project.status)}</div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <div className="text-[11px] font-semibold text-slate-500">Last Update</div>
                          <div className="mt-2 text-sm font-semibold text-[#0B132B]">{formatRelativeTime(project.updatedAt)}</div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Link href={`/dashboard/projects/${project.id}`} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#0B132B] hover:bg-slate-50">
                          فتح المشروع
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </OpsSurface>
        </div>

        <div className="space-y-6">
          <OpsSurface>
            <OpsSectionHeader
              title="Pending Payouts"
              description="المستحقات التي تنتظر مراجعة الإدارة قبل اعتماد الصرف."
              action={<Link href="/dashboard/provider/payouts" className="text-sm font-semibold text-[#06B6D4] hover:text-[#0891B2]">تفاصيل المستحقات</Link>}
            />
            {data.pendingPayouts.length === 0 ? (
              <OpsEmptyState
                icon={WalletMinimal}
                title="لا توجد مستحقات معلقة"
                description="سيظهر هنا فقط ما وصل إلى مرحلة انتظار مراجعة الصرف."
              />
            ) : (
              <div className="space-y-3 p-6">
                {data.pendingPayouts.map((payout) => (
                  <div key={payout.id} className="rounded-[22px] border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-[#0B132B]">{payout.project.name}</div>
                        <div className="mt-1 text-sm text-slate-500">{payout.project.order?.storeName || 'بدون متجر مرتبط'}</div>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-[#0B132B]">{formatCurrency(payout.amount)}</div>
                        <div className="mt-1 text-[11px] font-medium text-slate-400">{formatRelativeTime(payout.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </OpsSurface>

          <OpsSurface>
            <OpsSectionHeader title="Recent Activity" description="آخر التحديثات التشغيلية المتعلقة بمشاريعك وعروضك ومراجعاتك." />
            <OpsTimeline
              items={data.recentActivity}
              emptyTitle="لا توجد تحديثات بعد"
              emptyDescription="ستظهر هنا التحديثات الحقيقية فقط عند حدوثها داخل مسار التنفيذ."
            />
          </OpsSurface>

          <OpsSurface>
            <OpsSectionHeader title="Current Tasks" description="المهام المباشرة المسندة إليك داخل المشاريع الحالية." />
            {data.currentTasks.length === 0 ? (
              <OpsEmptyState
                icon={ListTodo}
                title="لا توجد مهام مسندة حالياً"
                description="عندما يبدأ تنظيم العمل على مستوى المهام داخل مشروع ما، ستظهر هنا فقط العناصر المفتوحة."
              />
            ) : (
              <div className="space-y-3 p-6">
                {data.currentTasks.map((task) => (
                  <Link key={task.id} href={`/dashboard/projects/${task.project.id}`} className="block rounded-[22px] border border-slate-200 p-4 transition-colors hover:bg-slate-50">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-[#0B132B]">{task.title}</div>
                        <div className="mt-1 text-sm text-slate-500">{task.project.name}</div>
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-semibold text-slate-500">{getTaskStatusLabel(task.status)}</div>
                        <div className="mt-1 text-[11px] font-medium text-slate-400">
                          {task.dueDate ? formatRelativeTime(task.dueDate) : 'بدون موعد'}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </OpsSurface>

          <OpsSurface>
            <OpsSectionHeader title="Current Services" description="الخدمات المفعلة حالياً في ملفك المهني داخل بروز." />
            <div className="flex flex-wrap gap-2 p-6">
              {activeServices.length > 0 ? (
                activeServices.map((service) => <OpsBadge key={service} tone="slate" label={service} />)
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle2 size={16} className="text-slate-300" />
                  لا توجد خدمات مفعلة حالياً.
                </div>
              )}
            </div>
          </OpsSurface>
        </div>
      </div>
    </div>
  );
}
