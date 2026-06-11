import prisma from './prisma';

// ============================================================================
// BOROZ — Service taxonomy & provider-driven availability (read-only helpers)
// ----------------------------------------------------------------------------
// `getRequestableServices()` reads the canonical taxonomy from the database and
// flags each service with `isAvailable` based ONLY on real approved-provider
// coverage. No fake availability: a service with zero approved providers
// returns `isAvailable: false`.
//
// `resolveServiceLabel()` is a synchronous, crash-proof slug→Arabic-label
// resolver that also tolerates legacy/free-text values.
// ============================================================================

// ── Types ───────────────────────────────────────────────────────────────────

export interface RequestableService {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  isAvailable: boolean;
  approvedProviderCount: number;
}

export interface RequestableCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  services: RequestableService[];
}

// ── Provider-driven availability (DB, read-only) ────────────────────────────

/**
 * Returns the active service taxonomy grouped by category, with each service
 * flagged for availability based on approved-provider coverage.
 *
 * `isAvailable` is true only when at least one `ExpertService` exists where:
 *   - ExpertService.isActive = true
 *   - the owning ExpertProfile.approvalStatus = 'APPROVED'
 *
 * DISABLED services are excluded entirely (admin override); all other active
 * services are returned so the request form can show unavailable ones clearly
 * instead of hiding them.
 */
export async function getRequestableServices(): Promise<RequestableCategory[]> {
  const categories = await prisma.serviceCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      services: {
        where: {
          isActive: true,
          status: { not: 'DISABLED' },
        },
        orderBy: { sortOrder: 'asc' },
        include: {
          _count: {
            select: {
              // Filtered relation count → number of APPROVED providers
              // actively offering this service.
              expertServices: {
                where: {
                  isActive: true,
                  expert: { approvalStatus: 'APPROVED' },
                },
              },
            },
          },
        },
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    nameAr: category.nameAr,
    nameEn: category.nameEn,
    slug: category.slug,
    services: category.services.map((service) => {
      const approvedProviderCount = service._count.expertServices;
      return {
        id: service.id,
        slug: service.slug,
        nameAr: service.nameAr,
        nameEn: service.nameEn,
        approvedProviderCount,
        isAvailable: approvedProviderCount > 0,
      };
    }),
  }));
}

// ── Label resolution (synchronous, crash-proof) ─────────────────────────────

/**
 * Canonical service slug → Arabic label.
 * Mirrors the seeded taxonomy (prisma/seed-services.js). Kept as a static map
 * so labels resolve synchronously and never require a DB round-trip.
 */
