import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import {
  ArrowRight,
  Calendar,
  type LucideIcon,
  Mail,
  Phone,
  ShoppingCart,
  Store,
  User,
} from 'lucide-react';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { resolveServiceLabel } from '@/app/lib/services';
import { formatCurrency, formatShortDate } from '@/app/lib/formatters';
import { getOrderStatusLabel, getOrderStatusStyle } from '@/app/lib/order-status';
import { getOrderMatchingServiceSlugs, getProviderDisplayName } from '@/app/lib/provider-opportunities';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import RequestReviewActions from './RequestReviewActions';
import InviteProvidersPanel from './InviteProvidersPanel';
import CreateProjectFromOfferButton from './CreateProjectFromOfferButton';

function serviceLabel(serviceType: string) {
  return resolveServiceLabel(serviceType);
}

export default async function AdminRequestDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.globalRole !== 'ADMIN') {
    redirect('/dashboard');
  }

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id: params.id }, { orderNumber: params.id }],
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
      serviceId: true,
      budget: true,
      priority: true,
      status: true,
      selectedOfferId: true,
      description: true,
      notes: true,
      adminNote: true,
      internalNote: true,
      project: {
        select: {
          id: true,
          status: true,
        },
      },
      selectedOffer: {
        select: {
          id: true,
          status: true,
        },
      },
      reviewedAt: true,
      reviewedById: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!order) {
    notFound();
  }

  const reviewer = order.reviewedById
    ? await prisma.user.findUnique({
        where: { id: order.reviewedById },
        select: { name: true },
      })
    : null;

  const statusLabel = getOrderStatusLabel(order.status);
  const reviewerName = order.reviewedAt ? reviewer?.name || 'مسؤول بروز' : 'لم تتم المراجعة بعد';
  const matchingServiceSlugs = getOrderMatchingServiceSlugs(order.serviceType);

  const [matchingProviders, invitations] = await Promise.all([
    prisma.expertProfile.findMany({
      where: {
        approvalStatus: 'APPROVED',
        services: matchingServiceSlugs.length
          ? {
              some: {
                isActive: true,
                service: {
                  slug: { in: matchingServiceSlugs },
                },
              },
            }
          : undefined,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        services: {
          where: matchingServiceSlugs.length
            ? {
                isActive: true,
                service: {
                  slug: { in: matchingServiceSlugs },
                },
              }
            : { isActive: true },
          include: {
            service: {
              select: {
                nameAr: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.offerInvitation.findMany({
      where: { orderId: order.id },
      include: {
        expertProfile: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            services: {
              where: matchingServiceSlugs.length
                ? {
                    isActive: true,
                    service: {
                      slug: { in: matchingServiceSlugs },
                    },
                  }
                : { isActive: true },
              include: {
                service: {
                  select: {
                    nameAr: true,
                  },
                },
              },
            },
            offers: {
              where: { orderId: order.id },
              select: {
                price: true,
                deliveryDays: true,
                status: true,
                submittedAt: true,
              },
            },
          },
        },
      },
      orderBy: { invitedAt: 'desc' },
    }),
  ]);

  const invitationMap = new Map(invitations.map((invitation) => [invitation.expertProfileId, invitation]));
  const mergedProviders = new Map(matchingProviders.map((provider) => [provider.id, provider]));

  invitations.forEach((invitation) => {
    if (!mergedProviders.has(invitation.expertProfile.id)) {
      mergedProviders.set(invitation.expertProfile.id, invitation.expertProfile);
    }
  });

  const providerInvitationRows = Array.from(mergedProviders.values()).map((provider) => {
    const invitation = invitationMap.get(provider.id);
    const offer = invitation?.expertProfile.offers[0] || null;

    return {
      id: provider.id,
      name: getProviderDisplayName(provider),
      email: provider.user.email || 'غير متوفر',
      specialtyTitle: provider.specialtyTitle || '',
      services: provider.services.map((service) => service.service.nameAr),
      alreadyInvited: Boolean(invitation),
      invitationStatus: invitation ? invitation.status : null,
      invitedAt: invitation ? formatShortDate(invitation.invitedAt).replace(/-/g, '/') : null,
      expiresAt: invitation?.expiresAt ? formatShortDate(invitation.expiresAt).replace(/-/g, '/') : null,
      offer: offer
        ? {
            price: offer.price,
            deliveryDays: offer.deliveryDays,
            status: offer.status,
            submittedAt: offer.submittedAt ? formatShortDate(offer.submittedAt).replace(/-/g, '/') : null,
          }
        : null,
    };
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/admin/requests"
            className="rounded-xl border border-slate-200/80 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            title="العودة لقائمة الطلبات"
          >
            <ArrowRight size={18} />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-[#111827]">{order.orderNumber}</h1>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${getOrderStatusStyle(order.status)}`}>
                {statusLabel}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              مراجعة طلب خدمة قبل إتاحته لأي مزود خدمة.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="border border-slate-200/80 shadow-sm">
            <CardHeader className="flex items-center gap-2 border-b border-slate-200/60 bg-slate-50/50 px-6 py-4">
              <ShoppingCart size={18} className="text-[#06B6D4]" />
              <h2 className="text-sm font-bold text-[#111827]">تفاصيل الطلب</h2>
            </CardHeader>
            <CardBody className="space-y-5 p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InfoItem label="نوع الخدمة" value={serviceLabel(order.serviceType)} />
                <InfoItem label="الميزانية" value={order.budget ? formatCurrency(order.budget) : 'قيد التقدير'} />
                <InfoItem label="الأولوية" value={order.priority} />
                <InfoItem label="الحالة" value={statusLabel} />
                <InfoItem label="تاريخ الإنشاء" value={formatShortDate(order.createdAt).replace(/-/g, '/')} />
                <InfoItem label="آخر تحديث" value={formatShortDate(order.updatedAt).replace(/-/g, '/')} />
              </div>

              <div>
                <span className="mb-1 block text-[10px] font-bold text-slate-500">وصف الطلب</span>
                <p className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs leading-relaxed text-slate-700">
                  {order.description}
                </p>
              </div>

              {order.notes && (
                <div>
                  <span className="mb-1 block text-[10px] font-bold text-slate-500">ملاحظات إضافية</span>
                  <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/40 p-4 text-xs leading-relaxed text-slate-700">
                    {order.notes}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          <Card className="border border-slate-200/80 shadow-sm">
            <CardHeader className="flex items-center gap-2 border-b border-slate-200/60 bg-slate-50/50 px-6 py-4">
              <Store size={18} className="text-[#06B6D4]" />
              <h2 className="text-sm font-bold text-[#111827]">بيانات التاجر والمتجر</h2>
            </CardHeader>
            <CardBody className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
              <IconInfo icon={User} label="التاجر" value={order.managerName} />
              <IconInfo icon={Store} label="المتجر" value={order.storeName} />
              <IconInfo icon={Mail} label="البريد" value={order.email || 'غير متوفر'} />
              <IconInfo icon={Phone} label="الجوال" value={order.phone || 'غير متوفر'} ltr />
              <IconInfo icon={Calendar} label="رابط المتجر" value={order.sallaUrl || 'غير متوفر'} />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <RequestReviewActions
            orderNumber={order.orderNumber}
            currentStatus={statusLabel}
            currentStatusKey={order.status as any}
            initialAdminNote={order.adminNote}
            initialInternalNote={order.internalNote}
          />

          <InviteProvidersPanel
            orderNumber={order.orderNumber}
            requestStatus={order.status}
            providers={providerInvitationRows}
          />

          <Card className="border border-slate-200/80 shadow-sm">
            <CardHeader className="border-b border-slate-200/60 bg-white px-5 py-4">
              <h2 className="text-sm font-bold text-[#111827]">سجل المراجعة</h2>
            </CardHeader>
            <CardBody className="space-y-3 p-5 text-xs text-slate-600">
              <InfoItem label="راجع بواسطة" value={reviewerName} />
              <InfoItem
                label="تاريخ المراجعة"
                value={order.reviewedAt ? formatShortDate(order.reviewedAt).replace(/-/g, '/') : 'لم تتم المراجعة بعد'}
              />
              {order.adminNote && <InfoBlock label="ملاحظة للتاجر" value={order.adminNote} />}
              {order.internalNote && <InfoBlock label="ملاحظة داخلية" value={order.internalNote} />}
              {!order.project && order.selectedOfferId && order.selectedOffer?.status === 'ACCEPTED' ? (
                <div className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3">
                  <span className="mb-1 block text-[10px] font-bold text-violet-700">مرحلة التنفيذ</span>
                  <p className="text-xs leading-relaxed text-violet-900">
                    تم اختيار العرض، لكن لم يتم إنشاء مشروع بعد.
                  </p>
                  <div className="mt-3">
                    <CreateProjectFromOfferButton orderNumber={order.orderNumber} />
                  </div>
                </div>
              ) : null}
              {order.project ? (
                <div className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3">
                  <span className="mb-1 block text-[10px] font-bold text-violet-700">مرحلة التنفيذ</span>
                  <p className="text-xs leading-relaxed text-violet-900">
                    تم إنشاء مشروع لهذا الطلب ويمكن متابعة kickoff من صفحة المشاريع.
                  </p>
                  <Link
                    href={`/dashboard/projects/${order.project.id}`}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-[10px] font-bold text-violet-800 transition-colors hover:bg-violet-100"
                  >
                    فتح المشروع
                  </Link>
                </div>
              ) : null}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="mb-1 block text-[10px] font-bold text-slate-500">{label}</span>
      <span className="text-sm font-bold text-[#111827]">{value}</span>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="mb-1 block text-[10px] font-bold text-slate-500">{label}</span>
      <p className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
        {value}
      </p>
    </div>
  );
}

function IconInfo({
  icon: Icon,
  label,
  value,
  ltr = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <span className="block text-[9px] font-bold text-slate-500">{label}</span>
        <span className="block truncate text-xs font-semibold text-slate-800" style={ltr ? { direction: 'ltr' } : undefined}>
          {value}
        </span>
      </div>
    </div>
  );
}
