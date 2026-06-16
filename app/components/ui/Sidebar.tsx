'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useLocale } from '@/app/components/i18n/LocaleProvider';
import { BrandLogo } from '@/app/components/ui/BrandLogo';
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

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname() ?? '';
  const { data: session } = useSession();
  const { locale, t: dict } = useLocale();
  const globalRole = session?.user?.globalRole;

  const d = dict.sidebar;

  const buildNavItems = (role: string | undefined | null) => {
    if (role === 'ADMIN') {
      return [
        { href: '/dashboard/admin', icon: LayoutDashboard, label: d.dashboard },
        { href: '/dashboard/admin/requests', icon: ClipboardCheck, label: d.requests },
        { href: '/dashboard/admin/providers', icon: Users, label: d.providers },
        { href: '/dashboard/admin/payouts', icon: WalletMinimal, label: d.payouts },
        { href: '/dashboard/admin/settings', icon: Settings, label: d.platformSettings },
        { href: '/dashboard/projects', icon: FolderOpen, label: d.projects },
        { href: '/dashboard/settings', icon: Settings, label: d.settings },
      ];
    }
    if (role === 'PROVIDER') {
      return [
        { href: '/dashboard/provider', icon: LayoutDashboard, label: d.dashboard },
        { href: '/dashboard/provider/opportunities', icon: Briefcase, label: d.opportunities },
        { href: '/dashboard/projects', icon: FolderOpen, label: d.projects },
        { href: '/dashboard/provider/payouts', icon: WalletMinimal, label: d.providerPayouts },
        { href: '/dashboard/settings', icon: Settings, label: d.settings },
      ];
    }
    return [
      { href: '/dashboard', icon: LayoutDashboard, label: d.dashboard },
      { href: '/dashboard/orders', icon: ShoppingCart, label: d.orders },
      { href: '/dashboard/offers', icon: Briefcase, label: d.offers },
      { href: '/dashboard/projects', icon: FolderOpen, label: d.projects },
      { href: '/dashboard/settings', icon: Settings, label: d.settings },
    ];
  };

  const currentNavItems = buildNavItems(globalRole);

  const roleSuffix = globalRole === 'ADMIN' ? locale === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Panel'
    : globalRole === 'PROVIDER' ? locale === 'ar' ? 'لوحة تحكم مقدم الخدمة' : 'Provider Panel'
    : locale === 'ar' ? 'لوحة تحكم التاجر' : 'Merchant Panel';

  const isActive = (href: string) => {
    const exactOnly = ['/dashboard', '/dashboard/admin', '/dashboard/provider'];
    if (exactOnly.includes(href)) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside
      className={`fixed right-0 top-0 h-screen w-[260px] bg-white border-l border-slate-200 z-50 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="relative p-6 border-b border-slate-200 flex items-center justify-center shrink-0">
        <Link
          href="/dashboard"
          onClick={onClose}
          className="flex flex-col items-center text-center gap-1"
        >
          <BrandLogo width={90} height={32} className="h-8 w-auto object-contain" />
          <span className="mt-0.5 w-full text-center text-[10px] font-semibold tracking-wide text-slate-400 dark:text-slate-400">
            {roleSuffix}
          </span>
        </Link>
        <button
          onClick={onClose}
          className="absolute left-5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg md:hidden"
          aria-label={locale === 'ar' ? 'إغلاق القائمة' : 'Close menu'}
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
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon size={18} className="transition-colors duration-200 shrink-0" />
              <span className="text-sm font-display">{item.label}</span>
              {active && <span className="w-1 h-1 rounded-full bg-white mr-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 shrink-0">
        <button
          onClick={() => {
            signOut({ callbackUrl: '/login' });
            onClose();
          }}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span className="font-display">{dict.nav.logout}</span>
        </button>
      </div>
    </aside>
  );
}
