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

/* ─── Hero Mockup: Layered Product Story (3 dashboards) ───
   بروز ليست لوحة واحدة: التاجر يطلب، إدارة بروز تدير التنفيذ، الخبير ينفّذ.
   لوحة الإدارة في الأمام لأنها قيمة بروز الأساسية (طبقة الإدارة والتشغيل). */

const STATUS_TONES: Record<string, { bg: string; fg: string }> = {
  green: { bg: '#DCFCE7', fg: '#15803D' },   // مكتمل / نشط
  orange: { bg: '#FFEDD5', fg: '#C2410C' },  // بانتظار
  purple: { bg: '#EEF2FF', fg: '#6D5DFB' },  // عروض / فرص
};

function StatusBadge({ label, tone }: { label: string; tone: keyof typeof STATUS_TONES }) {
  const t = STATUS_TONES[tone];
  return (
    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: t.bg, color: t.fg }}>
      {label}
    </span>
  );
}

function WindowFrame({
  title,
  primary = false,
  children,
}: {
  title: string;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden bg-white w-full"
      style={{
        border: primary ? '1px solid #DDD6FE' : '1px solid #E5E7EB',
        boxShadow: primary
          ? '0 26px 50px -14px rgba(109,93,251,0.35)'
          : '0 18px 36px -14px rgba(17,24,39,0.18)',
      }}
    >
      {/* Title bar */}
      <div className="h-8 flex items-center px-3 gap-2" style={{ background: '#F8FAFC', borderBottom: '1px solid #E5E7EB' }}>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#FF5F56' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#FFBD2E' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#27C93F' }} />
        </div>
        <span className="flex-1 text-center text-[11px] font-bold" style={{ color: primary ? '#6D5DFB' : '#475569' }}>
          {title}
        </span>
        <span className="w-8" />
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

/* محتوى لوحة الإدارة — النافذة الأمامية */
function AdminPanel() {
  return (
    <WindowFrame title="لوحة الإدارة" primary>
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-[13px] font-bold text-slate-900">متابعة المشاريع المفتوحة</h3>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded" style={{ background: '#EEF2FF', color: '#6D5DFB' }}>بروز</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: 'طلبات للمراجعة', value: '3' },
          { label: 'عروض قيد الجمع', value: '5' },
          { label: 'مشاريع نشطة', value: '4' },
        ].map((s, i) => (
          <div key={i} className="rounded-lg px-2 py-2 text-center" style={{ background: '#F8FAFC', border: '1px solid #EEF2FF' }}>
            <div className="text-[15px] font-bold text-slate-900 leading-none">{s.value}</div>
            <div className="text-[11px] text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        {[
          { title: 'تخصيص متجر سلة', status: 'قيد التنفيذ', tone: 'green' as const },
          { title: 'تحسين SEO', status: 'بانتظار عرض', tone: 'orange' as const },
          { title: 'صفحة هبوط', status: 'تسليم للمراجعة', tone: 'purple' as const },
        ].map((row, i) => (
          <div key={i} className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
            <span className="text-[12px] font-semibold text-slate-800 truncate">{row.title}</span>
            <StatusBadge label={row.status} tone={row.tone} />
          </div>
        ))}
      </div>
    </WindowFrame>
  );
}

/* محتوى لوحة التاجر — خلفية أعلى اليمين */
function MerchantPanel() {
  return (
    <WindowFrame title="لوحة التاجر">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-[13px] font-bold text-slate-900">طلباتي</h3>
        <span className="text-[11px] font-semibold px-2 py-1 rounded-lg text-white" style={{ background: '#6D5DFB' }}>+ طلب جديد</span>
      </div>
      <div className="space-y-1.5">
        {[
          { title: 'عروض مستلمة', tone: 'purple' as const, badge: 'عرضان' },
          { title: 'مشروع قيد التنفيذ', tone: 'green' as const, badge: 'نشط' },
          { title: 'تسليم بانتظار الاعتماد', tone: 'orange' as const, badge: 'مراجعة' },
        ].map((row, i) => (
          <div key={i} className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2" style={{ background: '#F8FAFC', border: '1px solid #E5E7EB' }}>
            <span className="text-[12px] font-semibold text-slate-800 truncate">{row.title}</span>
            <StatusBadge label={row.badge} tone={row.tone} />
          </div>
        ))}
      </div>
    </WindowFrame>
  );
}

/* محتوى لوحة الخبير — خلفية أسفل اليسار */
function ProviderPanel() {
  return (
    <WindowFrame title="لوحة الخبير">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-[13px] font-bold text-slate-900">فرصي ومشاريعي</h3>
      </div>
      <div className="space-y-1.5">
        {[
          { title: 'فرصة مدعو لها', tone: 'purple' as const, badge: 'دعوة' },
          { title: 'عرض مرسل', tone: 'green' as const, badge: 'مُرسل' },
          { title: 'تسليم مرفوع', tone: 'orange' as const, badge: 'بانتظار' },
        ].map((row, i) => (
          <div key={i} className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2" style={{ background: '#F8FAFC', border: '1px solid #E5E7EB' }}>
            <span className="text-[12px] font-semibold text-slate-800 truncate">{row.title}</span>
            <StatusBadge label={row.badge} tone={row.tone} />
          </div>
        ))}
      </div>
    </WindowFrame>
  );
}

