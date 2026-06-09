const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  {
    nameAr: 'تطوير وتخصيص المتاجر',
    nameEn: 'Storefront Development & Customization',
    slug: 'storefront-development',
    sortOrder: 10,
    services: [
      { nameAr: 'تخصيص واجهات متاجر سلة', nameEn: 'Salla Storefront Customization', slug: 'salla-storefront-customization' },
      { nameAr: 'تخصيص CSS', nameEn: 'CSS Customization', slug: 'css-customization' },
      { nameAr: 'تخصيص JavaScript', nameEn: 'JavaScript Customization', slug: 'js-customization' },
      { nameAr: 'تعديل واجهة المتجر', nameEn: 'Store Interface Modification', slug: 'store-interface-modification' },
      { nameAr: 'إنشاء أقسام مخصصة', nameEn: 'Create Custom Sections', slug: 'create-custom-sections' },
      { nameAr: 'تحسين صفحة المنتج', nameEn: 'Product Page Optimization', slug: 'product-page-optimization' },
      { nameAr: 'تحسين صفحات المنتج والسلة وتجربة الشراء', nameEn: 'Cart & Checkout Optimization', slug: 'cart-checkout-optimization' },
      { nameAr: 'تحسين تجربة المستخدم UX', nameEn: 'UX Optimization', slug: 'ux-optimization' },
      { nameAr: 'تحسين التحويلات CRO', nameEn: 'CRO Optimization', slug: 'cro-optimization' },
      { nameAr: 'تحسين تجربة الجوال', nameEn: 'Mobile Experience Optimization', slug: 'mobile-experience-optimization' },
      { nameAr: 'إصلاح مشاكل الواجهة', nameEn: 'Interface Bug Fixing', slug: 'interface-bug-fixing' },
    ]
  },
  {
    nameAr: 'المحتوى والتحسين',
    nameEn: 'Content & Optimization',
    slug: 'content-optimization',
    sortOrder: 20,
    services: [
      { nameAr: 'كتابة وصف المنتجات', nameEn: 'Product Description Writing', slug: 'product-description-writing' },
      { nameAr: 'كتابة وصف منتجات متوافق مع SEO', nameEn: 'SEO Optimized Product Descriptions', slug: 'seo-product-descriptions' },
      { nameAr: 'كتابة محتوى صفحات الهبوط', nameEn: 'Landing Page Copywriting', slug: 'landing-page-copywriting' },
      { nameAr: 'كتابة صفحة من نحن', nameEn: 'About Us Page Writing', slug: 'about-us-page-writing' },
      { nameAr: 'كتابة سياسة الخصوصية', nameEn: 'Privacy Policy Writing', slug: 'privacy-policy-writing' },
      { nameAr: 'كتابة سياسة الاستبدال والاسترجاع', nameEn: 'Return Policy Writing', slug: 'return-policy-writing' },
      { nameAr: 'كتابة الشروط والأحكام', nameEn: 'Terms & Conditions Writing', slug: 'terms-conditions-writing' },
      { nameAr: 'كتابة الأسئلة الشائعة', nameEn: 'FAQ Writing', slug: 'faq-writing' },
      { nameAr: 'كتابة صفحات تعريفية', nameEn: 'Company Profile Writing', slug: 'company-profile-writing' },
      { nameAr: 'كتابة مقالات SEO', nameEn: 'SEO Articles Writing', slug: 'seo-articles-writing' },
      { nameAr: 'تحسين المحتوى الحالي', nameEn: 'Current Content Optimization', slug: 'current-content-optimization' },
    ]
  },
  {
    nameAr: 'التسويق والنمو',
    nameEn: 'Marketing & Growth',
    slug: 'marketing-growth',
    sortOrder: 30,
    services: [
      { nameAr: 'تحسين محركات البحث SEO', nameEn: 'SEO Services', slug: 'seo-services' },
      { nameAr: 'Google Ads', nameEn: 'Google Ads', slug: 'google-ads' },
      { nameAr: 'Meta Ads', nameEn: 'Meta Ads', slug: 'meta-ads' },
      { nameAr: 'TikTok Ads', nameEn: 'TikTok Ads', slug: 'tiktok-ads' },
      { nameAr: 'Snapchat Ads', nameEn: 'Snapchat Ads', slug: 'snapchat-ads' },
      { nameAr: 'Email Marketing', nameEn: 'Email Marketing', slug: 'email-marketing' },
      { nameAr: 'WhatsApp Marketing', nameEn: 'WhatsApp Marketing', slug: 'whatsapp-marketing' },
      { nameAr: 'Google Analytics', nameEn: 'Google Analytics Setup', slug: 'google-analytics' },
      { nameAr: 'Google Tag Manager', nameEn: 'Google Tag Manager Setup', slug: 'google-tag-manager' },
      { nameAr: 'Google Search Console', nameEn: 'Google Search Console Setup', slug: 'google-search-console' },
      { nameAr: 'Microsoft Clarity', nameEn: 'Microsoft Clarity Setup', slug: 'microsoft-clarity' },
      { nameAr: 'إعداد تتبع التحويلات', nameEn: 'Conversion Tracking Setup', slug: 'conversion-tracking' },
      { nameAr: 'إعداد Events Analytics', nameEn: 'Events Analytics Setup', slug: 'events-analytics' },
      { nameAr: 'تقارير الأداء', nameEn: 'Performance Reporting', slug: 'performance-reporting' },
      { nameAr: 'إعادة الاستهداف Retargeting', nameEn: 'Retargeting Campaigns', slug: 'retargeting-campaigns' },
    ]
  },
  {
    nameAr: 'التصميم والهوية',
    nameEn: 'Design & Identity',
    slug: 'design-identity',
    sortOrder: 40,
    services: [
      { nameAr: 'تصميم بنرات المتجر', nameEn: 'Store Banners Design', slug: 'store-banners-design' },
      { nameAr: 'تصميم هوية بصرية', nameEn: 'Visual Identity Design', slug: 'visual-identity-design' },
      { nameAr: 'تصميم شعار', nameEn: 'Logo Design', slug: 'logo-design' },
      { nameAr: 'تصميم منشورات سوشيال ميديا', nameEn: 'Social Media Posts Design', slug: 'social-media-posts-design' },
      { nameAr: 'تصميم صفحة هبوط', nameEn: 'Landing Page Design', slug: 'landing-page-design' },
      { nameAr: 'تصميم واجهات المتجر UI', nameEn: 'Store UI Design', slug: 'store-ui-design' },
      { nameAr: 'تصميم إنفوجرافيك', nameEn: 'Infographic Design', slug: 'infographic-design' },
      { nameAr: 'تصميم أغلفة ومنتجات رقمية', nameEn: 'Digital Products Covers Design', slug: 'digital-products-covers-design' },
      { nameAr: 'تصميم إعلانات رقمية', nameEn: 'Digital Ads Design', slug: 'digital-ads-design' },
      { nameAr: 'إعداد دليل هوية بصرية', nameEn: 'Brand Guidelines Setup', slug: 'brand-guidelines-setup' },
    ]
  },
  {
    nameAr: 'الميديا والإنتاج',
    nameEn: 'Media & Production',
    slug: 'media-production',
    sortOrder: 50,
    services: [
      { nameAr: 'تصوير منتجات', nameEn: 'Product Photography', slug: 'product-photography' },
      { nameAr: 'تعديل صور المنتجات', nameEn: 'Product Photo Editing', slug: 'product-photo-editing' },
      { nameAr: 'تحسين الصور التجارية', nameEn: 'Commercial Photos Optimization', slug: 'commercial-photos-optimization' },
      { nameAr: 'إنتاج فيديوهات قصيرة', nameEn: 'Short Video Production', slug: 'short-video-production' },
      { nameAr: 'مونتاج فيديو', nameEn: 'Video Editing', slug: 'video-editing' },
      { nameAr: 'موشن جرافيك', nameEn: 'Motion Graphics', slug: 'motion-graphics' },
      { nameAr: 'إنتاج محتوى إعلاني', nameEn: 'Ad Content Production', slug: 'ad-content-production' },
      { nameAr: 'تصوير محتوى تسويقي', nameEn: 'Marketing Content Shooting', slug: 'marketing-content-shooting' },
    ]
  },
  {
    nameAr: 'الأتمتة والربط',
    nameEn: 'Automation & Integrations',
    slug: 'automation-integrations',
    sortOrder: 60,
    services: [
      { nameAr: 'أتمتة سير العمل', nameEn: 'Workflow Automation', slug: 'workflow-automation' },
      { nameAr: 'ربط التطبيقات والخدمات', nameEn: 'Apps & Services Integration', slug: 'apps-services-integration' },
      { nameAr: 'ربط أدوات متوافقة مع متاجر سلة', nameEn: 'Salla Integrations', slug: 'salla-integrations' },
      { nameAr: 'تكاملات CRM', nameEn: 'CRM Integrations', slug: 'crm-integrations' },
      { nameAr: 'تكاملات البريد الإلكتروني', nameEn: 'Email Integrations', slug: 'email-integrations' },
      { nameAr: 'تكاملات WhatsApp Business', nameEn: 'WhatsApp Business Integrations', slug: 'whatsapp-business-integrations' },
      { nameAr: 'Webhooks', nameEn: 'Webhooks Setup', slug: 'webhooks-setup' },
      { nameAr: 'بناء Automation Flows', nameEn: 'Build Automation Flows', slug: 'build-automation-flows' },
    ]
  }
];

