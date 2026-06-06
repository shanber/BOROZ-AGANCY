import { DashboardLayoutShell } from '@/components/layout/DashboardLayoutShell';

export const metadata = {
  title: 'BOROZ | لوحة التحكم',
  description: 'منصة النمو المتخصصة لتجار سلة',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutShell>{children}</DashboardLayoutShell>;
}

