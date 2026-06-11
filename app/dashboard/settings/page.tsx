'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { AlertCircle, CheckCircle, Loader2, Lock, Store, UserCircle, Briefcase, Eye, EyeOff } from 'lucide-react';

type UserProfile = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  avatar: string | null;
  bio: string | null;
  city: string | null;
  country: string | null;
  globalRole: string;
  storeName: string | null;
  storeUrl: string | null;
  businessType: string | null;
  companyName: string | null;
  storeNotes: string | null;
  preferredContact: string | null;
  expertProfile: {
    id: string | null;
    specialtyTitle: string | null;
    bio: string | null;
    yearsOfExperience: number | null;
    portfolioUrl: string | null;
    linkedinUrl: string | null;
    availability: string | null;
    priceRangeMin: number | null;
    priceRangeMax: number | null;
    preferredProjectTypes: string | null;
    sallaExperience: string | null;
    approvalStatus: string | null;
  } | null;
};

export default function SettingsPage() {
  const { update } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Shared fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  // Merchant fields
  const [storeName, setStoreName] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [storeNotes, setStoreNotes] = useState('');
  const [preferredContact, setPreferredContact] = useState('');

  // Provider fields
  const [specialtyTitle, setSpecialtyTitle] = useState('');
  const [providerBio, setProviderBio] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [availability, setAvailability] = useState('');
  const [priceRangeMin, setPriceRangeMin] = useState('');
  const [priceRangeMax, setPriceRangeMax] = useState('');
  const [preferredProjectTypes, setPreferredProjectTypes] = useState('');
  const [sallaExperience, setSallaExperience] = useState('');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch('/api/auth/profile');
      if (!res.ok) throw new Error('فشل تحميل الملف الشخصي');
      const data = await res.json();
      const u = data.user as UserProfile;
      setProfile(u);
      setName(u.name || '');
      setPhone(u.phone || '');
      setBio(u.bio || '');
      setCity(u.city || '');
      setCountry(u.country || '');
      if (u.globalRole === 'MERCHANT') {
        setStoreName(u.storeName || '');
        setStoreUrl(u.storeUrl || '');
        setBusinessType(u.businessType || '');
        setCompanyName(u.companyName || '');
        setStoreNotes(u.storeNotes || '');
        setPreferredContact(u.preferredContact || '');
      }
      if (u.globalRole === 'PROVIDER' && u.expertProfile) {
        setSpecialtyTitle(u.expertProfile.specialtyTitle || '');
        setProviderBio(u.expertProfile.bio || '');
        setYearsOfExperience(u.expertProfile.yearsOfExperience?.toString() || '');
        setPortfolioUrl(u.expertProfile.portfolioUrl || '');
        setLinkedinUrl(u.expertProfile.linkedinUrl || '');
        setAvailability(u.expertProfile.availability || '');
        setPriceRangeMin(u.expertProfile.priceRangeMin?.toString() || '');
        setPriceRangeMax(u.expertProfile.priceRangeMax?.toString() || '');
        setPreferredProjectTypes(u.expertProfile.preferredProjectTypes || '');
        setSallaExperience(u.expertProfile.sallaExperience || '');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveShared(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || null, phone: phone.trim() || null, bio: bio.trim() || null, city: city.trim() || null, country: country.trim() || null }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'فشل التحديث');
      }
      setSuccess('تم حفظ البيانات الشخصية');
      update();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveMerchant(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/auth/merchant-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName: storeName.trim() || null,
          storeUrl: storeUrl.trim() || null,
          businessType: businessType.trim() || null,
          companyName: companyName.trim() || null,
          storeNotes: storeNotes.trim() || null,
          preferredContact: preferredContact.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'فشل التحديث');
      }
      setSuccess('تم حفظ بيانات المتجر');
      update();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveProvider(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const body: Record<string, any> = {
        specialtyTitle: specialtyTitle.trim() || null,
        bio: providerBio.trim() || null,
        portfolioUrl: portfolioUrl.trim() || null,
        linkedinUrl: linkedinUrl.trim() || null,
        availability: availability.trim() || null,
        preferredProjectTypes: preferredProjectTypes.trim() || null,
        sallaExperience: sallaExperience.trim() || null,
      };
      const exp = parseInt(yearsOfExperience);
      if (yearsOfExperience.trim()) body.yearsOfExperience = isNaN(exp) ? null : exp;
      const min = parseFloat(priceRangeMin);
      if (priceRangeMin.trim()) body.priceRangeMin = isNaN(min) ? null : min;
      const max = parseFloat(priceRangeMax);
      if (priceRangeMax.trim()) body.priceRangeMax = isNaN(max) ? null : max;

      const res = await fetch('/api/auth/provider-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'فشل التحديث');
      }
      setSuccess('تم حفظ الملف المهني');
      update();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPassword.trim(), newPassword: newPassword.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'فشل تغيير كلمة المرور');
      }
      setSuccess('تم تغيير كلمة المرور بنجاح');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-[#06B6D4]" />
      </div>
    );
  }

  const role = profile?.globalRole;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-200/60 pb-5">
        <h1 className="text-2xl font-bold text-[#111827]">الإعدادات</h1>
        <p className="mt-1 text-sm text-slate-500">إدارة حسابك الشخصي وإعدادات المنصة</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle size={16} />
          {success}
        </div>
      )}

      {/* Shared: الحساب الشخصي */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2 text-sm font-bold text-[#111827]">
          <UserCircle size={18} className="text-[#06B6D4]" />
          الحساب الشخصي
        </div>
        <form onSubmit={handleSaveShared} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="البريد الإلكتروني" value={profile?.email || ''} disabled />
            <Field label="الاسم" value={name} onChange={setName} />
            <Field label="رقم الجوال" value={phone} onChange={setPhone} />
            <Field label="المدينة" value={city} onChange={setCity} />
            <Field label="الدولة" value={country} onChange={setCountry} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500">نبذة عني</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]" rows={3} maxLength={500} />
          </div>
          <div className="flex justify-end">
            <SubmitButton saving={saving} label="حفظ البيانات الشخصية" icon={<UserCircle size={16} />} />
          </div>
        </form>
      </section>

      {/* Security: الأمان */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2 text-sm font-bold text-[#111827]">
          <Lock size={18} className="text-[#06B6D4]" />
          الأمان
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">كلمة المرور الحالية</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pl-10 text-sm outline-none transition-colors focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]" placeholder="أدخل كلمة المرور الحالية" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">كلمة المرور الجديدة</label>
              <input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]" placeholder="أدخل كلمة المرور الجديدة" minLength={8} />
            </div>
          </div>
          <div className="flex justify-end">
            <SubmitButton saving={saving} label="تغيير كلمة المرور" icon={<Lock size={16} />} disabled={!currentPassword.trim() || !newPassword.trim()} />
          </div>
        </form>
      </section>

      {/* Merchant-only: بيانات المتجر */}
      {role === 'MERCHANT' && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2 text-sm font-bold text-[#111827]">
            <Store size={18} className="text-[#06B6D4]" />
            بيانات المتجر
          </div>
          <form onSubmit={handleSaveMerchant} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="اسم المتجر" value={storeName} onChange={setStoreName} />
              <Field label="رابط المتجر" value={storeUrl} onChange={setStoreUrl} />
              <Field label="نوع النشاط" value={businessType} onChange={setBusinessType} />
              <Field label="الاسم التجاري" value={companyName} onChange={setCompanyName} />
              <Field label="طريقة التواصل المفضلة" value={preferredContact} onChange={setPreferredContact} placeholder="واتساب، اتصال، بريد إلكتروني" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">ملاحظات عن المتجر</label>
              <textarea value={storeNotes} onChange={(e) => setStoreNotes(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]" rows={3} maxLength={500} />
            </div>
            <div className="flex justify-end">
              <SubmitButton saving={saving} label="حفظ بيانات المتجر" icon={<Store size={16} />} />
            </div>
          </form>
        </section>
      )}

      {/* Provider-only: الملف المهني */}
      {role === 'PROVIDER' && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2 text-sm font-bold text-[#111827]">
            <Briefcase size={18} className="text-[#06B6D4]" />
            الملف المهني
          </div>
          <form onSubmit={handleSaveProvider} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="التخصص الرئيسي" value={specialtyTitle} onChange={setSpecialtyTitle} />
              <Field label="سنوات الخبرة" value={yearsOfExperience} onChange={setYearsOfExperience} placeholder="مثال: 5" />
              <Field label="رابط الأعمال (Portfolio)" value={portfolioUrl} onChange={setPortfolioUrl} placeholder="https://..." />
              <Field label="رابط LinkedIn" value={linkedinUrl} onChange={setLinkedinUrl} placeholder="https://..." />
              <Field label="حالة التوفر" value={availability} onChange={setAvailability} placeholder="متاح، غير متاح، بدوام جزئي" />
              <Field label="الحد الأدنى للسعر" value={priceRangeMin} onChange={setPriceRangeMin} placeholder="مثال: 500" />
              <Field label="الحد الأعلى للسعر" value={priceRangeMax} onChange={setPriceRangeMax} placeholder="مثال: 5000" />
              <Field label="أنواع المشاريع المفضلة" value={preferredProjectTypes} onChange={setPreferredProjectTypes} placeholder="تصميم، تطوير، تحسين" />
              <Field label="خبرة في سلة" value={sallaExperience} onChange={setSallaExperience} placeholder="مبتدئ، متوسط، متقدم" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">نبذة مهنية</label>
              <textarea value={providerBio} onChange={(e) => setProviderBio(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]" rows={3} maxLength={500} />
            </div>
            <div className="flex justify-end">
              <SubmitButton saving={saving} label="حفظ الملف المهني" icon={<Briefcase size={16} />} />
            </div>
          </form>
        </section>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, disabled }: { label: string; value: string; onChange?: (v: string) => void; placeholder?: string; disabled?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold text-slate-500">{label}</label>
      <input value={value} onChange={onChange ? (e) => onChange(e.target.value) : undefined} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] disabled:bg-slate-50 disabled:text-slate-400" placeholder={placeholder} disabled={disabled} maxLength={200} />
    </div>
  );
}

function SubmitButton({ saving, label, icon, disabled }: { saving: boolean; label: string; icon: React.ReactNode; disabled?: boolean }) {
  return (
    <button type="submit" disabled={saving || disabled} className="flex items-center gap-2 rounded-xl bg-[#06B6D4] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0598B4] disabled:opacity-50">
      {saving ? <Loader2 size={16} className="animate-spin" /> : icon}
      {saving ? 'جاري الحفظ...' : label}
    </button>
  );
}
