'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ScrollToTop from './components/ui/ScrollToTop';
import { BrandLogo } from './components/ui/BrandLogo';
import { useLocale } from './components/i18n/LocaleProvider';
import LanguageToggle from './components/i18n/LanguageToggle';

/* ════════════════════════════════════════════════════════════════
   BOROZ — Home page content (bilingual).
   No i18n library exists in the project yet, so all copy lives here in
   a single ar/en dictionary. When next-intl is added later, these two
   objects map 1:1 to messages/ar.json and messages/en.json.
   UI numbers stay Western digits in both languages.
═══════════════════════════════════════════════════════════════════ */

type Lang = 'ar' | 'en';

const homeContent = {
  ar: {
    dir: 'rtl' as const,
    langToggle: 'EN',
    nav: {
      journey: 'رحلة الطلب',
      management: 'ماذا ندير؟',
      services: 'الخدمات',
      joinProvider: 'انضم كمقدم خدمة',
      login: 'تسجيل دخول',
      start: 'ابدأ طلبك',
    },
    hero: {
      badge: 'منصة تنفيذ لتجار سلة',
      title: 'حوّل طلب تطوير متجرك إلى مشروع واضح قابل للتنفيذ',
      desc: 'بدل البحث عن منفذين ومتابعة محادثات متفرقة، ارفع طلبك في بروز مرة واحدة، ودع المنصة تنظّم المراجعة، العروض، التنفيذ، والتسليم من لوحة واحدة.',
      ctaPrimary: 'ابدأ طلبك الآن',
      ctaSecondary: 'شاهد الرحلة',
      trust: ['طلب واحد واضح', 'عروض قابلة للمقارنة', 'تنفيذ موثق من لوحة واحدة'],
      board: {
        workspace: 'workspace.boroz.sa',
        boardTitle: 'لوحة التنفيذ',
        orderNo: 'طلب #1042',
        requestTitle: 'تحسين واجهة متجر سلة',
        status: 'بانتظار العروض',
        priorityLabel: 'الأولوية',
        priorityValue: 'متوسطة',
        budgetLabel: 'الميزانية',
        budgetValue: 'تُحدد بعد المراجعة',
        pipeline: ['طلب جديد', 'مراجعة بروز', 'توجيه للخبراء', 'عروض', 'تنفيذ', 'تسليم'],
        offersTitle: 'العروض الواردة',
        offers: [
          { name: 'عرض أ', meta: 'مدة 5 أيام' },
          { name: 'عرض ب', meta: 'مدة 7 أيام' },
          { name: 'عرض ج', meta: 'مدة 4 أيام' },
        ],
        nextLabel: 'الإجراء التالي',
        nextValue: 'راجع العروض واختر الأنسب',
      },
    },
    pain: {
      title: 'لماذا يضيع تنفيذ المتاجر؟',
      subtitle: 'ثلاث عقبات تجعل تطوير المتجر فوضى — بروز يحلّها من الجذر.',
      problems: [
        { t: 'البحث عن المنفذ يأخذ وقتًا', d: 'تبحث في كل مكان عن شخص مناسب دون ضمان للجودة أو الالتزام.' },
        { t: 'عروض غير قابلة للمقارنة', d: 'كل عرض يصل بصيغة مختلفة، فيصعب الموازنة بين السعر والمدة والنطاق.' },
        { t: 'متابعة مشتتة', d: 'العمل موزّع بين واتساب وملفات وملاحظات متفرقة بلا مرجع واحد.' },
      ],
      solutionTitle: 'بروز يحوّلها إلى مسار واحد واضح',
      solutions: ['طلب موحّد', 'مراجعة قبل الإرسال', 'عروض منظمة', 'مشروع قابل للمتابعة'],
    },
    journey: {
      title: 'رحلة طلبك داخل بروز',
      subtitle: 'من فكرة الطلب حتى اعتماد التسليم — كل خطوة واضحة وموثّقة.',
      steps: [
        { t: 'ترسل الطلب', d: 'تصف احتياجك مرة واحدة: الخدمة، الأولوية، والميزانية.', badge: 'البداية' },
        { t: 'بروز تراجع الاحتياج', d: 'نتأكد من وضوح المتطلبات وقابليتها للتنفيذ قبل أي إرسال.', badge: 'مراجعة' },
        { t: 'توجيه لمقدمي خدمات مناسبين', d: 'يصل الطلب فقط للخبراء المعتمدين في نوع الخدمة.', badge: 'توجيه' },
        { t: 'تستقبل عروضًا منظمة', d: 'سعر، مدة، ونطاق عمل بصيغة موحدة قابلة للمقارنة.', badge: 'عروض' },
        { t: 'تختار العرض', d: 'تقارن العروض وتعتمد الأنسب لمشروعك.', badge: 'اختيار' },
        { t: 'يبدأ التنفيذ داخل مشروع', d: 'مشروع واضح مع رسائل وملفات ومتابعة مباشرة.', badge: 'تنفيذ' },
        { t: 'التسليم والاعتماد', d: 'تستلم العمل وتعتمده من نفس اللوحة بشكل موثّق.', badge: 'تسليم' },
      ],
    },
    management: {
      title: 'ما الذي تديره بروز؟',
      desc: 'بروز ليست مجرد وسيط بين تاجر وخبير، بل طبقة تشغيل تدير مسار طلبك بالكامل — من أول خطوة حتى اعتماد التسليم.',
      stages: [
        { s: 'الطلبات', d: 'استقبال الطلب بنموذج موحّد وواضح.' },
        { s: 'المراجعة', d: 'التأكد من اكتمال المتطلبات قبل الإرسال.' },
        { s: 'العروض', d: 'جمع عروض الخبراء في واجهة مقارنة واحدة.' },
        { s: 'التنفيذ', d: 'إدارة المشروع والرسائل والملفات.' },
        { s: 'التسليم', d: 'اعتماد التسليم وتوثيق الإنجاز.' },
      ],
      boardTag: 'مسار التشغيل',
    },
    comparison: {
      title: 'الفرق ليس في العثور على منفذ، بل في إدارة التنفيذ',
      subtitle: 'بروز ينقل تطوير متجرك من محادثات متفرقة إلى مسار منظّم وموثّق.',
      traditionalLabel: 'الطريقة التقليدية',
      borozLabel: 'مع بروز',
      traditional: ['بحث يدوي عن منفذين', 'محادثات متفرقة', 'عروض غير موحّدة', 'متابعة غير واضحة', 'تسليم غير موثّق'],
      boroz: ['طلب واحد', 'مراجعة منظمة', 'عروض قابلة للمقارنة', 'تنفيذ داخل لوحة واحدة', 'تسليم واعتماد واضح'],
    },
    services: {
      title: 'الخدمات المتاحة الآن',
      subtitle: 'ابدأ بطلب أي من هذه الخدمات، ويتم توجيهه تلقائيًا للخبراء المناسبين.',
      cta: 'ابدأ طلب لهذه الخدمة',
      includesLabel: 'يمكنك أن تطلب ضمنها:',
      items: [
        { title: 'تخصيص متاجر سلة', desc: 'تعديل وتطوير واجهة متجرك وإضافة خصائص مخصصة تناسب نشاطك.', includes: ['تعديل الواجهة والأقسام', 'إصلاح مشاكل العرض', 'تحسين تجربة الجوال'] },
        { title: 'تحسين SEO', desc: 'رفع ظهور متجرك في نتائج البحث عبر هيكلة ومحتوى أوضح.', includes: ['تحسين بنية الصفحات', 'محتوى موجّه للبحث', 'معالجة مشاكل الفهرسة'] },
        { title: 'صفحات الهبوط', desc: 'تصميم صفحة هبوط تخدم حملة أو عرضًا محددًا بمخرجات واضحة.', includes: ['تصميم الصفحة', 'ربطها بالحملة', 'تهيئتها للتحويل'] },
      ],
    },
    audience: {
      title: 'بروز مناسب لك إذا كنت:',
      items: [
        'تملك متجر سلة وتريد تنفيذ تطوير بدون متابعة مشتتة',
        'تحتاج عروضًا واضحة قبل اتخاذ القرار',
        'تريد تنفيذًا موثّقًا بدل محادثات واتساب',
        'تريد متابعة الطلب والتسليم من مكان واحد',
      ],
    },
    cta: {
      title: 'ابدأ بطلب واحد، ودع بروز ترتّب الباقي',
      desc: 'ارفع احتياجك الآن، وسنحوّله إلى مسار واضح: مراجعة، عروض، تنفيذ، وتسليم.',
      button: 'ابدأ طلبك الآن',
    },
    footer: {
      tagline: 'منصة تنفيذ وإدارة تربط تجار سلة بمقدمي خدمات معتمدين، مع إدارة واضحة للطلب من البداية حتى التسليم.',
      platform: 'المنصة',
      account: 'الحساب',
      support: 'الدعم',
      links: {
        howItWorks: 'كيف تعمل',
        services: 'الخدمات المتاحة',
        request: 'ارفع طلبك',
        login: 'تسجيل الدخول',
        newMerchant: 'حساب تاجر جديد',
        joinProvider: 'انضم كمقدم خدمة',
        contact: 'تواصل معنا',
        privacy: 'الخصوصية',
        terms: 'الشروط',
      },
      rights: '© 2026 بروز. جميع الحقوق محفوظة.',
      sub: 'منصة لتنظيم وإدارة تطوير متاجر سلة',
    },
  },
  en: {
    dir: 'ltr' as const,
    langToggle: 'ع',
    nav: {
      journey: 'The journey',
      management: 'What we manage',
      services: 'Services',
      joinProvider: 'Join as a provider',
      login: 'Log in',
      start: 'Start a request',
    },
    hero: {
      badge: 'Execution platform for Salla merchants',
      title: 'Turn your store improvement request into a clear, executable project',
      desc: 'Instead of searching for providers and managing scattered conversations, submit one request in BOROZ and let the platform organize review, offers, execution, and delivery from one workspace.',
      ctaPrimary: 'Start your request',
      ctaSecondary: 'See the journey',
      trust: ['One clear request', 'Comparable offers', 'Tracked execution in one place'],
      board: {
        workspace: 'workspace.boroz.sa',
        boardTitle: 'Execution board',
        orderNo: 'Request #1042',
        requestTitle: 'Improve Salla storefront UI',
        status: 'Awaiting offers',
        priorityLabel: 'Priority',
        priorityValue: 'Medium',
        budgetLabel: 'Budget',
        budgetValue: 'Set after review',
        pipeline: ['New', 'Review', 'Routing', 'Offers', 'Execution', 'Delivery'],
        offersTitle: 'Incoming offers',
        offers: [
          { name: 'Offer A', meta: '5 days' },
          { name: 'Offer B', meta: '7 days' },
          { name: 'Offer C', meta: '4 days' },
        ],
        nextLabel: 'Next action',
        nextValue: 'Review the offers and pick the best fit',
      },
    },
    pain: {
      title: 'Why store execution falls apart',
      subtitle: 'Three obstacles turn store development into chaos — BOROZ fixes them at the root.',
      problems: [
        { t: 'Finding the right provider takes time', d: 'You search everywhere for someone suitable with no guarantee of quality or commitment.' },
        { t: 'Offers you can’t compare', d: 'Each offer arrives in a different format, so price, timeline and scope are hard to weigh.' },
        { t: 'Scattered follow-up', d: 'Work is spread across WhatsApp, files and loose notes with no single reference.' },
      ],
      solutionTitle: 'BOROZ turns it into one clear path',
      solutions: ['One unified request', 'Review before routing', 'Organized offers', 'A trackable project'],
    },
    journey: {
      title: 'Your request’s journey inside BOROZ',
      subtitle: 'From the first request to delivery approval — every step is clear and documented.',
      steps: [
        { t: 'You submit the request', d: 'Describe your need once: the service, priority, and budget.', badge: 'Start' },
        { t: 'BOROZ reviews the need', d: 'We confirm the requirements are clear and executable before any routing.', badge: 'Review' },
        { t: 'Routed to the right providers', d: 'The request reaches only approved experts in that service.', badge: 'Routing' },
        { t: 'You receive organized offers', d: 'Price, timeline and scope in one comparable format.', badge: 'Offers' },
        { t: 'You choose an offer', d: 'Compare the offers and approve the best fit for your project.', badge: 'Selection' },
        { t: 'Execution starts as a project', d: 'A clear project with messages, files and direct tracking.', badge: 'Execution' },
        { t: 'Delivery and approval', d: 'You receive the work and approve it from the same board.', badge: 'Delivery' },
      ],
    },
    management: {
      title: 'What does BOROZ manage?',
      desc: 'BOROZ isn’t just a middleman between a merchant and an expert — it’s an operating layer that manages your request end to end, from the first step to delivery approval.',
      stages: [
        { s: 'Requests', d: 'Capture the request through one clear, unified form.' },
        { s: 'Review', d: 'Make sure requirements are complete before routing.' },
        { s: 'Offers', d: 'Collect expert offers in one comparison view.' },
        { s: 'Execution', d: 'Manage the project, messages and files.' },
        { s: 'Delivery', d: 'Approve delivery and document the outcome.' },
      ],
      boardTag: 'Operating pipeline',
    },
    comparison: {
      title: 'The difference isn’t finding a provider — it’s managing execution',
      subtitle: 'BOROZ moves your store development from scattered chats to an organized, documented path.',
      traditionalLabel: 'The traditional way',
      borozLabel: 'With BOROZ',
      traditional: ['Manual provider hunting', 'Scattered conversations', 'Inconsistent offers', 'Unclear follow-up', 'Undocumented delivery'],
      boroz: ['One request', 'Structured review', 'Comparable offers', 'Execution in one board', 'Clear delivery & approval'],
    },
    services: {
      title: 'Services available now',
      subtitle: 'Start by requesting any of these services, and it’s routed automatically to the right experts.',
      cta: 'Request this service',
      includesLabel: 'You can request within it:',
      items: [
        { title: 'Salla store customization', desc: 'Adjust and develop your storefront and add custom features for your business.', includes: ['Storefront & sections edits', 'Display issue fixes', 'Mobile experience tuning'] },
        { title: 'SEO improvement', desc: 'Increase your store’s visibility in search through clearer structure and content.', includes: ['Page structure tuning', 'Search-focused content', 'Indexing issue fixes'] },
        { title: 'Landing pages', desc: 'Design a landing page that serves a specific campaign or offer with clear outputs.', includes: ['Page design', 'Campaign wiring', 'Conversion setup'] },
      ],
    },
    audience: {
      title: 'BOROZ is for you if you:',
      items: [
        'Own a Salla store and want development without scattered follow-up',
        'Need clear offers before making a decision',
        'Want documented execution instead of WhatsApp chats',
        'Want to track the request and delivery from one place',
      ],
    },
    cta: {
      title: 'Start with one request, and let BOROZ arrange the rest',
      desc: 'Submit your need now and we’ll turn it into a clear path: review, offers, execution, and delivery.',
      button: 'Start your request',
    },
    footer: {
      tagline: 'An execution and management platform connecting Salla merchants with approved providers, with clear request management from start to delivery.',
      platform: 'Platform',
      account: 'Account',
      support: 'Support',
      links: {
        howItWorks: 'How it works',
        services: 'Available services',
        request: 'Submit a request',
        login: 'Log in',
        newMerchant: 'New merchant account',
        joinProvider: 'Join as a provider',
        contact: 'Contact us',
        privacy: 'Privacy',
        terms: 'Terms',
      },
      rights: '© 2026 BOROZ. All rights reserved.',
      sub: 'A platform to organize and manage Salla store development',
    },
  },
};

