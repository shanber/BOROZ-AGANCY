'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BadgeCheck, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface ProviderDetailsClientProps {
  providerId: string;
  currentStatus: string;
}

export default function ProviderDetailsClient({ providerId, currentStatus }: ProviderDetailsClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState('');

  const handleAction = async (action: 'approve' | 'reject' | 'suspend') => {
    if (action === 'reject' && !rejectionReason.trim()) {
      setError('الرجاء إدخال سبب الرفض');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/providers/${providerId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...(action === 'reject' ? { rejectionReason } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء تنفيذ الإجراء');
      }

      if (action === 'reject') {
        setIsRejectModalOpen(false);
        setRejectionReason('');
      }

      router.refresh(); // Refresh the page to show new status
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">إجراءات الإدارة</h3>
        
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg mb-4 border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {currentStatus !== 'APPROVED' && (
            <button
              onClick={() => handleAction('approve')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BadgeCheck className="w-5 h-5" />}
              اعتماد المستقل
            </button>
          )}

          {currentStatus !== 'REJECTED' && (
            <button
              onClick={() => setIsRejectModalOpen(true)}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <XCircle className="w-5 h-5" />
              رفض الطلب
            </button>
          )}

          {currentStatus === 'APPROVED' && (
            <button
              onClick={() => handleAction('suspend')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-yellow-400 text-yellow-600 hover:bg-yellow-50 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <AlertTriangle className="w-5 h-5" />
              إيقاف الحساب
            </button>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <h3 className="text-xl font-bold text-slate-900 mb-2 text-right">سبب الرفض</h3>
            <p className="text-slate-500 text-sm mb-4 text-right">
              الرجاء توضيح سبب رفض طلب هذا المستقل. سيتم حفظ هذا السبب في السجلات.
            </p>
            
            <textarea
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-right resize-none mb-4"
              rows={4}
              placeholder="اكتب سبب الرفض هنا..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              disabled={isLoading}
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                disabled={isLoading}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleAction('reject')}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                تأكيد الرفض
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