/* الديسكتوب: ثلاث نوافذ متراكبة — الإدارة في الأمام، التاجر أعلى اليمين، الخبير أسفل اليسار */
function LayeredDashboardStory() {
  return (
    <div className="relative hidden lg:block" style={{ width: 600, height: 460 }}>
      {/* الخبير — خلف، أسفل اليسار */}
      <div className="absolute" style={{ left: 0, bottom: 0, width: 300, zIndex: 10, transform: 'rotate(-3deg) scale(0.9)', transformOrigin: '0% 100%' }}>
        <ProviderPanel />
      </div>
      {/* التاجر — خلف، أعلى اليمين */}
      <div className="absolute" style={{ right: 0, top: 0, width: 300, zIndex: 20, transform: 'rotate(3deg) scale(0.9)', transformOrigin: '100% 0%' }}>
        <MerchantPanel />
      </div>
      {/* الإدارة — في الأمام، الوسط */}
      <div className="absolute" style={{ left: '50%', top: '50%', width: 372, zIndex: 30, transform: 'translate(-50%, -50%)' }}>
        <AdminPanel />
      </div>
    </div>
  );
}

/* الجوال: نافذة واحدة مختصرة مع تبويبات (افتراضي: الإدارة) — لا تراكب */
function MobileDashboardStory() {
  const [tab, setTab] = useState<'merchant' | 'admin' | 'provider'>('admin');
  return (
    <div className="lg:hidden w-full max-w-sm mx-auto">
      <div className="flex gap-1.5 p-1 rounded-xl mb-3" style={{ background: '#F1F5F9' }}>
        {[
          { key: 'merchant' as const, label: 'التاجر' },
          { key: 'admin' as const, label: 'الإدارة' },
          { key: 'provider' as const, label: 'الخبير' },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className="flex-1 py-2 text-[13px] font-semibold rounded-lg transition-colors"
            style={tab === t.key ? { background: '#6D5DFB', color: '#FFFFFF' } : { color: '#475569' }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'merchant' && <MerchantPanel />}
      {tab === 'admin' && <AdminPanel />}
      {tab === 'provider' && <ProviderPanel />}
    </div>
  );
}

/* ─── Hero Section ─── */

function HeroSection() {
  return (
    <section className="relative py-20 md:py-28 lg:py-32 overflow-hidden" style={{ background: '#FFFFFF' }}>
      {/* Soft Purple Halo - positioned behind mockup */}
      <div className="absolute top-1/2 right-1/4 w-[700px] h-[600px] rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: '#6D5DFB', transform: 'translateY(-50%)' }} />

      <div className="container-xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12 lg:gap-16 items-center">
          {/* Text Column - Right */}
          <div className="space-y-8 order-2 lg:order-1">
            {/* Headline */}
            <div className="space-y-5">
              <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold leading-[1.2]" style={{ color: '#111827' }}>
                من طلب الخدمة إلى التسليم… بروز يدير التنفيذ كاملًا
              </h1>
              <p className="text-lg md:text-xl leading-relaxed" style={{ color: '#475569' }}>
                منصة واحدة تجمع طلبات التطوير، مراجعة المتطلبات، عروض الخبراء، متابعة التنفيذ، الرسائل، والتسليم النهائي في مسار واضح ومنظم.
              </p>
            </div>

            {/* Bullet Points */}
            <div className="space-y-3.5">
              {[
                'ارفع طلبك مرة واحدة',
                'قارن عروض الخبراء المعتمدين',
                'تابع التنفيذ والتسليم من لوحة واحدة',
              ].map((line, i) => (
                <div key={i} className="flex items-start gap-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#6D5DFB" strokeWidth="3" strokeLinecap="round" className="w-6 h-6 flex-shrink-0 mt-0.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span className="text-base font-semibold" style={{ color: '#111827' }}>{line}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/register"
                className="text-center px-8 py-4 font-semibold rounded-2xl text-white transition-all hover:shadow-lg"
                style={{ background: '#6D5DFB' }}
              >
                ابدأ طلبك الآن
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-2xl transition-all hover:shadow-sm"
                style={{ border: '2px solid #E5E7EB', color: '#111827', background: '#FFFFFF' }}
              >
                شاهد كيف تعمل بروز
                <ArrowDownIcon />
              </a>
            </div>
          </div>

          {/* Mockup Column - Left: Layered Product Story */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <LayeredDashboardStory />
            <MobileDashboardStory />
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
