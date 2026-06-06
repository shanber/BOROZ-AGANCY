/**
 * Format currency to SAR
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
  }).format(amount);
}

/**
 * Format date to Arabic format
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;
  if (days < 30) return `منذ ${days} يوم`;

  return formatDate(d);
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number = 50): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Generate slug from string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Saudi Arabia)
 */
export function isValidSaudiPhone(phone: string): boolean {
  const phoneRegex = /^(\+966|0)?[5][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Merge class names
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter((c): c is string => Boolean(c)).join(' ');
}

/**
 * Get status text in Arabic
 */
export const statusTexts: Record<string, string> = {
  // Merchant
  NEW: 'جديد',
  CONTACTED: 'تم التواصل',
  QUOTE_SENT: 'تم إرسال عرض',
  NEGOTIATING: 'قيد التفاوض',
  CLIENT: 'عميل',
  REJECTED: 'مرفوض',

  // Order
  WAITING_REQUIREMENTS: 'في انتظار المتطلبات',
  IN_PROGRESS: 'قيد الإنجاز',
  AWAITING_REVIEW: 'في انتظار المراجعة',
  COMPLETED: 'مكتمل',
  CANCELLED: 'ملغى',

  // Project
  PENDING: 'قيد الانتظار',
  ON_HOLD: 'معلق',

  // Task
  NOT_STARTED: 'لم يبدأ',
  AWAITING_CLIENT: 'في انتظار العميل',
};

/**
 * Get status text
 */
export function getStatusText(status: string): string {
  return statusTexts[status] || status;
}

/**
 * Calculate days remaining
 */
export function daysRemaining(dueDate: Date | null): number | null {
  if (!dueDate) return null;
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Check if date is overdue
 */
export function isOverdue(dueDate: Date | null): boolean {
  if (!dueDate) return false;
  return new Date() > new Date(dueDate);
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `+966${cleaned}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('966')) {
    return `+${cleaned}`;
  }
  return phone;
}
