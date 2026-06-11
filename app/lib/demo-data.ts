export interface Order {
  id: string;
  storeName: string;
  managerName: string;
  phone: string;
  email: string;
  sallaUrl: string;
  serviceKey: string;
  serviceLabel: string;
  status: string;
  statusKey?: string;
  priority: 'عادي' | 'مهم' | 'عاجل';
  date: string;
  price: string;
  description: string;
  notes?: string;
  adminNote?: string;
  createdAt?: string | Date;
  projectId?: string;
  projectStatus?: string;
}

export interface Project {
  name: string;
  client: string;
  progress: number;
  status: 'نشط' | 'متأخر' | 'مكتمل' | 'بانتظار العميل';
  statusColor: string;
  date: string;
  budget: string;
}

export interface Alert {
  title: string;
  desc: string;
  type: 'warning' | 'danger' | 'info';
  iconName: 'AlertCircle' | 'Clock' | 'TrendingUp';
}

export interface Stat {
  label: string;
  value: string;
  change: string;
  iconName: 'ShoppingCart' | 'FolderOpen' | 'DollarSign' | 'Users';
  color: string;
}

export const services = [
  { key: 'branding', label: 'تصميم الهوية البصرية' },
  { key: 'salla-customize', label: 'تخصيص متجر سلة' },
  { key: 'ui-design', label: 'تصميم واجهات المتجر' },
  { key: 'marketing', label: 'إدارة الحملات الإعلانية' },
  { key: 'seo', label: 'تحسين SEO' },
  { key: 'content', label: 'كتابة المحتوى التسويقي' },
  { key: 'dev', label: 'تطوير وتحسين المتجر' },
  { key: 'other', label: 'خدمة أخرى' },
];

export const stats: Stat[] = [
  { label: 'الطلبات النشطة', value: '8', change: '+2 هذا الأسبوع', iconName: 'ShoppingCart', color: 'emerald' },
  { label: 'المشاريع الجارية', value: '6', change: '1 في انتظار المراجعة', iconName: 'FolderOpen', color: 'purple' },
  { label: 'إجمالي الإيرادات', value: '45,000 ر.س', change: '+12% منذ الشهر الماضي', iconName: 'DollarSign', color: 'blue' },
  { label: 'العملاء النشطون', value: '12', change: '+3 عملاء جدد', iconName: 'Users', color: 'amber' },
];

export const alerts: Alert[] = [
  { title: 'رفع متطلبات معلق', desc: 'متجر التمور الراقية لم يرفع ملفات الشعار المطلوب بعد لمشروع الـ SEO.', type: 'warning', iconName: 'AlertCircle' },
  { title: 'تقرير مبيعات شهر مايو', desc: 'تم إعداد التقرير المالي لشهر مايو وهو جاهز للمراجعة من قبل الإدارة.', type: 'info', iconName: 'TrendingUp' },
  { title: 'تسليم الهوية البصرية غداً', desc: 'موعد تسليم المخرجات النهائية لشركة سلة المحدودة يصادف يوم الغد.', type: 'danger', iconName: 'Clock' },
];

