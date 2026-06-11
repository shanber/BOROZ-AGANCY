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

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <polyline points="20 6 9 17 4 12"/>
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

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
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
    { label: 'لماذا بروز', href: '#why' },
    { label: 'تواصل معنا', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
      style={{ background: 'rgba(11,19,43,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="container-xl">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link href="/" className="flex flex-col items-start justify-center shrink-0">
            <Image src="/شعار%20بروز.svg" alt="بروز" width={100} height={36} className="h-9 w-auto object-contain invert hue-rotate-180" />
            <span className="text-[10px] text-white mt-0.5 font-medium">منصة خدمات التجارة الإلكترونية</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((item) => (
              <a key={item.label} href={item.href}
                className="text-sm font-medium transition-opacity text-white hover:text-cyan-300"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="btn-ghost" style={{ padding: '0.5rem 1.25rem' }}>
              تسجيل دخول
            </Link>
            <Link href="/register" className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
              تسجيل
            </Link>
          </div>

          <button className="md:hidden p-2 text-white hover:text-cyan-300 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)} aria-label="القائمة"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t" style={{ background: 'rgba(11,19,43,0.98)', backdropFilter: 'blur(20px)' }}>
          <div className="container-xl py-4 space-y-1">
            {links.map((item) => (
              <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium rounded-xl text-white hover:text-cyan-300 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 border-t flex gap-2.5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <Link href="/login" className="btn-ghost flex-1 text-center" onClick={() => setMenuOpen(false)}>
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

/* ─── Hero ─── */

const PIPELINE_STEPS = [
  { label: 'طلب جديد', sub: 'تم رفع الاحتياج', done: true },
  { label: 'قيد المراجعة', sub: 'تنظيم وتوضيح النطاق', done: true },
  { label: 'عروض الخبراء', sub: 'عروض واضحة للمقارنة', done: true },
  { label: 'اختيار العرض', sub: 'تم اختيار الأنسب', done: false },
  { label: 'قيد التنفيذ', sub: 'متابعة منظمة للعمل', done: false },
  { label: 'تم التسليم', sub: 'اعتماد نهائي داخل المنصة', done: false },
];

function PipelineStep({ label, sub, done, isLast }: { label: string; sub: string; done: boolean; isLast: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex flex-col items-center gap-1.5">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-500 ${
          done
            ? 'shadow-[0_0_16px_rgba(6,182,212,0.25)]'
            : 'opacity-40'
        }`}
          style={{ background: done ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.03)', color: done ? '#06B6D4' : 'rgba(255,255,255,0.3)' }}
        >
          {done ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          )}
        </div>
        {!isLast && (
          <div className="w-px h-6" style={{ background: done ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.06)' }} />
        )}
      </div>
      <div className="space-y-0.5">
        <div className={`text-sm font-bold transition-all ${done ? 'text-white' : 'text-white/30'}`}>{label}</div>
        <div className={`text-[10px] font-medium transition-all ${done ? 'text-slate-200' : 'text-slate-400'}`}>{sub}</div>
      </div>
    </div>
  );
}

function WorkflowPipeline() {
  return (
    <div className="glass-card rounded-[2rem] p-5 md:p-7 lg:p-8 relative overflow-hidden shadow-[0_24px_80px_rgba(2,6,23,0.45)]"
      style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.96) 0%, rgba(11,19,43,0.94) 100%)', borderColor: 'rgba(255,255,255,0.08)' }}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#06B6D4]" />
              <span className="text-xs font-bold text-white">BOROZ Workflow</span>
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold text-white">رحلة الطلب داخل المنصة</div>
              <div className="text-xs md:text-sm text-slate-200">من طلب واحد إلى تسليم واضح بدون فوضى محادثات ومتابعة مشتتة.</div>
            </div>
          </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-200">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>بيانات حية ومباشرة — جميع الأرقام داخل المنصة محدثة تلقائياً</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.25fr)_minmax(240px,0.8fr)] gap-5 lg:gap-6">
        <div className="rounded-[1.5rem] p-4 md:p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-white">المسار الكامل</span>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(6,182,212,0.1)', color: '#67e8f9' }}>Request to Delivery</span>
          </div>
          <div className="flex flex-col gap-0">
            {PIPELINE_STEPS.map((step, i) => (
              <PipelineStep key={i} {...step} isLast={i === PIPELINE_STEPS.length - 1} />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-[1.5rem] p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-xs font-bold text-white mb-3">الفرق بين بروز والمنصات الأخرى</div>
            <div className="space-y-2.5 text-xs leading-relaxed text-slate-200">
              <p>بروز ليست سوقاً مفتوحاً، ولا دليل مستقلين عاماً. نحن منصة تنفيذ مدارة:</p>
              <ul className="space-y-1.5 pr-4">
                <li>• بروز تدعو الخبراء المناسبين — لا يمكن لأي خبير التقدّم على طلبك بدون دعوة</li>
                <li>• جميع العروض قابلة للمقارنة: سعر، مدة، نطاق عمل، والتسليمات</li>
                <li>• بروز تشرف على التنفيذ من البداية حتى التسليم النهائي</li>
                <li>• التوثيق والتواصل داخل المنصة — لا واتساب ولا إيميلات مشتتة</li>
              </ul>
            </div>
          </div>

          <div className="rounded-[1.5rem] p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-xs font-bold text-white mb-3">ماذا يحدث بعد تقديم الطلب؟</div>
            <div className="space-y-2 text-xs">
              <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="font-bold text-white">1. مراجعة بروز</div>
                <div className="text-slate-200 mt-0.5">فريق بروز يراجع الطلب ويتأكد من اكتمال المعلومات.</div>
              </div>
              <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="font-bold text-white">2. دعوة الخبراء</div>
                <div className="text-slate-200 mt-0.5">بروز تدعو نخبة الخبراء المناسبين لتخصص طلبك.</div>
              </div>
              <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="font-bold text-white">3. استقبال العروض</div>
                <div className="text-slate-200 mt-0.5">يقارن التاجر العروض ويختار الأنسب.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-[10px] text-slate-200">
          <span>بروز ترتب الطلب، تجمع العروض، وتتابع التنفيذ حتى التسليم من مكان واحد.</span>
        </div>
      </div>

      {/* Ambient glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)' }}
      />
    </div>
  );
}

function FloatingOfferCard() {
  return (
    <div className="glass-card rounded-xl p-3.5 w-48 shadow-lg"
      style={{ background: 'rgba(11,19,43,0.92)', borderColor: 'rgba(6,182,212,0.2)', backdropFilter: 'blur(16px)' }}
    >
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px] font-bold text-white">عرض خبير</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(6,182,212,0.1)', color: '#06B6D4' }}>
          جديد
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-white">خبير تخصيص متاجر</span>
          <span className="text-[11px] font-bold text-white">1,500 ر.س</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-200">
          <span>مدة التنفيذ</span>
          <span>7 أيام</span>
        </div>
      </div>
      <button className="w-full mt-2.5 text-[10px] font-bold py-1.5 rounded-lg transition-all"
        style={{ background: 'rgba(6,182,212,0.12)', color: '#06B6D4' }}
      >
        قبول العرض
      </button>
    </div>
  );
}

function FloatingProgressCard() {
  return (
    <div className="glass-card rounded-xl p-3.5 w-48 shadow-lg"
      style={{ background: 'rgba(11,19,43,0.92)', borderColor: 'rgba(34,197,94,0.15)', backdropFilter: 'blur(16px)' }}
    >
      <span className="text-[10px] font-bold text-white block mb-2">نسبة الإنجاز</span>
      <div className="flex items-end justify-between mb-2">
        <span className="text-lg font-bold text-white">--%</span>
      </div>
      <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full w-0" style={{ background: 'linear-gradient(90deg, #06B6D4, #22C55E)' }} />
      </div>
      <div className="flex items-center justify-between mt-1.5 text-[9px] text-slate-200">
        <span>جاري التحديث</span>
        <span>نموذج توضيحي</span>
      </div>
    </div>
  );
}

function FloatingStatusCard() {
  return (
    <div className="glass-card rounded-xl p-3.5 w-40 shadow-lg"
      style={{ background: 'rgba(11,19,43,0.92)', borderColor: 'rgba(167,139,250,0.15)', backdropFilter: 'blur(16px)' }}
    >
      <span className="text-[10px] font-bold text-white block mb-2">حالة الطلب</span>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse" />
        <span className="text-xs font-bold text-white">قيد المراجعة</span>
      </div>
      <div className="text-[10px] text-slate-200">طلب #1024</div>
      <div className="text-[10px] text-slate-200">تم التقديم: اليوم</div>
    </div>
  );
}

function FloatingReviewCard() {
  return (
    <div className="glass-card rounded-xl p-3.5 w-44 shadow-lg"
      style={{ background: 'rgba(11,19,43,0.92)', borderColor: 'rgba(245,158,11,0.15)', backdropFilter: 'blur(16px)' }}
    >
      <span className="text-[10px] font-bold text-white block mb-2">مراجعة واعتماد</span>
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span className="text-[10px] text-slate-200">اكتملت المتطلبات</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span className="text-[10px] text-slate-200">تم توضيح النطاق</span>
        </div>
      </div>
      <button className="w-full mt-2.5 text-[10px] font-bold py-1.5 rounded-lg transition-all text-white"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
      >
        إتاحة للخبراء
      </button>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-28 md:pt-32 pb-20 md:pb-24 overflow-visible"
      style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(6,182,212,0.12) 0%, transparent 65%), #0B132B' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle, #06B6D4 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }}
        />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #22C55E 0%, transparent 70%)' }}
        />
      </div>

      <div className="container-xl relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] gap-10 lg:gap-14 xl:gap-16 items-center">
          {/* Text Column */}
          <div className="space-y-7 animate-fade-up max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge-cyan">منصة تنفيذ مُدارة</span>
              <span className="text-[11px] font-medium px-3 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#FFFFFF' }}
              >
                ليست وكالة ولا دليلاً ولا ماركت بليس خدمات
              </span>
            </div>

            <h1>
              <span className="display-xl text-white block leading-[1.15]">
                طوّر متجرك بدون فوضى البحث والمتابعة
              </span>
              <span className="text-2xl md:text-3xl font-bold block mt-2 text-white leading-[1.3]">
                بروز ترتّب لك التنفيذ من <span style={{ color: '#67e8f9' }}>الطلب</span> إلى <span style={{ color: '#67e8f9' }}>التسليم</span>
              </span>
            </h1>

            <p className="text-base md:text-lg leading-8 max-w-xl text-slate-100">
              ارفع طلبك في بروز، ونرتّب لك رحلة التنفيذ من مراجعة الاحتياج، إلى استقبال عروض الخبراء،
              ثم متابعة العمل والتسليم من مكان واحد.
            </p>

            <div className="space-y-3 text-sm leading-relaxed text-slate-100">
              {[
                'طلب واحد بدل محادثات متفرقة',
                'عروض واضحة من خبراء مناسبين',
                'متابعة منظمة حتى التسليم',
              ].map((line, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#06B6D4]" />
                  <span>{line}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link href="/register" className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto">
                ابدأ طلبك الآن
              </Link>
              <a href="#how-it-works"
                className="inline-flex items-center gap-2 text-sm font-medium px-7 py-3.5 rounded-2xl w-full sm:w-auto justify-center transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}
              >
                شاهد كيف تعمل بروز
                <ArrowDownIcon />
              </a>
            </div>
          </div>

          {/* Visual Column */}
          <div className="relative animate-fade-up-1 xl:pl-8">
            <div className="relative">
              <WorkflowPipeline />

              {/* Floating cards — positioned relative to the pipeline */}
              <div className="absolute -top-5 left-3 md:-left-2 xl:-left-8 z-20 hidden sm:block">
                <FloatingStatusCard />
              </div>
              <div className="absolute bottom-6 -left-2 xl:-left-8 z-20 hidden sm:block">
                <FloatingOfferCard />
              </div>
              <div className="absolute top-10 right-3 md:-right-2 xl:-right-8 z-20 hidden sm:block">
                <FloatingReviewCard />
              </div>
              <div className="absolute bottom-24 right-2 md:-right-2 xl:-right-8 z-20 hidden sm:block">
                <FloatingProgressCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── How BOROZ Works ─── */

const DIFFERENCE_ROWS = [
  ['البحث عن منفذين', 'طلب واحد'],
  ['محادثات واتساب متفرقة', 'منصة موحدة'],
  ['متابعة يدوية', 'تتبع واضح'],
  ['ملفات مشتتة', 'مكان واحد'],
  ['عروض غير منظمة', 'عروض قابلة للمقارنة'],
  ['عدم وضوح النطاق', 'مراجعة وتنظيم قبل التنفيذ'],
];

function DifferenceSection() {
  return (
    <section id="difference" className="py-24 md:py-28 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0B132B 0%, #0f1e3a 100%)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 65% 45% at 50% 40%, rgba(6,182,212,0.05) 0%, transparent 70%)' }}
      />

      <div className="container-xl relative z-10">
        <div className="text-center space-y-4 mb-12 md:mb-14">
          <span className="badge-cyan">لماذا بروز مختلفة؟</span>
          <h2 className="display-lg text-white">الفرق ليس في العثور على منفذ فقط</h2>
          <p className="body-lg mx-auto text-slate-100" style={{ maxWidth: '640px' }}>
            بروز ليست مجرد مكان لعرض الخدمات، بل منصة تدير رحلة التنفيذ كاملة من أول طلب حتى اعتماد التسليم.
          </p>
        </div>

        <div className="glass-card rounded-[2rem] overflow-hidden max-w-5xl mx-auto" style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="grid grid-cols-2 text-sm md:text-base font-bold" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="px-5 md:px-7 py-4 text-white">الطريقة التقليدية</div>
            <div className="px-5 md:px-7 py-4 text-white">بروز</div>
          </div>

          {DIFFERENCE_ROWS.map(([traditional, boroz], index) => (
            <div
              key={traditional}
              className="grid grid-cols-2"
              style={{ borderTop: index === 0 ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="px-5 md:px-7 py-4 md:py-5 text-sm md:text-base text-white">{traditional}</div>
              <div className="px-5 md:px-7 py-4 md:py-5 text-sm md:text-base font-bold text-white">{boroz}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    num: '1',
    title: 'أرسل طلبك',
    desc: 'تصف متطلبات مشروعك بالتفصيل عبر المنصة، وتحدد الخدمة التي تحتاجها.',
    icon: ClipboardIcon,
  },
  {
    num: '2',
    title: 'مراجعة الطلب',
    desc: 'فريق المنصة يراجع الطلب ويتأكد من وضوح المتطلبات قبل إتاحته لمقدمي الخدمات.',
    icon: SearchIcon,
  },
  {
    num: '3',
    title: 'استقبال العروض',
    desc: 'يتقدم الخبراء المعتمدون بعروضهم، وتتصفح الخيارات وتختار الأنسب.',
    icon: OfferIcon,
  },
  {
    num: '4',
    title: 'تنفيذ وتسليم',
    desc: 'تتابع مراحل التنفيذ عبر المنصة، وتستلم العمل النهائي بعد إتمامه.',
    icon: GraphIcon,
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0B132B 0%, #0f1e3a 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(6,182,212,0.04) 0%, transparent 70%)' }}
      />

      <div className="container-xl relative z-10">
        <div className="text-center space-y-4 mb-16">
          <span className="badge-cyan">كيف تعمل بروز</span>
          <h2 className="display-lg text-white">مسار واضح من الطلب إلى التسليم</h2>
          <p className="body-lg mx-auto text-slate-100" style={{ maxWidth: '500px' }}>
            كل خطوة تمر عبر نظام بروز: مراجعة، عروض، اختيار، تنفيذ، ثم اعتماد التسليم.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative text-center animate-fade-up group"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="glass-card p-6 md:p-8 rounded-2xl h-full space-y-5 transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(6,182,212,0.12)', color: '#06B6D4' }}
                  >
                    <Icon />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg font-bold text-white">{step.num}</span>
                      <h3 className="text-lg font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-100">{step.desc}</p>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -left-3 top-1/2 -translate-y-1/2 z-10 text-white/10">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-6 h-6 rtl:rotate-180">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Services ─── */

const AVAILABLE_SERVICES = [
  {
    icon: StoreIcon,
    title: 'تخصيص متاجر سلة',
    desc: 'تطوير واجهات مخصصة، تحسين تجربة المستخدم، وإضافة ميزات فريدة لمتجرك على سلة.',
    color: '#06B6D4',
  },
  {
    icon: SEOIcon,
    title: 'تحسين محركات البحث SEO',
    desc: 'رفع ترتيب متجرك في نتائج البحث وجذب زوار مؤهلين قادرين على الشراء.',
    color: '#22C55E',
  },
  {
    icon: PageIcon,
    title: 'صفحات الهبوط',
    desc: 'تصميم صفحات احترافية للحملات التسويقية والعروض الخاصة تزيد من معدل التحويل.',
    color: '#A78BFA',
  },
];

function ServicesSection() {
  return (
    <section id="services" className="py-24 md:py-32" style={{ background: '#0B132B' }}>
      <div className="container-xl">
        <div className="text-center space-y-4 mb-16">
          <span className="badge-cyan">الخدمات المتاحة حالياً</span>
          <h2 className="display-lg text-white">خدمات تعمل داخل مسار بروز التنفيذي</h2>
          <p className="body-lg mx-auto text-slate-100" style={{ maxWidth: '560px' }}>
            هذه هي الخدمات المتاحة الآن داخل المنصة، وكل خدمة تمر عبر نفس مسار المراجعة والعروض والتنفيذ والتسليم.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {AVAILABLE_SERVICES.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <div key={i} className="glass-card p-6 md:p-8 rounded-2xl flex flex-col gap-5 text-center group transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.015)', borderColor: 'rgba(255,255,255,0.05)' }}
              >
                <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center transition-colors"
                  style={{ background: `${svc.color}15`, color: svc.color }}
                >
                  <Icon />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white">{svc.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-100">{svc.desc}</p>
                </div>
                <div className="mt-auto">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1' }}
                  >
                    <span className="w-3.5 h-3.5"><CheckIcon /></span>
                    متاح داخل المنصة
                  </span>
                </div>
              </div>
            );
          })}

          <div className="glass-card p-6 md:p-8 rounded-2xl flex flex-col gap-5 text-center items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ color: '#06B6D4', background: 'rgba(6,182,212,0.1)' }}>
              <ClockIcon />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">خدمات التصميم والتطوير</h3>
              <p className="text-sm leading-relaxed text-slate-100">
                خدمات تصميم الهوية البصرية وإدارة الحملات وكتابة المحتوى متاحة عبر طلب خدمة مخصصة في بروز.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Why BOROZ ─── */

const BENEFITS = [
  {
    icon: ClipboardIcon,
    title: 'طلب واضح قبل التقديم',
    desc: 'تُراجع المنصة متطلبات الطلب وتوضحها قبل إتاحتها لمقدمي الخدمات لضمان دقة العروض.',
    color: '#06B6D4',
  },
  {
    icon: SearchIcon,
    title: 'خبراء بعد المراجعة',
    desc: 'كل مقدم خدمة يمر بمراجعة قبل اعتماده، ولا تُتاح خدمة جديدة إلا بتوفر خبراء معتمدين.',
    color: '#22C55E',
  },
  {
    icon: OfferIcon,
    title: 'عروض من الخبراء',
    desc: 'تستقبل عروضاً من عدة خبراء معتمدين، وتقيّم الخيارات بناءً على السعر والمدة والتقييم.',
    color: '#A78BFA',
  },
  {
    icon: ShieldIcon,
    title: 'نطاق عمل موثق',
    desc: 'يحدد العرض المختار السعر، المدة، المخرجات، وعدد المراجعات في نطاق عمل موثق.',
    color: '#F59E0B',
  },
  {
    icon: GraphIcon,
    title: 'متابعة منظمة',
    desc: 'جميع مراحل التنفيذ، التواصل، ورفع الملفات تتم داخل المنصة كمرجع للطرفين.',
    color: '#EC4899',
  },
  {
    icon: ShieldIcon,
    title: 'تسليم آمن',
    desc: 'يُحفظ المبلغ حتى التسليم النهائي، وتُدار أي نقاط خلاف بناءً على نطاق العمل الموثق.',
    color: '#3B82F6',
  },
];

function WhySection() {
  return (
    <section id="why" className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0f1e3a 0%, #0B132B 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(6,182,212,0.04) 0%, transparent 70%)' }}
      />
      <div className="container-xl relative z-10">
        <div className="text-center space-y-4 mb-16">
          <span className="badge-cyan">لماذا بروز</span>
          <h2 className="display-lg text-white">منصة تدير التنفيذ بدل أن تتركه لك</h2>
          <p className="body-lg mx-auto text-slate-100" style={{ maxWidth: '560px' }}>
            قيمة بروز الحقيقية في نظام إدارة التنفيذ الكامل، وليس فقط في عرض أسماء خبراء أو قائمة خدمات.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {BENEFITS.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <div key={i} className="glass-card p-6 md:p-8 rounded-2xl space-y-4 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${benefit.color}15`, color: benefit.color }}
                >
                  <Icon />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">{benefit.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-100">{benefit.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */

function CTASection() {
  return (
    <section className="py-20 md:py-24 relative overflow-hidden" style={{ background: '#0B132B' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(6,182,212,0.07) 0%, transparent 70%)' }}
      />
      <div className="container-xl relative z-10">
        <div
          className="max-w-5xl mx-auto rounded-[2rem] px-6 py-10 md:px-10 md:py-12 lg:px-14 lg:py-14 text-center md:text-right flex flex-col md:flex-row md:items-center md:justify-between gap-8"
          style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(11,19,43,0.94) 55%, rgba(8,47,73,0.9) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 24px 80px rgba(2,6,23,0.35)',
          }}
        >
          <div className="space-y-4 max-w-2xl">
            <span className="badge-cyan">ابدأ الآن</span>
            <h2 className="display-lg text-white">جاهز لبدء مشروعك؟</h2>
            <p className="body-lg text-slate-100">
              ارفع طلبك مرة واحدة واترك بروز تدير رحلة التنفيذ حتى التسليم.
            </p>
          </div>

          <div className="flex justify-center md:justify-end">
            <Link href="/request" className="btn-primary text-base px-10 py-4 inline-flex">
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
    <footer id="contact" className="pt-16 pb-8"
      style={{ background: '#081224', borderTop: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="container-xl">
        <div className="flex flex-col items-center justify-center pb-12 gap-3 text-center">
          <Link href="/" className="flex justify-center">
            <Image src="/شعار%20بروز.svg" alt="بروز" width={220} height={84} className="h-16 md:h-20 w-auto object-contain invert hue-rotate-180" />
          </Link>
          <span className="text-sm md:text-base font-medium text-white">منصة خدمات التجارة الإلكترونية</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-10 xl:gap-10 pb-12 text-center md:text-right"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="space-y-4 flex flex-col items-center md:items-start max-w-md md:max-w-none mx-auto md:mx-0">
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-white">بروز</h4>
            </div>
            <p className="text-sm md:text-[15px] leading-7 text-slate-100">
              بروز منصة لإدارة وتنظيم تنفيذ المشاريع بين التجار والخبراء، من رفع الطلب ومراجعته إلى استلام العروض ومتابعة التنفيذ والتسليم.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">المنصة</h4>
            <ul className="space-y-2.5">
              <li><a href="#how-it-works" className="text-xs md:text-sm transition-colors hover:text-cyan-300 text-white">كيف تعمل بروز</a></li>
              <li><a href="#services" className="text-xs md:text-sm transition-colors hover:text-cyan-300 text-white">الخدمات المتاحة</a></li>
              <li><a href="#why" className="text-xs md:text-sm transition-colors hover:text-cyan-300 text-white">لماذا بروز</a></li>
              <li><Link href="/request" className="text-xs md:text-sm transition-colors hover:text-cyan-300 text-white">ارفع طلب خدمة</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">الحساب</h4>
            <ul className="space-y-2.5">
              <li><Link href="/login" className="text-xs md:text-sm transition-colors hover:text-cyan-300 text-white">تسجيل الدخول</Link></li>
              <li><Link href="/register/merchant" className="text-xs md:text-sm transition-colors hover:text-cyan-300 text-white">إنشاء حساب تاجر</Link></li>
              <li><Link href="/register/provider" className="text-xs md:text-sm transition-colors hover:text-cyan-300 text-white">إنشاء حساب خبير</Link></li>
              <li><Link href="/dashboard" className="text-xs md:text-sm transition-colors hover:text-cyan-300 text-white">لوحة التحكم</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">الدعم</h4>
            <ul className="space-y-2.5">
              <li><a href="mailto:support@boroz.sa" className="text-xs md:text-sm transition-colors hover:text-cyan-300 text-white">تواصل معنا</a></li>
              <li><a href="#" className="text-xs md:text-sm transition-colors hover:text-cyan-300 text-white">الأسئلة الشائعة</a></li>
              <li><a href="#" className="text-xs md:text-sm transition-colors hover:text-cyan-300 text-white">سياسة الخصوصية</a></li>
              <li><a href="#" className="text-xs md:text-sm transition-colors hover:text-cyan-300 text-white">الشروط والأحكام</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">التواصل</h4>
            <ul className="space-y-2.5">
              <li><a href="mailto:support@boroz.sa" className="text-xs md:text-sm transition-colors hover:text-cyan-300 text-white">support@boroz.sa</a></li>
              <li><span className="text-xs md:text-sm text-white">واتساب الأعمال</span></li>
              <li><span className="text-xs md:text-sm text-white">الأحد - الخميس</span></li>
              <li><span className="text-xs md:text-sm text-white">9:00 ص - 6:00 م</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col items-center justify-center gap-2 text-center">
          <div className="flex items-center gap-4 text-xs text-white">
            <Link href="/terms" className="hover:text-cyan-300 transition-colors">شروط الاستخدام</Link>
            <span className="opacity-30">|</span>
            <Link href="/privacy" className="hover:text-cyan-300 transition-colors">سياسة الخصوصية</Link>
          </div>
          <p className="text-xs text-white mt-2">© 2026 بروز. جميع الحقوق محفوظة.</p>
          <p className="text-xs text-white">منصة لتنظيم وإدارة تنفيذ المشاريع بين التجار والخبراء.</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ─── */

export default function HomePage() {
  return (
    <div style={{ fontFamily: 'var(--font-ar)', background: 'var(--bg-main)' }}>
      <Navbar />
      <main>
        <HeroSection />
        <DifferenceSection />
        <HowItWorksSection />
        <ServicesSection />
        <WhySection />
        <CTASection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
