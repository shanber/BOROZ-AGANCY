'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, PlayCircle } from 'lucide-react';

interface ProjectKickoffButtonProps {
  projectId: string;
}

export function ProjectKickoffButton({ projectId }: ProjectKickoffButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleKickoff = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}/kickoff`, {
        method: 'PATCH',
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'تعذر بدء مرحلة التنفيذ');
      }

      router.refresh();
    } catch (kickoffError) {
      setError(kickoffError instanceof Error ? kickoffError.message : 'تعذر بدء مرحلة التنفيذ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleKickoff}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#06B6D4] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0891B2] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <PlayCircle size={16} />}
        {loading ? 'جاري بدء التنفيذ...' : 'بدء التنفيذ'}
      </button>
      {error ? <div className="text-xs font-bold text-red-600">{error}</div> : null}
    </div>
  );
}