export const projects: Project[] = [
  { name: 'تهيئة وتحسين محركات البحث متجر العطور', client: 'متجر العطور الفاخرة', progress: 75, status: 'نشط', statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-100', date: 'منذ أسبوعين', budget: '5,500 ر.س' },
  { name: 'هوية بصرية وتصميم بنرات المتجر الجديد', client: 'شركة سلة المحدودة', progress: 100, status: 'مكتمل', statusColor: 'text-blue-600 bg-blue-50 border-blue-100', date: 'منذ شهر', budget: '12,500 ر.س' },
  { name: 'حملة تسويق موسم الصيف الكبرى', client: 'عبق الشرق للعود', progress: 40, status: 'نشط', statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-100', date: 'منذ 5 أيام', budget: '10,000 ر.س' },
  { name: 'تطوير تطبيق الجوال وتجربة المستخدم', client: 'متجر التمور الراقية', progress: 15, status: 'نشط', statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-100', date: 'منذ يومين', budget: '15,000 ر.س' },
  { name: 'تخصيص ثيم متجر الأزياء الحديثة', client: 'متجر الأزياء الحديثة', progress: 0, status: 'بانتظار العميل', statusColor: 'text-amber-600 bg-amber-50 border-amber-100', date: 'منذ يوم', budget: '8,000 ر.س' },
  { name: 'برمجة سلة المتقدمة لمتجر الألعاب', client: 'ألعاب الأطفال الذكية', progress: 90, status: 'متأخر', statusColor: 'text-red-600 bg-red-50 border-red-100', date: 'منذ 3 أسابيع', budget: '6,200 ر.س' },
];

export const orders: Order[] = [
  {
    id: 'ORD-109',
    storeName: 'متجر العطور الفاخرة',
    managerName: 'سارة خالد',
    phone: '0509876543',
    email: 'sara@perfumes.com',
    sallaUrl: 'https://salla.sa/perfumes-luxury',
    serviceKey: 'marketing',
    serviceLabel: 'إدارة الحملات الإعلانية',
    status: 'قيد التنفيذ',
    priority: 'عاجل',
    date: 'منذ ساعتين',
    price: '4,000 ر.س',
    description: 'إدارة وتدشين حملة إعلانية ممولة على منصات التواصل الاجتماعي لترويج العطور الجديدة واستهداف شريحة الشباب المهتمين بالعطور الفاخرة.',
    notes: 'التركيز على مقاطع التيك توك القصيرة وتصميم كود خصم خاص بالمؤثرين.'
  },
  {
    id: 'ORD-108',
    storeName: 'شركة سلة المحدودة',
    managerName: 'أحمد علي',
    phone: '0501234567',
    email: 'ahmed@salla.sa',
    sallaUrl: 'https://salla.sa/salla-co',
    serviceKey: 'branding',
    serviceLabel: 'تصميم الهوية البصرية',
    status: 'مكتمل',
    priority: 'مهم',
    date: 'أمس، 04:30 م',
    price: '12,500 ر.س',
    description: 'تصميم الهوية البصرية للشركة بما يشمل الشعار والبنرات وبطاقات الأعمال والألوان والخطوط والبروفايل التعريفي للمتجر.',
    notes: 'تم تسليم كافة الأصول والملفات المفتوحة والموافقة عليها من العميل.'
  },
  {
    id: 'ORD-107',
    storeName: 'متجر التمور الراقية',
    managerName: 'صالح محمد',
    phone: '0505554433',
    email: 'info@dates.com',
    sallaUrl: 'https://salla.sa/fancy-dates',
    serviceKey: 'seo',
    serviceLabel: 'تحسين SEO',
    status: 'بانتظار العميل',
    priority: 'عادي',
    date: '3 يونيو 2026',
    price: '5,500 ر.س',
    description: 'تحسين أداء المتجر الإلكتروني على محركات البحث وكتابة الكلمات المفتاحية للمنتجات ووصف الميتا التعريفي للصفحات لزيادة الزيارات العضوية.',
    notes: 'العمل معلق بانتظار رفع ملفات الشعار الجديد وتوفير الكلمات المفتاحية المفضلة من العميل.'
  },
  {
    id: 'ORD-106',
    storeName: 'عبق الشرق للعود',
    managerName: 'عبد الله عمر',
    phone: '0506667788',
    email: 'abdul@eastern.com',
    sallaUrl: 'https://salla.sa/eastern-oud',
    serviceKey: 'content',
    serviceLabel: 'كتابة المحتوى التسويقي',
    status: 'مكتمل',
    priority: 'عادي',
    date: '1 يونيو 2026',
    price: '3,000 ر.س',
    description: 'كتابة نصوص إعلانية وتسويقية جذابة لمنتجات العود الطبيعي ودهن العود لنشرها في قنوات التواصل الاجتماعي وحساب المتجر الرسمي.',
    notes: 'تم التسليم وإرسالها للعميل وموافقتها مباشرة.'
  },
  {
    id: 'ORD-105',
    storeName: 'متجر الأزياء الحديثة',
    managerName: 'منى فهد',
    phone: '0502223344',
    email: 'mona@fashion.com',
    sallaUrl: 'https://salla.sa/fashion-modern',
    serviceKey: 'salla-customize',
    serviceLabel: 'تخصيص متجر سلة',
    status: 'جديد',
    priority: 'عاجل',
    date: '29 مايو 2026',
    price: '8,000 ر.س',
    description: 'تخصيص ثيم متجر سلة وتعديل الألوان والخطوط وربط بوابات الدفع الإلكتروني وشركات الشحن بشكل كامل بما يتناسب مع الهوية الحديثة.',
    notes: 'يرجى الانتهاء والتدشين قبل انطلاق موسم التخفيضات القادم.'
  },
  {
    id: 'ORD-104',
    storeName: 'ألعاب الأطفال الذكية',
    managerName: 'يوسف خالد',
    phone: '0503334455',
    email: 'youssef@toys.com',
    sallaUrl: 'https://salla.sa/smart-toys',
    serviceKey: 'ui-design',
    serviceLabel: 'تصميم واجهات المتجر',
    status: 'جديد',
    priority: 'مهم',
    date: '25 مايو 2026',
    price: '6,200 ر.س',
    description: 'تصميم واجهات المستخدم للمتجر الإلكتروني لتكون متوافقة مع الجوال وسهلة التصفح وجذابة للأمهات والآباء لتسهيل عملية الشراء.',
    notes: 'مطلوب توفير نموذج أولي تفاعلي على Figma للمراجعة قبل الانتقال للتطبيق الفعلي.'
  }
];
