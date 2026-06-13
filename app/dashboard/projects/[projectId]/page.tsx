import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import { ArrowRight, Files, WalletMinimal } from 'lucide-react';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import {
  getMessagingBlockedReason,
  getProjectStatusLabel,
  getRoleLabel,
} from '@/app/lib/project-utils';
import { getProviderDisplayName } from '@/app/lib/provider-opportunities';
import { getOrderStatusLabel } from '@/app/lib/order-status';
import { resolveServiceLabel } from '@/app/lib/services';
import { formatCurrency, formatDate, formatNumber } from '@/app/lib/formatters';
import {
  formatRelativeTime,
  getNextProjectMilestone,
  getProjectHealth,
  getProjectProgress,
  getRequiredActionForRole,
} from '@/app/lib/execution';
import { ProjectKickoffButton } from '@/app/components/projects/ProjectKickoffButton';
import { ProjectDeliverySection } from '@/app/components/projects/ProjectDeliverySection';
import { ProjectMessagesSection } from '@/app/components/projects/ProjectMessagesSection';
import {
  OpsBadge,
  OpsHealthBadge,
  OpsMetaGrid,
  OpsPageHeader,
  OpsProgressBar,
  OpsSectionHeader,
  OpsSurface,
  OpsTabs,
  OpsTimeline,
} from '@/app/components/execution/OpsUI';

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'messages', label: 'Messages' },
  { key: 'files', label: 'Files' },
  { key: 'deliveries', label: 'Deliveries' },
] as const;

type ProjectTab = (typeof tabs)[number]['key'];

function getProjectTone(status: string) {
  switch (status) {
    case 'ACTIVE':
    case 'IN_PROGRESS':
      return 'indigo';
    case 'DELIVERED':
      return 'emerald';
    case 'REVISION_REQUESTED':
    case 'PAUSED':
    case 'ON_HOLD':
      return 'amber';
    case 'COMPLETED':
      return 'emerald';
    case 'KICKOFF_PENDING':
    case 'PENDING':
      return 'violet';
    default:
      return 'slate';
  }
}

function getPayoutLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING_REVIEW: 'بانتظار مراجعة الصرف',
    APPROVED: 'معتمد للصرف',
    ON_HOLD: 'موقوف مؤقتاً',
    PAID: 'تم الصرف',
    CANCELLED: 'ملغي',
  };
  return labels[status] || status;
}

function getPayoutTone(status: string) {
  switch (status) {
    case 'APPROVED':
    case 'PAID':
      return 'emerald';
    case 'ON_HOLD':
      return 'rose';
    case 'PENDING_REVIEW':
    default:
      return 'amber';
  }
}

function formatFileSize(value?: number | null) {
  if (!value) return 'غير محدد';
  if (value < 1024) return `${formatNumber(value)} B`;
  if (value < 1024 * 1024) return `${formatNumber((value / 1024).toFixed(1))} KB`;
  return `${formatNumber((value / (1024 * 1024)).toFixed(1))} MB`;
}

