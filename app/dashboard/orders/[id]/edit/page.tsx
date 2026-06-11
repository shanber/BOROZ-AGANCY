'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, AlertTriangle, Loader2 } from 'lucide-react';

const ALLOWED_SERVICES = [
  { key: 'salla-customize', label: 'تخصيص متاجر سلة' },
  { key: 'seo', label: 'تحسين SEO' },
  { key: 'landing-page-design', label: 'صفحات الهبوط' },
];

export default function EditOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [adminNote, setAdminNote] = React.useState('');
  const [form, setForm] = React.useState({
    storeName: '',
    managerName: '',
    phone: '',
    email: '',
    sallaUrl: '',
    serviceType: '',
    budget: '',
    priority: 'عادي',
    description: '',
    notes: '',
  });
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    fetch(`/api/orders/${encodeURIComponent(params.id)}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (data.statusKey !== 'NEEDS_CHANGES') {
          router.push(`/dashboard/orders/${encodeURIComponent(params.id)}`);
          return;
        }
        setAdminNote(data.adminNote || '');
        setForm({
          storeName: data.storeName || '',
          managerName: data.managerName || '',
          phone: data.phone || '',
          email: data.email || '',
          sallaUrl: data.sallaUrl || '',
          serviceType: data.serviceKey || '',
          budget: data.price && data.price !== 'قيد التقدير' ? data.price.replace(/[^0-9]/g, '') : '',
          priority: data.priority || 'عادي',
          description: data.description || '',
          notes: data.notes || '',
        });
      })
      .catch(() => setError('تعذر تحميل بيانات الطلب'))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.storeName.trim()) errors.storeName = 'اسم المتجر مطلوب';
    if (!form.managerName.trim()) errors.managerName = 'اسم المدير مطلوب';
    if (!form.phone.trim()) errors.phone = 'رقم الجوال مطلوب';
    else if (!/^05\d{8}$/.test(form.phone.trim())) errors.phone = 'رقم الجوال غير صحيح (05xxxxxxxx)';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'البريد الإلكتروني غير صحيح';
    if (!form.serviceType) errors.serviceType = 'اختر الخدمة المطلوبة';
    if (!form.description.trim()) errors.description = 'وصف الاحتياج مطلوب';
    else if (form.description.trim().length < 10) errors.description = 'وصف الاحتياج قصير جداً';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(params.id)}/resubmit`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName: form.storeName.trim(),
          managerName: form.managerName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          sallaUrl: form.sallaUrl.trim() || undefined,
          serviceType: form.serviceType,
          budget: form.budget.trim() || undefined,
          priority: form.priority,
          description: form.description.trim(),
          notes: form.notes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'حدث خطأ أثناء إعادة الإرسال');
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push(`/dashboard/orders/${encodeURIComponent(params.id)}`), 1500);
    } catch {
      setError('حدث خطأ أثناء إعادة الإرسال');
    } finally {
      setSaving(false);
    }
  };

  const setField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-slate-400" />
      </div>
    );
  }

  if (error && !form.storeName) {
    return (
      <div className="max-w-md mx-auto py-12 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <AlertTriangle size={28} className="mx-auto text-red-500 mb-3" />
          <p className="text-sm font-bold text-red-700">{error}</p>
          <Link href={`/dashboard/orders/${encodeURIComponent(params.id)}`} className="mt-4 inline-block text-sm font-bold text-blue-600 hover:underline">
            العودة للطلب
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-lg font-bold text-emerald-800">تم إرسال الطلب للمراجعة مرة أخرى</h2>
          <p className="text-sm text-emerald-600 mt-2">سيتم توجيهك إلى صفحة الطلب...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/dashboard/orders/${encodeURIComponent(params.id)}`}
          className="rounded-xl border border-slate-200/80 bg-white p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <ArrowRight size={18} />
        </Link>
        <div>
          <h1 className="text-xl md:text-2xl font-display font-bold text-slate-900">تعديل الطلب</h1>
          <p className="text-sm text-slate-500 mt-1">عدّل المعلومات ثم أعد إرسال الطلب للمراجعة.</p>
        </div>
      </div>

      {adminNote && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-800 mb-2">
            <AlertTriangle size={16} />
            ملاحظات بروز
          </div>
          <p className="text-sm text-amber-700 leading-7">{adminNote}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800">معلومات الطلب</h2>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">اسم المتجر *</label>
              <input
                type="text"
                value={form.storeName}
                onChange={(e) => setField('storeName', e.target.value)}
                className={`w-full rounded-xl border py-2.5 px-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${fieldErrors.storeName ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
              />
              {fieldErrors.storeName && <p className="mt-1 text-xs text-red-600">{fieldErrors.storeName}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">اسم المدير *</label>
              <input
                type="text"
                value={form.managerName}
                onChange={(e) => setField('managerName', e.target.value)}
                className={`w-full rounded-xl border py-2.5 px-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${fieldErrors.managerName ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
              />
              {fieldErrors.managerName && <p className="mt-1 text-xs text-red-600">{fieldErrors.managerName}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">رقم الجوال *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
                placeholder="05xxxxxxxx"
                className={`w-full rounded-xl border py-2.5 px-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${fieldErrors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
              />
              {fieldErrors.phone && <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                className={`w-full rounded-xl border py-2.5 px-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">رابط المتجر</label>
              <input
                type="url"
                value={form.sallaUrl}
                onChange={(e) => setField('sallaUrl', e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">الميزانية التقريبية</label>
              <input
                type="text"
                value={form.budget}
                onChange={(e) => setField('budget', e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="ريال سعودي"
                className="w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">الخدمة المطلوبة *</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ALLOWED_SERVICES.map((svc) => (
                <button
                  key={svc.key}
                  type="button"
                  onClick={() => setField('serviceType', svc.key)}
                  className={`rounded-xl border py-3 px-4 text-sm font-bold text-right transition-all ${
                    form.serviceType === svc.key
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {svc.label}
                </button>
              ))}
            </div>
            {fieldErrors.serviceType && <p className="mt-1 text-xs text-red-600">{fieldErrors.serviceType}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">الأولوية</label>
            <div className="flex gap-3">
              {['عادي', 'مهم', 'عاجل'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setField('priority', p)}
                  className={`rounded-xl border py-2 px-5 text-sm font-bold transition-all ${
                    form.priority === p
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">وصف الاحتياج *</label>
            <textarea
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              rows={5}
              className={`w-full rounded-xl border py-2.5 px-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors resize-y ${fieldErrors.description ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
            />
            {fieldErrors.description && <p className="mt-1 text-xs text-red-600">{fieldErrors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">ملاحظات إضافية</label>
            <textarea
              value={form.notes}
              onChange={(e) => setField('notes', e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors resize-y"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl flex items-center justify-between">
          <Link
            href={`/dashboard/orders/${encodeURIComponent(params.id)}`}
            className="text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
          >
            إلغاء
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            إعادة إرسال الطلب
          </button>
        </div>
      </form>
    </div>
  );
}
