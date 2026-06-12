'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { COUNTRIES, getCountryByCode } from '@/app/lib/phone';

type PhoneInputProps = {
  /** ISO country code, e.g. "SA" */
  countryCode: string;
  onCountryChange: (code: string) => void;
  /** Local number as typed (digits only kept) */
  value: string;
  onChange: (value: string) => void;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
};

export default function PhoneInput({
  countryCode,
  onCountryChange,
  value,
  onChange,
  id,
  required,
  disabled,
  placeholder = '5xxxxxxxx',
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const country = getCountryByCode(countryCode);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative" dir="rtl">
      <div
        className={`flex items-stretch w-full bg-white border border-slate-300 rounded-lg overflow-hidden transition-shadow focus-within:ring-2 focus-within:ring-[#6D5DFB] focus-within:border-[#6D5DFB] ${
          disabled ? 'opacity-60' : ''
        }`}
      >
        {/* Country selector */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-50 hover:bg-[#EEF2FF] border-l border-slate-200 text-slate-700 shrink-0 transition-colors"
        >
          <span className="text-base leading-none">{country.flag}</span>
          <span className="text-sm font-medium" dir="ltr">{country.dialCode}</span>
          <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {/* Local number */}
        <input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          dir="ltr"
          placeholder={placeholder}
          value={value}
          required={required}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value.replace(/[^\d\s\-+()٠-٩]/g, ''))}
          className="flex-1 min-w-0 px-3 py-2.5 text-left text-slate-900 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Dropdown */}
      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 w-full max-h-56 overflow-auto bg-white border border-slate-200 rounded-lg shadow-lg py-1"
        >
          {COUNTRIES.map((c) => (
            <li key={c.code}>
              <button
                type="button"
                role="option"
                aria-selected={c.code === country.code}
                onClick={() => {
                  onCountryChange(c.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm transition-colors hover:bg-[#EEF2FF] ${
                  c.code === country.code ? 'bg-[#EEF2FF] text-[#4F46E5] font-medium' : 'text-slate-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base leading-none">{c.flag}</span>
                  <span>{c.nameAr}</span>
                </span>
                <span className="text-slate-500" dir="ltr">{c.dialCode}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
