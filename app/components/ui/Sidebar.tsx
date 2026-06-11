'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Settings,
  ShoppingCart,
  LogOut,
  X,
  Users,
  ClipboardCheck,
  Briefcase,
  FolderOpen,
  WalletMinimal,
} from 'lucide-react';

const merchantNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
  { href: '/dashboard/orders', icon: ShoppingCart, label: 'طلباتي' },
  { href: '/dashboard/offers', icon: Briefcase, label: 'العروض' },
  { href: '/dashboard/projects', icon: FolderOpen, label: 'المشاريع' },
  { href: '/dashboard/settings', icon: Settings, label: 'الإعدادات' },
];

const adminNavItems = [
  { href: '/dashboard/admin', icon: LayoutDashboard, label: 'لوحة التحكم' },
  { href: '/dashboard/admin/requests', icon: ClipboardCheck, label: 'مراجعة الطلبات' },
  { href: '/dashboard/admin/providers', icon: Users, label: 'مقدمي الخدمات' },
  { href: '/dashboard/admin/payouts', icon: WalletMinimal, label: 'إدارة الصرف' },
  { href: '/dashboard/admin/settings', icon: Settings, label: 'إعدادات المنصة' },
  { href: '/dashboard/projects', icon: FolderOpen, label: 'المشاريع' },
  { href: '/dashboard/settings', icon: Settings, label: 'إعدادات الحساب' },
];

const providerNavItems = [
  { href: '/dashboard/provider', icon: LayoutDashboard, label: 'لوحة التحكم' },
  { href: '/dashboard/provider/opportunities', icon: Briefcase, label: 'الفرص المتاحة' },
  { href: '/dashboard/projects', icon: FolderOpen, label: 'المشاريع' },
  { href: '/dashboard/provider/payouts', icon: WalletMinimal, label: 'المستحقات' },
  { href: '/dashboard/settings', icon: Settings, label: 'الإعدادات' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname() ?? '';
  const { data: session } = useSession();
  const globalRole = session?.user?.globalRole;

  let currentNavItems = merchantNavItems;
  if (globalRole === 'ADMIN') {
    currentNavItems = adminNavItems;
  } else if (globalRole === 'PROVIDER') {
    currentNavItems = providerNavItems;
  }

  const isActive = (href: string) => {
    const exactOnly = ['/dashboard', '/dashboard/admin', '/dashboard/provider'];
    if (exactOnly.includes(href)) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside
      className={`fixed right-0 top-0 h-screen w-[260px] bg-navy-900 border-l border-navy-800 z-50 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="relative p-6 border-b border-navy-800 flex items-center justify-center shrink-0">
        <Link
          href="/dashboard"
          onClick={onClose}
          className="flex flex-col items-center text-center gap-1"
        >
          <Image src="/شعار%20بروز.svg" alt="بروز" width={90} height={32} className="h-8 w-auto object-contain" />
          <span className="mt-0.5 w-full text-center text-[10px] font-semibold tracking-wide text-slate-400 dark:text-slate-400">
            {globalRole === 'ADMIN'
              ? 'لوحة تحكم الإدارة'
              : globalRole === 'PROVIDER'
              ? 'لوحة تحكم مقدم الخدمة'
              : 'لوحة تحكم التاجر'}
          </span>
        </Link>
        <button
          onClick={onClose}
          className="absolute left-5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg md:hidden"
          aria-label="إغلاق القائمة"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto min-h-0">
        {currentNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3.5 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                active
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-navy-800 hover:text-white'
              }`}
            >
              <Icon size={18} className="transition-colors duration-200 shrink-0" />
              <span className="text-sm font-display">{item.label}</span>
              {active && <span className="w-1 h-1 rounded-full bg-white mr-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-navy-800 shrink-0">
        <button
          onClick={() => {
            signOut({ callbackUrl: '/login' });
            onClose();
          }}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span className="font-display">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
