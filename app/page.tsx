'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ServicesAccordion from './components/home/ServicesAccordion';
import ScrollToTop from './components/ui/ScrollToTop';

/* ─────────────────────────────────────────────
   SVG ICONS (inline, no external dep)
───────────────────────────────────────────── */
const IconStore = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);



const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconCode = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>
);



const IconZap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);



const IconLink = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const IconMouse = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
    <path d="M13 13l6 6"/>
  </svg>
);

const IconCompass = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);

const IconWrite = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);



const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */


const steps = [
  {
    num: '1',
    title: 'أرسل طلبك',
    desc: 'أخبرنا بما يحتاجه متجرك بالتفصيل.',
    icon: IconWrite,
  },
  {
    num: '2',
    title: 'مراجعة الطلب',
    desc: 'نراجع المتطلبات لضمان وضوحها للمستقلين.',
    icon: IconSearch,
  },
  {
    num: '3',
    title: 'استقبال العروض',
    desc: 'تتلقى عروضاً من مستقلين تمت مراجعتهم.',
    icon: IconCompass,
  },
  {
    num: '4',
    title: 'توثيق النطاق',
    desc: 'عقد يوضح السعر والمدة والمخرجات.',
    icon: IconLink,
  },
  {
    num: '5',
    title: 'تنفيذ وتسليم',
    desc: 'متابعة المشروع وتسليم نهائي موثق.',
    icon: IconCheck,
  },
];



/* Approved logos — PNG files in /public/logos/ */
const LOGOS = [
  { src: '/logos/salla.png',      alt: 'سلة',         w: 120 }, /* wide horizontal logo */
  { src: '/logos/tamara.png',     alt: 'تمارا',        w: 120 }, /* pill shape, roughly square */
  { src: '/logos/tabby.png',      alt: 'Tabby',        w: 100 },
  { src: '/logos/smsa.png',       alt: 'SMSA Express', w: 110 },
  { src: '/logos/Meta.png',       alt: 'Meta',         w: 130 },
  { src: '/logos/google-ads.png', alt: 'Google Ads',   w: 140 },
];



