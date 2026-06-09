'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Clock, Loader2, type LucideIcon, RotateCcw, XCircle } from 'lucide-react';

type ReviewAction = 'UNDER_REVIEW' | 'APPROVED_FOR_OFFERS' | 'NEEDS_CHANGES' | 'REJECTED';

interface RequestReviewActionsProps {
  orderNumber: string;
  currentStatus: string;
  initialAdminNote?: string | null;
  initialInternalNote?: string | null;
}

const actions: Array<{
  action: ReviewAction;
  label: string;
  icon: LucideIcon;
  className: string;
}> = [
  {
    action: 'UNDER_REVIEW',
    label: 'بدء المراجعة',
    icon: Clock,
    className: 'bg-sky-600 text-white hover:bg-sky-700',
  },
  {
    action: 'APPROVED_FOR_OFFERS',
    label: 'اعتماد الطلب للعروض',
    icon: CheckCircle2,
    className: 'bg-emerald-600 text-white hover:bg-emerald-700',
  },
  {
    action: 'NEEDS_CHANGES',
    label: 'طلب تعديل من التاجر',
    icon: RotateCcw,
    className: 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100',
  },
  {
    action: 'REJECTED',
    label: 'رفض الطلب',
    icon: XCircle,
    className: 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100',
  },
];

export default function RequestReviewActions({
  orderNumber,
  currentStatus,
  initialAdminNote = '',
  initialInternalNote = '',
}: RequestReviewActionsProps) {
  const router = useRouter();
  const [adminNote, setAdminNote] = React.useState(initialAdminNote || '');
  const [internalNote, setInternalNote] = React.useState(initialInternalNote || '');
  const [loadingAction, setLoadingAction] = React.useState<ReviewAction | null>(null);
  const [error, setError] = React.useState('');

  const handleAction = async (action: ReviewAction) => {
    if ((action === 'NEEDS_CHANGES' || action === 'REJECTED') && !adminNote.trim()) {
      setError('ملاحظة الإدارة مطلوبة عند طلب تعديل أو رفض الطلب.');
      return;
    }

    setLoadingAction(action);
    setError('');

    try {
      const response = await fetch(`/api/admin/requests/${orderNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          adminNote,
          internalNote,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'تعذر تحديث حالة الطلب');
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تحديث حالة الطلب');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-sm font-bold text-[#111827]">إجراءات المراجعة</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          الحالة الحالية: <span className="font-bold text-slate-700">{currentStatus}</span>
        </p>
      </div>

      <div>
        <label className="label-base">ملاحظة للتاجر</label>
        <textarea
          value={adminNote}
          onChange={(event) => setAdminNote(event.target.value)}
          rows={4}
          className="input-base min-h-[100px] resize-y"
          placeholder="تظهر للتاجر عند طلب تعديل أو رفض الطلب..."
        />
      </div>

      <div>
        <label className="label-base">ملاحظات داخلية للإدارة</label>
        <textarea
          value={internalNote}
          onChange={(event) => setInternalNote(event.target.value)}
          rows={4}
          className="input-base min-h-[100px] resize-y"
          placeholder="ملاحظات داخلية لا تظهر للتاجر..."
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {actions.map((item) => {
          const Icon = item.icon;
          const isLoading = loadingAction === item.action;
          return (
            <button
              key={item.action}
              type="button"
              onClick={() => handleAction(item.action)}
              disabled={Boolean(loadingAction)}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${item.className}`}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />}
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
