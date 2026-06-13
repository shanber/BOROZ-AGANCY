import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { ClipboardList, FolderKanban, Plus } from 'lucide-react';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { getProviderDisplayName } from '@/app/lib/provider-opportunities';
import { getOrderStatusLabel } from '@/app/lib/order-status';
import { getProjectStatusLabel } from '@/app/lib/project-utils';
import { resolveServiceLabel } from '@/app/lib/services';
import {
  buildWorkflowCounts,
  formatRelativeTime,
  getProjectHealth,
  getProjectProgress,
} from '@/app/lib/execution';
import {
  OpsBadge,
  OpsEmptyState,
  OpsHealthBadge,
  OpsPageHeader,
  OpsProgressBar,
  OpsSectionHeader,
  OpsSurface,
  OpsTimeline,
  OpsWorkflowPipeline,
} from '@/app/components/execution/OpsUI';

function getTimelineTone(type?: string | null) {
  switch (type) {
    case 'OFFER_RECEIVED':
      return 'cyan';
    case 'PROJECT_CREATED':
    case 'PROJECT_STARTED':
      return 'indigo';
    case 'DELIVERY_SUBMITTED':
      return 'emerald';
    case 'DELIVERY_REVISION_REQUESTED':
      return 'amber';
    default:
      return 'slate';
  }
}

