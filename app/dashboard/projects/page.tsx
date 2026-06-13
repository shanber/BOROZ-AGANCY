import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { FolderKanban } from 'lucide-react';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { getProjectStatusLabel } from '@/app/lib/project-utils';
import { getProviderDisplayName } from '@/app/lib/provider-opportunities';
import { resolveServiceLabel } from '@/app/lib/services';
import { formatCurrency, formatDate } from '@/app/lib/formatters';
import { getProjectHealth, getProjectProgress, formatRelativeTime } from '@/app/lib/execution';
import {
  OpsBadge,
  OpsEmptyState,
  OpsHealthBadge,
  OpsPageHeader,
  OpsProgressBar,
  OpsSectionHeader,
  OpsSurface,
} from '@/app/components/execution/OpsUI';

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const where =
    session.user.globalRole === 'ADMIN'
      ? {}
      : session.user.globalRole === 'PROVIDER'
      ? {
          acceptedOffer: {
            expertProfile: {
              userId: session.user.id,
            },
          },
        }
      : {
          order: {
            userId: session.user.id,
          },
        };

  const projects = await prisma.project.findMany({
    where,
    orderBy: [{ updatedAt: 'desc' }],
    select: {
      id: true,
      name: true,
      status: true,
      price: true,
      deliveryDays: true,
      createdAt: true,
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
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const eyebrow =
    session.user.globalRole === 'ADMIN'
      ? 'Operations Projects'
      : session.user.globalRole === 'PROVIDER'
      ? 'Execution Workspace'
      : 'Execution Projects';

  const description =
    session.user.globalRole === 'ADMIN'
      ? 'كل المشاريع المفتوحة التي تمر بمسار التنفيذ وتحتاج مراقبة أو متابعة أو تدخلاً عند الحاجة.'
      : session.user.globalRole === 'PROVIDER'
      ? 'مشاريعك النشطة داخل بروز: ما الذي يجري الآن، وما الذي يحتاج منك خطوة تالية.'
      : 'جميع المشاريع الناتجة من العروض المختارة، مع المرحلة الحالية والصحة التنفيذية وآخر التحديثات.';

  return (
    <div className="space-y-6">
      <OpsPageHeader eyebrow={eyebrow} title="المشاريع" description={description}>
        <OpsBadge tone="slate" label={`إجمالي المشاريع ${projects.length}`} />
      </OpsPageHeader>

      <OpsSurface>
        <OpsSectionHeader title="قائمة التنفيذ" description="كل مشروع هنا يمثل مسار تنفيذ فعلي وليس بطاقة عرض أو إحصائية تسويقية." />
        {projects.length === 0 ? (
          <OpsEmptyState
            icon={FolderKanban}
            title="لا توجد مشاريع بعد"
            description="سيظهر المشروع هنا بعد اختيار عرض والانتقال من مرحلة الطلب إلى التنفيذ داخل بروز."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 p-6 xl:grid-cols-2">
            {projects.map((project) => {
              const health = getProjectHealth({ status: project.status, dueDate: project.dueDate });
              const progress = getProjectProgress(project.status);
              const counterparty =
                session.user.globalRole === 'PROVIDER'
                  ? project.order.storeName
                  : project.acceptedOffer?.expertProfile
                  ? getProviderDisplayName(project.acceptedOffer.expertProfile)
                  : 'خبير بروز';

              return (
                <div key={project.id} className="rounded-[24px] border border-slate-200 bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{project.order.orderNumber}</div>
                      <h2 className="mt-2 text-lg font-bold text-[#0B132B]">{project.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {project.order.storeName} - {resolveServiceLabel(project.order.serviceType)}
                      </p>
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
                      <div className="text-[11px] font-semibold text-slate-500">{session.user.globalRole === 'PROVIDER' ? 'Merchant' : 'Assigned Expert'}</div>
                      <div className="mt-2 text-sm font-semibold text-[#0B132B]">{counterparty}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="text-[11px] font-semibold text-slate-500">Last Update</div>
                      <div className="mt-2 text-sm font-semibold text-[#0B132B]">{formatRelativeTime(project.updatedAt)}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="text-[11px] font-semibold text-slate-500">Target Delivery</div>
                      <div className="mt-2 text-sm font-semibold text-[#0B132B]">{project.dueDate ? formatDate(project.dueDate) : 'غير محدد'}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div className="text-sm text-slate-500">
                      {project.price ? formatCurrency(project.price) : 'قيمة غير محددة'}
                      {project.deliveryDays ? ` - ${project.deliveryDays} يوم` : ''}
                    </div>
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
  );
}
