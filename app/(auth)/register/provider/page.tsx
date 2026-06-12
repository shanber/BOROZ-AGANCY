'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, UserCircle2, Briefcase, Link as LinkIcon, CheckCircle, ArrowRight, ArrowLeft, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import PhoneInput from '@/app/components/ui/PhoneInput';
import { getCountryByCode, normalizePhoneNumber } from '@/app/lib/phone';

interface Service {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
}

interface Category {
  id: string;
  nameAr: string;
  slug: string;
  services: Service[];
}

interface PortfolioItem {
  title: string;
  description: string;
  projectUrl: string;
  serviceId?: string;
}

const UI_SERVICE_GROUPS: Record<string, { title: string; description: string; slugs: string[] }[]> = {
  'storefront-development': [
    { title: 'تصميم وتخصيص واجهات المتجر', description: 'تصميم وتخصيص واجهات سلة', slugs: ['salla-storefront-customization', 'store-interface-modification', 'create-custom-sections', 'mobile-experience-optimization'] },
    { title: 'حلول CSS و JavaScript', description: 'تخصيص متقدم وبرمجة واجهات', slugs: ['css-customization', 'js-customization', 'interface-bug-fixing'] },
    { title: 'تحسين تجربة المستخدم والتحويل UX/CRO', description: 'تحسين تجربة العميل وزيادة التحويلات', slugs: ['ux-optimization', 'cro-optimization', 'product-page-optimization', 'cart-checkout-optimization'] }
  ],
  'content-optimization': [
    { title: 'كتابة محتوى المتجر', description: 'وصف المنتجات والصفحات الأساسية', slugs: ['product-description-writing', 'seo-product-descriptions', 'about-us-page-writing', 'faq-writing', 'company-profile-writing'] },
    { title: 'محتوى السياسات والصفحات الرسمية', description: 'السياسات والأحكام القانونية', slugs: ['privacy-policy-writing', 'return-policy-writing', 'terms-conditions-writing'] },
    { title: 'محتوى SEO', description: 'مقالات وتحسين محتوى للبحث', slugs: ['seo-articles-writing', 'current-content-optimization'] }
  ],
  'marketing-growth': [
    { title: 'إعلانات المتاجر', description: 'إدارة وإطلاق الحملات الإعلانية', slugs: ['google-ads', 'meta-ads', 'tiktok-ads', 'snapchat-ads', 'retargeting-campaigns'] },
    { title: 'التسويق المباشر وإدارة الحملات', description: 'التسويق عبر الإيميل والواتساب', slugs: ['email-marketing', 'whatsapp-marketing'] },
    { title: 'التحليلات والتتبع Analytics & Tracking', description: 'ربط أدوات التحليل وتتبع التحويلات', slugs: ['google-analytics', 'google-tag-manager', 'google-search-console', 'microsoft-clarity', 'conversion-tracking', 'events-analytics', 'performance-reporting'] }
  ],
  'design-identity': [
    { title: 'تصميم المتجر والبنرات', description: 'تصميم البنرات وواجهات المتجر وصفحات الهبوط', slugs: ['store-banners-design', 'store-ui-design', 'landing-page-design', 'digital-ads-design'] },
    { title: 'الهوية البصرية للمتجر', description: 'تصميم الشعار والهوية البصرية', slugs: ['visual-identity-design', 'logo-design', 'brand-guidelines-setup'] },
    { title: 'تصاميم المحتوى والمنتجات', description: 'تصميم سوشيال ميديا ومنتجات رقمية', slugs: ['social-media-posts-design', 'infographic-design', 'digital-products-covers-design'] }
  ],
  'media-production': [
    { title: 'تصوير وتحسين الصور', description: 'تصوير المنتجات وتحسين الصور التجارية', slugs: ['product-photography', 'product-photo-editing', 'commercial-photos-optimization'] },
    { title: 'الفيديو والمحتوى المرئي', description: 'إنتاج ومونتاج الفيديو والموشن جرافيك', slugs: ['short-video-production', 'video-editing', 'motion-graphics', 'ad-content-production', 'marketing-content-shooting'] }
  ],
  'automation-integrations': [
    { title: 'أتمتة سير العمل', description: 'أتمتة العمليات اليومية للمتجر', slugs: ['workflow-automation', 'build-automation-flows'] },
    { title: 'ربط أدوات المتجر والخدمات الخارجية', description: 'تكامل مع التطبيقات وأنظمة CRM', slugs: ['apps-services-integration', 'webhooks-setup', 'crm-integrations', 'email-integrations', 'whatsapp-business-integrations', 'salla-integrations'] }
  ]
};

