'use client';

import { Menu } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { NotificationsBell } from './NotificationsBell';
import { usePathname } from 'next/navigation';

interface TopbarProps {
  onToggleSidebar: () => void;
}

const pageTitles: Record<string, string> = {
  '/dashboard': 'لوحة التحكم',
  '/dashboard/admin': 'لوحة التحكم',
  '/dashboard/admin/requests': 'مراجعة الطلبات',
  '/dashboard/admin/providers': 'مقدمي الخدمات',
  '/dashboard/admin/payouts': 'إدارة الصرف',
  '/dashboard/orders': 'طلباتي',
  '/dashboard/offers': 'العروض',
  '/dashboard/projects': 'المشاريع',
  '/dashboard/settings': 'الإعدادات',
  '/dashboard/provider': 'لوحة التحكم',
  '/dashboard/provider/opportunities': 'الفرص المتاحة',
  '/dashboard/provider/pending': 'بانتظار الاعتماد',
  '/dashboard/messages': 'الرسائل',
  '/dashboard/tasks': 'المهام',
  '/dashboard/merchants': 'التجار',
  '/dashboard/leads': 'العملاء المحتملين',
  '/dashboard/reports': 'التقارير',
};

function getPageTitle(pathname: string): string {
  const exact = pageTitles[pathname];
  if (exact) return exact;
  if (pathname.startsWith('/dashboard/admin/requests/')) return 'تفاصيل الطلب';
  if (pathname.startsWith('/dashboard/admin/providers/')) return 'تفاصيل مقدم الخدمة';
  if (pathname.startsWith('/dashboard/admin/payouts/')) return 'تفاصيل الصرف';
  if (pathname.startsWith('/dashboard/orders/')) return 'تفاصيل الطلب';
  if (pathname.startsWith('/dashboard/offers/')) return 'تفاصيل العرض';
  if (pathname.startsWith('/dashboard/projects/')) return 'تفاصيل المشروع';
  if (pathname.startsWith('/dashboard/provider/opportunities/')) return 'تفاصيل الفرصة';
  return 'لوحة التحكم';
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const { data: session } = useSession();
  const pathname = usePathname() ?? '';
  const globalRole = session?.user?.globalRole;

  let identityName = session?.user?.name;
  let identitySubtitle = 'تاجر سلة';

  if (globalRole === 'ADMIN') {
    identityName = identityName || 'مسؤول بروز';
    identitySubtitle = 'المدير العام';
  } else if (globalRole === 'PROVIDER') {
    identityName = identityName || 'مقدم خدمة';
    identitySubtitle = 'مستقل';
  } else {
    identityName = identityName || 'تاجر بروز';
  }

  const initial = identityName ? identityName.charAt(0) : 'ب';
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between px-4 md:px-8 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors md:hidden"
            aria-label="افتح القائمة الجانبية"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-base md:text-lg font-display font-bold text-slate-900">
            {pageTitle}
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <NotificationsBell />

          <div className="flex items-center gap-2.5 pr-3 border-r border-slate-200">
            <div className="hidden md:block text-right">
              <p className="text-xs font-semibold text-slate-900">{identityName}</p>
              <p className="text-[10px] font-medium text-slate-500">{identitySubtitle}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm">
              {initial}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
