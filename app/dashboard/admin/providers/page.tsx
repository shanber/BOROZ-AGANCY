import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/app/lib/prisma';

import ProvidersListClient from './ProvidersListClient';

export default async function AdminProvidersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.globalRole !== 'ADMIN') {
    redirect('/dashboard');
  }

  const providers = await prisma.expertProfile.findMany({
    include: {
      user: true,
      services: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B132B]">إدارة المستقلين</h1>
          <p className="text-slate-500 text-sm mt-1">
            مراجعة واعتماد طلبات المستقلين ومقدمي الخدمات
          </p>
        </div>
      </div>

      {/* Client Component for filtering and displaying the table */}
      <ProvidersListClient initialProviders={providers} />
    </div>
  );
}
