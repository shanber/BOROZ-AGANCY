import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { FolderOpen, ArrowRight } from 'lucide-react';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { getProjectStatusLabel, getProjectStatusStyle } from '@/app/lib/project-utils';
import { getProviderDisplayName } from '@/app/lib/provider-opportunities';
import { resolveServiceLabel } from '@/app/lib/services';

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
    orderBy: [{ createdAt: 'desc' }],
    select: {
      id: true,
      name: true,
      status: true,
      price: true,
      deliveryDays: true,
      createdAt: true,
      dueDate: true,
      order: {
        select: {
          orderNumber: true,
          storeName: true,
          managerName: true,
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

  const roleLabel =
    session.user.globalRole === 'ADMIN'
      ? 'لوحة تحكم الإدارة'
      : session.user.globalRole === 'PROVIDER'
      ? 'لوحة مقدم الخدمة'
      : 'لوحة تحكم التاجر';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2 border-b border-slate-200/60 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#06B6D4]">{roleLabel}</p>
        <h1 className="text-2xl font-bold text-[#111827]">المشاريع</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
          هذه المشاريع ناتجة من العروض المقبولة داخل بروز، وتوضح مرحلة تجهيز التنفيذ أو انطلاقه تحت إشراف بروز.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 text-[#06B6D4]">
            <FolderOpen size={30} />
          </div>
          <h2 className="text-lg font-bold text-[#111827]">لا توجد مشاريع بعد</h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            سيظهر المشروع هنا بعد قبول عرض والانتقال إلى مرحلة تجهيز التنفيذ.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {projects.map((project) => (
            <div key={project.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-[#06B6D4]">{project.order.orderNumber}</div>
                  <h2 className="mt-2 text-lg font-bold text-[#111827]">{project.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{resolveServiceLabel(project.order.serviceType)}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${getProjectStatusStyle(project.status)}`}>
                  {getProjectStatusLabel(project.status)}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm text-slate-600">
                <InfoPill label={session.user.globalRole === 'PROVIDER' ? 'التاجر' : 'الخبير'} value={session.user.globalRole === 'PROVIDER' ? project.order.storeName : project.acceptedOffer?.expertProfile ? getProviderDisplayName(project.acceptedOffer.expertProfile) : 'خبير بروز'} />
                <InfoPill label="السعر" value={project.price ? `${project.price} ر.س` : 'غير محدد'} />
                <InfoPill label="مدة التنفيذ" value={project.deliveryDays ? `${project.deliveryDays} يوم` : 'غير محددة'} />
                <InfoPill label="تاريخ الإنشاء" value={project.createdAt.toLocaleDateString('en-GB')} />
                <InfoPill label="تاريخ الاستحقاق" value={project.dueDate ? project.dueDate.toLocaleDateString('en-GB') : 'غير محدد'} />
                <InfoPill label="المتجر" value={project.order.storeName} />
              </div>

              <div className="mt-5 text-left">
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#06B6D4] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#0891B2]"
                >
                  <ArrowRight size={14} />
                  عرض المشروع
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
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
