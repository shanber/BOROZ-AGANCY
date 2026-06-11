'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface MerchantOfferSelectButtonProps {
  orderId: string;
  offerId: string;
  disabled?: boolean;
  selected?: boolean;
}

export function MerchantOfferSelectButton({ orderId, offerId, disabled = false, selected = false }: MerchantOfferSelectButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  if (selected) {
    return (
      <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
        <CheckCircle2 size={16} />
        العرض المختار
      </div>
    );
  }

  const handleSelect = async () => {
    if (!window.confirm('هل أنت متأكد من اختيار هذا العرض؟ بعد الاختيار سيتم إغلاق بقية العروض لهذا الطلب.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/offers/${encodeURIComponent(orderId)}/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'تعذر اختيار العرض');
      }

      router.refresh();
    } catch (selectionError) {
      setError(selectionError instanceof Error ? selectionError.message : 'تعذر اختيار العرض');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={disabled || loading}
        onClick={handleSelect}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#06B6D4] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0891B2] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {loading ? 'جاري التأكيد...' : 'اختيار هذا العرض'}
      </button>
      {error ? <div className="max-w-full break-words text-xs font-bold text-red-600 [overflow-wrap:anywhere]">{error}</div> : null}
    </div>
  );
}