async function main() {
  console.log('Seeding BOROZ Services Taxonomy...');
  
  for (const cat of categories) {
    // 1. Upsert Category
    const categoryRecord = await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.nameAr, // legacy
        nameAr: cat.nameAr,
        nameEn: cat.nameEn,
        sortOrder: cat.sortOrder,
      },
      create: {
        name: cat.nameAr, // legacy
        nameAr: cat.nameAr,
        nameEn: cat.nameEn,
        slug: cat.slug,
        sortOrder: cat.sortOrder,
        isActive: true,
      }
    });

    console.log(`- Upserted Category: ${categoryRecord.nameAr}`);

    // 2. Upsert Services
    let sOrder = 10;
    for (const srv of cat.services) {
      await prisma.service.upsert({
        where: { slug: srv.slug },
        update: {
          name: srv.nameAr, // legacy
          nameAr: srv.nameAr,
          nameEn: srv.nameEn,
          categoryId: categoryRecord.id,
          sortOrder: sOrder,
        },
        create: {
          name: srv.nameAr, // legacy
          nameAr: srv.nameAr,
          nameEn: srv.nameEn,
          slug: srv.slug,
          categoryId: categoryRecord.id,
          sortOrder: sOrder,
          status: 'AVAILABLE',
          isActive: true,
        }
      });
      sOrder += 10;
    }
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
