'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ScrollToTop from './components/ui/ScrollToTop';

/* ─── SVG Icons ─── */

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

function SEOIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
      <polyline points="16 7 22 7 22 13"/>
    </svg>
  );
}

function PageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function OfferIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <polyline points="20 12 20 22 4 22 4 12"/>
      <rect x="2" y="7" width="20" height="5"/>
      <line x1="12" y1="22" x2="12" y2="7"/>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  );
}

function GraphIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

/* ─── Navbar ─── */

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: 'لماذا بروز مختلفة؟', href: '#difference' },
    { label: 'كيف تعمل', href: '#how-it-works' },
    { label: 'الخدمات', href: '#services' },
  ];

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-slate-200" style={{ background: '#FFFFFF' }}>
      <div className="container-xl">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link href="/" className="flex items-center shrink-0">
            <Image src="/شعار%20بروز.svg" alt="بروز" width={100} height={36} className="h-8 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((item) => (
              <a key={item.label} href={item.href}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors">
              تسجيل دخول
            </Link>
            <Link href="/register" className="btn-primary text-sm" style={{ padding: '0.5rem 1rem' }}>
              تسجيل
            </Link>
          </div>

          <button className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)} aria-label="القائمة"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-200" style={{ background: '#FFFFFF' }}>
          <div className="container-xl py-4 space-y-1">
            {links.map((item) => (
              <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 border-t border-slate-200 flex gap-2.5">
              <Link href="/login" className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900" onClick={() => setMenuOpen(false)}>
                تسجيل الدخول
              </Link>
              <Link href="/register" className="btn-primary flex-1 text-center" onClick={() => setMenuOpen(false)}>
                تسجيل
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─── Mac Dashboard Mockup ─── */

function MacDashboardMockup() {
  return (
    <div className="relative h-[460px] rounded-3xl overflow-hidden shadow-lg" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
      {/* Mac Title Bar */}
      <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-3" style={{ background: '#F8FAFC' }}>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: '#FF5F56' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#FFBD2E' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#27C93F' }} />
        </div>
        <span className="text-xs font-medium text-slate-600 flex-1 text-center">لوحة بروز</span>
        <div className="w-12" />
      </div>

      {/* Dashboard Content */}
      <div className="flex h-[calc(100%-48px)] overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-white border-r border-slate-200 p-4 space-y-2 overflow-y-auto">
          <div className="px-3 py-2 rounded-lg font-semibold text-xs text-slate-600 mb-4">لوحة التحكم</div>
          {['لوحة التحكم', 'الطلبات', 'العروض', 'المشاريع', 'الرسائل'].map((item, i) => (
            <div key={i} className={`px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
              i === 0 ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50'
            }`} style={i === 0 ? { background: '#EEF2FF', color: '#6D5DFB' } : {}}>
              {item}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">مرحبًا، تاجر بروز</h3>
                <p className="text-xs text-slate-500 mt-1">الطلبات والعروض والمشاريع في مكان واحد</p>
              </div>
              <button className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: '#6D5DFB', color: '#FFFFFF' }}>
                + طلب جديد
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'الطلبات قيد المراجعة', value: '2', icon: '📋' },
                { label: 'العروض المستلمة', value: '4', icon: '💼' },
                { label: 'المشاريع قيد التنفيذ', value: '1', icon: '⚙️' },
              ].map((stat, i) => (
                <div key={i} className="p-2.5 rounded-lg" style={{ background: '#F8FAFC', border: '1px solid #E5E7EB' }}>
                  <div className="text-lg mb-1">{stat.icon}</div>
                  <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Projects List */}
            <div className="space-y-2">
              {[
                { title: 'تخصيص واجهة متجر سلة', status: 'قيد التنفيذ', badge: '🔄' },
                { title: 'تحسين SEO', status: 'بانتظار العروض', badge: '⏳' },
                { title: 'صفحة هبوط', status: 'تم التسليم', badge: '✓' },
              ].map((project, i) => (
                <div key={i} className="p-2.5 rounded-lg flex items-center justify-between text-[10px]" style={{ background: '#F8FAFC', border: '1px solid #E5E7EB' }}>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{project.title}</div>
                    <div className="text-slate-500 mt-0.5">{project.status}</div>
                  </div>
                  <span className="text-lg">{project.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Hero Section ─── */

function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden" style={{ background: '#FFFFFF' }}>
      {/* Soft Purple Halo */}
      <div className="absolute top-32 left-1/3 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: '#6D5DFB' }} />

      <div className="container-xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12 items-center">
          {/* Text Column */}
          <div className="space-y-8 max-w-2xl order-2 lg:order-1">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: '#111827' }}>
                طوّر متجرك بدون فوضى البحث والمتابعة
              </h1>
              <p className="text-lg md:text-xl leading-relaxed" style={{ color: '#475569' }}>
                بروز منصة تدير طلبات تطوير المتاجر من رفع الطلب إلى مراجعة العروض، اختيار الخبير، متابعة التنفيذ، واستلام العمل من مكان واحد.
              </p>
            </div>

            <div className="space-y-4">
              {[
                'طلب واضح من البداية',
                'عروض من خبراء معتمدين',
                'متابعة منظمة حتى التسليم',
              ].map((line, i) => (
                <div key={i} className="flex items-center gap-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#6D5DFB" strokeWidth="3" strokeLinecap="round" className="w-6 h-6 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span className="text-base font-medium" style={{ color: '#111827' }}>{line}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/register" className="btn-primary text-base px-8 py-4 text-center font-semibold rounded-xl" style={{ background: '#6D5DFB', color: '#FFFFFF' }}>
                ابدأ طلبك الآن
              </Link>
              <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 text-base font-semibold px-8 py-4 rounded-xl transition-colors" style={{ border: '2px solid #E5E7EB', color: '#111827', background: '#FFFFFF' }} onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}>
                شاهد طريقة العمل
                <ArrowDownIcon />
              </a>
            </div>
          </div>

          {/* Mac Mockup Column */}
          <div className="order-1 lg:order-2">
            <MacDashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Comparison Section ─── */

const COMPARISON_ROWS = [
  ['البحث عن منفذين', 'طلب واحد'],
  ['محادثات واتساب متفرقة', 'منصة موحدة'],
  ['متابعة يدوية', 'تتبع واضح'],
  ['عروض غير منظمة', 'عروض قابلة للمقارنة'],
];

function DifferenceSection() {
  return (
    <section id="difference" className="py-16 md:py-20" style={{ background: '#FFFFFF' }}>
      <div className="container-xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            الفرق ليس في العثور على منفذ فقط
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            بروز تدير رحلة التنفيذ كاملة من أول طلب حتى اعتماد التسليم
          </p>
        </div>

        <div className="max-w-3xl mx-auto overflow-hidden rounded-lg border border-slate-200">
          <div className="grid grid-cols-2 font-semibold bg-slate-50 border-b border-slate-200">
            <div className="px-6 py-4 text-slate-900">الطريقة التقليدية</div>
            <div className="px-6 py-4 text-slate-900">بروز</div>
          </div>

          {COMPARISON_ROWS.map(([traditional, boroz]) => (
            <div
              key={traditional}
              className="grid grid-cols-2 border-b border-slate-100 last:border-b-0"
            >
              <div className="px-6 py-4 text-slate-600">{traditional}</div>
              <div className="px-6 py-4 text-slate-900 font-medium">{boroz}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works Section ─── */

const STEPS = [
  {
    num: '1',
    title: 'أرسل طلبك',
    desc: 'تصف متطلبات مشروعك عبر المنصة بالتفصيل.',
    icon: ClipboardIcon,
  },
  {
    num: '2',
    title: 'مراجعة الطلب',
    desc: 'فريق المنصة يتأكد من وضوح المتطلبات.',
    icon: SearchIcon,
  },
  {
    num: '3',
    title: 'استقبال العروض',
    desc: 'يقدم الخبراء عروضهم لتختار الأنسب.',
    icon: OfferIcon,
  },
  {
    num: '4',
    title: 'التنفيذ والتسليم',
    desc: 'تتابع العمل من البداية حتى التسليم النهائي.',
    icon: GraphIcon,
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-20" style={{ background: '#F8FAFC' }}>
      <div className="container-xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            طريقة العمل
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            خطوات واضحة وسهلة من الطلب إلى التسليم
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="card p-6 text-center space-y-4 flex flex-col">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mx-auto">
                  <Icon />
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-sm font-bold text-blue-600">{step.num}</span>
                    <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Services Section ─── */

const SERVICES = [
  {
    icon: StoreIcon,
    title: 'تخصيص متاجر سلة',
    desc: 'تطوير واجهات مخصصة وإضافة ميزات فريدة.',
  },
  {
    icon: SEOIcon,
    title: 'تحسين محركات البحث',
    desc: 'رفع ترتيب متجرك وجذب عملاء مؤهلين.',
  },
  {
    icon: PageIcon,
    title: 'صفحات الهبوط',
    desc: 'تصميم صفحات احترافية للحملات التسويقية.',
  },
];

function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-20" style={{ background: '#FFFFFF' }}>
      <div className="container-xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            الخدمات المتاحة
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            خدمات معتمدة داخل منصة بروز
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {SERVICES.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <div key={i} className="card p-6 space-y-4 flex flex-col text-center">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mx-auto">
                  <Icon />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{svc.title}</h3>
                  <p className="text-sm text-slate-600">{svc.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Section ─── */

function CTASection() {
  return (
    <section className="py-16 md:py-20" style={{ background: '#0F172A' }}>
      <div className="container-xl">
        <div className="max-w-4xl mx-auto rounded-xl px-8 py-12 md:py-16 text-center space-y-6" style={{ background: '#1E3A8A', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            جاهز لبدء مشروعك؟
          </h2>
          <p className="text-lg text-blue-100">
            ارفع طلبك مرة واحدة واترك بروز تدير رحلة التنفيذ
          </p>
          <div>
            <Link href="/register" className="btn-primary text-base px-8 py-3 inline-block">
              ابدأ طلب خدمة
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */

function Footer() {
  return (
    <footer className="py-12" style={{ background: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
      <div className="container-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 text-center md:text-right">
          <div className="space-y-3 lg:col-span-1">
            <Link href="/" className="flex justify-center md:justify-start">
              <Image src="/شعار%20بروز.svg" alt="بروز" width={100} height={36} className="h-8 w-auto" />
            </Link>
            <p className="text-sm text-slate-600">
              منصة لإدارة تطوير متاجر سلة
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900">المنصة</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#how-it-works" className="text-slate-600 hover:text-slate-900">كيف تعمل</a></li>
              <li><a href="#services" className="text-slate-600 hover:text-slate-900">الخدمات</a></li>
              <li><Link href="/request" className="text-slate-600 hover:text-slate-900">ارفع طلب</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900">الحساب</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="text-slate-600 hover:text-slate-900">تسجيل الدخول</Link></li>
              <li><Link href="/register/merchant" className="text-slate-600 hover:text-slate-900">حساب تاجر</Link></li>
              <li><Link href="/register/provider" className="text-slate-600 hover:text-slate-900">حساب خبير</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900">الدعم</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:support@boroz.sa" className="text-slate-600 hover:text-slate-900">تواصل معنا</a></li>
              <li><Link href="/privacy" className="text-slate-600 hover:text-slate-900">الخصوصية</Link></li>
              <li><Link href="/terms" className="text-slate-600 hover:text-slate-900">الشروط</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 text-center text-sm text-slate-600 space-y-1">
          <p>© 2026 بروز. جميع الحقوق محفوظة.</p>
          <p>منصة لتنظيم وإدارة تطوير متاجر سلة</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Page ─── */

export default function HomePage() {
  return (
    <div style={{ background: '#F8FAFC' }}>
      <Navbar />
      <main>
        <HeroSection />
        <DifferenceSection />
        <HowItWorksSection />
        <ServicesSection />
        <CTASection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
