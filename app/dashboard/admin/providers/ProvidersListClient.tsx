'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Eye, BadgeCheck, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { formatShortDate } from '@/app/lib/formatters';

type Provider = {
  id: string;
  specialtyTitle: string | null;
  approvalStatus: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  };
  services: any[];
};

export default function ProvidersListClient({ initialProviders }: { initialProviders: Provider[] }) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredProviders = initialProviders.filter((p) => {
    if (filter !== 'ALL' && p.approvalStatus !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      const providerName = p.user.name || '';
      return (
        (providerName && providerName.toLowerCase().includes(q)) ||
        p.user.email.toLowerCase().includes(q) ||
        (p.specialtyTitle && p.specialtyTitle.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-200">
            <BadgeCheck className="w-3.5 h-3.5" />
            معتمد
          </span>
        );
      case 'PENDING':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            قيد المراجعة
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-medium border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            مرفوض
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-medium border border-yellow-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            موقوف
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Filters Bar */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-[#0B132B] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'ALL' && 'الكل'}
              {status === 'PENDING' && 'قيد المراجعة'}
              {status === 'APPROVED' && 'معتمد'}
              {status === 'REJECTED' && 'مرفوض'}
              {status === 'SUSPENDED' && 'موقوف'}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="بحث بالاسم أو البريد..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:border-transparent text-right"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold">المستقل</th>
              <th className="px-6 py-4 font-semibold">التخصص</th>
              <th className="px-6 py-4 font-semibold">تاريخ التسجيل</th>
              <th className="px-6 py-4 font-semibold">الخدمات</th>
              <th className="px-6 py-4 font-semibold">الحالة</th>
              <th className="px-6 py-4 font-semibold text-left">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProviders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  لا يوجد مستقلين يطابقون بحثك
                </td>
              </tr>
            ) : (
              filteredProviders.map((provider) => (
                <tr key={provider.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{provider.user.name || 'مستخدم بدون اسم'}</span>
                      <span className="text-slate-500 text-xs mt-0.5">{provider.user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-700">{provider.specialtyTitle || 'غير محدد'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-sans">
                    {formatShortDate(provider.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {provider.services.length} خدمات
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(provider.approvalStatus)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <Link
                        href={`/dashboard/admin/providers/${provider.id}`}
                        className="p-2 text-slate-400 hover:text-[#06B6D4] hover:bg-cyan-50 rounded-lg transition-colors"
                        title="عرض التفاصيل"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