/* ─────────────────────────────────────────────
   ECOSYSTEM VISUAL
───────────────────────────────────────────── */
function DashboardMockupVisual() {
  return (
    <div className="relative w-full max-w-[480px] mx-auto select-none" style={{ userSelect: 'none' }}>
      <div className="glass-card relative w-full flex flex-col" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-glass)' }}>
        
        {/* Browser / Window Header */}
        <div 
          className="h-10 flex items-center px-4 gap-2 rounded-t-2xl"
          style={{ borderBottom: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.1)' }}
        >
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
          </div>
          <div className="mx-auto flex items-center gap-2 text-[10px] text-main/40 font-medium">
            <span className="w-3 h-3"><IconShield /></span>
            boroz.sa/dashboard
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-5 space-y-4" dir="rtl">
          
          {/* Card 1: New Request */}
          <div className="p-4 rounded-xl space-y-3 animate-fade-up" style={{ background: 'var(--bg-card)', border: '1px solid rgba(6,182,212,0.2)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#06B6D4]">طلب جديد</span>
              <span className="text-[10px] text-main/50">منذ ساعتين</span>
            </div>
            <h3 className="text-sm font-semibold text-main">تحسين SEO لمتجر إلكتروني</h3>
            
            {/* Embedded Offers */}
            <div className="pt-3 border-t border-glass space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-medium text-main/70">عروض الخبراء (3)</div>
                <div className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">نشط الآن</div>
              </div>
              <div className="space-y-1.5">
                {[
                  { title: 'SEO Specialist', color: '#06B6D4', status: 'خبير معتمد', ratingText: 'تقييم ممتاز' },
                  { title: 'Store Customization Specialist', color: '#A78BFA', status: 'خبير معتمد', ratingText: 'تقييم ممتاز' },
                  { title: 'Landing Page Specialist', color: '#F59E0B', status: 'خبير معتمد', ratingText: 'تقييم ممتاز' }
                ].map((offer, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg transition-colors hover:bg-card" style={{ background: 'var(--bg-card)', border: i === 0 ? '1px solid rgba(6,182,212,0.3)' : '1px solid transparent' }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px]" style={{ background: `${offer.color}15`, color: offer.color }}>
                        <IconUser />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-main/90" dir="ltr">{offer.title}</span>
                        <div className="flex items-center gap-1.5 text-[9px] text-main/70">
                          <span className="text-yellow-400">★ {offer.ratingText}</span>
                          <span>• {offer.status}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-[9px] px-2.5 py-1.5 rounded font-bold transition-all" style={{ background: i === 0 ? 'var(--cyan)' : 'rgba(255,255,255,0.08)', color: i === 0 ? 'var(--navy)' : 'white' }}>
                      {i === 0 ? 'قبول العرض' : 'استعراض'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline within Mockup */}
          <div className="flex flex-col gap-3 relative z-10 pr-6 mr-2 py-1 mt-4">
            {/* The vertical timeline line */}
            <div className="absolute top-0 bottom-0 right-[4px] w-[2px] bg-white/10"></div>
            
            {/* Card 2: Contract */}
            <div className="flex items-center gap-3 animate-fade-up relative" style={{ animationDelay: '150ms' }}>
              <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] absolute -right-[23px] ring-4 ring-[#0B132B]"></div>
              <div className="flex-1 p-3 rounded-lg flex items-center justify-between" style={{ background: 'var(--bg-card)', border: '1px solid rgba(34,197,94,0.3)' }}>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 text-[#22C55E]"><IconLink /></span>
                  <span className="text-xs text-main">العقد جاهز</span>
                </div>
                <span className="text-[10px] bg-[#22C55E]/10 text-[#22C55E] px-1.5 py-0.5 rounded">موقع</span>
              </div>
            </div>

            {/* Card 3: Execution */}
            <div className="flex items-center gap-3 animate-fade-up relative" style={{ animationDelay: '300ms' }}>
              <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] absolute -right-[23px] ring-4 ring-[#0B132B]"></div>
              <div className="flex-1 p-3 rounded-lg flex items-center justify-between" style={{ background: 'var(--bg-card)', border: '1px solid rgba(245,158,11,0.3)' }}>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 text-[#F59E0B]"><IconCode /></span>
                  <span className="text-xs text-main">المشروع قيد التنفيذ</span>
                </div>
                <span className="text-[10px] bg-[#F59E0B]/10 text-[#F59E0B] px-1.5 py-0.5 rounded" dir="ltr">65%</span>
              </div>
            </div>

            {/* Card 4: Delivery */}
            <div className="flex items-center gap-3 animate-fade-up relative" style={{ animationDelay: '450ms' }}>
              <div className="w-2.5 h-2.5 rounded-full bg-white/20 absolute -right-[23px] ring-4 ring-[#0B132B]"></div>
              <div className="flex-1 p-3 rounded-lg flex items-center gap-2 opacity-50" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)' }}>
                <span className="w-4 h-4 text-main/50"><IconShield /></span>
                <span className="text-xs text-main/70">تم التسليم</span>
              </div>
            </div>

          </div>
          
        </div>
      </div>
      
      {/* Decorative Blur behind mockup */}
      <div className="absolute -inset-4 z-[-1] rounded-3xl opacity-30 pointer-events-none" style={{ background: 'linear-gradient(135deg, #06B6D4, #22C55E)', filter: 'blur(40px)' }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAV COMPONENT
───────────────────────────────────────────── */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
      style={{
        background: 'var(--bg-main)',
        borderBottom: '1px solid var(--border-glass)',
      }}
    >
      <div className="container-xl">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start justify-center flex-shrink-0">
            <Image
              src="/شعار%20بروز.svg"
              alt="بروز"
              width={120}
              height={40}
              className="h-10 w-auto object-contain invert hue-rotate-180"
            />
            <span className="text-[10px] text-white mt-0.5 font-medium tracking-wide opacity-90">منصة خدمات متاجر سلة</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {[
              { label: 'الخدمات', href: '#services' },
              { label: 'كيف يعمل', href: '#how-it-works' },
              { label: 'آلية العمل', href: '#trust' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium transition-opacity duration-200 text-white opacity-60 hover:opacity-100"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="btn-ghost" style={{ padding: '0.55rem 1.25rem', color: 'var(--text-main)' }}>
              تسجيل دخول
            </Link>
            <Link href="/register" className="btn-primary" style={{ padding: '0.55rem 1.25rem' }}>
              تسجيل
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-main/70 hover:text-main transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="القائمة"
          >
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t"
          style={{
            background: 'rgba(11,19,43,0.98)',
            borderColor: 'var(--border-glass)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="container-xl py-4 space-y-1">
            {[
              { label: 'الخدمات', href: '#services' },
              { label: 'كيف يعمل', href: '#how-it-works' },
              { label: 'آلية العمل', href: '#trust' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium rounded-xl transition-colors"
                style={{ color: 'var(--text-dim)' }}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 border-t flex gap-2.5" style={{ borderColor: 'var(--border-glass)' }}>
              <Link href="/login" className="btn-ghost text-center" onClick={() => setMenuOpen(false)} style={{ color: 'var(--text-main)' }}>
                تسجيل الدخول
              </Link>
              <Link href="/register" className="btn-primary flex-1 text-center" style={{ padding: '0.65rem 1rem' }}>
                تسجيل
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────── */
function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center pt-28 md:pt-32 pb-24 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 90% 60% at 50% -5%, rgba(6,182,212,0.13) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 85% 90%, rgba(34,197,94,0.07) 0%, transparent 60%), #0B132B',
      }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Ambient blobs */}
      <div
        className="absolute top-20 right-20 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-10 left-20 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)' }}
      />

      <div className="container-xl relative z-10 w-full px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center">

          {/* Right: Text Content */}
          <div className="space-y-7 text-right animate-fade-up">
            {/* Label */}
            <div className="inline-flex">
              <span className="badge-cyan">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: '#06B6D4' }}
                />
                المنصة التخصصية الأولى لتجار سلة
              </span>
            </div>

            {/* Headline */}
            <h1 className="display-xl text-main" style={{ lineHeight: '1.4' }}>
              منصة تربط تجار سلة بالخبراء المعتمدين لتنفيذ مشاريع المتاجر
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl font-medium leading-relaxed" style={{ color: '#cbd5e1', maxWidth: '560px' }}>
              بروز تساعد تجار سلة على تنفيذ خدمات المتجر مع مستقلين تتم مراجعتهم، نطاق عمل واضح، متابعة منظمة، وتسليم موثق من مكان واحد.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full">
              <Link href="/request" className="btn-primary w-full sm:w-auto text-sm px-8 py-3">
                ابدأ طلبك
              </Link>
              <Link href="/register/provider" className="btn-ghost w-full sm:w-auto text-sm px-8 py-3" style={{ border: '1px solid var(--border-glass)' }}>
                انضم كمستقل
              </Link>
              <Link href="/login" className="w-full sm:w-auto text-center text-sm font-medium transition-colors hover:text-white mt-1 sm:mt-0" style={{ color: '#cbd5e1', padding: '0.5rem 1rem' }}>
                تسجيل دخول
              </Link>
            </div>
            <div className="pt-2">
              <a href="#how-it-works" className="inline-flex items-center gap-1.5 text-sm text-[#06B6D4] hover:text-[#0891B2] transition-colors">
                كيف تعمل بروز؟ <span className="w-4 h-4"><IconArrowLeft /></span>
              </a>
            </div>
          </div>

          {/* Left: Ecosystem Visual */}
          <div className="animate-fade-up-1 flex justify-center">
            <DashboardMockupVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   LOGOS MARQUEE — infinite loop, local SVGs
   Triple the list: moving −33.333% = 1 copy
───────────────────────────────────────────── */
function TickerStrip() {
  const items = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <section className="pt-24 pb-12" style={{ background: '#0B132B' }}>
      <div className="container-xl max-w-4xl mx-auto text-center mb-12 px-4 space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          نفهم الأدوات التي يعتمد عليها تجار سلة
        </h2>
        <p className="text-sm md:text-base leading-relaxed mx-auto max-w-2xl" style={{ color: '#94a3b8' }}>
          من إدارة المتجر والمدفوعات والشحن إلى الإعلانات والتحليلات، بروز يساعدك على تنفيذ الخدمات المرتبطة بنمو متجرك من مكان واحد.
        </p>
      </div>

      <div
        className="py-8 overflow-hidden flex flex-col items-center"
        style={{
          borderTop: '1px solid var(--border-glass)',
          borderBottom: '1px solid var(--border-glass)',
          background: 'rgba(255, 255, 255, 0.01)',
        }}
      >
        {/* Faded edges mask */}
        <div
        style={{
          overflow:           'hidden',
          maskImage:          'linear-gradient(90deg,transparent 0%,black 10%,black 90%,transparent 100%)',
          WebkitMaskImage:    'linear-gradient(90deg,transparent 0%,black 10%,black 90%,transparent 100%)',
        }}
      >
        {/* Track */}
        <div
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '4rem',
            width:      'max-content',
            animation:  'marquee-scroll 45s linear infinite',
            willChange: 'transform',
          }}
        >
          {items.map((logo, i) => (
            <div
              key={i}
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                flexShrink:     0,
                height:         '42px',
              }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={Math.round(logo.w * 1.25)}
                height={40}
                style={{
                  height:         '40px',
                  width:          `${Math.round(logo.w * 1.25)}px`,
                  objectFit:      'contain',
                  objectPosition: 'center',
                  display:        'block',
                  flexShrink:     0,
                  /* ✦ كل الشعارات بيضاء موحدة */
                  filter:         'brightness(0) invert(1)',
                  opacity:        0.7,
                  transition:     'opacity 0.2s ease',
                }}
                loading="lazy"
                draggable={false}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
    </section>
  );
}


/* ─────────────────────────────────────────────
   SERVICES SECTION (IMPORTED FROM COMPONENTS)
───────────────────────────────────────────── */

/* ─────────────────────────────────────────────
   HOW IT WORKS
───────────────────────────────────────────── */
function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-24 md:py-32 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0B132B 0%, #111827 100%)',
      }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(6,182,212,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="container-xl relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 mb-20">
          <span className="badge-cyan">كيف يعمل بروز</span>
          <h2 className="display-lg text-white">
            من الطلب حتى التسليم{' '}
            <span style={{ color: '#22C55E' }}>بشفافية تامة</span>
          </h2>
          <p className="body-lg mx-auto" style={{ color: '#94a3b8', maxWidth: '480px' }}>
            المنصة تدير كل مرحلة من مراحل مشروعك، مع حماية حقوق الطرفين في كل خطوة.
          </p>
        </div>

        {/* Timeline Flow */}
        <div className="relative max-w-6xl mx-auto mt-16">
          {/* Main Horizontal Connector Line (Desktop only) */}
          <div 
            className="hidden lg:block absolute top-[40px] right-0 left-0 h-1.5 z-0" 
            style={{ background: 'var(--bg-card)', borderRadius: '4px' }}
          >
            <div 
              className="absolute top-0 right-0 h-full w-full"
              style={{ background: 'linear-gradient(90deg, transparent 0%, #06B6D4 50%, #22C55E 100%)', opacity: 0.8 }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative z-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative text-right lg:text-center animate-fade-up" style={{ animationDelay: `${i * 150}ms` }}>
                  {/* Timeline Node */}
                  <div className="hidden lg:flex items-center justify-center mb-8">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center relative"
                      style={{ 
                        background: 'var(--bg-main)', 
                        border: '4px solid #06B6D4',
                        boxShadow: '0 0 20px rgba(6,182,212,0.15)'
                      }}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-main" style={{ background: 'rgba(6,182,212,0.1)' }}>
                        <Icon />
                      </div>
                      <span 
                        className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm"
                        style={{ background: '#06B6D4', color: '#0B132B' }}
                      >
                        {step.num}
                      </span>
                    </div>
                  </div>

                  {/* Content (Mobile layout is side-by-side, desktop is stacked) */}
                  <div className="glass-card p-5 md:p-6 rounded-2xl h-full lg:h-auto space-y-4" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-4 lg:hidden">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0" style={{ background: '#06B6D4', color: '#0B132B' }}>
                        {step.num}
                      </div>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#06B6D4]" style={{ background: 'rgba(6,182,212,0.1)' }}>
                        <Icon />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg mb-2">{step.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   EXPERTS SECTION
───────────────────────────────────────────── */
function ExpertsSection() {
  const experts = [
    { title: 'مستقل تخصيص متاجر', desc: 'بناء واجهات متاجر سلة باحترافية وتخصيص الثيمات', icon: IconStore, color: '#06B6D4' },
    { title: 'مستقل SEO بعد المراجعة', desc: 'تهيئة المتجر لمحركات البحث وتصدر نتائج جوجل', icon: IconSearch, color: '#22C55E' },
    { title: 'مستقل صفحات هبوط', desc: 'تصميم وبناء صفحات عالية التحويل للحملات', icon: IconMouse, color: '#A78BFA' },
    { title: 'مستقل إعلانات', desc: 'إدارة الحملات الإعلانية على سناب شات، تيك توك، وميتا', icon: IconZap, color: '#F59E0B' },
    { title: 'كاتب محتوى متخصص', desc: 'صياغة نصوص تسويقية للمنتجات والمقالات', icon: IconWrite, color: '#EC4899' },
    { title: 'مطور واجهات (API)', desc: 'ربط الأنظمة الخارجية وتطوير تطبيقات خاصة بسلة', icon: IconCode, color: '#3B82F6' },
  ];

  return (
    <section className="py-24" style={{ background: 'var(--bg-main)' }}>
      <div className="container-xl">
        <div className="text-center space-y-4 mb-16">
          <span className="badge-cyan">مستقلون مراجعون</span>
          <h2 className="display-lg text-white">
            مستقلون يتم قبولهم بعد المراجعة
          </h2>
          <p className="body-lg mx-auto" style={{ color: '#cbd5e1', maxWidth: '520px' }}>
            اعثر على المستقل المناسب لمشروعك، بملفات موثقة ومراجعة من فريق المنصة لضمان الجودة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((exp, i) => {
            const Icon = exp.icon;
            return (
              <div 
                key={i} 
                className="glass-card p-6 rounded-2xl flex flex-col gap-5 text-right relative overflow-hidden group hover:-translate-y-1 transition-all duration-300"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-glass)' }}
              >
                {/* Decoration glow */}
                <div 
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle, ${exp.color} 0%, transparent 70%)` }}
                />
                
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 relative z-10"
                    style={{ background: `${exp.color}15`, color: exp.color, border: `1px solid ${exp.color}30` }}
                  >
                    <Icon />
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded" style={{ color: '#22C55E', background: 'rgba(34,197,94,0.1)' }}>
                    <span className="w-3 h-3"><IconCheck /></span> تم المراجعة
                  </span>
                </div>

                <div className="relative z-10 space-y-2">
                  <h3 className="text-white font-bold text-lg">{exp.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                    {exp.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TRUST SECTION
───────────────────────────────────────────── */
function TrustSection() {
  const flowSteps = ['طلب', 'مراجعة', 'عرض', 'عقد', 'تنفيذ', 'تسليم'];
  
  const cards = [
    {
      title: 'طلب واضح قبل العروض',
      desc: 'نراجع الطلب ونوضح المتطلبات قبل إرساله للمستقلين المناسبين.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <path d="M16 13H8"></path>
          <path d="M16 17H8"></path>
          <path d="M10 9H8"></path>
        </svg>
      )
    },
    {
      title: 'مستقلون تتم مراجعتهم',
      desc: 'كل مستقل يحدد خدماته ويرفق أعماله، ولا يظهر كتخصص متاح إلا بعد مراجعة الإدارة.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <polyline points="16 11 18 13 22 9"></polyline>
        </svg>
      )
    },
    {
      title: 'نطاق عمل موثق',
      desc: 'كل مشروع يبدأ بعرض واضح يحدد السعر، المدة، المخرجات، وعدد المراجعات.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>
      )
    },
    {
      title: 'دفع محجوز حتى التسليم',
      desc: 'يُحفظ مبلغ المشروع داخل بروز، ولا يتم صرفه إلا بعد التسليم أو قرار النزاع.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <rect x="2" y="5" width="20" height="14" rx="2"></rect>
          <line x1="2" y1="10" x2="22" y2="10"></line>
        </svg>
      )
    },
    {
      title: 'مساحة مشروع واحدة',
      desc: 'المحادثات، الملفات، التعديلات، والتسليمات تبقى داخل المشروع كمرجع للطرفين.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      )
    },
    {
      title: 'نزاعات مبنية على الأدلة',
      desc: 'عند الخلاف، تراجع الإدارة العقد، المحادثات، الملفات، والتسليمات قبل اتخاذ القرار.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      )
    }
  ];

  return (
    <section id="trust" className="py-24 md:py-32" style={{ background: 'var(--bg-main)' }}>
      <div className="container-xl max-w-6xl mx-auto">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            منصة تحفظ حق التاجر والمستقل
          </h2>
          <p className="text-lg mx-auto leading-relaxed" style={{ color: '#cbd5e1', maxWidth: '800px' }}>
            بروز لا يكتفي بربطك بمقدم خدمة. نراجع الطلب، نوثق نطاق العمل، نحفظ الدفع حتى التسليم، وندير المشروع بخطوات واضحة تقلل الخلاف وتحافظ على جودة التنفيذ.
          </p>
        </div>

        {/* Horizontal Flow Graphic */}
        <div className="hidden md:flex items-center justify-center gap-4 mb-16 overflow-x-auto pb-4">
          {flowSteps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="px-6 py-3 rounded-full font-bold text-sm bg-card border border-glass text-main/90 shadow-sm whitespace-nowrap">
                {step}
              </div>
              {idx < flowSteps.length - 1 && (
                <div className="text-cyan-500 opacity-60">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 rtl:rotate-180">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className="bg-card border border-glass p-6 md:p-8 rounded-3xl flex flex-col gap-3 md:gap-4 text-right transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/5"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2 md:mb-4">
                {card.icon}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-main">{card.title}</h3>
              <p className="text-sm leading-relaxed text-main/70">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



/* ─────────────────────────────────────────────
   FINAL CTA SECTION
───────────────────────────────────────────── */
function FinalCTASection() {
  return (
    <section
      id="final-cta"
      className="py-24 md:py-32"
      style={{ background: '#111827' }}
    >
      <div className="container-xl">
        <div
          className="rounded-3xl p-10 md:p-16 relative overflow-hidden text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(17,24,39,0.9) 60%)',
            border: '1px solid rgba(6,182,212,0.15)',
          }}
        >
          {/* Glow blobs */}
          <div
            className="absolute top-0 left-0 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-0 right-20 w-60 h-60 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)' }}
          />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="badge-cyan">ابدأ الآن</span>
            <h2 className="display-lg text-white">
              جاهز للانضمام إلى بروز؟
            </h2>
            <p className="body-lg leading-relaxed" style={{ color: '#cbd5e1' }}>
              سواء كنت صاحب متجر تبحث عن تنفيذ مشروعك، أو مستقلاً يبحث عن فرص جديدة، بروز تجمع الطرفين داخل منصة واحدة لإدارة المشاريع من الطلب حتى التسليم.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <Link href="/register" className="btn-primary text-sm px-10 py-4 text-lg">
                تسجيل
              </Link>
              <Link href="/login" className="btn-ghost text-sm px-10 py-4 text-lg">
                تسجيل دخول
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer
      className="pt-16 pb-8"
      style={{
        background: 'var(--bg-main)',
        borderTop: '1px solid var(--border-glass)',
      }}
    >
      <div className="container-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 text-center md:text-right" style={{ borderBottom: '1px solid var(--border-glass)' }}>

          {/* Brand */}
          <div className="md:col-span-1 space-y-4 flex flex-col items-center md:items-start">
            <div className="flex flex-col items-center md:items-start justify-center">
              <Image src="/شعار%20بروز.svg" alt="بروز" width={100} height={40} className="h-10 w-auto object-contain invert hue-rotate-180" />
              <span className="text-[11px] text-white mt-1 font-medium tracking-wide opacity-90">منصة خدمات متاجر سلة</span>
            </div>
            <p className="text-lg md:text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>
              منصة بروز، الماركت بليس المتخصص لربط تجار سلة بخبراء وحلول متكاملة لتطوير المتاجر وتنمية المبيعات.
            </p>
            <div className="flex justify-center md:justify-start gap-3">
              {['X', 'في', 'إنستغرام'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200 hover:scale-110"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-dim)',
                  }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-base md:text-xs font-bold uppercase tracking-wider text-main/60">الخدمات</h4>
            <ul className="space-y-2.5">
              <li><Link href="/request" className="text-lg md:text-sm transition-colors duration-200 hover:text-main" style={{ color: 'var(--text-dim)' }}>تخصيص متاجر سلة</Link></li>
              <li><Link href="/request" className="text-lg md:text-sm transition-colors duration-200 hover:text-main" style={{ color: 'var(--text-dim)' }}>تحسين SEO</Link></li>
              <li><Link href="/request" className="text-lg md:text-sm transition-colors duration-200 hover:text-main" style={{ color: 'var(--text-dim)' }}>صفحات الهبوط</Link></li>
            </ul>
          </div>

          {/* For Experts */}
          <div className="space-y-4">
            <h4 className="text-base md:text-xs font-bold uppercase tracking-wider text-main/60">مقدمو الخدمات</h4>
            <ul className="space-y-2.5">
              <li><Link href="/register/provider" className="text-lg md:text-sm transition-colors duration-200 hover:text-main" style={{ color: 'var(--text-dim)' }}>انضم كمستقل</Link></li>
              <li><Link href="/login" className="text-lg md:text-sm transition-colors duration-200 hover:text-main" style={{ color: 'var(--text-dim)' }}>لوحة التحكم</Link></li>
              <li><a href="#" className="text-lg md:text-sm transition-colors duration-200 hover:text-main" style={{ color: 'var(--text-dim)' }}>شروط الانضمام</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-base md:text-xs font-bold uppercase tracking-wider text-main/60">الدعم والمساعدة</h4>
            <ul className="space-y-2.5">
              {['مركز المساعدة', 'الشروط والأحكام', 'سياسة الخصوصية', 'اتصل بنا'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-lg md:text-sm transition-colors duration-200 hover:text-main" style={{ color: 'var(--text-dim)' }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
          <p className="text-base md:text-xs" style={{ color: 'rgba(148,163,184,0.4)' }}>
            © 2026 بروز. جميع الحقوق محفوظة.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-5">
            {['سياسة الاستخدام', 'الخصوصية', 'الإبلاغ عن مشكلة'].map((item) => (
              <a key={item} href="#" className="text-base md:text-xs transition-colors hover:text-main" style={{ color: 'rgba(148,163,184,0.4)' }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div style={{ fontFamily: 'var(--font-ar)', background: 'var(--bg-main)' }}>
      <Navbar />
      <main>
        <HeroSection />
        <TickerStrip />
        <ServicesAccordion />
        <HowItWorksSection />
        <ExpertsSection />
        <TrustSection />
        <FinalCTASection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
