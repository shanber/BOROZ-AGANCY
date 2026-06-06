'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Search, Eye } from 'lucide-react';
import { orders, Order } from '@/app/lib/demo-data';

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterTabs = [
    { label: 'الكل', count: orders.length },
    { label: 'جديد', count: orders.filter(o => o.status === 'جديد').length },
    { label: 'قيد التنفيذ', count: orders.filter(o => o.status === 'قيد التنفيذ').length },
    { label: 'بانتظار العميل', count: orders.filter(o => o.status === 'بانتظار العميل').length },
    { label: 'مكتمل', count: orders.filter(o => o.status === 'مكتمل').length },
  ];

  // Filter and Search logic
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = activeFilter === 'الكل' || order.status === activeFilter;
    const matchesSearch = 
      order.storeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.serviceLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'مكتمل':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-250';
      case 'قيد التنفيذ':
        return 'bg-[#5B4DFF]/10 text-[#5B4DFF] border border-[#5B4DFF]/20';
      case 'بانتظار العميل':
        return 'bg-amber-50 text-amber-700 border border-amber-250';
      case 'جديد':
        return 'bg-blue-50 text-blue-700 border border-blue-250';
      default:
        return 'bg-slate-50 text-slate-650 border border-slate-200';
    }
  };

  const getPriorityStyle = (priority: Order['priority']) => {
    switch (priority) {
      case 'عاجل':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'مهم':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'عادي':
        return 'bg-slate-50 text-slate-600 border border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-250';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#111827] font-sans">الطلبات</h2>
          <p className="text-xs md:text-sm text-[#64748B] mt-1 font-sans">
            متابعة طلبات الخدمات وحالات التنفيذ داخل وكالة بروز.
          </p>
        </div>
        <Link href="/dashboard/orders/new">
          <Button className="bg-[#5B4DFF] hover:bg-[#4b3dff] text-white text-xs font-bold shadow-sm shadow-[#5B4DFF]/10 flex items-center gap-1.5 px-4 py-2.5 rounded-xl">
            <Plus size={16} />
            طلب جديد
          </Button>
        </Link>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl max-w-max">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveFilter(tab.label)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${isActive ? 'bg-white text-[#111827] shadow-sm' : 'text-slate-600 hover:text-[#111827]'}`}
              >
                <span className="font-sans">{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${isActive ? 'bg-[#5B4DFF] text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="w-full lg:w-72">
          <Input
            placeholder="ابحث برقم الطلب أو اسم المتجر..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={16} className="text-slate-400" />}
            className="bg-white border-slate-200"
          />
        </div>
      </div>

      {/* Table Container */}
      <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Table itself is wrapped in an overflow-x-auto container.
            This ensures that the table scrolls horizontally ONLY inside the card on mobile,
            instead of breaking the viewport and causing horizontal scrolling on the page body. */}
        <div className="w-full overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <p className="text-sm font-sans">لا توجد طلبات تطابق الفلتر أو البحث الحالي.</p>
              <button 
                onClick={() => { setActiveFilter('الكل'); setSearchQuery(''); }}
                className="text-xs text-[#5B4DFF] font-bold hover:underline font-sans"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          ) : (
            <table className="w-full text-right border-collapse text-xs whitespace-nowrap min-w-[750px]">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200/80">
                  <th className="px-6 py-3.5 font-bold font-sans">رقم الطلب</th>
                  <th className="px-6 py-3.5 font-bold font-sans">اسم المتجر</th>
                  <th className="px-6 py-3.5 font-bold font-sans">الخدمة المطلوبة</th>
                  <th className="px-6 py-3.5 font-bold font-sans text-center">الحالة</th>
                  <th className="px-6 py-3.5 font-bold font-sans text-center">الأولوية</th>
                  <th className="px-6 py-3.5 font-bold font-sans">تاريخ الطلب</th>
                  <th className="px-6 py-3.5 font-bold font-sans text-left">المبلغ</th>
                  <th className="px-6 py-3.5 font-bold font-sans text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#111827] font-sans">{order.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700 font-sans">{order.storeName}</td>
                    <td className="px-6 py-4 text-slate-650 font-sans">{order.serviceLabel}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sans ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold font-sans border ${getPriorityStyle(order.priority)}`}>
                        {order.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-sans">{order.date}</td>
                    <td className="px-6 py-4 text-left font-bold text-[#111827] font-sans">{order.price}</td>
                    <td className="px-6 py-4 text-center">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-650 hover:text-[#111827] transition-all font-sans font-bold text-[10px]">
                          <Eye size={12} />
                          تفاصيل
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
