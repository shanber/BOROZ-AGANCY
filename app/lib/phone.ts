// Phone helpers: country dial codes, E.164 normalization, and login identifier detection.
// Storage/search format is E.164 (e.g. +966501234567).

export type Country = {
  /** ISO 3166-1 alpha-2 */
  code: string;
  nameAr: string;
  flag: string;
  dialCode: string;
  /** Expected local number length(s) after stripping the leading zero */
  localLengths: number[];
};

// Ordered list shown in the country selector. Extend here when new markets open.
export const COUNTRIES: Country[] = [
  { code: 'SA', nameAr: 'السعودية', flag: '🇸🇦', dialCode: '+966', localLengths: [9] },
  { code: 'AE', nameAr: 'الإمارات', flag: '🇦🇪', dialCode: '+971', localLengths: [9] },
  { code: 'KW', nameAr: 'الكويت', flag: '🇰🇼', dialCode: '+965', localLengths: [8] },
  { code: 'QA', nameAr: 'قطر', flag: '🇶🇦', dialCode: '+974', localLengths: [8] },
  { code: 'BH', nameAr: 'البحرين', flag: '🇧🇭', dialCode: '+973', localLengths: [8] },
  { code: 'OM', nameAr: 'عُمان', flag: '🇴🇲', dialCode: '+968', localLengths: [8] },
  { code: 'EG', nameAr: 'مصر', flag: '🇪🇬', dialCode: '+20', localLengths: [10] },
  { code: 'JO', nameAr: 'الأردن', flag: '🇯🇴', dialCode: '+962', localLengths: [9] },
  { code: 'IN', nameAr: 'الهند', flag: '🇮🇳', dialCode: '+91', localLengths: [10] },
  { code: 'PK', nameAr: 'باكستان', flag: '🇵🇰', dialCode: '+92', localLengths: [10] },
  { code: 'PH', nameAr: 'الفلبين', flag: '🇵🇭', dialCode: '+63', localLengths: [10] },
];

export const DEFAULT_COUNTRY = COUNTRIES[0]; // 🇸🇦 +966

export function getCountryByCode(code: string): Country {
  return COUNTRIES.find((c) => c.code === code) || DEFAULT_COUNTRY;
}

/** Strip everything except digits (handles spaces, dashes, parentheses, Arabic-Indic digits). */
function digitsOnly(input: string): string {
  const arabicIndic = '٠١٢٣٤٥٦٧٨٩';
  return String(input || '')
    .split('')
    .map((ch) => {
      const idx = arabicIndic.indexOf(ch);
      return idx >= 0 ? String(idx) : ch;
    })
    .join('')
    .replace(/\D/g, '');
}

export function isLikelyEmail(input: string): boolean {
  return String(input || '').includes('@');
}

/** True when the input looks like a phone number: only digits/spaces/dashes/parens, optional leading +, ≥7 digits. */
export function isLikelyPhone(input: string): boolean {
  const value = String(input || '').trim();
  if (!value || isLikelyEmail(value)) return false;
  if (!/^\+?[\d\s\-()٠-٩]+$/.test(value)) return false;
  return digitsOnly(value).length >= 7;
}

/**
 * Combine a dial code with a local number into E.164.
 * Accepts local input like "0501234567", "501234567", "+966501234567" — all become "+966501234567".
 * Returns null when the result is not a plausible number for that country.
 */
export function normalizePhoneNumber(dialCode: string, localNumber: string): string | null {
  const country = COUNTRIES.find((c) => c.dialCode === dialCode);
  let digits = digitsOnly(localNumber);
  if (!digits) return null;

  const dialDigits = digitsOnly(dialCode);
  // User pasted the full international number (+9665..., 009665..., 9665...)
  if (digits.startsWith('00' + dialDigits)) digits = digits.slice(2 + dialDigits.length);
  else if (digits.startsWith(dialDigits) && digits.length > (country?.localLengths[0] ?? 10)) {
    digits = digits.slice(dialDigits.length);
  }
  // Drop the trunk prefix (05xxxxxxxx → 5xxxxxxxx)
  if (digits.startsWith('0')) digits = digits.replace(/^0+/, '');

  if (digits.length < 7 || digits.length > 12) return null;
  if (country && !country.localLengths.includes(digits.length)) return null;
  // Saudi mobiles are 5xxxxxxxx
  if (dialCode === '+966' && !/^5\d{8}$/.test(digits)) return null;

  return dialCode + digits;
}

/** Legacy helper: normalize any Saudi-looking input to +9665xxxxxxxx. */
export function normalizeSaudiPhone(input: string): string | null {
  return normalizePhoneNumber('+966', input);
}

/**
 * Best-effort normalization of a raw identifier typed without a country selector.
 * "+9715..." matches a known dial code; bare local numbers fall back to the default country (SA).
 */
export function normalizeToE164(input: string, defaultDialCode = '+966'): string | null {
  const value = String(input || '').trim();
  const digits = digitsOnly(value);
  if (!digits) return null;

  const international = value.startsWith('+') || digits.startsWith('00');
  const intlDigits = digits.startsWith('00') ? digits.slice(2) : digits;

  if (international) {
    const match = COUNTRIES.find((c) => intlDigits.startsWith(digitsOnly(c.dialCode)));
    if (match) return normalizePhoneNumber(match.dialCode, intlDigits.slice(digitsOnly(match.dialCode).length));
    return null;
  }

  // Not explicitly international, but may still start with a known dial code (e.g. "9665...")
  const implicit = COUNTRIES.find(
    (c) => digits.startsWith(digitsOnly(c.dialCode)) && c.localLengths.includes(digits.length - digitsOnly(c.dialCode).length)
  );
  if (implicit) return normalizePhoneNumber(implicit.dialCode, digits.slice(digitsOnly(implicit.dialCode).length));

  return normalizePhoneNumber(defaultDialCode, digits);
}

/**
 * All storage formats a legacy record might hold for the same number.
 * Used to match users whose phone was saved before E.164 normalization existed.
 */
export function phoneSearchVariants(e164: string): string[] {
  const country = COUNTRIES.find((c) => e164.startsWith(c.dialCode));
  if (!country) return [e164];
  const local = e164.slice(country.dialCode.length);
  const dialDigits = digitsOnly(country.dialCode);
  return Array.from(
    new Set([e164, dialDigits + local, '00' + dialDigits + local, '0' + local, local])
  );
}
