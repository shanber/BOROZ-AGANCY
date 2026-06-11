'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import {
  ShoppingCart,
  FolderOpen,
  Plus,
  AlertCircle,
  ArrowUpRight,
  Briefcase,
} from 'lucide-react';
import { Order } from '@/app/lib/demo-data';
import { getDashboardOrdersSummary } from '@/app/lib/orders-api';

// ── Icon map ──────────────────────────────────────────────────
const IconMap = {
  ShoppingCart,
  FolderOpen,
  AlertCircle,
};

// ── Role-based welcome header ─────────────────────────────────
function DashboardHeader({ name, role }: { name?: string | null; role?: string }) {
  if (role === 'ADMIN') {
    return (
      <div>
        <p className="text-xs font-semibold text-[#06B6D4] mb-1 tracking-wide uppercase">
          لوحة تحكم الإدارة
        </p>
        <h2 className="text-xl md:text-2xl font-bold text-[#111827]">أهلاً مسؤول بروز</h2>
        <p className="text-xs md:text-sm text-[#475569] mt-1.5">
          إدارة مقدمي الخدمة، الطلبات، المشاريع، ومراجعة نشاط المنصة.
        </p>
      </div>
    );
  }

  if (role === 'PROVIDER') {
    const greeting = name ? `أهلاً ${name}` : 'أهلاً مقدم الخدمة';
    return (
      <div>
        <p className="text-xs font-semibold text-[#06B6D4] mb-1 tracking-wide uppercase">
          لوحة تحكم مقدم الخدمة
        </p>
        <h2 className="text-xl md:text-2xl font-bold text-[#111827]">{greeting}</h2>
        <p className="text-xs md:text-sm text-[#475569] mt-1.5">
          تابع الطلبات المناسبة، عروضك، ومشاريعك داخل بروز.
        </p>
      </div>
    );
  }

  // Default: MERCHANT
  const greeting = name ? `أهلاً تاجرنا، ${name}` : 'أهلاً تاجرنا';
  return (
    <div>
      <p className="text-xs font-semibold text-[#06B6D4] mb-1 tracking-wide uppercase">
        لوحة تحكم التاجر
      </p>
      <h2 className="text-xl md:text-2xl font-bold text-[#111827]">{greeting}</h2>
      <p className="text-xs md:text-sm text-[#475569] mt-1.5">
        تابع طلباتك ومراجعة بروز من مكان واحد.
      </p>
    </div>
  );
}

