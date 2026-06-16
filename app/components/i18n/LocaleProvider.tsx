'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { t as dict, type Locale, type Dictionary } from '@/app/lib/i18n';

type LocaleContextValue = {
  locale: Locale;
  t: Dictionary;
  dir: 'rtl' | 'ltr';
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const value = useMemo<LocaleContextValue>(
    () => ({ locale, t: dict[locale], dir: locale === 'ar' ? 'rtl' : 'ltr' }),
    [locale]
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    // Fallback for components rendered outside provider — should not happen in normal flow.
    return { locale: 'ar', t: dict.ar, dir: 'rtl' };
  }
  return ctx;
}