type Content = (typeof homeContent)[Lang];

/* ─── SVG Icons ─── */
const Menu = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>);
const Close = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
const Check = ({ cls = 'w-3.5 h-3.5' }: { cls?: string }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={cls}><polyline points="20 6 9 17 4 12" /></svg>);
const ChevronDown = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 12 15 18 9" /></svg>);
const Arrow = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 rtl:rotate-180"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>);

const StoreIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>);
const SEOIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>);
const PageIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>);

const SERVICE_ICONS = [StoreIcon, SEOIcon, PageIcon];

/* ─── Navbar ─── */
function Navbar({ t }: { t: Content }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { label: t.nav.journey, href: '#journey' },
    { label: t.nav.management, href: '#management' },
    { label: t.nav.services, href: '#services' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-[#E5E7EB] bg-white/90 backdrop-blur">
      <div className="container-xl">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center shrink-0">
            <BrandLogo width={96} height={34} className="h-8 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {links.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-medium text-slate-600 hover:text-[#0B132B] transition-colors">{item.label}</a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle />
            <span className="w-px h-6 bg-slate-200" />
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-[#0B132B] transition-colors">{t.nav.login}</Link>
            <Link href="/request" className="text-sm font-bold text-white px-5 py-2.5 rounded-lg transition-all hover:-translate-y-0.5" style={{ background: '#0B132B' }}>{t.nav.start}</Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LanguageToggle />
            <button className="p-2 text-slate-600" onClick={() => setMenuOpen(!menuOpen)} aria-label="menu">{menuOpen ? <Close /> : <Menu />}</button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-white">
          <div className="container-xl py-4 space-y-1">
            {links.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">{item.label}</a>
            ))}
            <div className="pt-3 border-t border-[#E5E7EB] flex gap-2.5 px-4">
              <Link href="/login" className="flex-1 text-center py-2.5 text-sm font-medium border border-[#E5E7EB] rounded-lg text-slate-600" onClick={() => setMenuOpen(false)}>{t.nav.login}</Link>
              <Link href="/request" className="flex-1 text-center py-2.5 text-sm font-bold text-white rounded-lg" style={{ background: '#0B132B' }} onClick={() => setMenuOpen(false)}>{t.nav.start}</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─── Hero Visual: Execution Board ─── */
function ExecutionBoard({ t }: { t: Content }) {
  const b = t.hero.board;
  const activeStep = 3; // "Offers"
  return (
    <div className="w-full rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden" style={{ boxShadow: '0 30px 60px -20px rgba(11,19,43,0.28)' }}>
      {/* window bar */}
      <div className="h-11 bg-[#F6F8FB] border-b border-[#E5E7EB] flex items-center px-4 gap-2">
        <span className="w-3 h-3 rounded-full bg-[#E5E7EB]" />
        <span className="w-3 h-3 rounded-full bg-[#E5E7EB]" />
        <span className="w-3 h-3 rounded-full bg-[#E5E7EB]" />
        <span className="mx-auto text-[11px] font-semibold text-slate-500 bg-white border border-[#E5E7EB] rounded-md px-3 py-1">{b.workspace}</span>
      </div>

      <div className="p-5 space-y-5">
        {/* header */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[#0B132B]">{b.boardTitle}</h3>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#F6F8FB] text-slate-600 border border-[#E5E7EB]" dir="ltr">{b.orderNo}</span>
        </div>

        {/* pipeline */}
        <div className="flex items-center">
          {b.pipeline.map((label, i) => {
            const done = i < activeStep;
            const active = i === activeStep;
            return (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${done ? 'bg-[#06B6D4] border-[#06B6D4] text-white' : active ? 'bg-white border-[#06B6D4]' : 'bg-white border-[#E5E7EB]'}`}>
                    {done ? <Check cls="w-2.5 h-2.5" /> : active ? <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" /> : null}
                  </div>
                  <span className={`text-[9px] font-bold whitespace-nowrap ${active || done ? 'text-[#0B132B]' : 'text-slate-400'}`}>{label}</span>
                </div>
                {i < b.pipeline.length - 1 && (
                  <div className={`h-0.5 flex-1 mb-4 ${i < activeStep ? 'bg-[#06B6D4]' : 'bg-[#E5E7EB]'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* request card */}
        <div className="rounded-xl border border-[#E5E7EB] bg-[#F6F8FB] p-4">
          <div className="flex items-start justify-between gap-3">
            <h4 className="font-bold text-[#0B132B]">{b.requestTitle}</h4>
            <span className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-md bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20">{b.status}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-white border border-[#E5E7EB] px-3 py-2">
              <div className="text-[10px] text-slate-500">{b.priorityLabel}</div>
              <div className="text-xs font-bold text-[#0B132B]">{b.priorityValue}</div>
            </div>
            <div className="rounded-lg bg-white border border-[#E5E7EB] px-3 py-2">
              <div className="text-[10px] text-slate-500">{b.budgetLabel}</div>
              <div className="text-xs font-bold text-[#0B132B]">{b.budgetValue}</div>
            </div>
          </div>
        </div>

        {/* offers */}
        <div>
          <div className="text-[11px] font-bold text-slate-500 mb-2">{b.offersTitle}</div>
          <div className="space-y-2">
            {b.offers.map((o, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#0B132B] text-white text-[11px] font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="text-sm font-semibold text-[#0B132B]">{o.name}</span>
                </div>
                <span className="text-[11px] font-medium text-slate-500">{o.meta}</span>
              </div>
            ))}
          </div>
        </div>

        {/* next action */}
        <div className="rounded-xl p-4 flex items-center justify-between gap-3" style={{ background: 'linear-gradient(135deg,#0B132B,#10243f)' }}>
          <div>
            <div className="text-[10px] font-bold text-[#06B6D4] mb-0.5">{b.nextLabel}</div>
            <div className="text-sm font-bold text-white">{b.nextValue}</div>
          </div>
          <span className="shrink-0 w-9 h-9 rounded-lg bg-[#06B6D4] text-white flex items-center justify-center"><Arrow /></span>
        </div>
      </div>
    </div>
  );
}

/* ─── Hero ─── */
function Hero({ t }: { t: Content }) {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-white">
      <div className="absolute top-0 inset-inline-end-0 w-[700px] h-[700px] bg-[#06B6D4] opacity-[0.06] rounded-full blur-3xl -translate-y-1/3 pointer-events-none" style={{ insetInlineEnd: '-10%' }} />
      <div className="container-xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[44%_56%] gap-10 lg:gap-14 items-center">
          {/* text */}
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#06B6D4]/25 bg-[#06B6D4]/10 px-3.5 py-1.5 text-xs font-bold text-[#0B132B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />{t.hero.badge}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold leading-[1.18] text-[#0B132B]">{t.hero.title}</h1>
            <p className="text-lg leading-relaxed text-slate-600">{t.hero.desc}</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/request" className="text-center px-7 py-3.5 text-base font-bold rounded-xl text-white transition-all shadow-lg hover:-translate-y-0.5" style={{ background: '#0B132B', boxShadow: '0 12px 30px -8px rgba(11,19,43,0.4)' }}>{t.hero.ctaPrimary}</Link>
              <a href="#journey" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-bold rounded-xl border-2 border-[#E5E7EB] text-[#0B132B] hover:border-[#06B6D4] hover:text-[#06B6D4] transition-colors">{t.hero.ctaSecondary}<ChevronDown /></a>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2.5 pt-1">
              {t.hero.trust.map((line, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#22C55E]/12 text-[#22C55E] flex items-center justify-center"><Check cls="w-3 h-3" /></span>
                  <span className="text-sm font-semibold text-[#0B132B]">{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* visual */}
          <div className="w-full">
            <ExecutionBoard t={t} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Pain → Solution ─── */
function PainSection({ t }: { t: Content }) {
  return (
    <section className="py-16 md:py-20 bg-[#F6F8FB]">
      <div className="container-xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B132B]">{t.pain.title}</h2>
          <p className="mt-3 text-lg text-slate-600">{t.pain.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {t.pain.problems.map((p, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-4 text-lg font-bold">✕</div>
              <h3 className="font-bold text-[#0B132B] mb-1.5">{p.t}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>

        {/* solution band */}
        <div className="mt-8 max-w-5xl mx-auto rounded-2xl border border-[#06B6D4]/20 p-6 md:p-7" style={{ background: 'linear-gradient(135deg,#0B132B,#10243f)' }}>
          <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
            <h3 className="text-xl md:text-2xl font-bold text-white md:max-w-xs">{t.pain.solutionTitle}</h3>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {t.pain.solutions.map((s, i) => (
                <div key={i} className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#22C55E] text-white flex items-center justify-center shrink-0"><Check cls="w-3 h-3" /></span>
                  <span className="text-xs font-bold text-white">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Journey (connected timeline) ─── */
function JourneySection({ t }: { t: Content }) {
  return (
    <section id="journey" className="py-16 md:py-24 bg-white">
      <div className="container-xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B132B]">{t.journey.title}</h2>
          <p className="mt-3 text-lg text-slate-600">{t.journey.subtitle}</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {t.journey.steps.map((step, idx) => {
            const last = idx === t.journey.steps.length - 1;
            return (
              <div key={idx} className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-[#0B132B] text-white font-bold flex items-center justify-center">{idx + 1}</div>
                  {!last && <div className="w-px flex-1 my-1.5 bg-[#E5E7EB]" />}
                </div>
                <div className={`flex-1 ${last ? '' : 'pb-7'}`}>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-lg font-bold text-[#0B132B]">{step.t}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/15">{step.badge}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{step.d}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Management (operations board) ─── */
function ManagementSection({ t }: { t: Content }) {
  return (
    <section id="management" className="py-16 md:py-20 bg-[#F6F8FB]">
      <div className="container-xl">
        <div className="max-w-3xl mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B132B]">{t.management.title}</h2>
          <p className="mt-3 text-lg text-slate-600 leading-relaxed">{t.management.desc}</p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
            <span className="text-xs font-bold text-slate-500">{t.management.boardTag}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {t.management.stages.map((st, i) => (
              <div key={i} className="rounded-xl border border-[#E5E7EB] bg-[#F6F8FB] p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-[#0B132B] text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  {i < t.management.stages.length - 1 && <span className="text-slate-300"><Arrow /></span>}
                </div>
                <div className="font-bold text-[#0B132B] text-sm">{st.s}</div>
                <p className="text-xs text-slate-600 leading-relaxed">{st.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Comparison (premium two-card) ─── */
function ComparisonSection({ t }: { t: Content }) {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B132B]">{t.comparison.title}</h2>
          <p className="mt-3 text-lg text-slate-600">{t.comparison.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {/* traditional */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-[#F6F8FB] p-6 md:p-7">
            <h3 className="text-lg font-bold text-slate-500 mb-5">{t.comparison.traditionalLabel}</h3>
            <ul className="space-y-3.5">
              {t.comparison.traditional.map((row, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-sm font-bold shrink-0">✕</span>
                  <span className="text-sm md:text-base text-slate-600">{row}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* boroz */}
          <div className="rounded-2xl border border-[#06B6D4]/30 p-6 md:p-7 relative overflow-hidden" style={{ background: 'linear-gradient(150deg,#0B132B,#10243f)' }}>
            <div className="absolute top-0 inset-inline-end-0 w-40 h-40 bg-[#06B6D4] opacity-10 rounded-full blur-2xl" />
            <h3 className="text-lg font-bold text-[#06B6D4] mb-5 relative z-10">{t.comparison.borozLabel}</h3>
            <ul className="space-y-3.5 relative z-10">
              {t.comparison.boroz.map((row, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#22C55E] text-white flex items-center justify-center shrink-0"><Check cls="w-3 h-3" /></span>
                  <span className="text-sm md:text-base font-medium text-white">{row}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Services ─── */
function ServicesSection({ t }: { t: Content }) {
  return (
    <section id="services" className="py-16 md:py-20 bg-[#F6F8FB]">
      <div className="container-xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B132B]">{t.services.title}</h2>
          <p className="mt-3 text-lg text-slate-600">{t.services.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {t.services.items.map((svc, i) => {
            const Icon = SERVICE_ICONS[i] || StoreIcon;
            return (
              <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-6 flex flex-col hover:border-[#06B6D4] hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#0B132B] text-white flex items-center justify-center mb-4"><Icon /></div>
                <h3 className="text-xl font-bold text-[#0B132B]">{svc.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{svc.desc}</p>

                <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex-1">
                  <div className="text-[11px] font-bold text-slate-500 mb-2.5">{t.services.includesLabel}</div>
                  <ul className="space-y-2">
                    {svc.includes.map((inc, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-[#0B132B]">
                        <span className="w-4 h-4 rounded-full bg-[#22C55E]/12 text-[#22C55E] flex items-center justify-center shrink-0"><Check cls="w-2.5 h-2.5" /></span>
                        {inc}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/request" className="mt-5 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-bold text-white transition-colors hover:bg-[#0596B2]" style={{ background: '#06B6D4' }}>
                  {t.services.cta}<Arrow />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Audience ─── */
function AudienceSection({ t }: { t: Content }) {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-xl">
        <div className="max-w-4xl mx-auto rounded-3xl border border-[#E5E7EB] bg-[#F6F8FB] p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B132B] mb-8">{t.audience.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.audience.items.map((line, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-[#E5E7EB] p-4">
                <span className="w-6 h-6 rounded-full bg-[#22C55E]/12 text-[#22C55E] flex items-center justify-center shrink-0 mt-0.5"><Check cls="w-3.5 h-3.5" /></span>
                <span className="text-base font-semibold text-[#0B132B] leading-relaxed">{line}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTASection({ t }: { t: Content }) {
  return (
    <section className="py-16 md:py-24 bg-[#F6F8FB]">
      <div className="container-xl">
        <div className="max-w-4xl mx-auto rounded-3xl px-8 py-12 md:py-16 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0B132B 0%,#10243f 60%,#06405a 100%)' }}>
          <div className="absolute -top-16 inset-inline-end-0 w-72 h-72 bg-[#06B6D4] opacity-15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{t.cta.title}</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">{t.cta.desc}</p>
            <Link href="/request" className="inline-flex items-center gap-2 bg-[#06B6D4] text-white text-base font-bold px-9 py-4 rounded-xl hover:bg-[#0596B2] transition-colors" style={{ boxShadow: '0 14px 34px -10px rgba(6,182,212,0.5)' }}>
              {t.cta.button}<Arrow />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer({ t }: { t: Content }) {
  const f = t.footer;
  return (
    <footer className="py-12 bg-white border-t border-[#E5E7EB]">
      <div className="container-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
          <div className="space-y-4">
            <Link href="/"><BrandLogo width={96} height={34} className="h-8 w-auto" /></Link>
            <p className="text-sm text-slate-600 leading-relaxed">{f.tagline}</p>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-[#0B132B]">{f.platform}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#journey" className="text-slate-600 hover:text-[#0B132B]">{f.links.howItWorks}</a></li>
              <li><a href="#services" className="text-slate-600 hover:text-[#0B132B]">{f.links.services}</a></li>
              <li><Link href="/request" className="text-slate-600 hover:text-[#0B132B]">{f.links.request}</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-[#0B132B]">{f.account}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="text-slate-600 hover:text-[#0B132B]">{f.links.login}</Link></li>
              <li><Link href="/request" className="text-slate-600 hover:text-[#0B132B]">{f.links.newMerchant}</Link></li>
              <li><Link href="/register/provider" className="text-slate-600 hover:text-[#0B132B]">{f.links.joinProvider}</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-[#0B132B]">{f.support}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:support@boroz.sa" className="text-slate-600 hover:text-[#0B132B]">{f.links.contact}</a></li>
              <li><Link href="/privacy" className="text-slate-600 hover:text-[#0B132B]">{f.links.privacy}</Link></li>
              <li><Link href="/terms" className="text-slate-600 hover:text-[#0B132B]">{f.links.terms}</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-[#E5E7EB] text-center text-sm text-slate-500 space-y-1">
          <p>{f.rights}</p>
          <p>{f.sub}</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ─── */
export default function HomePage() {
  const { locale } = useLocale();
  const t = homeContent[locale];

  return (
    <div className="bg-[#F6F8FB] font-sans">
      <Navbar t={t} />
      <main>
        <Hero t={t} />
        <PainSection t={t} />
        <JourneySection t={t} />
        <ManagementSection t={t} />
        <ComparisonSection t={t} />
        <ServicesSection t={t} />
        <AudienceSection t={t} />
        <CTASection t={t} />
      </main>
      <Footer t={t} />
      <ScrollToTop />
    </div>
  );
}
