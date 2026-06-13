'use client';

import { useState } from 'react';
import { CheckCircle, Send, AlertCircle, FileText, RefreshCw, ExternalLink } from 'lucide-react';

type Delivery = {
  id: string;
  status: string;
  title: string;
  description: string;
  deliverableLinks: string | null;
  revisionNote: string | null;
  submittedAt: string;
  approvedAt: string | null;
  revisionRequestedAt: string | null;
  submittedBy: { name: string | null };
};

type Props = {
  projectId: string;
  projectStatus: string;
  initialDeliveries: Delivery[];
  isProviderOwner: boolean;
  isMerchantOwner: boolean;
  isAdminViewer: boolean;
};

const statusLabels: Record<string, string> = {
  SUBMITTED: 'تم التسليم',
  APPROVED: 'مقبول',
  REVISION_REQUESTED: 'طلب تعديل',
  CANCELLED: 'ملغي',
};

const statusStyles: Record<string, string> = {
  SUBMITTED: 'bg-teal-50 text-teal-700 border-teal-200',
  APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REVISION_REQUESTED: 'bg-amber-50 text-amber-700 border-amber-200',
  CANCELLED: 'bg-slate-100 text-slate-500 border-slate-200',
};

export function ProjectDeliverySection({
  projectId,
  projectStatus,
  initialDeliveries,
  isProviderOwner,
  isMerchantOwner,
}: Props) {
  const [deliveries, setDeliveries] = useState<Delivery[]>(initialDeliveries);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deliverableLinks, setDeliverableLinks] = useState('');
  const [revisionNote, setRevisionNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const latestDelivery = deliveries.length > 0 ? deliveries[0] : null;
  const canSubmit = isProviderOwner && (projectStatus === 'ACTIVE' || projectStatus === 'IN_PROGRESS' || projectStatus === 'REVISION_REQUESTED');
  const isDelivered = projectStatus === 'DELIVERED';
  const isRevisionRequested = projectStatus === 'REVISION_REQUESTED';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/projects/${projectId}/deliveries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), deliverableLinks: deliverableLinks.trim() || undefined }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'فشل تسليم العمل');
      }
      const data = await res.json();
      setDeliveries((prev) => [data.delivery, ...prev]);
      setTitle('');
      setDescription('');
      setDeliverableLinks('');
      setShowSubmitForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!latestDelivery) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/projects/${projectId}/deliveries/${latestDelivery.id}/approve`, {
        method: 'POST',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'فشل قبول التسليم');
      }
      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === latestDelivery.id
            ? { ...d, status: 'APPROVED', approvedAt: new Date().toISOString() }
            : d
        )
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRevision = async () => {
    if (!latestDelivery || !revisionNote.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/projects/${projectId}/deliveries/${latestDelivery.id}/request-revision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revisionNote: revisionNote.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'فشل طلب التعديل');
      }
      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === latestDelivery.id
            ? { ...d, status: 'REVISION_REQUESTED', revisionNote: revisionNote.trim(), revisionRequestedAt: new Date().toISOString() }
            : d
        )
      );
      setRevisionNote('');
      setShowRevisionForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {canSubmit && !showSubmitForm && (
        <button
          onClick={() => setShowSubmitForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0B132B] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#16213C]"
        >
          <Send size={16} />
          تسليم العمل
        </button>
      )}

      {showSubmitForm && (
        <form onSubmit={handleSubmit} className="rounded-[24px] border border-slate-200 bg-[#F8FAFC] p-6">
          <div className="mb-4 text-sm font-bold text-[#0B132B]">تسليم العمل</div>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">عنوان التسليم</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20"
                placeholder="مثال: النسخة النهائية من التصميم"
                required
                maxLength={200}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">وصف التسليم</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20"
                placeholder="اشرح ما تم تسليمه بالتفصيل"
                required
                maxLength={5000}
                rows={4}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">روابط التسليم (اختياري)</label>
              <input
                value={deliverableLinks}
                onChange={(e) => setDeliverableLinks(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20"
                placeholder="رابط معاينة، رابط مستند، إلخ"
                maxLength={1000}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                  className="flex items-center gap-2 rounded-2xl bg-[#0B132B] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#16213C] disabled:opacity-50"
                >
                  {loading ? 'جاري الإرسال...' : 'إرسال التسليم'}
                </button>
              <button
                type="button"
                onClick={() => setShowSubmitForm(false)}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  إلغاء
                </button>
            </div>
          </div>
        </form>
      )}

      {isMerchantOwner && isDelivered && latestDelivery && latestDelivery.status === 'SUBMITTED' ? (
        <div className="rounded-[24px] border border-slate-200 bg-[#F8FAFC] p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#0B132B]">
            <FileText size={18} className="text-[#06B6D4]" />
            مراجعة التسليم
          </div>
          <DeliveryCard delivery={latestDelivery} />
          <div className="mt-4 space-y-4">
            {showRevisionForm ? (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500">ملاحظات التعديل المطلوبة</label>
                <textarea
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20"
                  placeholder="اذكر التعديلات المطلوبة بالتفصيل"
                  rows={3}
                  maxLength={2000}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleRequestRevision}
                    disabled={loading || !revisionNote.trim()}
                    className="flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
                  >
                    {loading ? 'جاري الإرسال...' : 'إرسال طلب المراجعة'}
                  </button>
                  <button
                    onClick={() => setShowRevisionForm(false)}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={handleApprove}
                  disabled={loading}
                   className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                 >
                   <CheckCircle size={16} />
                   {loading ? 'جاري...' : 'اعتماد التسليم'}
                 </button>
                 <button
                   onClick={() => setShowRevisionForm(true)}
                   disabled={loading}
                   className="flex items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-2.5 text-sm font-bold text-amber-700 transition-colors hover:bg-amber-100 disabled:opacity-50"
                 >
                   <RefreshCw size={16} />
                   طلب مراجعة
                 </button>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {isDelivered && isProviderOwner && latestDelivery?.status === 'SUBMITTED' ? (
         <div className="rounded-[24px] border border-teal-200 bg-teal-50 px-5 py-4 text-sm font-bold text-teal-800">
           تم تسليم العمل، بانتظار مراجعة التاجر.
         </div>
      ) : null}

      {isRevisionRequested && isProviderOwner ? (
        <div className="space-y-4">
          {latestDelivery ? (
             <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5">
               <div className="mb-2 text-sm font-bold text-amber-800">طلب تعديل من التاجر</div>
               <div className="text-sm leading-7 text-amber-700">{latestDelivery.revisionNote}</div>
             </div>
          ) : null}
          {!showSubmitForm ? (
            <button
              onClick={() => setShowSubmitForm(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0B132B] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#16213C]"
            >
              <Send size={16} />
              إعادة التسليم بعد التعديل
            </button>
          ) : null}
        </div>
      ) : null}

      {deliveries.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-500">سجل التسليمات</div>
          {deliveries.map((d) => (
            <DeliveryCard key={d.id} delivery={d} />
          ))}
        </div>
      )}

      {deliveries.length === 0 && !canSubmit && projectStatus !== 'KICKOFF_PENDING' && projectStatus !== 'PENDING' && (
         <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
           لا توجد تسليمات بعد.
         </div>
      )}
    </div>
  );
}

function DeliveryCard({ delivery }: { delivery: Delivery }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-bold text-[#0B132B]">{delivery.title}</span>
        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusStyles[delivery.status] || 'bg-slate-100 text-slate-600'}`}>
          {statusLabels[delivery.status] || delivery.status}
        </span>
      </div>
      <p className="mb-3 text-sm leading-7 text-slate-600">{delivery.description}</p>
      {delivery.deliverableLinks ? (
        <a
          href={delivery.deliverableLinks}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-[#06B6D4] hover:underline"
        >
          <ExternalLink size={14} />
          روابط التسليم
        </a>
      ) : null}
      {delivery.revisionNote ? (
        <div className="mt-2 rounded-lg border border-amber-100 bg-amber-50/50 px-3 py-2 text-xs text-amber-700">
          <span className="font-bold">ملاحظات التعديل:</span> {delivery.revisionNote}
        </div>
      ) : null}
      <div className="mt-2 text-[11px] text-slate-400">
        تم بواسطة {delivery.submittedBy.name || 'مقدم الخدمة'} •{' '}
        {new Date(delivery.submittedAt).toLocaleDateString('en-GB')}
      </div>
    </div>
  );
}
