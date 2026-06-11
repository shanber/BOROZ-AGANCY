'use client';

import React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  DollarSign,
  type LucideIcon,
  Mail,
  Phone,
  ShoppingCart,
  Store,
  User,
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Order } from '@/app/lib/demo-data';
import { getOrderById } from '@/app/lib/orders-api';
import { getOrderStatusStyle } from '@/app/lib/order-status';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const orderId = params.id;
  const [order, setOrder] = React.useState<Order | undefined>(undefined);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    getOrderById(orderId)
      .then((apiOrder) => {
        setOrder(apiOrder || undefined);
        setIsLoaded(true);
      })
      .catch(() => {
        setIsLoaded(true);
      });
  }, [orderId]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-[300px] items-center justify-center animate-fade-in">
        <div className="flex items-center gap-2 font-bold text-[#06B6D4]">
          <span className="inline-block animate-spin">⟳</span>
          جاري تحميل تفاصيل الطلب...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-md space-y-6 py-12 animate-fade-in">
        <Card className="border-red-200 bg-red-50/20 text-center">
          <CardBody className="space-y-4 p-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-red-950">الطلب غير موجود</h3>
              <p className="text-sm text-red-700">
                لم نتمكن من العثور على الطلب رقم <span className="font-bold">{orderId}</span>.
              </p>
            </div>
            <Link href="/dashboard/orders">
              <Button className="w-full rounded-xl bg-[#06B6D4] py-2.5 text-xs font-bold text-white hover:bg-[#0891B2]">
                العودة لقائمة الطلبات
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  const statusKey = order.statusKey || order.status;
  const needsChanges = statusKey === 'NEEDS_CHANGES';
  const hasOffersFlow = statusKey === 'COLLECTING_OFFERS' || statusKey === 'APPROVED_FOR_OFFERS';
  const offerSelected = statusKey === 'OFFER_SELECTED';
  const hasProject = Boolean(order.projectId);

  const statusGuidance: Record<string, { title: string; message: string; style: string }> = {
    SUBMITTED: {
      title: 'بانتظار مراجعة بروز',
      message: 'طلبك قيد المراجعة من قبل فريق بروز. سيتم إعلامك فور الانتهاء من المراجعة.',
      style: 'border-blue-200 bg-blue-50',
    },
    UNDER_REVIEW: {
      title: 'قيد المراجعة',
      message: 'فريق بروز يدرس طلبك حاليًا ويقوم بتقييم المتطلبات.',
      style: 'border-sky-200 bg-sky-50',
    },
    REJECTED: {
      title: 'لم يتم اعتماد الطلب',
      message: 'نأسف، لم يتم اعتماد طلبك من قبل بروز. يمكنك الاطلاع على ملاحظات فريق بروز في الطلب والتواصل معنا.',
      style: 'border-red-200 bg-red-50',
    },
    CANCELLED: {
      title: 'تم إلغاء الطلب',
      message: 'تم إلغاء هذا الطلب ولن يتم اتخاذ أي إجراء إضافي بخصوصه.',
      style: 'border-slate-200 bg-slate-50',
    },
    DELIVERED: {
      title: 'تم التسليم',
      message: 'تم تسليم مشروعك من قبل مقدم الخدمة. يرجى مراجعة التسليم واختيار الاعتماد أو طلب تعديل من صفحة المشروع.',
      style: 'border-teal-200 bg-teal-50',
    },
    COMPLETED: {
      title: 'مكتمل',
      message: 'تم إكمال المشروع بنجاح. نشكر لك ثقتك ببروز، ونتطلع لخدمتك في مشاريع قادمة.',
      style: 'border-green-200 bg-green-50',
    },
    IN_EXECUTION: {
      title: 'مشروعك قيد التنفيذ',
      message: 'يعمل مقدم الخدمة على مشروعك حاليًا. يمكنك متابعة التقدم ومراسلة مقدم الخدمة من صفحة المشروع.',
      style: 'border-indigo-200 bg-indigo-50',
    },
  };

  const guidance = statusGuidance[statusKey];

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/orders"
            className="rounded-xl border border-slate-200/80 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            title="العودة للطلبات"
          >
            <ArrowRight size={18} />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-[#111827] md:text-2xl">{order.id}</h2>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${getOrderStatusStyle(statusKey)}`}>
                {order.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#64748B] md:text-sm">
              تفاصيل طلب الخدمة الخاص بمتجر <span className="font-bold text-slate-700">{order.storeName}</span>
            </p>
          </div>
        </div>
      </div>

      {guidance && !needsChanges && !hasOffersFlow && !offerSelected && !hasProject ? (
        <Card className={guidance.style}>
          <CardBody className="space-y-2 p-5">
            <div className="text-sm font-bold">{guidance.title}</div>
            <p className="text-xs leading-relaxed opacity-80">{guidance.message}</p>
          </CardBody>
        </Card>
      ) : null}

      {needsChanges && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardBody className="space-y-3 p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-800">
              <AlertTriangle size={18} />
              يحتاج الطلب إلى تعديل
            </div>
            {order.adminNote && (
              <div>
                <span className="mb-1 block text-[10px] font-bold text-amber-700">ملاحظات بروز</span>
                <p className="rounded-xl border border-amber-200 bg-white/70 p-4 text-xs leading-relaxed text-amber-900">
                  {order.adminNote}
                </p>
              </div>
            )}
            <Link href={`/dashboard/orders/${order.id}/edit`}>
              <Button className="rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-amber-700">
                تعديل الطلب وإعادة إرساله
              </Button>
            </Link>
          </CardBody>
        </Card>
      )}

      {hasOffersFlow && (
        <Card className="border-cyan-200 bg-cyan-50/40">
          <CardBody className="space-y-3 p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-cyan-800">
              <ShoppingCart size={18} />
              الطلب في مرحلة العروض
            </div>
            <p className="text-xs leading-relaxed text-cyan-900">
              بدأت بروز في تجهيز أو استقبال عروض الخبراء لهذا الطلب. يمكنك مراجعة العروض المتاحة من صفحة العروض داخل المنصة.
            </p>
            <Link href={`/dashboard/offers/${order.id}`}>
              <Button className="rounded-xl bg-[#06B6D4] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0891B2]">
                عرض العروض
              </Button>
            </Link>
          </CardBody>
        </Card>
      )}

      {offerSelected && (
        <Card className="border-violet-200 bg-violet-50/40">
          <CardBody className="space-y-3 p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-violet-800">
              <ShoppingCart size={18} />
              تم اختيار العرض
            </div>
            <p className="text-xs leading-relaxed text-violet-900">
              تم اختيار العرض، وسيتم تجهيز مرحلة التنفيذ بواسطة بروز.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/dashboard/offers/${order.id}`}>
                <Button className="rounded-xl bg-[#06B6D4] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0891B2]">
                  مراجعة العرض المختار
                </Button>
              </Link>
              {hasProject ? (
                <Link href={`/dashboard/projects/${order.projectId}`}>
                  <Button className="rounded-xl border border-violet-200 bg-white px-5 py-2.5 text-xs font-bold text-violet-800 hover:bg-violet-100">
                    عرض المشروع
                  </Button>
                </Link>
              ) : null}
            </div>
          </CardBody>
        </Card>
      )}

      {hasProject && !offerSelected ? (
        <Card className="border-indigo-200 bg-indigo-50/40">
          <CardBody className="space-y-3 p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-800">
              <ShoppingCart size={18} />
              المشروع جاهز للمتابعة
            </div>
            <p className="text-xs leading-relaxed text-indigo-900">
              تم ربط هذا الطلب بمشروع داخل بروز ويمكنك متابعة مرحلة التنفيذ من صفحة المشروع.
            </p>
            <Link href={`/dashboard/projects/${order.projectId}`}>
              <Button className="rounded-xl bg-[#06B6D4] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0891B2]">
                عرض المشروع
              </Button>
            </Link>
          </CardBody>
        </Card>
      ) : null}

      <Card className="border border-slate-200/80 shadow-sm">
        <CardHeader className="flex items-center gap-2 border-b border-slate-200/60 bg-slate-50/50 px-6 py-4">
          <ShoppingCart size={18} className="text-[#06B6D4]" />
          <h3 className="text-sm font-bold text-[#111827]">بيانات الخدمة المطلوبة</h3>
        </CardHeader>
        <CardBody className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InfoItem label="الخدمة المطلوبة" value={order.serviceLabel} />
            <InfoItem label="الميزانية التقريبية" value={order.price} icon={DollarSign} />
            <InfoItem label="الأولوية" value={order.priority} />
            <InfoItem label="حالة المراجعة" value={order.status} />
            <InfoItem label="تاريخ الطلب" value={order.date} icon={Calendar} />
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
              <p className="rounded-xl border border-dashed border-slate-100 bg-slate-50/40 p-3 text-xs leading-relaxed text-slate-600">
                {order.notes}
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      <Card className="border border-slate-200/80 shadow-sm">
        <CardHeader className="flex items-center gap-2 border-b border-slate-200/60 bg-slate-50/50 px-6 py-4">
          <Store size={18} className="text-[#06B6D4]" />
          <h3 className="text-sm font-bold text-[#111827]">بيانات إرسال الطلب</h3>
        </CardHeader>
        <CardBody className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
          <IconInfo icon={User} label="التاجر" value={order.managerName} />
          <IconInfo icon={Store} label="المتجر" value={order.storeName} />
          <IconInfo icon={Mail} label="البريد" value={order.email || 'غير متوفر'} />
          <IconInfo icon={Phone} label="الجوال" value={order.phone || 'غير متوفر'} ltr />
        </CardBody>
      </Card>
    </div>
  );
}

function InfoItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
}) {
  return (
    <div>
      <span className="mb-1 block text-[10px] font-bold text-slate-500">{label}</span>
      <span className="flex items-center gap-1 text-sm font-bold text-[#111827]">
        {Icon && <Icon size={16} className="text-emerald-600" />}
        {value}
      </span>
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
