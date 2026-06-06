'use client';

import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import {
  ShoppingCart,
  Users,
  DollarSign,
  Plus,
  Settings,
  FolderOpen,
  BarChart3,
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'المتاجر', value: 24, icon: ShoppingCart, color: 'primary-purple' },
          { label: 'الطلبات', value: 8, icon: Users, color: 'blue' },
          { label: 'المشاريع', value: 5, icon: FolderOpen, color: 'emerald' },
          { label: 'الإيرادات', value: '45,000 ر.س', icon: DollarSign, color: 'amber' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                    <Icon size={24} className={`text-${stat.color}-600`} />
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">الإجراءات السريعة</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Plus, label: 'طلب جديد', color: 'primary-purple' },
              { icon: BarChart3, label: 'عرض التقارير', color: 'blue' },
              { icon: FolderOpen, label: 'مشروع جديد', color: 'emerald' },
              { icon: Settings, label: 'الإعدادات', color: 'amber' },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className={`p-4 rounded-lg border border-slate-200 hover:shadow-lg transition-all hover:border-${action.color}-300`}
                >
                  <Icon className={`mx-auto mb-2 text-${action.color}-600`} size={24} />
                  <p className="text-sm font-medium text-slate-700">{action.label}</p>
                </button>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">🎉 مرحباً بك في BOROZ</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <p className="text-slate-700">
              أهلاً وسهلاً في منصة بروز - منصة النمو المتخصصة لتجار سلة.
            </p>
            <p className="text-slate-600 text-sm">
              هذه نسخة تجريبية من لوحة التحكم تظهر الواجهات والتخطيط النهائي. يتم تطوير
              الميزات الفعلية والمصادقة في المرحلة التالية (Phase 2).
            </p>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-slate-800">✅ ما هو جاهز:</p>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>واجهات المستخدم (UI) الكاملة</li>
                <li>قاعدة البيانات والنموذج</li>
                <li>نظام الملاحة</li>
                <li>مكونات معادة الاستخدام</li>
              </ul>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-slate-800">⏳ قريباً (Phase 2):</p>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>المصادقة والتسجيل</li>
                <li>إدارة الحسابات</li>
                <li>نظام الطلبات والمشاريع</li>
                <li>التقارير والتحليلات</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
