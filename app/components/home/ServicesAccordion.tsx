'use client';

import React, { useState } from 'react';

// Icons for the categories
const IconStore = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const IconContent = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const IconGrowth = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
    <polyline points="16 7 22 7 22 13"></polyline>
  </svg>
);

const IconDesign = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
    <path d="M2 2l7.586 7.586"></path>
    <circle cx="11" cy="11" r="2"></circle>
  </svg>
);

const IconMedia = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
    <line x1="7" y1="2" x2="7" y2="22"></line>
    <line x1="17" y1="2" x2="17" y2="22"></line>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <line x1="2" y1="7" x2="7" y2="7"></line>
    <line x1="2" y1="17" x2="7" y2="17"></line>
    <line x1="17" y1="17" x2="22" y2="17"></line>
    <line x1="17" y1="7" x2="22" y2="7"></line>
  </svg>
);

const IconAutomation = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M12 2v20"></path>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const IconChevronDown = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-full h-full ${className || ''}`}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const CATEGORIES = [
  {
    id: 'dev',
    title: 'تطوير وتخصيص المتاجر',
    desc: 'حلول برمجية متكاملة لتخصيص متجرك على سلة وبرمجة واجهات احترافية.',
    icon: IconStore,
    color: '#06B6D4',
    services: [
      'تخصيص متاجر سلة', 'تخصيص CSS', 'تخصيص JavaScript', 'تخصيص واجهات المتاجر',
      'تطوير أقسام مخصصة', 'تخصيص صفحة المنتج', 'تخصيص صفحة السلة', 'تخصيص صفحة الدفع',
      'تحسين تجربة المستخدم (UX)', 'تحسين معدل التحويل وزيادة المبيعات (CRO)',
      'تحسين سرعة المتجر', 'تحسين تجربة الجوال', 'إصلاح مشاكل الواجهة'
    ]
  },
  {
    id: 'content',
    title: 'المحتوى والتحسين',
    desc: 'كتابة محتوى إبداعي ووصف منتجات متوافق مع محركات البحث SEO.',
    icon: IconContent,
    color: '#22C55E',
    services: [
      'كتابة وصف المنتجات', 'تحسين محركات البحث SEO', 'كتابة صفحات الهبوط',
      'كتابة صفحة من نحن', 'كتابة سياسة الخصوصية', 'كتابة سياسة الاستبدال والاسترجاع',
      'كتابة الشروط والأحكام', 'كتابة الأسئلة الشائعة', 'كتابة الصفحات التعريفية',
      'كتابة مقالات متوافقة مع محركات البحث (SEO)', 'تحسين المحتوى الحالي'
    ]
  },
  {
    id: 'marketing',
    title: 'التسويق والنمو',
    desc: 'حملات إعلانية مدفوعة وتحليل بيانات لزيادة المبيعات والعائد على الاستثمار.',
    icon: IconGrowth,
    color: '#A78BFA',
    services: [
      'إعلانات Google (Google Ads)', 'إعلانات Meta', 'إعلانات TikTok', 'إعلانات Snapchat',
      'التسويق عبر البريد الإلكتروني (Email Marketing)',
      'التسويق عبر واتساب (WhatsApp Marketing)', 'تحليلات Google (Google Analytics)',
      'إدارة الوسوم والتتبع (Google Tag Manager)', 'أدوات مشرفي المواقع (Google Search Console)',
      'تحليل سلوك الزوار (Microsoft Clarity)', 'تتبع التحويلات (Conversion Tracking)',
      'إعداد الأحداث والتحليلات (Event Tracking)', 'تقارير الأداء', 'إعادة الاستهداف (Retargeting)'
    ]
  },
  {
    id: 'design',
    title: 'التصميم والهوية',
    desc: 'بناء هوية بصرية قوية وتصميم واجهات وبنرات جذابة تعكس قيمة علامتك التجاري.',
    icon: IconDesign,
    color: '#F59E0B',
    services: [
      'صفحات الهبوط', 'تصميم البنرات', 'تصميم الهوية البصرية', 'تصميم الشعارات', 'تصميم منشورات السوشيال ميديا',
      'تصميم واجهات المتاجر', 'تصميم العروض التقديمية',
      'تصميم الإنفوجرافيك', 'تصميم أغلفة المنتجات', 'تصميم الإعلانات الرقمية',
      'إعداد الدليل البصري للهوية (Brand Guidelines)'
    ]
  },
  {
    id: 'media',
    title: 'الوسائط والإنتاج',
    desc: 'تصوير منتجات احترافي وإنتاج فيديوهات وموشن جرافيك بجودة عالية.',
    icon: IconMedia,
    color: '#EC4899',
    services: [
      'تصوير المنتجات', 'تعديل الصور', 'معالجة الصور التجارية', 'إنتاج الفيديوهات القصيرة',
      'مونتاج الفيديو', 'موشن جرافيك (Motion Graphics)', 'إنتاج المحتوى الإعلاني',
      'تصوير المحتوى التسويقي'
    ]
  },
  {
    id: 'automation',
    title: 'الأتمتة والتكاملات',
    desc: 'ربط الأنظمة وأتمتة العمليات اليومية لتوفير الوقت وزيادة الإنتاجية.',
    icon: IconAutomation,
    color: '#3B82F6',
    services: [
      'أتمتة العمليات', 'ربط التطبيقات والخدمات', 'تكاملات سلة', 'تكاملات CRM',
      'تكاملات البريد الإلكتروني', 'تكاملات WhatsApp Business', 'Webhooks',
      'تدفقات الأتمتة (Automation Flows)'
    ]
  }
];

