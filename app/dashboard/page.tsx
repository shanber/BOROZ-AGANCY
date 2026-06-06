'use client';

import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import {
  ShoppingCart,
  Users,
  DollarSign,
  FolderOpen,
  Plus,
  BarChart3,
  Settings,
  AlertCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { label: 'الطلبات النشطة', value: '8', icon: ShoppingCart, change: '+2 هذا الأسبوع', color: 'emerald' },
    { label: 'المشاريع الجارية', value: '5', icon: FolderOpen, change: '1 في انتظار المراجعة', color: 'purple' },
    { label: 'إجمالي الإيرادات', value: '45,000 ر.س', icon: DollarSign, change: '+12% منذ الشهر الماضي', color: 'blue' },
    { label: 'العملاء النشطون', value: '12', icon: Users, change: '+3 عملاء جدد', color: 'amber' },
  ];

  const quickActions = [
    { label: 'طلب جديد', href: '/dashboard/orders', icon: Plus, color: 'text-white bg-[#5B4DFF] hover:bg-[#4b3dff] shadow-sm shadow-[#5B4DFF]/10' },
    { label: 'مشروع جديد', href: '/dashboard/projects', icon: FolderOpen, color: 'text-[#111827] bg-slate-50 border border-slate-200 hover:bg-slate-100' },
    { label: 'عرض التقارير', href: '/dashboard/reports', icon: BarChart3, color: 'text-[#111827] bg-slate-50 border border-slate-200 hover:bg-slate-100' },
    { label: 'الإعدادات', href: '/dashboard/settings', icon: Settings, color: 'text-[#111827] bg-slate-50 border border-slate-200 hover:bg-slate-100' },
  ];

  const recentOrders = [
    { id: 'ORD-109', client: 'متجر العطور الفاخرة', service: 'إدارة حملات سناب شات', price: '4,000 ر.س', status: 'قيد التنفيذ', date: 'منذ ساعتين' },
    { id: 'ORD-108', client: 'شركة سلة المحدودة', service: 'تصميم هوية بصرية كاملة', price: '12,500 ر.س', status: 'مكتمل', date: 'أمس، 04:30 م' },
    { id: 'ORD-107', client: 'متجر التمور الراقية', service: 'تحسين أداء متجر سلة (SEO)', price: '5,500 ر.س', status: 'بانتظار العميل', date: '3 يونيو 2026' },
    { id: 'ORD-106', client: 'عبق الشرق للعود', service: 'كتابة محتوى إعلاني', price: '3,000 ر.س', status: 'مكتمل', date: '1 يونيو 2026' },
  ];

  const activeProjects = [
    { name: 'تهيئة وتحسين محركات البحث متجر العطور', client: 'متجر العطور الفاخرة', progress: 75, status: 'نشط', statusColor: 'text-emerald-600 bg-emerald-50' },
    { name: 'هوية بصرية وتصميم بنرات المتجر الجديد', client: 'شركة سلة المحدودة', progress: 100, status: 'مكتمل', statusColor: 'text-blue-600 bg-blue-50' },
    { name: 'حملة تسويق موسم الصيف الكبرى', client: 'عبق الشرق للعود', progress: 40, status: 'نشط', statusColor: 'text-emerald-600 bg-emerald-50' },
  ];

  const alerts = [
    { title: 'رفع متطلبات معلق', desc: 'متجر التمور الراقية لم يرفع ملفات الشعار المطلوب بعد لمشروع الـ SEO.', type: 'warning', icon: AlertCircle },
    { title: 'تقرير مبيعات شهر مايو', desc: 'تم إعداد التقرير المالي لشهر مايو وهو جاهز للمراجعة من قبل الإدارة.', type: 'info', icon: TrendingUp },
    { title: 'تسليم الهوية البصرية غداً', desc: 'موعد تسليم المخرجات النهائية لشركة سلة المحدودة يصادف يوم الغد.', type: 'danger', icon: Clock },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'مكتمل':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'قيد التنفيذ':
        return 'bg-[#5B4DFF]/10 text-[#5B4DFF] border border-[#5B4DFF]/20';
      case 'بانتظار العميل':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Header section inside main content */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#111827] font-sans">لوحة التحكم</h2>
          <p className="text-xs md:text-sm text-[#64748B] mt-1 font-sans">
            نظرة عامة على أداء الطلبات والمشاريع داخل بروز
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] bg-white border border-slate-200/80 rounded-xl px-3.5 py-2 shadow-sm">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          <span className="font-sans">محدث تلقائياً قبل دقيقة واحدة</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border border-slate-200/80 hover:shadow-md transition-shadow">
              <CardBody className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#64748B] font-sans">{stat.label}</span>
                  <div className="w-10 h-10 rounded-xl bg-[#0F172A]/5 flex items-center justify-center text-[#0F172A]">
                    <Icon size={20} />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-[#111827] font-sans leading-none">{stat.value}</h3>
                  <span className="text-[10px] text-slate-500 font-medium font-sans mt-2 block">
                    {stat.change}
                  </span>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Left Side: Recent Orders & Active Projects (2 Columns on Desktop) */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          
          {/* Recent Orders Table */}
          <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
            <CardHeader className="flex justify-between items-center bg-white border-b border-slate-200/80 px-6 py-4">
              <h3 className="font-bold text-sm text-[#111827] font-sans">آخر الطلبات</h3>
              <Link href="/dashboard/orders" className="text-xs text-[#5B4DFF] font-semibold hover:underline flex items-center gap-1 font-sans">
                عرض الكل
                <ArrowUpRight size={14} />
              </Link>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200/80">
                    <th className="px-6 py-3 font-semibold font-sans">رقم الطلب</th>
                    <th className="px-6 py-3 font-semibold font-sans">العميل</th>
                    <th className="px-6 py-3 font-semibold font-sans">الخدمة</th>
                    <th className="px-6 py-3 font-semibold font-sans text-left">القيمة</th>
                    <th className="px-6 py-3 font-semibold font-sans text-center">الحالة</th>
                    <th className="px-6 py-3 font-semibold font-sans">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5 font-bold text-[#111827] font-sans">{order.id}</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-700 font-sans">{order.client}</td>
                      <td className="px-6 py-3.5 text-slate-600 font-sans">{order.service}</td>
                      <td className="px-6 py-3.5 text-left font-bold text-[#111827] font-sans">{order.price}</td>
                      <td className="px-6 py-3.5 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-sans ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-500 font-sans whitespace-nowrap">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Active Projects Grid */}
          <Card className="border border-slate-200/80 shadow-sm">
            <CardHeader className="flex justify-between items-center bg-white border-b border-slate-200/80 px-5 py-4">
              <h3 className="font-bold text-sm text-[#111827] font-sans">المشاريع النشطة</h3>
              <Link href="/dashboard/projects" className="text-xs text-[#5B4DFF] font-semibold hover:underline flex items-center gap-1 font-sans">
                عرض كل المشاريع
                <ArrowUpRight size={14} />
              </Link>
            </CardHeader>
            <CardBody className="p-4 md:p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeProjects.map((project, idx) => (
                  <div key={idx} className="border border-slate-150 rounded-xl p-3.5 space-y-3 hover:border-slate-350 transition-colors bg-white">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-[#111827] font-sans line-clamp-1">{project.name}</h4>
                        <p className="text-[10px] text-[#64748B] font-medium font-sans">{project.client}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold font-sans shrink-0 ${project.statusColor}`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold font-sans">
                        <span className="text-slate-500">نسبة الإنجاز</span>
                        <span className="text-[#5B4DFF]">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#5B4DFF] h-1.5 rounded-full transition-all duration-500" 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Side: Quick Actions & Alerts (1 Column on Desktop) */}
        <div className="space-y-6 md:space-y-8">
          
          {/* Quick Actions Grid */}
          <Card className="border border-slate-200/80 shadow-sm">
            <CardHeader className="bg-white border-b border-slate-200/80 px-6 py-4">
              <h3 className="font-bold text-sm text-[#111827] font-sans">الإجراءات السريعة</h3>
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
                      <span className="text-xs font-bold font-sans">{action.label}</span>
                    </Link>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          {/* Important Alerts */}
          <Card className="border border-slate-200/80 shadow-sm">
            <CardHeader className="bg-white border-b border-slate-200/80 px-6 py-4">
              <h3 className="font-bold text-sm text-[#111827] font-sans">تنبيهات مهمة</h3>
            </CardHeader>
            <CardBody className="p-4 space-y-3">
              {alerts.map((alert, idx) => {
                const Icon = alert.icon;
                let borderTheme = 'border-amber-200 bg-amber-50/50 text-amber-800';
                let iconColor = 'text-amber-600';
                if (alert.type === 'danger') {
                  borderTheme = 'border-red-200 bg-red-50/50 text-red-800';
                  iconColor = 'text-red-600';
                } else if (alert.type === 'info') {
                  borderTheme = 'border-blue-200 bg-blue-50/50 text-blue-800';
                  iconColor = 'text-blue-600';
                }
                return (
                  <div key={idx} className={`p-3 border rounded-xl flex gap-3 ${borderTheme}`}>
                    <div className={`${iconColor} shrink-0`}>
                      <Icon size={18} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs font-sans leading-none">{alert.title}</h4>
                      <p className="text-[10px] text-slate-650 leading-relaxed font-sans">{alert.desc}</p>
                    </div>
                  </div>
                );
              })}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
