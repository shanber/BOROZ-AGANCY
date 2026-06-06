'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import {
  Zap,
  BarChart3,
  Users,
  CheckCircle,
  Palette,
  Rocket,
  TrendingUp,
  Shield,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">
            <span className="text-primary-navy">بروز</span>{' '}
            <span className="text-primary-purple">BOROZ</span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">تسجيل الدخول</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="primary">ابدأ الآن</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-primary-navy mb-6 leading-tight">
          كل ما يحتاجه متجرك<br />
          <span className="text-primary-purple">للنمو في مكان واحد</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12">
          اطلب خدمات التسويق والتصميم والتطوير لمتجرك على سلة، وتابع التنفيذ والمشاريع
          والتقارير من لوحة تحكم موحدة
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/register">
            <Button variant="primary" size="lg">
              ابدأ الآن
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="secondary" size="lg">
              تسجيل الدخول
            </Button>
          </Link>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="max-w-7xl mx-auto px-6 py-16 bg-slate-50 rounded-2xl">
        <h2 className="text-3xl font-bold text-primary-navy text-center mb-12">
          منصة متكاملة تجمع كل ما تحتاجه
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Zap, label: 'الطلبات', desc: 'اطلب الخدمات بسهولة' },
            { icon: BarChart3, label: 'المشاريع', desc: 'تابع التقدم بوضوح' },
            { icon: TrendingUp, label: 'التقارير', desc: 'شاهد النتائج' },
            { icon: Palette, label: 'التصميم', desc: 'هويات بصرية احترافية' },
            { icon: Users, label: 'التسويق', desc: 'حملات إعلانية فعالة' },
            { icon: Rocket, label: 'التطوير', desc: 'تحسين الأداء' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="text-center">
                <div className="bg-primary-purple bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon size={32} className="text-primary-purple" />
                </div>
                <h3 className="font-semibold text-lg text-primary-navy mb-2">
                  {item.label}
                </h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-primary-navy text-center mb-12">
          خدماتنا المتخصصة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'تخصيص متجر سلة', price: '2,500', days: '10' },
            { name: 'إدارة المتجر', price: 'متغير', days: 'مستمر' },
            { name: 'تصميم واجهات المتجر', price: '3,000', days: '14' },
            { name: 'تطوير وتحسين المتجر', price: '5,000', days: '30' },
            { name: 'تصميم البنرات', price: '1,500', days: '7' },
            { name: 'تصميم الهوية البصرية', price: '3,000', days: '14' },
            { name: 'إدارة الحملات الإعلانية', price: '4,000', days: '30' },
            { name: 'كتابة المحتوى التسويقي', price: '2,000', days: '14' },
            { name: 'إنشاء صفحات الهبوط', price: '2,500', days: '7' },
            { name: 'تحسين SEO للمتجر', price: '3,500', days: '45' },
          ].map((service) => (
            <div
              key={service.name}
              className="border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg text-primary-navy mb-2">
                {service.name}
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-primary-purple font-bold">
                  ر.س {service.price}
                </span>
                <span className="text-sm text-slate-600">{service.days} يوم</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-24 bg-slate-50 rounded-2xl">
        <h2 className="text-3xl font-bold text-primary-navy text-center mb-12">
          خطوات العمل معنا
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { num: 1, title: 'أنشئ حسابك', desc: 'سجل وأضف متجرك' },
            { num: 2, title: 'أضف متجرك', desc: 'ربط متجرك على سلة' },
            { num: 3, title: 'اختر الخدمة', desc: 'اختر من خدماتنا' },
            { num: 4, title: 'ارفع المتطلبات', desc: 'شارك ملفاتك ومتطلباتك' },
            { num: 5, title: 'تابع التنفيذ', desc: 'شاهد التقدم في الوقت الفعلي' },
            { num: 6, title: 'استلم المخرجات', desc: 'احصل على النتائج والتقارير' },
          ].map((step) => (
            <div key={step.num} className="relative">
              <div className="bg-primary-purple text-white w-12 h-12 rounded-full flex items-center justify-center font-bold mb-4">
                {step.num}
              </div>
              <h3 className="font-semibold text-lg text-primary-navy mb-2">
                {step.title}
              </h3>
              <p className="text-slate-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why BOROZ */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-primary-navy text-center mb-12">
          لماذا بروز؟
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            { icon: Zap, title: 'سرعة التنفيذ', desc: 'فريق متخصص يعمل بكفاءة عالية' },
            { icon: Shield, title: 'وضوح المتابعة', desc: 'شفافية كاملة في كل خطوة' },
            {
              icon: CheckCircle,
              title: 'مكان واحد',
              desc: 'كل الخدمات في لوحة تحكم واحدة',
            },
            {
              icon: BarChart3,
              title: 'شفافية المشاريع',
              desc: 'تقارير مفصلة لكل مشروع',
            },
            {
              icon: Users,
              title: 'تجربة مخصصة',
              desc: 'منصة مصممة لتجار سلة',
            },
            {
              icon: Rocket,
              title: 'النمو المستمر',
              desc: 'دعم مستمر لنمو متجرك',
            },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex gap-4">
                <Icon className="text-primary-purple flex-shrink-0" size={32} />
                <div>
                  <h3 className="font-semibold text-lg text-primary-navy mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* About Us */}
      <section className="max-w-4xl mx-auto px-6 py-24 bg-slate-50 rounded-2xl text-center">
        <h2 className="text-3xl font-bold text-primary-navy mb-6">عن بروز</h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-8">
          بروز هي منصة متخصصة في تسويق ونمو تجار سلة. نحن نوفر حلاً متكاملاً يجمع بين
          خدمات التسويق والتصميم والتطوير، مع توفير تجربة سهلة وشفافة لإدارة وتتبع
          المشاريع. فريقنا من المتخصصين يعمل على تحسين أداء متاجرك وزيادة مبيعاتك.
        </p>
        <p className="text-slate-600">
          نؤمن بأن كل متجر يستحق أفضل الخدمات بأسعار عادلة وشفافة.
        </p>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-bold text-primary-navy mb-6">
          جاهز لتطوير متجرك؟
        </h2>
        <p className="text-xl text-slate-600 mb-8">
          ابدأ الآن مع بروز واستمتع بخدمات احترافية متكاملة
        </p>
        <Link href="/auth/register">
          <Button variant="primary" size="lg">
            ابدأ الآن
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-primary-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="mb-2">
            <span className="text-2xl font-bold">بروز</span> |{' '}
            <span className="text-2xl font-bold">BOROZ</span>
          </p>
          <p className="text-slate-300 mb-6">
            منصة التسويق والنمو المتخصصة لتجار سلة
          </p>
          <p className="text-slate-400">© 2024 BOROZ. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
