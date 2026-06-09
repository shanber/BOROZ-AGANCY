'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Target,
  Settings,
  ShoppingCart,
  FolderOpen,
  CheckSquare,
  MessageSquare,
  CreditCard,
  LogOut,
  X,
  FileText,
  Users,
  ClipboardCheck
} from 'lucide-react';

const merchantNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
  { href: '/dashboard/orders', icon: ShoppingCart, label: 'طلباتي' },
  { href: '/dashboard/offers', icon: Target, label: 'العروض' },
  { href: '/dashboard/projects', icon: FolderOpen, label: 'المشاريع' },
  { href: '/dashboard/contracts', icon: FileText, label: 'العقود' },
  { href: '/dashboard/messages', icon: MessageSquare, label: 'الرسائل' },
  { href: '/dashboard/files', icon: CheckSquare, label: 'الملفات' },
  { href: '/dashboard/invoices', icon: CreditCard, label: 'الفواتير والمدفوعات' },
  { href: '/dashboard/settings', icon: Settings, label: 'الإعدادات' },
];

const adminNavItems = [
  { href: '/dashboard/admin/requests', icon: ClipboardCheck, label: 'مراجعة الطلبات' },
  { href: '/dashboard/admin/providers', icon: Users, label: 'مقدمي الخدمات' },
  { href: '/dashboard/settings', icon: Settings, label: 'الإعدادات' },
];

const providerNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
  { href: '/dashboard/projects', icon: FolderOpen, label: 'المشاريع' },
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
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed right-0 top-0 h-screen w-[260px] bg-[#0B132B] text-slate-300 border-l border-slate-800 z-50 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header / Logo */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
        <Link
          href="/dashboard"
          onClick={onClose}
          className="flex flex-col gap-1"
        >
          <Image src="/شعار%20بروز.svg" alt="بروز" width={90} height={32} className="h-8 w-auto object-contain invert hue-rotate-180" />
          {/* Role label under logo */}
          <span className="text-[10px] font-semibold text-slate-400 tracking-wide mt-0.5">
            {globalRole === 'ADMIN'
              ? 'لوحة تحكم الإدارة'
              : globalRole === 'PROVIDER'
              ? 'لوحة تحكم مقدم الخدمة'
              : 'لوحة تحكم التاجر'}
          </span>
        </Link>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg md:hidden"
          aria-label="إغلاق القائمة"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1.5 p-4 overflow-y-auto min-h-0">
        {currentNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group
                ${
                  active
                    ? 'bg-[#06B6D4] text-white font-medium shadow-md shadow-[#06B6D4]/20'
                    : 'hover:bg-slate-800/60 hover:text-white'
                }
              `}
            >
              <Icon 
                size={18} 
                className={`transition-colors duration-200 ${
                  active ? 'text-white' : 'text-slate-400 group-hover:text-white'
                }`} 
              />
              <span className="text-sm font-semibold font-sans">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout / User Info footer */}
      <div className="p-4 border-t border-slate-800 bg-[#070D1E] shrink-0">
        <button
          onClick={() => {
            signOut({ callbackUrl: '/login' });
            onClose();
          }}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
        >
          <LogOut size={18} />
          <span className="font-sans">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
