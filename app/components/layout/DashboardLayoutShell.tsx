'use client';

import React, { useState } from 'react';
import { Sidebar } from '../ui/Sidebar';
import { Topbar } from '../ui/Topbar';
import { usePathname } from 'next/navigation';

interface DashboardLayoutShellProps {
  children: React.ReactNode;
}

const routeTitles: Record<string, string> = {
  '/dashboard': 'لوحة التحكم',
  '/dashboard/merchants': 'التجار',
  '/dashboard/leads': 'العملاء المحتملين',
  '/dashboard/orders': 'الطلبات',
  '/dashboard/projects': 'المشاريع',
  '/dashboard/tasks': 'المهام',
  '/dashboard/reports': 'التقارير',
  '/dashboard/settings': 'الإعدادات',
};

export function DashboardLayoutShell({ children }: DashboardLayoutShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const title = routeTitles[pathname] || 'لوحة التحكم';

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827] overflow-x-hidden relative">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - fixed width 260px */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 md:pr-[260px] transition-all duration-300 min-h-screen">
        {/* Topbar */}
        <Topbar title={title} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