export default function ProviderRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    portfolioUrl: '',
    linkedinUrl: '',
    specialtyTitle: '',
    yearsOfExperience: '',
    bio: '',
    agreeTerms: false,
  });

  const [countryCode, setCountryCode] = useState('SA');
  const [localPhone, setLocalPhone] = useState('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [newItem, setNewItem] = useState({ title: '', description: '', projectUrl: '', serviceId: '' });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0) {
            setExpandedCategories([data.categories[0].id]);
          }
        }
      })
      .catch(err => console.error('Error fetching services:', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
    );
  };

  const toggleGroup = (serviceIds: string[]) => {
    const allSelected = serviceIds.length > 0 && serviceIds.every(id => selectedServices.includes(id));
    if (allSelected) {
      setSelectedServices(prev => prev.filter(id => !serviceIds.includes(id)));
    } else {
      setSelectedServices(prev => {
        const newSet = new Set([...prev, ...serviceIds]);
        return Array.from(newSet);
      });
    }
  };

  const addPortfolioItem = () => {
    if (!newItem.title || !newItem.description) return;
    setPortfolioItems(prev => [...prev, newItem]);
    setNewItem({ title: '', description: '', projectUrl: '', serviceId: '' });
  };

  const removePortfolioItem = (index: number) => {
    setPortfolioItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    setError('');
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('يرجى تعبئة كافة الحقول المطلوبة.');
        return;
      }
      if (formData.email.length < 5) {
        setError('البريد الإلكتروني غير صحيح.');
        return;
      }
      if (formData.password.length < 8) {
        setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('كلمات المرور غير متطابقة.');
        return;
      }
      // Phone is optional; validate only when provided
      if (localPhone.trim()) {
        const dialCode = getCountryByCode(countryCode).dialCode;
        if (!normalizePhoneNumber(dialCode, localPhone)) {
          setError('رقم الجوال غير صحيح.');
          return;
        }
      }
    } else if (currentStep === 2) {
      if (!formData.specialtyTitle || !formData.yearsOfExperience) {
        setError('يرجى تعبئة كافة الحقول المطلوبة.');
        return;
      }
    } else if (currentStep === 3) {
      if (selectedServices.length === 0) {
        setError('يرجى اختيار خدمة واحدة على الأقل.');
        return;
      }
    } else if (currentStep === 4) {
      const hasLink = formData.portfolioUrl.trim() !== '' || formData.linkedinUrl.trim() !== '';
      if (!hasLink && portfolioItems.length === 0) {
        setError('يرجى إضافة عمل سابق واحد على الأقل أو رابط يوضح خبرتك.');
        return;
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!formData.agreeTerms) {
      setError('يجب الموافقة على الشروط والأحكام لإرسال الطلب.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register/provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: localPhone.trim()
            ? normalizePhoneNumber(getCountryByCode(countryCode).dialCode, localPhone)
            : '',
          portfolioUrl: formData.portfolioUrl,
          linkedinUrl: formData.linkedinUrl,
          specialtyTitle: formData.specialtyTitle,
          yearsOfExperience: formData.yearsOfExperience,
          bio: formData.bio,
          services: selectedServices.map(id => ({ serviceId: id })),
          portfolioItems: portfolioItems,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ غير متوقع');
      }

      setSuccess('✅ تم إنشاء الحساب بنجاح! جاري التوجيه...');
      
      setTimeout(() => {
        router.push('/login?registered=true');
      }, 1500);

    } catch (err: any) {
      setError('❌ ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get selected service name
  const getServiceName = (id: string) => {
    for (const cat of categories) {
      const srv = cat.services.find(s => s.id === id);
      if (srv) return srv.nameAr;
    }
    return 'خدمة غير معروفة';
  };

  const steps = [
    'الحساب',
    'المجال والخبرة',
    'المسارات والخدمات',
    'الأعمال السابقة',
    'المراجعة والإرسال'
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col p-4 items-center" dir="rtl">
      
      {/* Header */}
      <div className="w-full max-w-4xl py-6 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-3">
            <Image src="/شعار%20بروز.svg" alt="بروز" width={100} height={32} className="h-8 w-auto object-contain brightness-0" />
          </div>
        </Link>
        <Link href="/register" className="text-slate-500 hover:text-[#06B6D4] flex items-center gap-2">
          العودة
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden mb-12">
        <div className="bg-[#0B132B] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#06B6D4] opacity-20 rounded-full blur-3xl" />
          <h1 className="text-3xl font-bold text-white mb-2 relative z-10">
            قدّم طلب الانضمام كمقدم خدمة في بروز
          </h1>
          <p className="text-slate-300 relative z-10">
            اختر المسارات أو الخدمات التي تقدمها، وأرفق نماذج من أعمالك لمراجعة طلبك.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-4 sm:px-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
            {steps.map((stepLabel, idx) => {
              const stepNumber = idx + 1;
              const isActive = stepNumber === currentStep;
              const isPast = stepNumber < currentStep;
              return (
                <div key={idx} className="flex flex-col items-center gap-2 relative z-10 bg-slate-50 px-2 sm:px-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                    isActive ? 'bg-[#06B6D4] border-[#06B6D4] text-white' : 
                    isPast ? 'bg-[#0B132B] border-[#0B132B] text-white' : 
                    'bg-white border-slate-300 text-slate-400'
                  }`}>
                    {isPast ? <CheckCircle size={16} /> : stepNumber}
                  </div>
                  <span className={`text-xs sm:text-sm font-medium hidden sm:block ${
                    isActive ? 'text-[#06B6D4]' : 
                    isPast ? 'text-[#0B132B]' : 
                    'text-slate-400'
                  }`}>
                    {stepLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 sm:p-10">
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <CheckCircle size={20} className="text-green-600" />
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-[#0B132B] mb-6">المعلومات الشخصية والحساب</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">الاسم الكامل *</label>
                  <div className="relative">
                    <input type="text" name="name" placeholder="اسمك الكامل" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 pr-11 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06B6D4] text-slate-900" />
                    <UserCircle2 size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">البريد الإلكتروني *</label>
                  <div className="relative">
                    <input type="email" name="email" placeholder="example@domain.com" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 pr-11 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06B6D4] text-slate-900" />
                    <Mail size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">كلمة المرور *</label>
                  <div className="relative">
                    <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 pr-11 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06B6D4] text-slate-900" />
                    <Lock size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">تأكيد كلمة المرور *</label>
                  <div className="relative">
                    <input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 pr-11 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06B6D4] text-slate-900" />
                    <Lock size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">رقم الجوال (اختياري)</label>
                  <PhoneInput
                    countryCode={countryCode}
                    onCountryChange={setCountryCode}
                    value={localPhone}
                    onChange={setLocalPhone}
                    placeholder="5xxxxxxxx"
                  />
                  <p className="text-xs text-slate-400 mt-1">يمكنك استخدامه لتسجيل الدخول لاحقًا.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-[#0B132B] mb-6">التخصص والخبرة</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">المسمى المهني الأساسي *</label>
                  <div className="relative">
                    <input type="text" name="specialtyTitle" placeholder="مثال: مطور متاجر سلة، أخصائي تسويق..." value={formData.specialtyTitle} onChange={handleChange} className="w-full px-4 py-3 pr-11 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06B6D4] text-slate-900" />
                    <Briefcase size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">سنوات الخبرة *</label>
                  <div className="relative">
                    <input type="number" name="yearsOfExperience" placeholder="مثال: 3" min="0" value={formData.yearsOfExperience} onChange={handleChange} className="w-full px-4 py-3 pr-11 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06B6D4] text-slate-900" />
                    <Briefcase size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">نبذة عنك (اختياري)</label>
                  <textarea name="bio" placeholder="تحدث باختصار عن خبراتك ومهاراتك وما يميزك كمستقل..." value={formData.bio} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06B6D4] text-slate-900" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-[#0B132B]">المسارات والخدمات</h2>
                <span className="text-sm font-medium px-4 py-1.5 bg-[#06B6D4]/10 text-[#06B6D4] rounded-full">
                  تم تحديد ({selectedServices.length}) خدمة
                </span>
              </div>
              <p className="text-slate-500 mb-6">حدد الخدمات التي يمكنك تقديمها. يرجى اختيار خدمة واحدة على الأقل للاستمرار.</p>
              
              <div className="space-y-4">
                {categories.map((cat) => {
                  const isExpanded = expandedCategories.includes(cat.id);
                  const selectedInCat = cat.services.filter(s => selectedServices.includes(s.id)).length;
                  
                  return (
                    <div key={cat.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg text-[#0B132B]">{cat.nameAr}</span>
                          {selectedInCat > 0 && (
                            <span className="text-xs font-semibold bg-[#06B6D4] text-white px-2.5 py-1 rounded-full">
                              {selectedInCat} محددة
                            </span>
                          )}
                        </div>
                        {isExpanded ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
                      </button>
                      
                      {isExpanded && (
                        <div className="p-5 space-y-8 bg-white">
                          {(() => {
                            const uiGroups = UI_SERVICE_GROUPS[cat.slug] || [];
                            const renderedServiceIds = new Set<string>();
                            
                            const groupsToRender = uiGroups.map(uiGroup => {
                              const groupServices = cat.services.filter(s => uiGroup.slugs.includes(s.slug));
                              groupServices.forEach(s => renderedServiceIds.add(s.id));
                              return { ...uiGroup, services: groupServices };
                            }).filter(g => g.services.length > 0);

                            const otherServices = cat.services.filter(s => !renderedServiceIds.has(s.id));
                            if (otherServices.length > 0) {
                              groupsToRender.push({ title: 'خدمات إضافية', description: 'خدمات أخرى في هذا القسم', slugs: [], services: otherServices });
                            }

                            if (groupsToRender.length === 0) {
                              groupsToRender.push({ title: 'جميع الخدمات', description: '', slugs: [], services: cat.services });
                            }

                            return groupsToRender.map((group, gIdx) => {
                              const groupServiceIds = group.services.map(s => s.id);
                              const isAllSelected = groupServiceIds.length > 0 && groupServiceIds.every(id => selectedServices.includes(id));
                              const selectedInGroup = groupServiceIds.filter(id => selectedServices.includes(id)).length;
                              const isPartiallySelected = selectedInGroup > 0 && !isAllSelected;

                              return (
                                <div key={gIdx} className="bg-slate-50/50 border border-slate-200 rounded-xl p-5">
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-200">
                                    <div>
                                      <h4 className="font-bold text-lg text-slate-800">{group.title}</h4>
                                      {group.description && <p className="text-sm text-slate-500 mt-1">{group.description}</p>}
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                      <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                        {selectedInGroup} / {group.services.length} محددة
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => toggleGroup(groupServiceIds)}
                                        className={`text-sm px-4 py-2 rounded-lg border transition-all flex items-center justify-center font-medium ${
                                          isAllSelected
                                            ? 'bg-[#0B132B] text-white border-[#0B132B] hover:bg-slate-800'
                                            : isPartiallySelected
                                              ? 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/30 hover:bg-[#06B6D4]/20'
                                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                                        }`}
                                      >
                                        {isAllSelected ? 'إلغاء تحديد كل خدمات هذا المسار' : 'تحديد كل خدمات هذا المسار'}
                                      </button>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {group.services.map(srv => {
                                      const isSelected = selectedServices.includes(srv.id);
                                      return (
                                        <label
                                          key={srv.id}
                                          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                                            isSelected 
                                              ? 'border-[#06B6D4] bg-[#06B6D4]/5 shadow-sm' 
                                              : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                                          }`}
                                        >
                                          <div className="mt-0.5 shrink-0">
                                            <input
                                              type="checkbox"
                                              checked={isSelected}
                                              onChange={() => toggleService(srv.id)}
                                              className="w-5 h-5 rounded text-[#06B6D4] focus:ring-[#06B6D4] border-slate-300 cursor-pointer"
                                            />
                                          </div>
                                          <span className={`text-sm leading-snug pt-0.5 ${isSelected ? 'font-bold text-[#0B132B]' : 'font-medium text-slate-700'}`}>
                                            {srv.nameAr}
                                          </span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-[#0B132B] mb-2">الأعمال السابقة (إلزامي)</h2>
              <p className="text-slate-500 mb-6">
                أضف عملًا سابقًا واحدًا على الأقل، أو رابط معرض أعمالك لمساعدة فريق بروز في مراجعة طلبك واعتمادك كمقدم خدمة.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">رابط معرض الأعمال (Behance, Dribbble...)</label>
                  <div className="relative">
                    <input type="url" name="portfolioUrl" placeholder="https://..." value={formData.portfolioUrl} onChange={handleChange} className="w-full px-4 py-3 pr-11 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06B6D4]" />
                    <LinkIcon size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">رابط حساب LinkedIn</label>
                  <div className="relative">
                    <input type="url" name="linkedinUrl" placeholder="https://linkedin.com/in/..." value={formData.linkedinUrl} onChange={handleChange} className="w-full px-4 py-3 pr-11 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06B6D4]" />
                    <LinkIcon size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Added Portfolio Items List */}
              {portfolioItems.length > 0 && (
                <div className="mb-8 space-y-4">
                  <h3 className="text-lg font-bold text-[#0B132B]">الأعمال المضافة ({portfolioItems.length}):</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {portfolioItems.map((item, index) => (
                      <div key={index} className="flex flex-col bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
                        <button type="button" onClick={() => removePortfolioItem(index)} className="absolute top-4 left-4 text-slate-400 hover:text-red-500 transition-colors p-1">
                          <Trash2 size={18} />
                        </button>
                        <h4 className="font-bold text-[#0B132B] mb-1 pr-6">{item.title}</h4>
                        <p className="text-sm text-slate-500 mb-3">{item.description}</p>
                        {item.serviceId && (
                          <div className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-md self-start mb-3 font-medium">
                            مرتبط بـ: {getServiceName(item.serviceId)}
                          </div>
                        )}
                        {item.projectUrl && (
                          <a href={item.projectUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#06B6D4] hover:text-[#0B132B] flex items-center gap-1 mt-auto">
                            <LinkIcon size={14} /> عرض المشروع
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Portfolio Item Form */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-bold text-[#0B132B] mb-4">إضافة عمل سابق جديد</h3>
                <p className="text-sm text-slate-500 mb-5">اربط كل عمل سابق بالخدمة الأقرب له حتى نتمكن من مراجعة خبرتك بدقة.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">عنوان العمل *</label>
                    <input type="text" placeholder="مثال: تصميم متجر إلكتروني لمطعم" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06B6D4]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">وصف العمل *</label>
                    <textarea placeholder="وصف مختصر لدورك وما أنجزته في هذا العمل..." value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06B6D4]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">رابط المشروع (اختياري)</label>
                    <input type="url" placeholder="https://..." value={newItem.projectUrl} onChange={(e) => setNewItem({ ...newItem, projectUrl: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06B6D4]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">الخدمة المرتبطة (اختياري)</label>
                    <select value={newItem.serviceId} onChange={(e) => setNewItem({ ...newItem, serviceId: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06B6D4]">
                      <option value="">اختر خدمة لربطها بهذا العمل</option>
                      {selectedServices.map(id => (
                        <option key={id} value={id}>{getServiceName(id)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-5 flex justify-end">
                  <button type="button" onClick={addPortfolioItem} disabled={!newItem.title || !newItem.description} className="flex items-center gap-2 bg-[#0B132B] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors">
                    <Plus size={18} />
                    إضافة إلى طلبك
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#06B6D4]/10 text-[#06B6D4] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-[#0B132B] mb-2">المراجعة والإرسال</h2>
                <p className="text-slate-500">راجع ملخص طلبك قبل الإرسال النهائي لفريق بروز.</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-6 border-b border-slate-200">
                  <div>
                    <span className="block text-sm text-slate-500 mb-1">الاسم الكامل</span>
                    <strong className="text-[#0B132B]">{formData.name}</strong>
                  </div>
                  <div>
                    <span className="block text-sm text-slate-500 mb-1">البريد الإلكتروني</span>
                    <strong className="text-[#0B132B] truncate block" title={formData.email}>{formData.email}</strong>
                  </div>
                  <div>
                    <span className="block text-sm text-slate-500 mb-1">المجال المهني</span>
                    <strong className="text-[#0B132B]">{formData.specialtyTitle}</strong>
                  </div>
                  <div>
                    <span className="block text-sm text-slate-500 mb-1">سنوات الخبرة</span>
                    <strong className="text-[#0B132B]">{formData.yearsOfExperience} سنوات</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-200">
                  <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <span className="block text-sm text-slate-500 mb-3">الخدمات المحددة ({selectedServices.length})</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedServices.slice(0, 5).map(id => (
                        <span key={id} className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                          {getServiceName(id)}
                        </span>
                      ))}
                      {selectedServices.length > 5 && (
                        <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md">
                          +{selectedServices.length - 5} أكثر
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <span className="block text-sm text-slate-500 mb-3">معرض الأعمال ({portfolioItems.length})</span>
                    <div className="space-y-2">
                      {formData.portfolioUrl && (
                        <a href={formData.portfolioUrl} target="_blank" rel="noreferrer" className="text-sm flex items-center gap-2 text-[#06B6D4] hover:underline">
                          <LinkIcon size={14} /> رابط معرض الأعمال
                        </a>
                      )}
                      {formData.linkedinUrl && (
                        <a href={formData.linkedinUrl} target="_blank" rel="noreferrer" className="text-sm flex items-center gap-2 text-[#06B6D4] hover:underline">
                          <LinkIcon size={14} /> حساب LinkedIn
                        </a>
                      )}
                      {portfolioItems.slice(0, 3).map((p, i) => (
                        <div key={i} className="text-sm text-slate-700 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#0B132B]"></div> {p.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <label className="flex items-start gap-3 cursor-pointer p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-[#06B6D4] transition-colors">
                  <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 mt-0.5 text-[#06B6D4] focus:ring-[#06B6D4]" />
                  <span className="text-sm text-slate-700 font-medium leading-relaxed">
                    أتعهد بصحة المعلومات والأعمال المقدمة، وأوافق على{' '}
                    <Link href="/terms" className="text-[#06B6D4] font-bold hover:underline" target="_blank">
                      شروط الخدمة
                    </Link>{' '}
                    و{' '}
                    <Link href="/privacy" className="text-[#06B6D4] font-bold hover:underline" target="_blank">
                      سياسة الخصوصية
                    </Link>
                    {' '}الخاصة بمنصة بروز، وأقر بأن حسابي سيخضع للمراجعة من قبل الإدارة.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-200">
            {currentStep > 1 ? (
              <button type="button" onClick={handlePrev} className="flex items-center gap-2 text-slate-600 font-bold hover:text-[#0B132B] px-6 py-3 rounded-xl transition-colors hover:bg-slate-100">
                <ArrowRight size={20} />
                السابق
              </button>
            ) : <div></div>}

            {currentStep < totalSteps ? (
              <button type="button" onClick={handleNext} className="flex items-center gap-2 bg-[#0B132B] text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md">
                التالي
                <ArrowLeft size={20} />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={isLoading || !formData.agreeTerms} className="flex items-center gap-2 bg-[#06B6D4] text-white px-10 py-3 rounded-xl font-bold hover:bg-cyan-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-lg">
                {isLoading ? 'جاري الإرسال...' : 'إرسال طلب المراجعة'}
              </button>
            )}
          </div>

          {currentStep === 1 && (
            <p className="text-center text-slate-500 mt-8">
              لديك حساب بالفعل؟{' '}
              <Link href="/login" className="text-[#0B132B] font-bold hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
