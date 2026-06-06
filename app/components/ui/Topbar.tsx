'use client';

import { Bell, Menu, Search, Settings } from 'lucide-react';

interface TopbarProps {
  title: string;
  userName?: string;
  onToggleSidebar: () => void;
}

export function Topbar({ title, userName = 'مسؤول بروز', onToggleSidebar }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 border-b border-slate-200/80 shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* Right side: Title & Sidebar toggle (aligned right in RTL) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors md:hidden"
            aria-label="افتح القائمة الجانبية"
          >
            <Menu size={22} />
          </button>
          
          <h1 className="text-base md:text-lg font-bold text-[#111827] font-sans truncate">
            {title}
          </h1>
        </div>

        {/* Left side: Search & User actions (aligned left in RTL) */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Search bar on desktop */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-250/80 rounded-xl px-3 py-1.5 w-60 text-slate-400 focus-within:border-[#5B4DFF] focus-within:bg-white transition-all">
            <Search size={16} />
            <input
              type="text"
              placeholder="ابحث هنا..."
              className="bg-transparent border-none text-xs w-full text-slate-800 focus:outline-none placeholder-slate-400 font-sans"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors" aria-label="التنبيهات">
            <Bell size={18} className="text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#5B4DFF] rounded-full animate-pulse" />
          </button>

          {/* Settings */}
          <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors" aria-label="الإعدادات">
            <Settings size={18} className="text-slate-600" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pr-2.5 border-r border-slate-200">
            <div className="hidden md:block text-right">
              <p className="text-xs font-semibold text-[#111827] font-sans">{userName}</p>
              <p className="text-[10px] text-slate-500 font-medium font-sans">المدير العام</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5B4DFF] to-[#0F172A] flex items-center justify-center shadow-sm text-white font-bold text-sm">
              م
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