const CANONICAL_SERVICE_LABELS: Record<string, string> = {
  // Storefront Development & Customization
  'salla-storefront-customization': 'تخصيص واجهات متاجر سلة',
  'css-customization': 'تخصيص CSS',
  'js-customization': 'تخصيص JavaScript',
  'store-interface-modification': 'تعديل واجهة المتجر',
  'create-custom-sections': 'إنشاء أقسام مخصصة',
  'product-page-optimization': 'تحسين صفحة المنتج',
  'cart-checkout-optimization': 'تحسين صفحات المنتج والسلة وتجربة الشراء',
  'ux-optimization': 'تحسين تجربة المستخدم UX',
  'cro-optimization': 'تحسين التحويلات CRO',
  'mobile-experience-optimization': 'تحسين تجربة الجوال',
  'interface-bug-fixing': 'إصلاح مشاكل الواجهة',
  // Content & Optimization
  'product-description-writing': 'كتابة وصف المنتجات',
  'seo-product-descriptions': 'كتابة وصف منتجات متوافق مع SEO',
  'landing-page-copywriting': 'كتابة محتوى صفحات الهبوط',
  'about-us-page-writing': 'كتابة صفحة من نحن',
  'privacy-policy-writing': 'كتابة سياسة الخصوصية',
  'return-policy-writing': 'كتابة سياسة الاستبدال والاسترجاع',
  'terms-conditions-writing': 'كتابة الشروط والأحكام',
  'faq-writing': 'كتابة الأسئلة الشائعة',
  'company-profile-writing': 'كتابة صفحات تعريفية',
  'seo-articles-writing': 'كتابة مقالات SEO',
  'current-content-optimization': 'تحسين المحتوى الحالي',
  // Marketing & Growth
  'seo-services': 'تحسين محركات البحث SEO',
  'google-ads': 'Google Ads',
  'meta-ads': 'Meta Ads',
  'tiktok-ads': 'TikTok Ads',
  'snapchat-ads': 'Snapchat Ads',
  'email-marketing': 'Email Marketing',
  'whatsapp-marketing': 'WhatsApp Marketing',
  'google-analytics': 'Google Analytics',
  'google-tag-manager': 'Google Tag Manager',
  'google-search-console': 'Google Search Console',
  'microsoft-clarity': 'Microsoft Clarity',
  'conversion-tracking': 'إعداد تتبع التحويلات',
  'events-analytics': 'إعداد Events Analytics',
  'performance-reporting': 'تقارير الأداء',
  'retargeting-campaigns': 'إعادة الاستهداف Retargeting',
  // Design & Identity
  'store-banners-design': 'تصميم بنرات المتجر',
  'visual-identity-design': 'تصميم هوية بصرية',
  'logo-design': 'تصميم شعار',
  'social-media-posts-design': 'تصميم منشورات سوشيال ميديا',
  'landing-page-design': 'تصميم صفحة هبوط',
  'store-ui-design': 'تصميم واجهات المتجر UI',
  'infographic-design': 'تصميم إنفوجرافيك',
  'digital-products-covers-design': 'تصميم أغلفة ومنتجات رقمية',
  'digital-ads-design': 'تصميم إعلانات رقمية',
  'brand-guidelines-setup': 'إعداد دليل هوية بصرية',
  // Media & Production
  'product-photography': 'تصوير منتجات',
  'product-photo-editing': 'تعديل صور المنتجات',
  'commercial-photos-optimization': 'تحسين الصور التجارية',
  'short-video-production': 'إنتاج فيديوهات قصيرة',
  'video-editing': 'مونتاج فيديو',
  'motion-graphics': 'موشن جرافيك',
  'ad-content-production': 'إنتاج محتوى إعلاني',
  'marketing-content-shooting': 'تصوير محتوى تسويقي',
  // Automation & Integrations
  'workflow-automation': 'أتمتة سير العمل',
  'apps-services-integration': 'ربط التطبيقات والخدمات',
  'salla-integrations': 'ربط أدوات متوافقة مع متاجر سلة',
  'crm-integrations': 'تكاملات CRM',
  'email-integrations': 'تكاملات البريد الإلكتروني',
  'whatsapp-business-integrations': 'تكاملات WhatsApp Business',
  'webhooks-setup': 'Webhooks',
  'build-automation-flows': 'بناء Automation Flows',
};

/**
 * Legacy demo-data service keys → Arabic labels. Retained so historical orders
 * created before the canonical taxonomy still display a friendly label.
 */
const LEGACY_SERVICE_LABELS: Record<string, string> = {
  branding: 'تصميم الهوية البصرية',
  'salla-customize': 'تخصيص متجر سلة',
  'ui-design': 'تصميم واجهات المتجر',
  marketing: 'إدارة الحملات الإعلانية',
  seo: 'تحسين SEO',
  content: 'كتابة المحتوى التسويقي',
  dev: 'تطوير وتحسين المتجر',
  other: 'خدمة أخرى',
};

/**
 * Resolves a service identifier to an Arabic display label.
 *
 * Resolution order: canonical slug → legacy key → original value (trimmed).
 * Free-text Arabic values (e.g. older concatenated entries) are returned as-is.
 * Never throws; returns a safe fallback for empty/unknown input.
 */
export function resolveServiceLabel(slugOrLegacy?: string | null): string {
  if (slugOrLegacy === null || slugOrLegacy === undefined) {
    return 'خدمة غير محددة';
  }

  const value = String(slugOrLegacy).trim();
  if (!value) {
    return 'خدمة غير محددة';
  }

  return CANONICAL_SERVICE_LABELS[value] || LEGACY_SERVICE_LABELS[value] || value;
}
