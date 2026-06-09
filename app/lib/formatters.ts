/**
 * Converts Arabic and Persian numerals to English (Latin) digits.
 * Example: "١٢٣٤" -> "1234"
 */
export function toEnglishDigits(value: string | number): string {
  const strValue = String(value);
  const idb = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const pdb = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  return strValue.replace(/[٠-٩]/g, (w) => String(idb.indexOf(w)))
                 .replace(/[۰-۹]/g, (w) => String(pdb.indexOf(w)));
}

/**
 * Formats a number using Latin digits.
 * Example: 45000 -> "45,000"
 */
export function formatNumber(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(toEnglishDigits(value)) : value;
  if (isNaN(num)) return String(value);
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Formats a currency amount with Latin digits and the specified currency symbol.
 * Example: 45000 -> "45,000 ر.س"
 */
export function formatCurrency(value: number | string, currency: string = 'ر.س'): string {
  return `${formatNumber(value)} ${currency}`;
}

/**
 * Formats a date using Latin digits and Arabic months (if desired) or strict Arabic format but Latin digits.
 * We use 'ar-SA-u-nu-latn' to ensure RTL and Arabic text but Latin numerals.
 */
export function formatDate(date: string | Date): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return String(date);
  
  try {
    // using nu-latn guarantees English digits. 
    return new Intl.DateTimeFormat('ar-SA-u-nu-latn', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj);
  } catch (e) {
    // Fallback if the browser doesn't fully support -u-nu-latn
    // E.g. "8 يونيو 2026"
    return toEnglishDigits(new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj));
  }
}

/**
 * Formats a short date using Latin digits.
 * Example: "2026/06/09"
 */
export function formatShortDate(date: string | Date): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return String(date);

  try {
    return new Intl.DateTimeFormat('ar-SA-u-nu-latn', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(dateObj);
  } catch (e) {
    return toEnglishDigits(new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(dateObj));
  }
}
