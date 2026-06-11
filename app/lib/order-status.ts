export const orderReviewStatuses = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'NEEDS_CHANGES',
  'APPROVED_FOR_OFFERS',
  'REJECTED',
  'CANCELLED',
] as const;

export type OrderReviewStatus = (typeof orderReviewStatuses)[number];

export const orderStatusLabels: Record<string, string> = {
  SUBMITTED: 'بانتظار مراجعة بروز',
  UNDER_REVIEW: 'قيد المراجعة',
  NEEDS_CHANGES: 'بحاجة إلى تعديل',
  APPROVED_FOR_OFFERS: 'معتمد للعروض',
  COLLECTING_OFFERS: 'جارٍ استقبال العروض',
  OFFER_SELECTED: 'تم اختيار العرض',
  IN_EXECUTION: 'قيد التنفيذ',
  DELIVERED: 'تم التسليم',
  COMPLETED: 'مكتمل',
  REJECTED: 'مرفوض',
  CANCELLED: 'ملغي',
  جديد: 'بانتظار مراجعة بروز',
  'قيد التنفيذ': 'قيد التنفيذ',
  مكتمل: 'مكتمل',
  ملغى: 'ملغي',
};

export function getOrderStatusLabel(status?: string | null) {
  if (!status) return orderStatusLabels.SUBMITTED;
  return orderStatusLabels[status] || status;
}

export function getOrderStatusStyle(status?: string | null) {
  switch (status) {
    case 'UNDER_REVIEW':
      return 'bg-sky-50 text-sky-700 border border-sky-200';
    case 'NEEDS_CHANGES':
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'APPROVED_FOR_OFFERS':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'COLLECTING_OFFERS':
      return 'bg-cyan-50 text-cyan-700 border border-cyan-200';
    case 'OFFER_SELECTED':
      return 'bg-violet-50 text-violet-700 border border-violet-200';
    case 'IN_EXECUTION':
      return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
    case 'DELIVERED':
      return 'bg-teal-50 text-teal-700 border border-teal-200';
    case 'COMPLETED':
      return 'bg-green-50 text-green-700 border border-green-200';
    case 'REJECTED':
      return 'bg-red-50 text-red-700 border border-red-200';
    case 'CANCELLED':
      return 'bg-slate-100 text-slate-600 border border-slate-200';
    case 'SUBMITTED':
    case 'جديد':
    default:
      return 'bg-blue-50 text-blue-700 border border-blue-200';
  }
}
