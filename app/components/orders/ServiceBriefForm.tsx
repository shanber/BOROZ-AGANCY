'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowRight, CheckCircle2, ClipboardList, Store } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { services } from '@/app/lib/demo-data';
import {
  createOrder,
  getMerchantOrderContext,
  MerchantOrderContext,
} from '@/app/lib/orders-api';

type Priority = 'عادي' | 'مهم' | 'عاجل';

interface ServiceBriefFormProps {
  backHref?: string;
  backLabel?: string;
  redirectAfterSubmit?: string;
}

export function ServiceBriefForm({
  backHref = '/dashboard/orders',
  backLabel = 'العودة للطلبات',
  redirectAfterSubmit = '/dashboard/orders',
}: ServiceBriefFormProps) {
  const router = useRouter();
  const { status } = useSession();
  const [context, setContext] = React.useState<MerchantOrderContext | null>(null);
  const [contextError, setContextError] = React.useState('');
  const [serviceType, setServiceType] = React.useState('');
  const [budget, setBudget] = React.useState('');
  const [priority, setPriority] = React.useState<Priority>('عادي');
  const [description, setDescription] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    if (status !== 'authenticated') return;

    getMerchantOrderContext()
      .then((summary) => {
        if (isMounted) setContext(summary);
      })
      .catch((error) => {
        if (isMounted) {
          setContextError(error instanceof Error ? error.message : 'تعذر تحميل بيانات التاجر');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [status]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!serviceType) {
      nextErrors.serviceType = 'يرجى اختيار نوع الخدمة';
    }

    if (!description.trim()) {
      nextErrors.description = 'وصف الطلب مطلوب';
    } else if (description.trim().length < 10) {
      nextErrors.description = 'يرجى كتابة وصف أكثر تفصيلا لا يقل عن 10 أحرف';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await createOrder({
        serviceType,
        budget: budget.trim() || undefined,
        priority,
        description: description.trim(),
        notes: notes.trim() || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push(redirectAfterSubmit);
      }, 1200);
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : 'تعذر إرسال الطلب',
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-[260px] items-center justify-center text-sm font-bold text-[#06B6D4]">
        جاري تحميل بيانات التاجر...
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <Card className="mx-auto max-w-md border border-slate-200/80 shadow-sm">
        <CardBody className="space-y-4 p-8 text-center">
          <h2 className="text-lg font-bold text-[#111827]">تسجيل الدخول مطلوب</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            يجب تسجيل الدخول بحساب التاجر قبل إرسال طلب خدمة جديد.
          </p>
          <Link href="/login">
            <Button className="bg-[#06B6D4] px-6 text-sm font-bold text-white hover:bg-[#0891B2]">
              تسجيل الدخول
            </Button>
          </Link>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            className="rounded-xl border border-slate-200/80 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            title={backLabel}
          >
            <ArrowRight size={18} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-[#111827] md:text-2xl">طلب خدمة جديد</h2>
            <p className="mt-1 text-xs text-[#64748B] md:text-sm">
              أرسل موجز الخدمة فقط، وسيتم ربط الطلب تلقائيا ببيانات حسابك ومتجرك.
            </p>
          </div>
        </div>
      </div>

      {success ? (
        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardBody className="space-y-4 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-lg font-bold text-emerald-900">تم إرسال الطلب بنجاح</h3>
            <p className="text-sm text-emerald-700">جاري توجيهك إلى قائمة الطلبات...</p>
          </CardBody>
        </Card>
      ) : (
        <Card className="overflow-hidden border border-slate-200/80 shadow-sm">
          <CardHeader className="flex items-center gap-2 border-b border-slate-200/60 bg-slate-50/50 px-6 py-4">
            <ClipboardList size={18} className="text-[#06B6D4]" />
            <h3 className="text-sm font-bold text-[#111827]">تفاصيل موجز الخدمة</h3>
          </CardHeader>
          <CardBody className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold text-[#111827]">
                  <Store size={16} className="text-[#06B6D4]" />
                  سيتم إرسال الطلب باسم:
                </div>
                {context ? (
                  <dl className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                    <div>
                      <dt className="font-bold text-slate-500">التاجر</dt>
                      <dd className="mt-1 text-slate-800">{context.merchantName}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-slate-500">المتجر</dt>
                      <dd className="mt-1 text-slate-800">{context.storeName}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-slate-500">البريد</dt>
                      <dd className="mt-1 break-all text-slate-800">{context.email || 'غير متوفر'}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-slate-500">رابط المتجر</dt>
                      <dd className="mt-1 break-all text-slate-800">{context.storeUrl || 'غير متوفر'}</dd>
                    </div>
                  </dl>
                ) : (
                  <p className="text-xs font-semibold text-slate-500">
                    {contextError || 'جاري تحميل بيانات التاجر...'}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="w-full">
                  <label className="label-base">
                    نوع الخدمة <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={serviceType}
                    onChange={(event) => {
                      setServiceType(event.target.value);
                      if (errors.serviceType) setErrors({ ...errors, serviceType: '' });
                    }}
                    className={`input-base bg-white ${errors.serviceType ? 'border-red-500 focus:ring-red-500' : ''}`}
                    required
                  >
                    <option value="" disabled hidden>
                      اختر نوع الخدمة المطلوبة...
                    </option>
                    {services.map((service) => (
                      <option key={service.key} value={service.key}>
                        {service.label}
                      </option>
                    ))}
                  </select>
                  {errors.serviceType && <p className="mt-1 text-sm text-red-500">{errors.serviceType}</p>}
                </div>

                <Input
                  label="الميزانية التقريبية"
                  type="number"
                  placeholder="مثال: 5000"
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                />
              </div>

              <div>
                <label className="label-base">مستوى الأولوية</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['عادي', 'مهم', 'عاجل'] as const).map((item) => {
                    const isActive = priority === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setPriority(item)}
                        className={`rounded-xl border px-4 py-2 text-center text-xs font-bold transition-all ${
                          isActive
                            ? 'border-[#06B6D4] bg-[#06B6D4]/10 text-[#03687A] ring-2 ring-[#06B6D4]/10'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="w-full">
                <label className="label-base">
                  وصف الطلب <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="اكتب تفاصيل الخدمة المطلوبة، الأهداف، النطاق، وأي متطلبات مهمة..."
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    if (errors.description) setErrors({ ...errors, description: '' });
                  }}
                  rows={5}
                  className={`input-base min-h-[120px] resize-y ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                  required
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="w-full">
                <label className="label-base">ملاحظات إضافية</label>
                <textarea
                  placeholder="أضف أي روابط مرجعية، ملاحظات، أو شروط خاصة تساعد الفريق على فهم الطلب..."
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  className="input-base min-h-[80px] resize-y"
                />
              </div>

              {errors.form && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
                  {errors.form}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <Link
                  href={backHref}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-500 transition-colors hover:text-slate-700"
                >
                  إلغاء والعودة
                </Link>
                <Button
                  type="submit"
                  isLoading={loading}
                  disabled={!context}
                  className="bg-[#06B6D4] px-6 text-xs font-bold text-white shadow-sm shadow-[#06B6D4]/10 hover:bg-[#0891B2]"
                >
                  إرسال الطلب
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