// ── Main dashboard page ───────────────────────────────────────
export default function DashboardPage() {
  const { data: session } = useSession();
  const globalRole = session?.user?.globalRole;
  const userName = session?.user?.name;

  const [stats, setStats] = React.useState([
    { label: 'طلبات جديدة',   value: '0', iconName: 'FolderOpen'  },
    { label: 'قيد المراجعة',  value: '0', iconName: 'AlertCircle' },
  ]);
  const [recentOrders, setRecentOrders] = React.useState<Order[]>([]);

  React.useEffect(() => {
    async function loadDashboardData() {
      try {
        const summary = await getDashboardOrdersSummary();
        const newCount = summary.counts.SUBMITTED || 0;
        const reviewCount = summary.counts.UNDER_REVIEW || 0;

        setStats([
          { label: 'طلبات جديدة',   value: String(newCount),    iconName: 'FolderOpen'  },
          { label: 'قيد المراجعة',  value: String(reviewCount), iconName: 'AlertCircle' },
        ]);

        setRecentOrders(summary.recentOrders);
      } catch (error) {
        console.warn('Failed to load real data', error);
      }
    }
    loadDashboardData();
  }, []);

  const quickActions = [
    { label: 'طلب خدمة جديد', href: '/request',          icon: Plus,         color: 'text-white bg-[#06B6D4] hover:bg-[#0891B2] shadow-sm' },
    { label: 'إدارة طلباتي',   href: '/dashboard/orders', icon: ShoppingCart, color: 'text-[#111827] bg-slate-50 border border-slate-200 hover:bg-slate-100' },
    { label: 'العروض',         href: '/dashboard/offers', icon: Briefcase,    color: 'text-[#111827] bg-slate-50 border border-slate-200 hover:bg-slate-100' },
    { label: 'المشاريع',       href: '/dashboard/projects', icon: FolderOpen,  color: 'text-[#111827] bg-slate-50 border border-slate-200 hover:bg-slate-100' },
  ];

  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'مكتمل':         return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'معتمد للعروض':   return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'قيد المراجعة':   return 'bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20';
      case 'بحاجة إلى تعديل': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'بانتظار مراجعة بروز':          return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'مرفوض':          return 'bg-red-50 text-red-700 border border-red-200';
      default:              return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Welcome Header (role-aware) ────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <DashboardHeader name={userName} role={globalRole} />
        <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] bg-white border border-slate-200/80 rounded-xl px-3.5 py-2 shadow-sm shrink-0">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          <span>محدث تلقائياً</span>
        </div>
      </div>

      {/* ── Stats Grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => {
          const Icon = IconMap[stat.iconName as keyof typeof IconMap] || FolderOpen;
          return (
            <Card key={idx} className="border border-slate-200/80 hover:shadow-md transition-shadow">
              <CardBody className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#64748B]">{stat.label}</span>
                  <div className="w-9 h-9 rounded-xl bg-[#0F172A]/5 flex items-center justify-center text-[#0F172A]">
                    <Icon size={18} />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-[#111827] leading-none">{stat.value}</h3>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* ── Main Grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
            <CardHeader className="flex justify-between items-center bg-white border-b border-slate-200/80 px-6 py-4">
              <h3 className="font-bold text-sm text-[#111827]">آخر الطلبات</h3>
              <Link href="/dashboard/orders" className="text-xs text-[#06B6D4] font-semibold hover:underline flex items-center gap-1">
                عرض الكل <ArrowUpRight size={14} />
              </Link>
            </CardHeader>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-right border-collapse text-xs min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200/80">
                    <th className="px-6 py-3 font-semibold">رقم الطلب</th>
                    <th className="px-6 py-3 font-semibold">المتجر</th>
                    <th className="px-6 py-3 font-semibold">الخدمة</th>
                    <th className="px-6 py-3 font-semibold text-left">القيمة</th>
                    <th className="px-6 py-3 font-semibold text-center">الحالة</th>
                    <th className="px-6 py-3 font-semibold">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-3.5 font-bold text-[#111827]">
                          <Link href={`/dashboard/orders/${order.id}`} className="hover:text-[#06B6D4] hover:underline">
                            {order.id}
                          </Link>
                        </td>
                        <td className="px-6 py-3.5 font-semibold text-slate-700">{order.storeName}</td>
                        <td className="px-6 py-3.5 text-slate-600">{order.serviceLabel}</td>
                        <td className="px-6 py-3.5 text-left font-bold text-[#111827]">{order.price}</td>
                        <td className="px-6 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getStatusStyle(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-slate-500 whitespace-nowrap">{order.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                            <ShoppingCart size={32} />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-700">لا توجد طلبات حتى الآن</h4>
                            <p className="text-sm text-slate-500 max-w-sm mx-auto">
                              ابدأ بإرسال طلب خدمة ليقوم فريق بروز بمراجعته وتوجيهه للمستقل المناسب.
                            </p>
                          </div>
                          <Link href="/request" className="btn-primary mt-2">
                            <Plus size={18} />
                            إنشاء طلب خدمة
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Side: Quick Actions + Alert */}
        <div className="space-y-6">

          <Card className="border border-slate-200/80 shadow-sm">
            <CardHeader className="bg-white border-b border-slate-200/80 px-6 py-4">
              <h3 className="font-bold text-sm text-[#111827]">الإجراءات السريعة</h3>
            </CardHeader>
            <CardBody className="p-6">
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={idx}
                      href={action.href}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200/60 shadow-sm transition-all text-center hover:-translate-y-0.5 ${action.color}`}
                    >
                      <Icon className="mb-2" size={20} />
                      <span className="text-xs font-bold">{action.label}</span>
                    </Link>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          <Card className="border border-slate-200/80 shadow-sm">
            <CardHeader className="bg-white border-b border-slate-200/80 px-6 py-4">
              <h3 className="font-bold text-sm text-[#111827]">تنبيهات مهمة</h3>
            </CardHeader>
            <CardBody className="p-4">
              <div className="p-3 border rounded-xl flex gap-3 border-blue-200 bg-blue-50/50">
                <div className="text-blue-500 shrink-0 mt-0.5">
                  <AlertCircle size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-blue-900 leading-none">مرحباً بك في بروز</h4>
                  <p className="text-[10px] text-blue-700 leading-relaxed">
                    يمكنك الآن البدء بإضافة طلب خدمة جديد ليقوم فريقنا بمراجعته وتوجيهه.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

        </div>
      </div>
    </div>
  );
}
