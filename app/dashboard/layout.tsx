import { DashboardLayoutShell } from '@/components/layout/DashboardLayoutShell';

export const metadata = {
  title: 'BOROZ | لوحة التحكم',
  description: 'منصة النمو المتخصصة لتجار سلة',
};

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session?.user?.globalRole === 'PROVIDER') {
    const status = session.user.approvalStatus;
    if (status === 'PENDING' || status === 'REJECTED' || status === 'SUSPENDED') {
      // Pending providers do not get the sidebar layout
      return <>{children}</>;
    }
  }

  return <DashboardLayoutShell>{children}</DashboardLayoutShell>;
}

