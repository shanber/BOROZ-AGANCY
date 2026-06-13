import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import { ArrowRight, FolderKanban, GitBranch, ListChecks, MessageSquareMore } from 'lucide-react';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { merchantOrderOwnershipFilter } from '@/app/lib/order-access';
import { getOrderStatusLabel, getOrderStatusStyle } from '@/app/lib/order-status';
import { resolveServiceLabel } from '@/app/lib/services';
import { buildWorkflowCounts, formatRelativeTime } from '@/app/lib/execution';
import { formatCurrency, formatDate } from '@/app/lib/formatters';
import {
  OpsBadge,
  OpsEmptyState,
  OpsMetaGrid,
  OpsPageHeader,
  OpsSectionHeader,
  OpsSurface,
  OpsWorkflowPipeline,
} from '@/app/components/execution/OpsUI';

function getOrderAction(status: string, hasProject: boolean) {
  switch (status) {
    case 'NEEDS_CHANGES':
      return 'حدّث التفاصيل المطلوبة ثم أعد إرسال الطلب للمراجعة.';
    case 'APPROVED_FOR_OFFERS':
    case 'COLLECTING_OFFERS':
      return 'راجع العروض الواردة عندما تصبح متاحة واختر العرض المناسب.';
    case 'OFFER_SELECTED':
      return hasProject ? 'انتقل إلى المشروع لمتابعة التنفيذ الفعلي.' : 'بانتظار تهيئة المشروع من بروز.';
    case 'IN_EXECUTION':
      return 'تابع المشروع المفتوح والرسائل والتسليمات من مساحة التنفيذ.';
    case 'DELIVERED':
      return 'راجع التسليم داخل المشروع واعتمد أو اطلب مراجعة.';
    case 'COMPLETED':
      return 'اكتمل الطلب بنجاح ولا توجد خطوة مطلوبة حالياً.';
    case 'REJECTED':
      return 'الطلب مرفوض. راجع الملاحظات إن وجدت قبل إعادة التقديم.';
    case 'CANCELLED':
      return 'تم إغلاق الطلب ولن ينتقل إلى مراحل لاحقة.';
    case 'UNDER_REVIEW':
      return 'الطلب قيد المراجعة من إدارة بروز الآن.';
    case 'SUBMITTED':
    default:
      return 'تم استلام الطلب وهو بانتظار بدء المراجعة.';
  }
}

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  if (session.user.globalRole !== 'MERCHANT') {
    redirect('/dashboard');
  }

  const ownerFilter = merchantOrderOwnershipFilter(session);

  const order = await prisma.order.findFirst({
    where: {
      AND: [ownerFilter, { OR: [{ id: params.id }, { orderNumber: params.id }] }],
    },
    select: {
      id: true,
      orderNumber: true,
      storeName: true,
      managerName: true,
      phone: true,
      email: true,
      sallaUrl: true,
      serviceType: true,
      budget: true,
      priority: true,
      description: true,
      notes: true,
      status: true,
      adminNote: true,
      createdAt: true,
      updatedAt: true,
      selectedOfferId: true,
      offers: {
        where: { status: { in: ['SUBMITTED', 'ACCEPTED', 'REJECTED'] } },
        select: {
          id: true,
          status: true,
          price: true,
          deliveryDays: true,
          submittedAt: true,
        },
        orderBy: { submittedAt: 'desc' },
      },
      project: {
        select: {
          id: true,
          name: true,
          status: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const pipelineSteps = buildWorkflowCounts([order.status]);

  const primaryAction = order.status === 'NEEDS_CHANGES'
    ? {
        href: `/dashboard/orders/${encodeURIComponent(order.orderNumber)}/edit`,
        label: 'تحديث الطلب',
      }
    : order.status === 'APPROVED_FOR_OFFERS' || order.status === 'COLLECTING_OFFERS'
    ? {
        href: `/dashboard/offers/${encodeURIComponent(order.orderNumber)}`,
        label: 'مراجعة العروض',
      }
    : order.project?.id
    ? {
        href: `/dashboard/projects/${order.project.id}`,
        label: 'فتح المشروع',
      }
    : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-start">
        <Link href="/dashboard/orders" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B132B] transition-colors hover:bg-slate-50">
          <ArrowRight size={16} />
          العودة إلى الطلبات
        </Link>
      </div>

      <OpsPageHeader
        eyebrow={order.orderNumber}
        title="تفاصيل الطلب"
        description="هذه الصفحة تشرح أين يقف طلبك الآن داخل مسار بروز، وما هي الخطوة التالية قبل أن يتحول إلى تنفيذ فعلي."
        actions={<span className={`rounded-full px-3 py-1 text-xs font-bold ${getOrderStatusStyle(order.status)}`}>{getOrderStatusLabel(order.status)}</span>}
      >
        <OpsBadge tone="slate" label={resolveServiceLabel(order.serviceType)} />
        <OpsBadge tone="cyan" label={order.storeName} />
      </OpsPageHeader>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_340px]">
        <div className="space-y-6">
          <OpsSurface>
            <OpsSectionHeader title="الموقع الحالي في المسار" description="كل طلب في بروز يمر بخطوات واضحة: طلب، مراجعة، عروض، اختيار، تنفيذ، تسليم، إكمال." />
            <OpsWorkflowPipeline steps={pipelineSteps} />
          </OpsSurface>

          <OpsSurface>
            <OpsSectionHeader title="ملخص الطلب" description="المعطيات الأساسية التي يعتمد عليها فريق بروز والخبراء عند تقييم الطلب وتنفيذه." />
            <div className="p-6">
              <OpsMetaGrid
                items={[
                  { label: 'الخدمة', value: resolveServiceLabel(order.serviceType) },
                  { label: 'الأولوية', value: order.priority || 'عادي' },
                  { label: 'الميزانية', value: order.budget ? formatCurrency(order.budget) : 'قيد التقدير' },
                  { label: 'عدد العروض', value: String(order.offers.length) },
                  { label: 'تاريخ الإنشاء', value: formatDate(order.createdAt) },
                  { label: 'آخر تحديث', value: formatRelativeTime(order.updatedAt) },
                ]}
              />
            </div>
          </OpsSurface>

          <OpsSurface>
            <OpsSectionHeader title="النطاق والملاحظات" description="الوصف التشغيلي الذي يبدأ منه تقييم الطلب، إلى جانب أي ملاحظات إضافية مسجلة عليه." />
            <div className="space-y-5 p-6">
              <ContentBlock label="وصف الاحتياج" value={order.description} />
              {order.notes ? <ContentBlock label="ملاحظات إضافية" value={order.notes} /> : null}
              {order.adminNote ? <ContentBlock label="ملاحظة إدارة بروز" value={order.adminNote} tone="amber" /> : null}
            </div>
          </OpsSurface>

          <OpsSurface>
            <OpsSectionHeader title="التحويلات المتاحة" description="اختصارات مباشرة للخطوة التالية المتاحة حالياً لهذا الطلب." />
            <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
              <ActionTile
                icon={ListChecks}
                title="العروض"
                description={order.offers.length > 0 ? 'راجع مقارنة العروض واتخذ قرار الاختيار عندما تكون جاهزاً.' : 'ستظهر هنا العروض حين يبدأ الخبراء بإرسالها.'}
                href={`/dashboard/offers/${encodeURIComponent(order.orderNumber)}`}
                label={order.offers.length > 0 ? 'فتح العروض' : 'متابعة لاحقاً'}
                disabled={order.offers.length === 0}
              />
              <ActionTile
                icon={FolderKanban}
                title="المشروع"
                description={order.project?.id ? 'تم إنشاء مشروع مرتبط بهذا الطلب ويمكنك متابعة التنفيذ من داخله.' : 'سيظهر المشروع هنا بعد اختيار عرض وتجهيز التنفيذ.'}
                href={order.project?.id ? `/dashboard/projects/${order.project.id}` : '#'}
                label={order.project?.id ? 'فتح المشروع' : 'بانتظار الإنشاء'}
                disabled={!order.project?.id}
              />
            </div>
          </OpsSurface>
        </div>

        <aside className="space-y-6">
          <OpsSurface>
            <OpsSectionHeader title="الخطوة التالية" description="ما الذي يجب أن يحدث الآن حتى يستمر الطلب في التقدم." />
            <div className="space-y-4 p-6">
              <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
                {getOrderAction(order.status, Boolean(order.project?.id))}
              </div>
              {primaryAction ? (
                <Link href={primaryAction.href} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0B132B] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#16213C]">
                  {primaryAction.label}
                </Link>
              ) : null}
            </div>
          </OpsSurface>

          <OpsSurface>
            <OpsSectionHeader title="بيانات التواصل المرجعية" description="البيانات التي تم إرسالها مع الطلب للاستخدام التشغيلي داخل بروز." />
            <div className="p-6">
              <OpsMetaGrid
                columns={2}
                items={[
                  { label: 'اسم المسؤول', value: order.managerName },
                  { label: 'الجوال', value: order.phone },
                  { label: 'البريد', value: order.email || 'غير مضاف' },
                  { label: 'رابط المتجر', value: order.sallaUrl || 'غير مضاف' },
                ]}
              />
            </div>
          </OpsSurface>

          {order.offers.length === 0 && !order.project?.id ? (
            <OpsSurface>
              <OpsEmptyState
                icon={MessageSquareMore}
                title="لا توجد حركة تنفيذية بعد"
                description="بمجرد انتقال الطلب إلى العروض أو المشروع، ستظهر هنا التحركات التشغيلية التالية بشكل مباشر."
              />
            </OpsSurface>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function ContentBlock({
  label,
  value,
  tone = 'slate',
}: {
  label: string;
  value: string;
  tone?: 'slate' | 'amber';
}) {
  const style = tone === 'amber'
    ? 'border-amber-200 bg-amber-50 text-amber-800'
    : 'border-slate-200 bg-slate-50 text-slate-600';

  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold text-slate-500">{label}</div>
      <div className={`rounded-[24px] border px-5 py-5 text-sm leading-8 ${style}`}>{value}</div>
    </div>
  );
}

function ActionTile({
  icon: Icon,
  title,
  description,
  href,
  label,
  disabled,
}: {
  icon: typeof GitBranch;
  title: string;
  description: string;
  href: string;
  label: string;
  disabled?: boolean;
}) {
  const content = (
    <div className={`rounded-[24px] border p-5 transition-colors ${disabled ? 'border-slate-200 bg-slate-50 text-slate-400' : 'border-slate-200 bg-white text-[#0B132B] hover:bg-slate-50'}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-[#0B132B]">
        <Icon size={18} />
      </div>
      <div className="mt-4 text-base font-bold">{title}</div>
      <div className="mt-2 text-sm leading-7 text-slate-500">{description}</div>
      <div className="mt-4 text-sm font-semibold">{label}</div>
    </div>
  );

  if (disabled) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}
