'use client';

import Image from 'next/image';
import { useLocale } from '@/app/components/i18n/LocaleProvider';

export function BrandLogo(props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'> & { alt?: string }) {
  const { locale } = useLocale();
  const src = locale === 'ar' ? '/brand/logo-ar.svg' : '/brand/logo-en.svg';
  return <Image src={src} alt={props.alt || 'BOROZ'} {...props} />;
}
