'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FolderOpen, Loader2 } from 'lucide-react';

interface CreateProjectFromOfferButtonProps {
  orderNumber: string;
}

export default function CreateProjectFromOfferButton({ orderNumber }: CreateProjectFromOfferButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleCreateProject = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/orders/${encodeURIComponent(orderNumber)}/create-project`, {
        method: 'POST',
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'تعذر إنشاء المشروع من العرض المختار');
      }

      router.refresh();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'تعذر إنشاء المشروع من العرض المختار');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleCreateProject}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-violet-800 transition-colors hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <FolderOpen size={14} />}
        {loading ? 'جاري إنشاء المشروع...' : 'إنشاء مشروع من العرض المختار'}
      </button>
      {error ? <div className="text-[11px] font-bold text-red-600">{error}</div> : null}
    </div>
  );
}