async function getMerchantExecutionCenter(userId: string) {
  const [ordersWithOffers, clarificationOrders, deliveryProjects, activeProjects, orderStatuses, notifications, recentOrders, recentDeliveries] =
    await Promise.all([
      prisma.order.findMany({
        where: {
          userId,
          selectedOfferId: null,
          status: { in: ['APPROVED_FOR_OFFERS', 'COLLECTING_OFFERS', 'OFFER_SELECTED'] },
          offers: { some: { status: 'SUBMITTED' } },
        },
        orderBy: { updatedAt: 'desc' },
        take: 4,
        select: {
          orderNumber: true,
          storeName: true,
          serviceType: true,
          updatedAt: true,
          offers: {
            where: { status: 'SUBMITTED' },
            select: { id: true },
          },
        },
      }),
      prisma.order.findMany({
        where: { userId, status: 'NEEDS_CHANGES' },
        orderBy: { updatedAt: 'desc' },
        take: 4,
        select: {
          orderNumber: true,
          storeName: true,
          serviceType: true,
          adminNote: true,
          updatedAt: true,
        },
      }),
      prisma.project.findMany({
        where: {
          deletedAt: null,
          status: 'DELIVERED',
          order: { userId },
          deliveries: { some: { status: 'SUBMITTED' } },
        },
        orderBy: { updatedAt: 'desc' },
        take: 4,
        select: {
          id: true,
          name: true,
          updatedAt: true,
          deliveries: {
            where: { status: 'SUBMITTED' },
            orderBy: { submittedAt: 'desc' },
            take: 1,
            select: { submittedAt: true },
          },
        },
      }),
      prisma.project.findMany({
        where: {
          deletedAt: null,
          order: { userId },
          status: {
            in: ['KICKOFF_PENDING', 'PENDING', 'ACTIVE', 'IN_PROGRESS', 'PAUSED', 'ON_HOLD', 'DELIVERED', 'REVISION_REQUESTED'],
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 6,
        select: {
          id: true,
          name: true,
          status: true,
          updatedAt: true,
          dueDate: true,
          order: {
            select: {
              orderNumber: true,
              storeName: true,
              serviceType: true,
            },
          },
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
        },
      }),
      prisma.order.findMany({
        where: { userId },
        select: { status: true },
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
      prisma.order.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: 4,
        select: {
          orderNumber: true,
          serviceType: true,
          status: true,
          updatedAt: true,
        },
      }),
      prisma.projectDelivery.findMany({
        where: {
          project: {
            deletedAt: null,
            order: { userId },
          },
        },
        orderBy: { submittedAt: 'desc' },
        take: 4,
        select: {
          id: true,
          submittedAt: true,
          status: true,
          project: { select: { id: true, name: true } },
        },
      }),
    ]);

  const attentionItems = [
    ...ordersWithOffers.map((order) => ({
      id: `offer-${order.orderNumber}`,
      tone: 'cyan' as const,
      status: 'عرض جديد بانتظار قرارك',
      projectName: `${order.storeName} - ${resolveServiceLabel(order.serviceType)}`,
      requiredAction: `راجع ${order.offers.length} عروض جديدة وحدد العرض الأنسب لبدء التنفيذ.`,
      dueTime: formatRelativeTime(order.updatedAt),
      href: `/dashboard/offers/${encodeURIComponent(order.orderNumber)}`,
      actionLabel: 'مراجعة العروض',
    })),
    ...deliveryProjects.map((project) => ({
      id: `delivery-${project.id}`,
      tone: 'emerald' as const,
      status: 'تسليم بانتظار الاعتماد',
      projectName: project.name,
      requiredAction: 'راجع التسليم الحالي ثم اختر الاعتماد أو طلب تعديل.',
      dueTime: formatRelativeTime(project.deliveries[0]?.submittedAt || project.updatedAt),
      href: `/dashboard/projects/${project.id}?tab=deliveries`,
      actionLabel: 'مراجعة التسليم',
    })),
    ...clarificationOrders.map((order) => ({
      id: `changes-${order.orderNumber}`,
      tone: 'amber' as const,
      status: 'طلب يحتاج توضيحاً',
      projectName: `${order.storeName} - ${resolveServiceLabel(order.serviceType)}`,
      requiredAction: order.adminNote || 'حدّث تفاصيل الطلب ثم أعد إرساله للمراجعة.',
      dueTime: formatRelativeTime(order.updatedAt),
      href: `/dashboard/orders/${encodeURIComponent(order.orderNumber)}/edit`,
      actionLabel: 'تحديث الطلب',
    })),
  ].sort((a, b) => a.dueTime.localeCompare(b.dueTime));

  const fallbackTimelineItems = [
    ...recentOrders.map((order) => ({
      id: `order-${order.orderNumber}`,
      createdAt: order.updatedAt,
      title: `تحديث على الطلب ${order.orderNumber}`,
      description: `${getOrderStatusLabel(order.status)} - ${resolveServiceLabel(order.serviceType)}`,
      href: `/dashboard/orders/${encodeURIComponent(order.orderNumber)}`,
      tone: 'slate' as const,
    })),
    ...recentDeliveries.map((delivery) => ({
      id: `delivery-feed-${delivery.id}`,
      createdAt: delivery.submittedAt,
      title: 'تم رفع تسليم جديد',
      description: delivery.project.name,
      href: `/dashboard/projects/${delivery.project.id}?tab=deliveries`,
      tone: delivery.status === 'REVISION_REQUESTED' ? ('amber' as const) : ('emerald' as const),
    })),
  ];

  const timelineItems = (notifications.length > 0
    ? notifications.map((item) => ({
        id: item.id,
        createdAt: item.createdAt,
        title: item.title,
        description: item.message,
        href: item.url,
        tone: getTimelineTone(item.type) as 'slate' | 'cyan' | 'indigo' | 'emerald' | 'amber',
      }))
    : fallbackTimelineItems
  )
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 8)
    .map((item) => ({
      ...item,
      time: formatRelativeTime(item.createdAt),
    }));

  return {
    attentionItems,
    activeProjects,
    pipelineSteps: buildWorkflowCounts(orderStatuses.map((item) => item.status)),
    timelineItems,
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  if (session.user.globalRole === 'ADMIN') {
    redirect('/dashboard/admin');
  }

  if (session.user.globalRole === 'PROVIDER') {
    redirect('/dashboard/provider');
  }

  const data = await getMerchantExecutionCenter(session.user.id);

  return (
    <div className="space-y-6">
      <OpsPageHeader
        eyebrow="Execution Center"
        title="مركز تنفيذ المتجر"
        description="تابع الطلبات والعروض والمشاريع والتسليمات من مكان واحد."
        actions={
          <Link
            href="/dashboard/orders/new"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#0B132B] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#16213C]"
          >
            <Plus size={16} />
            طلب خدمة جديد
          </Link>
        }
      >
        <OpsBadge tone="slate" label="BOROZ manages execution" />
        <OpsBadge tone="cyan" label="مركز تنفيذ ونمو المتجر" />
      </OpsPageHeader>

      <OpsSurface>
        <OpsSectionHeader
          title="يحتاج انتباهك الآن"
          description="العناصر التي تتطلب قراراً أو تحديثاً من طرفك حتى يستمر التنفيذ بدون تأخير."
        />
        {data.attentionItems.length === 0 ? (
          <OpsEmptyState
            icon={ClipboardList}
            title="لا توجد عناصر عالقة الآن"
            description="كل ما يخص متجرك يتحرك بشكل طبيعي حالياً. ستظهر هنا فقط القرارات أو المراجعات التي تتطلب تدخلك."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 p-6 xl:grid-cols-2">
            {data.attentionItems.map((item) => (
              <div key={item.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <OpsBadge tone={item.tone} label={item.status} />
                    <h3 className="text-base font-bold text-[#0B132B]">{item.projectName}</h3>
                  </div>
                  <div className="text-xs font-medium text-slate-400">{item.dueTime}</div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.requiredAction}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <div className="text-xs font-medium text-slate-500">الخطوة التالية: {item.actionLabel}</div>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B132B] transition-colors hover:bg-slate-100"
                  >
                    {item.actionLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </OpsSurface>

      <OpsSurface>
        <OpsSectionHeader
          title="المشاريع النشطة"
          description="تنفيذ المشاريع الجارية مع المرحلة الحالية، الخبير المسؤول، وصحة التنفيذ."
          action={
            <Link href="/dashboard/projects" className="text-sm font-semibold text-[#06B6D4] hover:text-[#0891B2]">
              عرض جميع المشاريع
            </Link>
          }
        />
        {data.activeProjects.length === 0 ? (
          <OpsEmptyState
            icon={FolderKanban}
            title="لا توجد مشاريع نشطة بعد"
            description="سيظهر التنفيذ هنا بعد اختيار عرض والانتقال من مرحلة الطلب إلى مرحلة المشروع."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 p-6 xl:grid-cols-2">
            {data.activeProjects.map((project) => {
              const health = getProjectHealth({ status: project.status, dueDate: project.dueDate });
              const progress = getProjectProgress(project.status);
              const assignedExpert = project.acceptedOffer?.expertProfile
                ? getProviderDisplayName(project.acceptedOffer.expertProfile)
                : 'خبير بروز';

              return (
                <div key={project.id} className="rounded-[24px] border border-slate-200 bg-white p-5">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          {project.order.orderNumber}
                        </div>
                        <h3 className="mt-2 text-lg font-bold text-[#0B132B]">{project.name}</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {project.order.storeName} - {resolveServiceLabel(project.order.serviceType)}
                        </p>
                      </div>
                      <OpsHealthBadge health={health} />
                    </div>

                    <OpsProgressBar value={progress} label="Progress %" />

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="text-[11px] font-semibold text-slate-500">Current Phase</div>
                        <div className="mt-2 text-sm font-semibold text-[#0B132B]">{getProjectStatusLabel(project.status)}</div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="text-[11px] font-semibold text-slate-500">Assigned Expert</div>
                        <div className="mt-2 text-sm font-semibold text-[#0B132B]">{assignedExpert}</div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="text-[11px] font-semibold text-slate-500">Last Update</div>
                        <div className="mt-2 text-sm font-semibold text-[#0B132B]">{formatRelativeTime(project.updatedAt)}</div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="text-[11px] font-semibold text-slate-500">Project Health</div>
                        <div className="mt-2 text-sm font-semibold text-[#0B132B]">{health}</div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#0B132B] transition-colors hover:bg-slate-50"
                      >
                        فتح المشروع
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </OpsSurface>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.9fr)]">
        <OpsSurface>
          <OpsSectionHeader
            title="سجل التنفيذ"
            description="تسلسل زمني لأهم ما حدث في الطلبات والمشاريع داخل بروز."
          />
          <OpsTimeline
            items={data.timelineItems}
            emptyTitle="لم يبدأ السجل بعد"
            emptyDescription="عندما يبدأ تدفق الطلبات والعروض والتسليمات، ستظهر هنا آخر التحديثات التشغيلية."
          />
        </OpsSurface>

        <OpsSurface>
          <OpsSectionHeader
            title="نظرة على خط التنفيذ"
            description="توزيع طلباتك الحالية على مراحل التشغيل من الطلب وحتى الإكمال."
          />
          <OpsWorkflowPipeline steps={data.pipelineSteps} />
        </OpsSurface>
      </div>
    </div>
  );
}
