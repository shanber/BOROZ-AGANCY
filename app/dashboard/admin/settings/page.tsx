'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Settings, Loader2, Percent, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [rate, setRate] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [fieldError, setFieldError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated' && session.user.globalRole !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    if (status === 'authenticated') {
      fetch('/api/admin/platform-settings', { cache: 'no-store' })
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((data) => {
          const rateSetting = data.settings?.find(
            (s: { key: string }) => s.key === 'platform_commission_rate'
          );
          setRate(rateSetting?.value ?? '25');
        })
        .catch(() => setRate('25'))
        .finally(() => setLoading(false));
    }
  }, [status, session, router]);

  const validate = (val: string): string | null => {
    const trimmed = val.trim();
    if (!trimmed) return 'يجب إدخال نسبة صحيحة';
    const num = parseFloat(trimmed);
    if (isNaN(num) || !isFinite(num)) return 'يجب إدخال نسبة صحيحة';
    if (num < 0 || num > 80) return 'النسبة يجب أن تكون بين 0 و 80';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate(rate);
    if (error) {
      setFieldError(error);
      return;
    }
    setFieldError(null);
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/platform-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'platform_commission_rate', value: rate.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'حدث خطأ أثناء الحفظ' });
        return;
      }
      setMessage({ type: 'success', text: 'تم تحديث نسبة العمولة بنجاح' });
      setRate(data.setting.value);
    } catch {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء الحفظ' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-900">إعدادات المنصة</h1>
        <p className="text-sm text-slate-500 mt-1">إدارة إعدادات عمولة بروز والسياسات المالية للمنصة.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Settings size={18} />
            عمولة بروز
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {message && (
            <div
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {message.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              نسبة عمولة بروز الافتراضية (%)
            </label>
            <div className="relative">
              <Percent size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                inputMode="decimal"
                value={rate}
                onChange={(e) => {
                  setRate(e.target.value);
                  setFieldError(null);
                }}
                placeholder="مثال: 25"
                className={`w-full rounded-xl border py-2.5 pr-10 pl-4 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${
                  fieldError ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                }`}
              />
            </div>
            {fieldError && (
              <p className="mt-1.5 text-xs font-medium text-red-600">{fieldError}</p>
            )}
            <p className="mt-1.5 text-xs text-slate-500">
              هذه النسبة تُستخدم لحساب صافي مستحق الخبير عند إنشاء طلب الصرف بعد اعتماد التسليم.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl flex items-center justify-between">
          <p className="text-xs text-slate-400">التغييرات تطبق على طلبات الصرف الجديدة فقط.</p>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            حفظ الإعدادات
          </button>
        </div>
      </form>
    </div>
  );
}