export default function ServicesAccordion() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [showAllServices, setShowAllServices] = useState<Record<string, boolean>>({});

  const toggleCategory = (id: string) => {
    setActiveCategoryId((prev) => (prev === id ? null : id));
  };

  const toggleShowAll = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setShowAllServices((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="services" className="py-24" style={{ background: '#111827' }}>
      <div className="container-xl">
        <div className="text-center space-y-4 mb-16">
          <span className="badge-cyan">خدمات الماركت بليس</span>
          <h2 className="display-lg text-white">خدمات تساعد متجر سلة على النمو</h2>
          <p className="body-lg mx-auto" style={{ color: '#94a3b8', maxWidth: '600px' }}>
            من تطوير الواجهة وتجربة المستخدم إلى المحتوى، التسويق، والتحليلات. بروز يساعدك على تحويل احتياج المتجر إلى طلب واضح يصل للمستقل المناسب.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isOpen = activeCategoryId === cat.id;
            const isShowingAll = !!showAllServices[cat.id];
            
            const displayedServices = isShowingAll ? cat.services : cat.services.slice(0, 5);

            return (
              <div 
                key={cat.id} 
                className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'ring-1 ring-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)]' : 'hover:border-glass'}`}
                style={{ 
                  background: isOpen ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)', 
                  borderColor: isOpen ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.06)' 
                }}
              >
                {/* Header (Clickable) */}
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full text-right p-6 md:p-8 flex items-start gap-5 focus:outline-none"
                >
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors"
                    style={{ background: isOpen ? `${cat.color}20` : `${cat.color}10`, color: cat.color }}
                  >
                    <span className="w-7 h-7"><Icon /></span>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">{cat.title}</h3>
                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-cyan-500/20 text-cyan-400' : 'bg-card text-white/40'}`}
                      >
                        <IconChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                      {cat.desc}
                    </p>
                    <div className="pt-2">
                      <span 
                        className="inline-flex items-center text-[11px] font-bold px-3 py-1 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}
                      >
                        أمثلة على خدمات القسم
                      </span>
                    </div>
                  </div>
                </button>

                {/* Body (Accordion with CSS Grid transition) */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-8 md:px-8 pt-2">
                      <div className="h-px w-full mb-6" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05), transparent)' }}></div>
                      <h4 className="text-sm font-bold text-white/60 mb-4">تشمل:</h4>
                      <div className="flex flex-col gap-3">
                        {displayedServices.map((service, idx) => (
                          <div 
                            key={idx}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg gap-2"
                            style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-4 h-4 text-cyan-400"><IconCheck /></span>
                              <span className="text-sm text-white/90">{service}</span>
                            </div>
                          </div>
                        ))}
                        {cat.services.length > 5 && (
                          <button 
                            onClick={(e) => toggleShowAll(e, cat.id)}
                            className="mt-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors text-center w-full py-2 bg-white/5 rounded-lg border border-white/5"
                          >
                            {isShowingAll ? 'عرض أقل' : 'عرض المزيد'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

