import { ReactNode } from 'react';

export const metadata = {
  title: 'BOROZ | بروز - منصة النمو المتخصصة',
  description: 'منصة متكاملة لتجار سلة - تسويق، تصميم، تطوير',
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
