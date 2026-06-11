'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Ban, DollarSign, AlertCircle } from 'lucide-react';

type Props = {
  payoutId: string;
  status: string;
  checklistPassed: boolean;
};

export function PayoutReviewActions({ payoutId, status, checklistPassed }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showHoldForm, setShowHoldForm] = useState(false);
  const [holdReason, setHoldReason] = useState('');

  const isPending = status === 'PENDING_REVIEW';
  const isApproved = status === 'APPROVED';

  const handleAction = async (action: 'approve' | 'hold' | 'mark-paid') => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const body = action === 'hold' ? { holdReason: holdReason.trim() } : undefined;
      const res = await fetch(`/api/admin/payouts/${payoutId}/${action}`, {
        method: 'POST',
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'فشلت العملية');
      }

      setSuccess(action === 'approve' ? 'تم اعتماد الصرف بنجاح' : action === 'hold' ? 'تم إيقاف الصرف' : 'تم تأكيد الصرف');
      setShowHoldForm(false);
      setHoldReason('');
      setTimeout(() => router.refresh(), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle size={16} />
          {success}
        </div>
      )}

      {isPending && (
        <div className="space-y-2">
          <button
            onClick={() => handleAction('approve')}
            disabled={loading || !checklistPassed}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? 'جاري...' : (
              <>
                <CheckCircle size={16} />
                اعتماد الصرف
              </>
            )}
          </button>

          {!checklistPassed && (
            <p className="text-xs font-medium text-amber-600">يجب استيفاء جميع بنود قائمة التحقق أولاً.</p>
          )}

          {showHoldForm ? (
            <div className="space-y-3 rounded-xl border border-red-100 bg-red-50 p-4">
              <label className="block text-xs font-bold text-slate-500">سبب الإيقاف</label>
              <textarea
                value={holdReason}
                onChange={(e) => setHoldReason(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]"
                placeholder="اذكر سبب إيقاف الصرف"
                rows={3}
                maxLength={1000}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction('hold')}
                  disabled={loading || !holdReason.trim()}
                  className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                >
                  {loading ? 'جاري...' : 'تأكيد الإيقاف'}
                </button>
                <button
                  onClick={() => { setShowHoldForm(false); setHoldReason(''); }}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600"
                >
                  إلغاء
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowHoldForm(true)}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
            >
              <Ban size={16} />
              إيقاف الصرف
            </button>
          )}
        </div>
      )}

      {isApproved && (
        <button
          onClick={() => handleAction('mark-paid')}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          <DollarSign size={16} />
          {loading ? 'جاري...' : 'تأكيد الصرف (تم الدفع)'}
        </button>
      )}
    </div>
  );
}