function buildTimeline(project: {
  id: string;
  name: string;
  createdAt: Date;
  startDate: Date | null;
  acceptedOffer: {
    acceptedAt: Date | null;
  } | null;
  deliveries: Array<{
    id: string;
    title: string;
    submittedAt: Date;
    approvedAt: Date | null;
    revisionRequestedAt: Date | null;
    revisionNote: string | null;
  }>;
  messages: Array<{
    id: string;
    body: string;
    createdAt: Date;
    senderUser: {
      name: string | null;
      globalRole: string;
    };
  }>;
}) {
  const items = [
    {
      id: 'project-created',
      createdAt: project.createdAt,
      title: 'تم إنشاء المشروع من العرض المختار',
      description: project.name,
      tone: 'violet' as const,
    },
    ...(project.acceptedOffer?.acceptedAt
      ? [
          {
            id: 'offer-accepted',
            createdAt: project.acceptedOffer.acceptedAt,
            title: 'تم اختيار الخبير',
            description: 'انتقل الطلب من مرحلة العروض إلى التنفيذ.',
            tone: 'cyan' as const,
          },
        ]
      : []),
    ...(project.startDate
      ? [
          {
            id: 'project-started',
            createdAt: project.startDate,
            title: 'بدأ التنفيذ',
            description: 'تم تفعيل المشروع وفتح العمل داخله.',
            tone: 'indigo' as const,
          },
        ]
      : []),
    ...project.deliveries.flatMap((delivery) => [
      {
        id: `delivery-submitted-${delivery.id}`,
        createdAt: delivery.submittedAt,
        title: 'تم رفع تسليم جديد',
        description: delivery.title,
        tone: 'emerald' as const,
      },
      ...(delivery.revisionRequestedAt
        ? [
            {
              id: `delivery-revision-${delivery.id}`,
              createdAt: delivery.revisionRequestedAt,
              title: 'تم طلب مراجعة على التسليم',
              description: delivery.revisionNote || 'تم طلب تعديل على آخر تسليم.',
              tone: 'amber' as const,
            },
          ]
        : []),
      ...(delivery.approvedAt
        ? [
            {
              id: `delivery-approved-${delivery.id}`,
              createdAt: delivery.approvedAt,
              title: 'تم اعتماد التسليم',
              description: delivery.title,
              tone: 'emerald' as const,
            },
          ]
        : []),
    ]),
    ...project.messages.map((message) => ({
      id: `message-${message.id}`,
      createdAt: message.createdAt,
      title: `تحديث جديد من ${message.senderUser.name || getRoleLabel(message.senderUser.globalRole)}`,
      description: message.body.length > 140 ? `${message.body.slice(0, 140)}...` : message.body,
      tone: 'slate' as const,
    })),
  ];

  return items
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((item) => ({
      ...item,
      time: formatRelativeTime(item.createdAt),
    }));
}

function resolveTab(tab?: string): ProjectTab {
  return tabs.some((item) => item.key === tab) ? (tab as ProjectTab) : 'overview';
}

