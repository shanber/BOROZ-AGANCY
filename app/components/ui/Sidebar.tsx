'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Target,
  Settings,
  ShoppingCart,
  FolderOpen,
  CheckSquare,
  FileText,
  LogOut,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
  { href: '/dashboard/merchants', icon: Users, label: 'التجار' },
  { href: '/dashboard/leads', icon: Target, label: 'العملاء المحتملين' },
  { href: '/dashboard/orders', icon: ShoppingCart, label: 'الطلبات' },
  { href: '/dashboard/projects', icon: FolderOpen, label: 'المشاريع' },
  { href: '/dashboard/tasks', icon: CheckSquare, label: 'المهام' },
  { href: '/dashboard/reports', icon: FileText, label: 'التقارير' },
  { href: '/dashboard/settings', icon: Settings, label: 'الإعدادات' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed right-0 top-0 h-screen w-[260px] bg-[#0F172A] text-slate-300 border-l border-slate-800 z-50 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header / Logo */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
        <Link 
          href="/dashboard" 
          onClick={onClose}
          className="flex items-center gap-3"
        >
          <Image src="/بروز.svg" alt="بروز" width={120} height={36} className="h-9 w-auto object-contain brightness-0 invert" priority />
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
        {navItems.map((item) => {
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
                    ? 'bg-[#5B4DFF] text-white font-medium shadow-md shadow-[#5B4DFF]/20'
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
              <span className="text-sm font-sans">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout / User Info footer */}
      <div className="p-4 border-t border-slate-800 bg-[#0c1222] shrink-0">
        <Link href="/auth/login" className="w-full block">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('userEmail');
              }
              onClose();
            }}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-slate-450 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            <span className="font-sans">تسجيل الخروج</span>
          </button>
        </Link>
      </div>
    </aside>
  );
}
