'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Send, Users } from 'lucide-react';

const invitationStatusLabels: Record<string, string> = {
  INVITED: 'تمت دعوتك',
  VIEWED: 'تمت المعاينة',
  DECLINED: 'تم الاعتذار',
  OFFER_SUBMITTED: 'تم تقديم العرض',
  EXPIRED: 'انتهت الدعوة',
};

type ProviderItem = {
  id: string;
  name: string;
  email: string;
  specialtyTitle: string;
  services: string[];
  alreadyInvited: boolean;
  invitationStatus: string | null;
  invitedAt: string | null;
  expiresAt: string | null;
  offer: {
    price: number;
    deliveryDays: number;
    status: string;
    submittedAt: string | null;
  } | null;
};

interface InviteProvidersPanelProps {
  orderNumber: string;
  requestStatus: string;
  providers: ProviderItem[];
}

export default function InviteProvidersPanel({ orderNumber, requestStatus, providers }: InviteProvidersPanelProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [expiresAt, setExpiresAt] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const toggleProvider = (providerId: string) => {
    setSelectedIds((current) =>
      current.includes(providerId)
        ? current.filter((id) => id !== providerId)
        : [...current, providerId]
    );
  };

  const inviteProviders = async (expertProfileIds: string[]) => {
    if (expertProfileIds.length === 0) {
      setError('يرجى اختيار خبير واحد على الأقل.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/admin/requests/${encodeURIComponent(orderNumber)}/invite-providers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expertProfileIds,
          expiresAt: expiresAt || undefined,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'تعذر إرسال الدعوات');
      }

      setSuccess(data.message || 'تم إرسال الدعوات بنجاح');
      setSelectedIds([]);
      router.refresh();
    } catch (inviteError) {
      setError(inviteError instanceof Error ? inviteError.message : 'تعذر إرسال الدعوات');
    } finally {
      setLoading(false);
    }
  };

  if (!['APPROVED_FOR_OFFERS', 'COLLECTING_OFFERS'].includes(requestStatus)) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <Users size={18} className="text-[#06B6D4]" />
        <div>
          <h3 className="text-base font-bold text-[#0B132B]">دعوة الخبراء لتقديم عروض</h3>
          <p className="mt-1 text-sm leading-7 text-slate-500">
            اختر الخبراء المعتمدين المناسبين لهذا الطلب لإرسال دعوة مباشرة داخل بروز.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[220px_auto] md:items-end">
        <div>
          <label className="label-base">آخر موعد اختياري للدعوة</label>
          <input
            type="date"
            value={expiresAt}
            onChange={(event) => setExpiresAt(event.target.value)}
            className="input-base bg-white"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={loading || selectedIds.length === 0}
            onClick={() => inviteProviders(selectedIds)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0B132B] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#16213C] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            دعوة الخبراء المحددين
          </button>
          <span className="text-[11px] font-bold text-slate-500">
            {selectedIds.length > 0 ? `تم تحديد ${selectedIds.length} خبير` : 'يمكنك دعوة خبير واحد أو عدة خبراء'}
          </span>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700">
          {success}
        </div>
      ) : null}

      {providers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-semibold text-slate-500">
          لا يوجد خبراء معتمدون مطابقون لهذا الطلب حالياً.
        </div>
      ) : (
        <div className="space-y-3">
          {providers.map((provider) => (
            <div key={provider.id} className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-bold text-[#0B132B]">{provider.name}</div>
                    {provider.alreadyInvited ? (
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        تم إرسال الدعوة
                      </span>
                    ) : null}
                  </div>
                  <div className="text-xs text-slate-500">{provider.email}</div>
                  <div className="text-xs font-semibold text-slate-700">{provider.specialtyTitle || 'بدون مسمى تخصص واضح'}</div>
                  <div className="flex flex-wrap gap-2">
                    {provider.services.length > 0 ? provider.services.map((service) => (
                      <span key={service} className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        {service}
                      </span>
                    )) : (
                      <span className="text-[11px] text-slate-500">لا توجد خدمات مرتبطة ظاهرة</span>
                    )}
                  </div>
                  {provider.offer ? (
                    <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-3 py-3 text-[11px] leading-6 text-cyan-900">
                      <div className="font-bold">تم تقديم عرض</div>
                      <div>السعر: {provider.offer.price} ر.س</div>
                      <div>مدة التنفيذ: {provider.offer.deliveryDays} يوم</div>
                      <div>حالة العرض: {provider.offer.status}</div>
                      <div>تاريخ الإرسال: {provider.offer.submittedAt || 'غير متوفر'}</div>
                    </div>
                  ) : null}
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {!provider.alreadyInvited ? (
                    <>
                      <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-600">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(provider.id)}
                          onChange={() => toggleProvider(provider.id)}
                          className="h-4 w-4 rounded border-slate-300 text-[#06B6D4] focus:ring-[#06B6D4]"
                        />
                        تحديد
                      </label>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => inviteProviders([provider.id])}
                        className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-[11px] font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        دعوة الآن
                      </button>
                    </>
                  ) : (
                    <div className="text-left text-[11px] text-slate-500">
                      <div>{provider.invitationStatus ? invitationStatusLabels[provider.invitationStatus] || provider.invitationStatus : 'تمت الدعوة'}</div>
                      {provider.invitedAt ? <div>{provider.invitedAt}</div> : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
