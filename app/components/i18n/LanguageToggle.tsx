'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from './LocaleProvider';

type Variant = 'navbar' | 'compact' | 'sidebar';

export default function LanguageToggle({ variant = 'navbar' }: { variant?: Variant }) {
  const { locale, t } = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);

  const handleToggle = async () => {
    const next = locale === 'ar' ? 'en' : 'ar';
    setIsFetching(true);
    try {
      await fetch('/api/locale', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ locale: next }),
      });
      startTransition(() => {
        router.refresh();
      });
    } finally {
      setIsFetching(false);
    }
  };

  const isLoading = isPending || isFetching;
  const label = t.common.toggleTo;

  const base = 'inline-flex items-center justify-center font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed';
  const styles: Record<Variant, string> = {
    navbar: 'text-xs w-9 h-9 rounded-lg border border-[#E5E7EB] text-[#0B132B] hover:border-[#06B6D4] hover:text-[#06B6D4]',
    compact: 'text-xs w-8 h-8 rounded-md border border-[#E5E7EB] text-[#0B132B] hover:border-[#06B6D4] hover:text-[#06B6D4]',
    sidebar: 'text-xs px-3 py-2 rounded-lg border border-[#E5E7EB] text-[#0B132B] hover:bg-slate-50',
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      aria-label={t.common.language}
      className={`${base} ${styles[variant]}`}
    >
      {isLoading ? '…' : label}
    </button>
  );
}
