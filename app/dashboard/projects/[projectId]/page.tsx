import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import { ArrowRight, DollarSign, FileText, FolderOpen, Send } from 'lucide-react';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { getProjectStatusLabel, getProjectStatusStyle, getMessagingBlockedReason } from '@/app/lib/project-utils';
import { getProviderDisplayName } from '@/app/lib/provider-opportunities';
import { getOrderStatusLabel } from '@/app/lib/order-status';
import { resolveServiceLabel } from '@/app/lib/services';
import { ProjectKickoffButton } from '@/app/components/projects/ProjectKickoffButton';
import { ProjectDeliverySection } from '@/app/components/projects/ProjectDeliverySection';
import { ProjectMessagesSection } from '@/app/components/projects/ProjectMessagesSection';

export default async function ProjectDetailsPage({ params }: { params: { projectId: string } }) {
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
      scopeSummary: true,
      deliverables: true,
      price: true,
      deliveryDays: true,
      revisionsIncluded: true,
      startDate: true,
      dueDate: true,
      acceptedOffer: {
        select: {
          messageToMerchant: true,
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
  const isActive = project.status === 'ACTIVE' || project.status === 'IN_PROGRESS';
  const isProviderOwner = session.user.globalRole === 'PROVIDER';
  const isMerchantOwner = session.user.globalRole === 'MERCHANT';
  const isAdminViewer = session.user.globalRole === 'ADMIN';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/projects"
            className="rounded-xl border border-slate-200/80 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            title="العودة للمشاريع"
          >
            <ArrowRight size={18} />
          </Link>
          <div>
            <div className="text-xs font-bold text-[#06B6D4]">{project.order.orderNumber}</div>
            <h1 className="mt-1 text-2xl font-bold text-[#111827]">{project.name}</h1>
            <p className="mt-1 text-sm text-slate-500">مشروع ناتج من العرض المختار داخل بروز.</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${getProjectStatusStyle(project.status)}`}>
          {getProjectStatusLabel(project.status)}
        </span>
      </div>

      {isKickoffPending ? (
        <div className="rounded-2xl border border-violet-200 bg-violet-50 px-5 py-4 text-sm font-bold text-violet-800">
          {isProviderOwner
            ? 'تم اختيار عرضك لهذا المشروع. راجع نطاق العمل والمتطلبات، ثم ابدأ التنفيذ عند جاهزيتك.'
            : isMerchantOwner
            ? 'تم اختيار العرض، وبانتظار مقدم الخدمة لبدء التنفيذ.'
            : 'المشروع بانتظار مقدم الخدمة لبدء التنفيذ.'}
        </div>
      ) : null}

      {isActive && !isProviderOwner ? (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-4 text-sm font-bold text-indigo-800">
          بدأ مقدم الخدمة تنفيذ المشروع داخل بروز. يمكنك متابعة التقدم من خلال شاشة المشروع والتواصل مع مقدم الخدمة عبر الرسائل.
        </div>
      ) : null}

      {isActive && isProviderOwner ? (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-4 text-sm font-bold text-indigo-800">
          قم بتسليم أعمال المشروع عند الانتهاء من خلال زر &quot;تسليم&quot; في قسم التسليم. يمكنك متابعة التواصل مع التاجر عبر الرسائل.
        </div>
      ) : null}

      {project.status === 'DELIVERED' ? (
        <div className="rounded-2xl border border-teal-200 bg-teal-50 px-5 py-4 text-sm font-bold text-teal-800">
          {isProviderOwner
            ? 'تم تسليم المشروع. بانتظار مراجعة التاجر للتسليم.'
            : isMerchantOwner
            ? 'تم تسليم المشروع من مقدم الخدمة. يرجى مراجعة التسليم واختيار الاعتماد أو طلب تعديل.'
            : 'تم تسليم المشروع. بانتظار مراجعة التاجر.'}
        </div>
      ) : null}

      {project.status === 'REVISION_REQUESTED' ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-800">
          {isProviderOwner
            ? 'طلب التاجر تعديل على آخر تسليم. راجع الملاحظات في قسم التسليم وقدّم التعديلات المطلوبة.'
            : isMerchantOwner
            ? 'تم طلب تعديل على التسليم من قبلك. بانتظار مقدم الخدمة لتنفيذ التعديلات وإعادة التسليم.'
            : 'طلب التاجر تعديل على آخر تسليم. بانتظار مقدم الخدمة.'}
        </div>
      ) : null}

      {project.status === 'COMPLETED' ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-bold text-green-800">
          {isProviderOwner
            ? 'تم إكمال المشروع بنجاح. شكرًا لجهودك.'
            : isMerchantOwner
            ? 'تم إكمال المشروع بنجاح. نشكر لك ثقتك ببروز.'
            : 'تم إكمال المشروع بنجاح.'}
        </div>
      ) : null}

      {project.status === 'CANCELLED' ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-600">
          تم إلغاء هذا المشروع ولن يتم اتخاذ أي إجراء إضافي.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#111827]">
              <FolderOpen size={18} className="text-[#06B6D4]" />
              ملخص المشروع
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <InfoPill label="الخدمة" value={resolveServiceLabel(project.order.serviceType)} />
              <InfoPill label="حالة الطلب" value={getOrderStatusLabel(project.order.status)} />
              <InfoPill label="السعر" value={project.price ? `${project.price} ر.س` : 'غير محدد'} />
              <InfoPill label="مدة التنفيذ" value={project.deliveryDays ? `${project.deliveryDays} يوم` : 'غير محددة'} />
              <InfoPill label="عدد المراجعات" value={project.revisionsIncluded !== null && project.revisionsIncluded !== undefined ? `${project.revisionsIncluded}` : 'غير محدد'} />
              <InfoPill label="المتجر" value={project.order.storeName} />
            </div>

            <div className="mt-5 space-y-4">
              <SectionCard label="نطاق العمل" value={project.scopeSummary || project.order.description} />
              <SectionCard label="المخرجات" value={project.deliverables || 'سيتم توضيح المخرجات هنا بعد انتقال المشروع لمرحلة التنفيذ.'} />
              <SectionCard label="العرض المختار" value={project.acceptedOffer?.expertProfile ? getProviderDisplayName(project.acceptedOffer.expertProfile) : 'خبير بروز'} />
              <SectionCard label="رسالة الخبير" value={project.acceptedOffer?.messageToMerchant || 'لا توجد رسالة إضافية من الخبير.'} />
            </div>
          </div>

          <ProjectMessagesSection projectId={project.id} messagingBlockedReason={getMessagingBlockedReason(project.status)} />
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#111827]">
              <FileText size={18} className="text-[#06B6D4]" />
              بيانات مرتبطة
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <InfoPill label="رقم الطلب" value={project.order.orderNumber} />
              <InfoPill label="حالة المشروع" value={getProjectStatusLabel(project.status)} />
              <InfoPill label="تاريخ البدء" value={project.startDate ? project.startDate.toLocaleDateString('en-GB') : 'لم يبدأ بعد'} />
              <InfoPill label="تاريخ الاستحقاق" value={project.dueDate ? project.dueDate.toLocaleDateString('en-GB') : 'غير محدد'} />
            </div>
          </div>

          {isProviderOwner && isKickoffPending ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 text-sm font-bold text-[#111827]">إجراء مقدم الخدمة</div>
              <p className="mb-4 text-sm leading-7 text-slate-500">
                بعد مراجعة نطاق العمل والمتطلبات، يمكنك بدء التنفيذ رسميًا داخل بروز.
              </p>
              <ProjectKickoffButton projectId={project.id} />
            </div>
          ) : null}

          {isAdminViewer && isKickoffPending ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 text-sm font-bold text-[#111827]">إشراف بروز</div>
              <p className="text-sm leading-7 text-slate-500">
                المشروع بانتظار مقدم الخدمة لبدء التنفيذ. يمكن للإدارة متابعة الحالة والتدخل عند الحاجة دون أن تكون هي البداية الافتراضية للتنفيذ.
              </p>
            </div>
          ) : null}

          {project.payout && !isMerchantOwner ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#111827]">
                <DollarSign size={18} className="text-emerald-600" />
                الصرف
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5">
                  <span className="text-xs font-bold text-slate-500">إجمالي المشروع</span>
                  <span className="text-xs font-bold text-slate-800">{project.payout.grossAmount.toLocaleString()} ر.س</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5">
                  <span className="text-xs font-bold text-slate-500">عمولة بروز</span>
                  <span className="text-xs font-bold text-[#06B6D4]">{project.payout.platformFee.toLocaleString()} ر.س</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5">
                  <span className="text-xs font-bold text-emerald-700">صافي مستحق الخبير</span>
                  <span className="text-sm font-bold text-emerald-700">{project.payout.amount.toLocaleString()} ر.س</span>
                </div>
                <PayoutStatusBadge status={project.payout.status} holdReason={project.payout.holdReason} />
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#111827]">
              <Send size={18} className="text-[#06B6D4]" />
              التسليم
            </div>
            <ProjectDeliverySection
              projectId={project.id}
              projectStatus={project.status}
              initialDeliveries={project.deliveries.map((d) => ({
                ...d,
                submittedAt: d.submittedAt.toISOString(),
                approvedAt: d.approvedAt?.toISOString() || null,
                revisionRequestedAt: d.revisionRequestedAt?.toISOString() || null,
              }))}
              isProviderOwner={isProviderOwner}
              isMerchantOwner={isMerchantOwner}
              isAdminViewer={isAdminViewer}
            />
          </div>
        </aside>
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

function PayoutStatusBadge({ status, holdReason }: { status: string; holdReason: string | null }) {
  const labels: Record<string, string> = {
    PENDING_REVIEW: 'بانتظار مراجعة الصرف',
    APPROVED: 'معتمد للصرف',
    ON_HOLD: 'موقوف مؤقتًا',
    PAID: 'تم الصرف',
    CANCELLED: 'ملغي',
  };
  const styles: Record<string, string> = {
    PENDING_REVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
    APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ON_HOLD: 'bg-red-50 text-red-700 border-red-200',
    PAID: 'bg-blue-50 text-blue-700 border-blue-200',
    CANCELLED: 'bg-slate-100 text-slate-500 border-slate-200',
  };
  return (
    <div className="space-y-1">
      <span className={`block rounded-full border px-3 py-1 text-center text-xs font-bold ${styles[status] || ''}`}>
        {labels[status] || status}
      </span>
      {status === 'ON_HOLD' && holdReason ? (
        <p className="text-xs leading-5 text-red-600">{holdReason}</p>
      ) : null}
    </div>
  );
}

function SectionCard({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-bold text-slate-500">{label}</div>
      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
        {value}
      </div>
    </div>
  );
}
