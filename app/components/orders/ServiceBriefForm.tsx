'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
} from 'lucide-react';
import {
  createOrder,
  getMerchantOrderContext,
  MerchantOrderContext,
} from '@/app/lib/orders-api';

type Priority = 'عادي' | 'مهم' | 'عاجل';

type StepState = {
  id: number;
  title: string;
  done: boolean;
};

interface ServiceBriefFormProps {
  backHref?: string;
  backLabel?: string;
  redirectAfterSubmit?: string;
}

const AVAILABLE_SERVICES = [
  {
    key: 'salla-customize',
    title: 'تخصيص متاجر سلة',
    description: 'تعديلات الواجهة، تحسين التجربة، وتطوير أقسام أو خصائص مخصصة داخل المتجر.',
  },
  {
    key: 'seo',
    title: 'تحسين SEO',
    description: 'تحسين ظهور المتجر في نتائج البحث عبر محتوى منظم وهيكلة واضحة للأولويات.',
  },
  {
    key: 'landing-page-design',
    title: 'صفحات الهبوط',
    description: 'تصميم أو تطوير صفحة هبوط تخدم عرضاً أو حملة محددة بمخرجات واضحة.',
  },
];

const PROCESS_STEPS = [
  'مراجعة الطلب',
  'التحقق من المتطلبات',
  'طرح الطلب على الخبراء المناسبين',
  'استقبال العروض',
  'اختيار العرض المناسب',
  'بدء التنفيذ',
];

const TRUST_POINTS = [
  'مراجعة الطلب قبل التنفيذ',
  'عروض من خبراء متخصصين',
  'متابعة منظمة داخل المنصة',
  'نطاق عمل واضح قبل البدء',
];

