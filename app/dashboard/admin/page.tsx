import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import {
  AlertTriangle,
  BriefcaseBusiness,
  ClipboardCheck,
  Upload,
  Users,
  WalletMinimal,
} from 'lucide-react';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { formatCurrency } from '@/app/lib/formatters';
import { formatRelativeTime } from '@/app/lib/execution';
import { getProjectStatusLabel } from '@/app/lib/project-utils';
import { resolveServiceLabel } from '@/app/lib/services';
import { OpsBadge, OpsEmptyState, OpsPageHeader, OpsSectionHeader, OpsSurface } from '@/app/components/execution/OpsUI';

async function getOperationsCenterData() {
  const riskDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  const [
    pendingRequests,
    pendingProviders,
    collectingOffers,
    atRiskProjects,
    awaitingDeliveries,
    awaitingPayouts,
    pendingRequestCount,
    pendingProviderCount,
    collectingOfferCount,
    atRiskProjectCount,
    awaitingDeliveryCount,
    awaitingPayoutCount,
  ] = await Promise.all([
    prisma.order.findMany({
      where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } },
      orderBy: { createdAt: 'asc' },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        storeName: true,
        serviceType: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.expertProfile.findMany({
      where: { approvalStatus: 'PENDING' },
      orderBy: { createdAt: 'asc' },
      take: 5,
      select: {
        id: true,
        specialtyTitle: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.order.findMany({
      where: {
        status: { in: ['APPROVED_FOR_OFFERS', 'COLLECTING_OFFERS'] },
        selectedOfferId: null,
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        storeName: true,
        serviceType: true,
        updatedAt: true,
        offers: { where: { status: 'SUBMITTED' }, select: { id: true } },
      },
    }),
    prisma.project.findMany({
      where: {
        deletedAt: null,
        status: { in: ['KICKOFF_PENDING', 'ACTIVE', 'IN_PROGRESS', 'PAUSED', 'ON_HOLD', 'REVISION_REQUESTED'] },
        OR: [
          { status: { in: ['PAUSED', 'ON_HOLD', 'REVISION_REQUESTED'] } },
          { dueDate: { lte: riskDate } },
        ],
      },
      orderBy: [{ dueDate: 'asc' }, { updatedAt: 'desc' }],
      take: 5,
      select: {
        id: true,
        name: true,
        status: true,
        dueDate: true,
        order: { select: { storeName: true } },
      },
    }),
    prisma.projectDelivery.findMany({
      where: { status: 'SUBMITTED' },
      orderBy: { submittedAt: 'asc' },
      take: 5,
      select: {
        id: true,
        title: true,
        submittedAt: true,
        project: {
          select: {
            id: true,
            name: true,
            order: { select: { storeName: true } },
          },
        },
      },
    }),
    prisma.providerPayout.findMany({
      where: { status: 'PENDING_REVIEW' },
      orderBy: { createdAt: 'asc' },
      take: 5,
      select: {
        id: true,
        amount: true,
        createdAt: true,
        provider: { select: { name: true } },
        project: {
          select: {
            name: true,
            order: { select: { storeName: true } },
          },
        },
      },
    }),
    prisma.order.count({ where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } } }),
    prisma.expertProfile.count({ where: { approvalStatus: 'PENDING' } }),
    prisma.order.count({ where: { status: { in: ['APPROVED_FOR_OFFERS', 'COLLECTING_OFFERS'] }, selectedOfferId: null } }),
    prisma.project.count({
      where: {
        deletedAt: null,
        status: { in: ['KICKOFF_PENDING', 'ACTIVE', 'IN_PROGRESS', 'PAUSED', 'ON_HOLD', 'REVISION_REQUESTED'] },
        OR: [
          { status: { in: ['PAUSED', 'ON_HOLD', 'REVISION_REQUESTED'] } },
          { dueDate: { lte: riskDate } },
        ],
      },
    }),
    prisma.projectDelivery.count({ where: { status: 'SUBMITTED' } }),
    prisma.providerPayout.count({ where: { status: 'PENDING_REVIEW' } }),
  ]);

  return {
    pendingRequests,
    pendingProviders,
    collectingOffers,
    atRiskProjects,
    awaitingDeliveries,
    awaitingPayouts,
    counts: {
      pendingRequests: pendingRequestCount,
      pendingProviders: pendingProviderCount,
      collectingOffers: collectingOfferCount,
      atRiskProjects: atRiskProjectCount,
      awaitingDeliveries: awaitingDeliveryCount,
      awaitingPayouts: awaitingPayoutCount,
    },
  };
}

function QueuePanel({
  icon: Icon,
  title,
  description,
  count,
  href,
  children,
}: {
  icon: typeof ClipboardCheck;
  title: string;
  description: string;
  count: number;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <OpsSurface>
      <OpsSectionHeader
        title={title}
        description={description}
        action={
          <Link href={href} className="text-sm font-semibold text-[#06B6D4] hover:text-[#0891B2]">
            فتح الصف
          </Link>
        }
      />
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0B132B] shadow-sm">
              <Icon size={19} />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">العناصر الحالية</div>
              <div className="mt-1 text-sm font-semibold text-[#0B132B]">Operational queue</div>
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight text-[#0B132B]">{count}</div>
        </div>
        {children}
      </div>
    </OpsSurface>
  );
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.globalRole !== 'ADMIN') {
    redirect('/dashboard');
  }

  const data = await getOperationsCenterData();

  return (
    <div className="space-y-6">
      <OpsPageHeader
        eyebrow="Operations Center"
        title="مركز عمليات بروز"
        description="شاشتك التشغيلية لمراجعة الطلبات، اعتماد الخبراء، مراقبة التنفيذ، وإدارة الصفوف التي تحتاج قراراً الآن."
      >
        <OpsBadge tone="slate" label="No vanity metrics" />
        <OpsBadge tone="violet" label="Queues only" />
      </OpsPageHeader>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <QueuePanel
          icon={ClipboardCheck}
          title="Requests Pending Review"
          description="طلبات تحتاج قرار مراجعة قبل الانتقال للعروض."
          count={data.counts.pendingRequests}
          href="/dashboard/admin/requests"
        >
          {data.pendingRequests.length === 0 ? (
            <OpsEmptyState
              icon={ClipboardCheck}
              title="لا توجد طلبات بانتظار المراجعة"
              description="سيظهر هنا فقط ما يحتاج قراراً من الإدارة على مستوى الطلبات الجديدة."
            />
          ) : (
            <div className="space-y-3">
              {data.pendingRequests.map((order) => (
                <Link key={order.id} href={`/dashboard/admin/requests/${order.id}`} className="block rounded-[22px] border border-slate-200 p-4 transition-colors hover:bg-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{order.orderNumber}</div>
                      <div className="mt-2 text-sm font-bold text-[#0B132B]">{order.storeName}</div>
                      <div className="mt-1 text-sm text-slate-500">{resolveServiceLabel(order.serviceType)}</div>
                    </div>
                    <div className="text-xs font-medium text-slate-400">{formatRelativeTime(order.createdAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </QueuePanel>

        <QueuePanel
          icon={Users}
          title="Providers Pending Approval"
          description="ملفات خبراء تحتاج اعتماداً أو رفضاً قبل دخولهم مسار التنفيذ."
          count={data.counts.pendingProviders}
          href="/dashboard/admin/providers"
        >
          {data.pendingProviders.length === 0 ? (
            <OpsEmptyState
              icon={Users}
              title="لا يوجد خبراء بانتظار الاعتماد"
              description="ستظهر هنا فقط الطلبات الجديدة للانضمام كخبير معتمد داخل بروز."
            />
          ) : (
            <div className="space-y-3">
              {data.pendingProviders.map((provider) => (
                <Link key={provider.id} href={`/dashboard/admin/providers/${provider.id}`} className="block rounded-[22px] border border-slate-200 p-4 transition-colors hover:bg-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-[#0B132B]">{provider.user.name || provider.user.email}</div>
                      <div className="mt-1 text-sm text-slate-500">{provider.specialtyTitle || 'ملف مهني قيد الاكتمال'}</div>
                    </div>
                    <div className="text-xs font-medium text-slate-400">{formatRelativeTime(provider.createdAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </QueuePanel>

        <QueuePanel
          icon={BriefcaseBusiness}
          title="Offers Being Collected"
          description="طلبات دخلت مرحلة العروض ولم يصل اختيار نهائي بعد."
          count={data.counts.collectingOffers}
          href="/dashboard/admin/requests"
        >
          {data.collectingOffers.length === 0 ? (
            <OpsEmptyState
              icon={BriefcaseBusiness}
              title="لا توجد طلبات في جمع العروض"
              description="عندما يتم فتح طلب للخبراء المعتمدين دون حسم نهائي، سيظهر هنا."
            />
          ) : (
            <div className="space-y-3">
              {data.collectingOffers.map((order) => (
                <Link key={order.id} href={`/dashboard/admin/requests/${order.id}`} className="block rounded-[22px] border border-slate-200 p-4 transition-colors hover:bg-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{order.orderNumber}</div>
                      <div className="mt-2 text-sm font-bold text-[#0B132B]">{order.storeName}</div>
                      <div className="mt-1 text-sm text-slate-500">{resolveServiceLabel(order.serviceType)}</div>
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-bold text-[#0B132B]">{order.offers.length}</div>
                      <div className="text-[11px] font-medium text-slate-400">عرض</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </QueuePanel>

        <QueuePanel
          icon={AlertTriangle}
          title="Projects At Risk"
          description="مشاريع اقتربت من موعدها أو تحتاج متابعة تشغيلية مباشرة."
          count={data.counts.atRiskProjects}
          href="/dashboard/projects"
        >
          {data.atRiskProjects.length === 0 ? (
            <OpsEmptyState
              icon={AlertTriangle}
              title="لا توجد مشاريع حرجة حالياً"
              description="ستظهر هنا فقط المشاريع التي تحتاج متابعة تشغيلية، وليست مجرد مشاريع نشطة."
            />
          ) : (
            <div className="space-y-3">
              {data.atRiskProjects.map((project) => (
                <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="block rounded-[22px] border border-slate-200 p-4 transition-colors hover:bg-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-[#0B132B]">{project.name}</div>
                      <div className="mt-1 text-sm text-slate-500">{project.order?.storeName || 'بدون متجر مرتبط'}</div>
                      <div className="mt-2 text-xs font-medium text-slate-400">{getProjectStatusLabel(project.status)}</div>
                    </div>
                    <div className="text-xs font-medium text-slate-400">
                      {project.dueDate ? formatRelativeTime(project.dueDate) : 'بدون موعد'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </QueuePanel>

        <QueuePanel
          icon={Upload}
          title="Deliveries Awaiting Review"
          description="تسليمات جديدة تحتاج متابعة قبل إغلاق الحلقة التنفيذية."
          count={data.counts.awaitingDeliveries}
          href="/dashboard/projects"
        >
          {data.awaitingDeliveries.length === 0 ? (
            <OpsEmptyState
              icon={Upload}
              title="لا توجد تسليمات جديدة"
              description="سيظهر هنا كل تسليم يحتاج مراجعة أو متابعة داخل المشروع."
            />
          ) : (
            <div className="space-y-3">
              {data.awaitingDeliveries.map((delivery) => (
                <Link key={delivery.id} href={`/dashboard/projects/${delivery.project.id}?tab=deliveries`} className="block rounded-[22px] border border-slate-200 p-4 transition-colors hover:bg-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-[#0B132B]">{delivery.title}</div>
                      <div className="mt-1 text-sm text-slate-500">{delivery.project.name}</div>
                      <div className="mt-2 text-xs font-medium text-slate-400">{delivery.project.order?.storeName || 'بدون متجر مرتبط'}</div>
                    </div>
                    <div className="text-xs font-medium text-slate-400">{formatRelativeTime(delivery.submittedAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </QueuePanel>

        <QueuePanel
          icon={WalletMinimal}
          title="Payouts Awaiting Review"
          description="مستحقات خبراء تحتاج قرار مراجعة قبل الاعتماد أو التعليق أو الصرف."
          count={data.counts.awaitingPayouts}
          href="/dashboard/admin/payouts"
        >
          {data.awaitingPayouts.length === 0 ? (
            <OpsEmptyState
              icon={WalletMinimal}
              title="لا توجد مستحقات بانتظار المراجعة"
              description="تظهر هنا فقط المدفوعات التي تحتاج قراراً إدارياً على مستوى الصرف."
            />
          ) : (
            <div className="space-y-3">
              {data.awaitingPayouts.map((payout) => (
                <Link key={payout.id} href={`/dashboard/admin/payouts/${payout.id}`} className="block rounded-[22px] border border-slate-200 p-4 transition-colors hover:bg-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-[#0B132B]">{payout.project.name}</div>
                      <div className="mt-1 text-sm text-slate-500">{payout.provider.name || 'خبير بروز'}</div>
                      <div className="mt-2 text-xs font-medium text-slate-400">{payout.project.order?.storeName || 'بدون متجر مرتبط'}</div>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-[#0B132B]">{formatCurrency(payout.amount)}</div>
                      <div className="mt-1 text-[11px] font-medium text-slate-400">{formatRelativeTime(payout.createdAt)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </QueuePanel>
      </div>
    </div>
  );
}
