'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import type { OfferStatus } from '@prisma/client';

interface ProviderOfferSubmissionFormProps {
  orderId: string;
  existingOffer?: {
    id: string;
    status: OfferStatus;
    submittedAt: string | null;
  } | null;
}

const FIELD_LIMITS = {
  scopeSummary: 500,
  deliverables: 800,
  assumptions: 500,
  exclusions: 500,
  messageToMerchant: 500,
};

export function ProviderOfferSubmissionForm({ orderId, existingOffer }: ProviderOfferSubmissionFormProps) {
  const router = useRouter();
  const [price, setPrice] = React.useState('');
  const [deliveryDays, setDeliveryDays] = React.useState('');
  const [scopeSummary, setScopeSummary] = React.useState('');
  const [deliverables, setDeliverables] = React.useState('');
  const [revisionsIncluded, setRevisionsIncluded] = React.useState('');
  const [assumptions, setAssumptions] = React.useState('');
  const [exclusions, setExclusions] = React.useState('');
  const [messageToMerchant, setMessageToMerchant] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const [error, setError] = React.useState('');

  const isSubmitted = Boolean(existingOffer && ['SUBMITTED', 'ACCEPTED'].includes(existingOffer.status));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch(`/api/provider/opportunities/${encodeURIComponent(orderId)}/offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price,
          deliveryDays,
          scopeSummary,
          deliverables,
          revisionsIncluded,
          assumptions,
          exclusions,
          messageToMerchant,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || data.error || 'تعذر إرسال العرض');
      }

      setSuccessMessage('تم تقديم العرض بنجاح، ويمكنك الآن انتظار قرار التاجر داخل بروز.');
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'تعذر إرسال العرض');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={24} />
        </div>
        <h3 className="mt-4 text-lg font-bold text-emerald-900">تم تقديم العرض مسبقاً</h3>
        <p className="mt-2 text-sm leading-7 text-emerald-800">
          تم استلام عرضك على هذا الطلب، وستظهر لك النتيجة عند اختيار التاجر للعرض المناسب.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field
          label="السعر"
          required
          input={
            <input
              type="number"
              min="1"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="مثال: 3500"
              className="input-base bg-white"
            />
          }
        />
        <Field
          label="مدة التنفيذ بالأيام"
          required
          input={
            <input
              type="number"
              min="1"
              value={deliveryDays}
              onChange={(event) => setDeliveryDays(event.target.value)}
              placeholder="مثال: 7"
              className="input-base bg-white"
            />
          }
        />
        <Field
          label="عدد المراجعات"
          required
          input={
            <input
              type="number"
              min="1"
              value={revisionsIncluded}
              onChange={(event) => setRevisionsIncluded(event.target.value)}
              placeholder="مثال: 2"
              className="input-base bg-white"
            />
          }
        />
      </div>

      <TextareaField
        label="ملخص نطاق العمل"
        required
        value={scopeSummary}
        onChange={setScopeSummary}
        placeholder="اشرح بشكل مختصر ماذا ستنفذ داخل هذا الطلب، وما حدود العمل التي ستلتزم بها."
        limit={FIELD_LIMITS.scopeSummary}
        rows={5}
      />

      <TextareaField
        label="المخرجات"
        required
        value={deliverables}
        onChange={setDeliverables}
        placeholder="مثال: تعديل الصفحة الرئيسية، بناء 3 أقسام مخصصة، تحسين تجربة الجوال، وتسليم نسخة جاهزة للمراجعة."
        limit={FIELD_LIMITS.deliverables}
        rows={5}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <TextareaField
          label="الافتراضات"
          value={assumptions}
          onChange={setAssumptions}
          placeholder="مثال: الهوية البصرية متوفرة، والصور والنصوص الأساسية سيتم تسليمها قبل بدء العمل."
          limit={FIELD_LIMITS.assumptions}
          rows={4}
        />
        <TextareaField
          label="الاستثناءات"
          value={exclusions}
          onChange={setExclusions}
          placeholder="مثال: لا يشمل العرض كتابة المحتوى التسويقي أو تصوير المنتجات أو الحملات الإعلانية."
          limit={FIELD_LIMITS.exclusions}
          rows={4}
        />
      </div>

      <TextareaField
        label="رسالة للتاجر"
        value={messageToMerchant}
        onChange={setMessageToMerchant}
        placeholder="اكتب رسالة مهنية مختصرة توضّح للتاجر كيف ستتعامل مع الطلب داخل بروز."
        limit={FIELD_LIMITS.messageToMerchant}
        rows={4}
      />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#06B6D4] px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-[#0891B2] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        {loading ? 'جاري إرسال العرض...' : 'إرسال العرض'}
      </button>
    </form>
  );
}

function Field({ label, required, input }: { label: string; required?: boolean; input: React.ReactNode }) {
  return (
    <div>
      <label className="label-base">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      {input}
    </div>
  );
}

function TextareaField({
  label,
  required,
  value,
  onChange,
  placeholder,
  limit,
  rows,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  limit: number;
  rows: number;
}) {
  return (
    <div>
      <label className="label-base">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, limit))}
        maxLength={limit}
        rows={rows}
        placeholder={placeholder}
        className="input-base min-h-[120px] resize-y bg-white"
      />
      <div className="mt-1 text-left text-[11px] font-bold text-slate-400">
        {value.length}/{limit}
      </div>
    </div>
  );
}