export default async function ProjectDetailsPage({
  params,
  searchParams,
}: {
  params: { projectId: string };
  searchParams?: { tab?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const where =
    session.user.globalRole === 'ADMIN'
      ? { id: params.projectId }
      : session.user.globalRole === 'PROVIDER'
      ? {
          id: params.projectId,
          acceptedOffer: {
            expertProfile: {
              userId: session.user.id,
            },
          },
        }
      : {
          id: params.projectId,
          order: {
            userId: session.user.id,
          },
        };

  const project = await prisma.project.findFirst({
    where,
    select: {
      id: true,
      name: true,
      status: true,
      description: true,
      scopeSummary: true,
      deliverables: true,
      price: true,
      deliveryDays: true,
      revisionsIncluded: true,
      startDate: true,
      dueDate: true,
      createdAt: true,
      updatedAt: true,
      acceptedOffer: {
        select: {
          messageToMerchant: true,
          acceptedAt: true,
          submittedAt: true,
          expertProfile: {
            select: {
              specialtyTitle: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      order: {
        select: {
          orderNumber: true,
          storeName: true,
          serviceType: true,
          status: true,
          description: true,
          notes: true,
        },
      },
      deliveries: {
        orderBy: { submittedAt: 'desc' },
        select: {
          id: true,
          status: true,
          title: true,
          description: true,
          deliverableLinks: true,
          revisionNote: true,
          submittedAt: true,
          approvedAt: true,
          revisionRequestedAt: true,
          submittedBy: {
            select: { name: true },
          },
        },
      },
      messages: {
        orderBy: { createdAt: 'asc' },
        take: 50,
        select: {
          id: true,
          body: true,
          createdAt: true,
          senderUser: {
            select: {
              name: true,
              globalRole: true,
            },
          },
        },
      },
      fileAssets: {
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: {
          id: true,
          fileName: true,
          fileUrl: true,
          fileType: true,
          fileSize: true,
          createdAt: true,
        },
      },
      payout: {
        select: {
          id: true,
          status: true,
          amount: true,
          platformFee: true,
          grossAmount: true,
          holdReason: true,
          paidAt: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const isKickoffPending = project.status === 'KICKOFF_PENDING' || project.status === 'PENDING';
  const isProviderOwner = session.user.globalRole === 'PROVIDER';
  const isMerchantOwner = session.user.globalRole === 'MERCHANT';
  const isAdminViewer = session.user.globalRole === 'ADMIN';
  const activeTab = resolveTab(searchParams?.tab);
  const health = getProjectHealth({ status: project.status, dueDate: project.dueDate });
  const progress = getProjectProgress(project.status);
  const timelineItems = buildTimeline(project);
  const latestActivity = timelineItems[0]?.title || 'لا توجد تحديثات بعد';
  const assignedExpert = project.acceptedOffer?.expertProfile
    ? getProviderDisplayName(project.acceptedOffer.expertProfile)
    : 'خبير بروز';
  const requiredAction = getRequiredActionForRole(project.status, session.user.globalRole);

  const tabLinks = tabs.map((tab) => ({
    ...tab,
    href: `/dashboard/projects/${project.id}?tab=${tab.key}`,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-start">
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B132B] transition-colors hover:bg-slate-50"
        >
          <ArrowRight size={16} />
          العودة إلى المشاريع
        </Link>
      </div>

      <OpsPageHeader
        eyebrow={project.order.orderNumber}
        title={project.name}
        description="هذا المشروع هو مساحة التنفيذ الرسمية داخل بروز: النطاق، الرسائل، الملفات، التسليمات، وكل ما يحتاج متابعة من مكان واحد."
        actions={<OpsBadge tone={getProjectTone(project.status)} label={getProjectStatusLabel(project.status)} />}
      >
        <OpsBadge tone="slate" label={resolveServiceLabel(project.order.serviceType)} />
        <OpsBadge tone="cyan" label={project.order.storeName} />
      </OpsPageHeader>

      <OpsSurface className="p-6 md:p-7">
        <OpsMetaGrid
          items={[
            { label: 'Current Status', value: getProjectStatusLabel(project.status) },
            { label: 'Assigned Expert', value: assignedExpert },
            { label: 'Start Date', value: project.startDate ? formatDate(project.startDate) : 'لم يبدأ بعد' },
            { label: 'Target Delivery', value: project.dueDate ? formatDate(project.dueDate) : 'غير محدد' },
          ]}
        />
        <div className="mt-6">
          <OpsProgressBar value={progress} label="Progress %" />
        </div>
      </OpsSurface>

      <OpsTabs tabs={tabLinks} active={activeTab} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_340px]">
        <div className="space-y-6">
          {activeTab === 'overview' ? (
            <>
              <OpsSurface>
                <OpsSectionHeader title="Overview" description="صورة تنفيذية سريعة للحالة الحالية وما الذي يجب أن يحدث بعد ذلك." />
                <div className="p-6">
                  <OpsMetaGrid
                    columns={3}
                    items={[
                      { label: 'Current Phase', value: getProjectStatusLabel(project.status) },
                      { label: 'Next Milestone', value: getNextProjectMilestone(project.status) },
                      {
                        label: isMerchantOwner ? 'Required Merchant Action' : 'Required Action',
                        value: requiredAction,
                      },
                      { label: 'Project Health', value: <OpsHealthBadge health={health} /> },
                      { label: 'Latest Activity', value: latestActivity },
                      { label: 'Order Status', value: getOrderStatusLabel(project.order.status) },
                    ]}
                  />
                </div>
              </OpsSurface>

              <OpsSurface>
                <OpsSectionHeader title="Execution Scope" description="الملخص التنفيذي، المخرجات، ورسالة الخبير المرتبطة بالعقد التنفيذي الحالي." />
                <div className="space-y-5 p-6">
                  <ContentBlock label="نطاق التنفيذ" value={project.scopeSummary || project.order.description || project.description || 'سيتم تحديد النطاق مع بداية التنفيذ.'} />
                  <ContentBlock label="المخرجات المتفق عليها" value={project.deliverables || 'سيتم إظهار المخرجات التفصيلية هنا بعد تثبيتها ضمن التنفيذ.'} />
                  <ContentBlock label="رسالة الخبير" value={project.acceptedOffer?.messageToMerchant || 'لا توجد رسالة تشغيلية إضافية من الخبير.'} />
                </div>
              </OpsSurface>
            </>
          ) : null}

          {activeTab === 'timeline' ? (
            <OpsSurface>
              <OpsSectionHeader title="Timeline" description="التاريخ الكامل للتنفيذ منذ إنشاء المشروع وحتى آخر تسليم ورسالة تشغيلية." />
              <OpsTimeline
                items={timelineItems}
                emptyTitle="لا يوجد سجل زمني بعد"
                emptyDescription="بمجرد بدء العمل أو إضافة رسائل أو تسليمات، ستظهر هنا بصيغة تشغيلية مرتبة."
              />
            </OpsSurface>
          ) : null}

          {activeTab === 'messages' ? (
            <ProjectMessagesSection projectId={project.id} messagingBlockedReason={getMessagingBlockedReason(project.status)} />
          ) : null}

          {activeTab === 'files' ? (
            <OpsSurface>
              <OpsSectionHeader title="Files" description="ملفات المشروع المرتبطة بالتنفيذ الحالي، مع تواريخ إضافتها وروابط الوصول لها." />
              {project.fileAssets.length === 0 ? (
                <div className="p-6">
                  <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                      <Files size={24} />
                    </div>
                    <h3 className="text-base font-bold text-[#0B132B]">لا توجد ملفات مرتبطة بعد</h3>
                    <p className="mt-2 text-sm text-slate-500">عند إضافة ملفات تنفيذية أو مرفقات خاصة بالمشروع، ستظهر هنا بشكل منظم.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 p-6">
                  {project.fileAssets.map((file) => (
                    <a
                      key={file.id}
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-[22px] border border-slate-200 p-4 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold text-[#0B132B]">{file.fileName}</div>
                          <div className="mt-1 text-sm text-slate-500">{file.fileType || 'ملف مشروع'}</div>
                        </div>
                        <div className="text-left text-xs text-slate-400">
                          <div>{formatFileSize(file.fileSize)}</div>
                          <div className="mt-1">{formatRelativeTime(file.createdAt)}</div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </OpsSurface>
          ) : null}

          {activeTab === 'deliveries' ? (
            <OpsSurface>
              <OpsSectionHeader title="Deliveries" description="مسار التسليم والاعتماد وطلبات المراجعة لهذا المشروع داخل بروز." />
              <div className="p-6 pt-0">
                <ProjectDeliverySection
                  projectId={project.id}
                  projectStatus={project.status}
                  initialDeliveries={project.deliveries.map((delivery) => ({
                    ...delivery,
                    submittedAt: delivery.submittedAt.toISOString(),
                    approvedAt: delivery.approvedAt?.toISOString() || null,
                    revisionRequestedAt: delivery.revisionRequestedAt?.toISOString() || null,
                  }))}
                  isProviderOwner={isProviderOwner}
                  isMerchantOwner={isMerchantOwner}
                  isAdminViewer={isAdminViewer}
                />
              </div>
            </OpsSurface>
          ) : null}
        </div>

        <aside className="space-y-6">
          <OpsSurface>
            <OpsSectionHeader title="Execution Snapshot" description="معلومات تشغيلية سريعة يحتاجها أي طرف مشارك في التنفيذ." />
            <div className="p-6">
              <OpsMetaGrid
                columns={2}
                items={[
                  { label: 'Service', value: resolveServiceLabel(project.order.serviceType) },
                  { label: 'Store', value: project.order.storeName },
                  { label: 'Budget', value: project.price ? formatCurrency(project.price) : 'غير محدد' },
                  { label: 'Delivery Window', value: project.deliveryDays ? `${project.deliveryDays} يوم` : 'غير محدد' },
                  { label: 'Revisions', value: project.revisionsIncluded !== null && project.revisionsIncluded !== undefined ? String(project.revisionsIncluded) : 'غير محدد' },
                  { label: 'Last Update', value: formatRelativeTime(project.updatedAt) },
                ]}
              />
            </div>
          </OpsSurface>

          <OpsSurface>
            <OpsSectionHeader title="Next Action" description="ما الذي يحتاج انتباهاً الآن حتى لا يتعطل مسار التنفيذ." />
            <div className="space-y-4 p-6">
              <OpsHealthBadge health={health} />
              <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
                {requiredAction}
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-4">
                <div className="text-[11px] font-semibold text-slate-500">Latest Activity</div>
                <div className="mt-2 text-sm font-semibold text-[#0B132B]">{latestActivity}</div>
              </div>
            </div>
          </OpsSurface>

          {isProviderOwner && isKickoffPending ? (
            <OpsSurface>
              <OpsSectionHeader title="Provider Action" description="بعد مراجعة النطاق، ابدأ التنفيذ رسمياً من داخل بروز." />
              <div className="space-y-4 p-6">
                <p className="text-sm leading-7 text-slate-500">لن ينتقل المشروع إلى التنفيذ الفعلي إلا بعد بدء العمل من طرفك داخل المنصة.</p>
                <ProjectKickoffButton projectId={project.id} />
              </div>
            </OpsSurface>
          ) : null}

          {isAdminViewer && isKickoffPending ? (
            <OpsSurface>
              <OpsSectionHeader title="Ops Watch" description="المشروع لم يبدأ بعد، لكنه دخل بالفعل مسار التنفيذ الداخلي." />
              <div className="p-6 text-sm leading-7 text-slate-500">
                راقب بدء التنفيذ وتدخل فقط إذا بقي المشروع معلقاً دون نشاط أو ظهرت حاجة تشغيلية للتصعيد.
              </div>
            </OpsSurface>
          ) : null}

          {project.payout && !isMerchantOwner ? (
            <OpsSurface>
              <OpsSectionHeader title="Payout" description="ملخص المستحقات المرتبطة بهذا المشروع بعد التسليم والمراجعة." />
              <div className="space-y-4 p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0B132B]">
                  <WalletMinimal size={16} />
                  {getPayoutLabel(project.payout.status)}
                </div>
                <OpsBadge tone={getPayoutTone(project.payout.status)} label={getPayoutLabel(project.payout.status)} />
                <OpsMetaGrid
                  columns={2}
                  items={[
                    { label: 'Gross Amount', value: formatCurrency(project.payout.grossAmount) },
                    { label: 'Platform Fee', value: formatCurrency(project.payout.platformFee) },
                    { label: 'Net Payout', value: formatCurrency(project.payout.amount) },
                    { label: 'Paid At', value: project.payout.paidAt ? formatDate(project.payout.paidAt) : 'لم يتم الصرف بعد' },
                  ]}
                />
                {project.payout.status === 'ON_HOLD' && project.payout.holdReason ? (
                  <div className="rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-7 text-rose-700">
                    {project.payout.holdReason}
                  </div>
                ) : null}
              </div>
            </OpsSurface>
          ) : null}

          <OpsSurface>
            <OpsSectionHeader title="Order Context" description="الطلب الأصلي الذي بدأ منه هذا التنفيذ داخل بروز." />
            <div className="space-y-5 p-6">
              <OpsMetaGrid
                columns={2}
                items={[
                  { label: 'Order Number', value: project.order.orderNumber },
                  { label: 'Order Status', value: getOrderStatusLabel(project.order.status) },
                ]}
              />
              <ContentBlock label="وصف الطلب" value={project.order.description || 'لا يوجد وصف إضافي.'} compact />
              {project.order.notes ? <ContentBlock label="ملاحظات إضافية" value={project.order.notes} compact /> : null}
            </div>
          </OpsSurface>
        </aside>
      </div>
    </div>
  );
}

function ContentBlock({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold text-slate-500">{label}</div>
      <div className={compact ? 'rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600' : 'rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-5 text-sm leading-8 text-slate-600'}>
        {value}
      </div>
    </div>
  );
}