const DESCRIPTION_LIMIT = 1200;
const GOALS_LIMIT = 600;

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
  const [priority, setPriority] = React.useState<Priority>('عادي');
  const [description, setDescription] = React.useState('');
  const [goals, setGoals] = React.useState('');
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

  const stepStates = React.useMemo<StepState[]>(() => {
    return [
      { id: 1, title: 'اختيار الخدمة', done: Boolean(serviceType) },
      { id: 2, title: 'وصف الاحتياج', done: description.trim().length >= 30 },
      { id: 3, title: 'الأهداف المطلوبة', done: goals.trim().length >= 20 },
      { id: 4, title: 'إرسال الطلب', done: false },
    ];
  }, [description, goals, serviceType]);

  const completedSteps = stepStates.filter((step) => step.done).length;
  const progressPercent = Math.round((completedSteps / stepStates.length) * 100);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!serviceType) {
      nextErrors.serviceType = 'اختر الخدمة التي تريد أن يدير بروز تنفيذها.';
    }

    const cleanDescription = description.trim();
    if (!cleanDescription) {
      nextErrors.description = 'أدخل وصفاً واضحاً للاحتياج المطلوب.';
    } else if (cleanDescription.length < 30) {
      nextErrors.description = 'حاول توضيح الاحتياج بتفاصيل أكثر حتى يستطيع الفريق مراجعته بدقة.';
    }

    const cleanGoals = goals.trim();
    if (!cleanGoals) {
      nextErrors.goals = 'اذكر الأهداف أو النتيجة التي تريد الوصول لها.';
    } else if (cleanGoals.length < 20) {
      nextErrors.goals = 'أضف أهدافاً أوضح حتى تصبح العروض أكثر دقة وقابلية للمقارنة.';
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
        priority,
        description: description.trim(),
        notes: goals.trim(),
      });

      setSuccess(true);
      setTimeout(() => {
        router.push(redirectAfterSubmit);
      }, 1200);
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : 'تعذر إرسال الطلب حالياً. حاول مرة أخرى بعد قليل.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 text-sm font-bold text-cyan-300 backdrop-blur-xl">
        جاري تجهيز تجربة الطلب...
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-[0_24px_80px_rgba(2,6,23,0.24)] backdrop-blur-xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
          <ShieldCheck size={28} />
        </div>
        <h2 className="text-2xl font-bold text-white">تسجيل الدخول مطلوب</h2>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          يجب تسجيل الدخول بحساب التاجر قبل إرسال الطلب حتى يتم ربطه بمتجرك ومتابعته داخل بروز.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/login" className="btn-primary px-8 py-3 text-sm font-bold">
            تسجيل الدخول
          </Link>
          <Link href="/register/merchant" className="rounded-2xl border border-white/15 px-8 py-3 text-sm font-bold text-white transition-colors hover:border-cyan-300 hover:text-cyan-300">
            إنشاء حساب تاجر
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.24)] backdrop-blur-xl md:p-8">
            <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-3">
                <Link
                  href={backHref}
                  className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-100 transition-colors hover:border-cyan-300 hover:text-cyan-300"
                  title={backLabel}
                >
                  <ArrowRight size={18} />
                </Link>
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-bold text-cyan-300">
                    <Sparkles size={14} />
                    Managed Execution Request
                  </div>
                  <h2 className="text-2xl font-bold text-white md:text-3xl">النموذج الموجّه لرفع الطلب</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-200 md:text-base">
                    ابدأ من اختيار الخدمة المناسبة، ثم صف الاحتياج والنتيجة المطلوبة ليتمكن فريق بروز من مراجعة الطلب وتجهيزه قبل طرحه على الخبراء المناسبين.
                  </p>
                </div>
              </div>

              <div className="min-w-[180px] rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-4 text-center md:text-right">
                <div className="text-[11px] font-bold text-slate-300">تقدم الطلب</div>
                <div className="mt-2 text-2xl font-bold text-white">{progressPercent}%</div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-l from-cyan-300 to-cyan-500 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {stepStates.map((step) => (
                <div
                  key={step.id}
                  className="rounded-2xl border px-4 py-4 text-center transition-all"
                  style={{
                    background: step.done ? 'rgba(6,182,212,0.14)' : 'rgba(255,255,255,0.03)',
                    borderColor: step.done ? 'rgba(6,182,212,0.32)' : 'rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="text-xs font-bold text-cyan-300">الخطوة {step.id}</div>
                  <div className="mt-2 text-sm font-bold text-white">{step.title}</div>
                </div>
              ))}
            </div>

            {success ? (
              <div className="mt-8 rounded-[1.75rem] border border-emerald-400/20 bg-emerald-500/10 p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                  <CheckCircle2 size={30} />
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">تم إرسال الطلب بنجاح</h3>
                <p className="mt-2 text-sm text-slate-200">يتم الآن تحويلك إلى قائمة الطلبات لمتابعة حالة الطلب الجديد.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
                      <Store size={18} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">1. اختيار الخدمة</h3>
                      <p className="text-sm text-slate-200">اختر الخدمة التي تريد من بروز تنظيم تنفيذها.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {AVAILABLE_SERVICES.map((service) => {
                      const isActive = serviceType === service.key;
                      return (
                        <button
                          key={service.key}
                          type="button"
                          onClick={() => {
                            setServiceType(service.key);
                            if (errors.serviceType) setErrors((current) => ({ ...current, serviceType: '' }));
                          }}
                          className="rounded-[1.5rem] border p-5 text-right transition-all"
                          style={{
                            background: isActive ? 'rgba(6,182,212,0.14)' : 'rgba(255,255,255,0.03)',
                            borderColor: isActive ? 'rgba(6,182,212,0.35)' : 'rgba(255,255,255,0.08)',
                            boxShadow: isActive ? '0 20px 40px rgba(6,182,212,0.12)' : 'none',
                          }}
                        >
                          <div className="text-base font-bold text-white">{service.title}</div>
                          <div className="mt-2 text-sm leading-7 text-slate-200">{service.description}</div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.serviceType ? <p className="text-sm font-bold text-rose-300">{errors.serviceType}</p> : null}
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">2. وصف الاحتياج</h3>
                      <p className="text-sm text-slate-200">اشرح الوضع الحالي، المطلوب تنفيذه، وأي تفاصيل تساعد على مراجعة النطاق.</p>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                    <textarea
                      placeholder="مثال: أحتاج تخصيص واجهة الصفحة الرئيسية في متجر سلة، مع إعادة ترتيب الأقسام وتحسين تجربة الجوال وربط التصميم مع الهوية الحالية. أريد أن يكون النطاق واضحاً قبل استلام العروض."
                      value={description}
                      onChange={(event) => {
                        const nextValue = event.target.value.slice(0, DESCRIPTION_LIMIT);
                        setDescription(nextValue);
                        if (errors.description) setErrors((current) => ({ ...current, description: '' }));
                      }}
                      rows={8}
                      className="w-full resize-y border-0 bg-transparent text-sm leading-8 text-white outline-none placeholder:text-slate-400"
                    />
                    <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs">
                      <span className="text-slate-300">كلما كان الوصف أوضح، أصبحت مراجعة الطلب والعروض أدق.</span>
                      <span className="font-bold text-cyan-300">{description.length}/{DESCRIPTION_LIMIT}</span>
                    </div>
                  </div>
                  {errors.description ? <p className="text-sm font-bold text-rose-300">{errors.description}</p> : null}
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
                      <Target size={18} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">3. الأهداف المطلوبة</h3>
                      <p className="text-sm text-slate-200">حدد النتيجة التي تريد الوصول لها حتى يصبح نطاق العمل أكثر وضوحاً.</p>
                    </div>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                      <textarea
                        placeholder="مثال: الهدف هو رفع وضوح العرض الرئيسي في الصفحة، تحسين تجربة الجوال، وتجهيز الصفحة لتكون جاهزة للتنفيذ خلال نطاق واضح ومخرجات محددة."
                        value={goals}
                        onChange={(event) => {
                          const nextValue = event.target.value.slice(0, GOALS_LIMIT);
                          setGoals(nextValue);
                          if (errors.goals) setErrors((current) => ({ ...current, goals: '' }));
                        }}
                        rows={6}
                        className="w-full resize-y border-0 bg-transparent text-sm leading-8 text-white outline-none placeholder:text-slate-400"
                      />
                      <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs">
                        <span className="text-slate-300">اذكر الأهداف، المخرجات، أو ما تعتبره نجاحاً لهذا الطلب.</span>
                        <span className="font-bold text-cyan-300">{goals.length}/{GOALS_LIMIT}</span>
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/25 p-5">
                      <div className="text-sm font-bold text-white">الأولوية</div>
                      <div className="mt-4 space-y-3">
                        {(['عادي', 'مهم', 'عاجل'] as const).map((item) => {
                          const isActive = priority === item;
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setPriority(item)}
                              className="w-full rounded-2xl border px-4 py-3 text-sm font-bold transition-all"
                              style={{
                                background: isActive ? 'rgba(6,182,212,0.14)' : 'rgba(255,255,255,0.03)',
                                borderColor: isActive ? 'rgba(6,182,212,0.35)' : 'rgba(255,255,255,0.08)',
                                color: '#FFFFFF',
                              }}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  {errors.goals ? <p className="text-sm font-bold text-rose-300">{errors.goals}</p> : null}
                </section>

                <section className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-5 md:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
                      <Send size={18} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">4. إرسال الطلب</h3>
                      <p className="text-sm text-slate-200">راجع المعلومات ثم أرسل الطلب ليبدأ فريق بروز مراجعته.</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {TRUST_POINTS.map((point) => (
                      <div key={point} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/20 px-4 py-3 text-sm text-white">
                        <CheckCircle2 size={16} className="shrink-0 text-cyan-300" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>

                  {errors.form ? (
                    <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-200">
                      {errors.form}
                    </div>
                  ) : null}

                  <div className="flex flex-col-reverse items-stretch justify-between gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
                    <Link href={backHref} className="text-center text-sm font-bold text-slate-200 transition-colors hover:text-cyan-300">
                      إلغاء والعودة
                    </Link>
                    <button
                      type="submit"
                      disabled={loading || !context}
                      className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-8 py-4 text-sm font-bold text-slate-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? 'جاري إرسال الطلب...' : 'إرسال الطلب'}
                    </button>
                  </div>
                </section>
              </form>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.24)] backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
              <ClipboardCheck size={18} className="text-cyan-300" />
              ماذا يحدث بعد إرسال الطلب؟
            </div>
            <div className="space-y-3">
              {PROCESS_STEPS.map((item, index) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/20 px-4 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-400/15 text-xs font-bold text-cyan-300">
                    {index + 1}
                  </div>
                  <div className="pt-1 text-sm font-medium text-white">{item}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.24)] backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
              <Store size={18} className="text-cyan-300" />
              بيانات الطلب المرتبطة بالحساب
            </div>
            {context ? (
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-slate-300">التاجر</dt>
                  <dd className="mt-1 font-bold text-white">{context.merchantName}</dd>
                </div>
                <div>
                  <dt className="text-slate-300">المتجر</dt>
                  <dd className="mt-1 font-bold text-white">{context.storeName}</dd>
                </div>
                <div>
                  <dt className="text-slate-300">البريد</dt>
                  <dd className="mt-1 break-all font-bold text-white">{context.email || 'غير متوفر'}</dd>
                </div>
                <div>
                  <dt className="text-slate-300">رابط المتجر</dt>
                  <dd className="mt-1 break-all font-bold text-white">{context.storeUrl || 'غير متوفر'}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm leading-7 text-slate-200">{contextError || 'جاري تحميل بيانات التاجر...'}</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
