import { formatDate, formatNumber } from '@/app/lib/formatters';

export type WorkflowStageKey =
  | 'request'
  | 'review'
  | 'offers'
  | 'selection'
  | 'execution'
  | 'delivery'
  | 'completed';

export type ProjectHealth = 'Excellent' | 'Needs Follow-Up' | 'Delayed';

export const workflowStageLabels: Record<WorkflowStageKey, string> = {
  request: 'طلب جديد',
  review: 'مراجعة',
  offers: 'عروض',
  selection: 'اختيار',
  execution: 'تنفيذ',
  delivery: 'تسليم',
  completed: 'مكتمل',
};

export function getWorkflowStageFromOrderStatus(status?: string | null): WorkflowStageKey {
  switch (status) {
    case 'SUBMITTED':
      return 'request';
    case 'UNDER_REVIEW':
    case 'NEEDS_CHANGES':
    case 'REJECTED':
    case 'CANCELLED':
      return 'review';
    case 'APPROVED_FOR_OFFERS':
    case 'COLLECTING_OFFERS':
      return 'offers';
    case 'OFFER_SELECTED':
      return 'selection';
    case 'IN_EXECUTION':
      return 'execution';
    case 'DELIVERED':
      return 'delivery';
    case 'COMPLETED':
      return 'completed';
    default:
      return 'request';
  }
}

export function buildWorkflowCounts(statuses: Array<string | null | undefined>) {
  const counts: Record<WorkflowStageKey, number> = {
    request: 0,
    review: 0,
    offers: 0,
    selection: 0,
    execution: 0,
    delivery: 0,
    completed: 0,
  };

  statuses.forEach((status) => {
    counts[getWorkflowStageFromOrderStatus(status)] += 1;
  });

  return (Object.keys(workflowStageLabels) as WorkflowStageKey[]).map((key) => ({
    key,
    label: workflowStageLabels[key],
    count: counts[key],
  }));
}

export function getProjectProgress(status?: string | null) {
  switch (status) {
    case 'KICKOFF_PENDING':
    case 'PENDING':
      return 15;
    case 'ACTIVE':
    case 'IN_PROGRESS':
      return 55;
    case 'PAUSED':
    case 'ON_HOLD':
      return 45;
    case 'REVISION_REQUESTED':
      return 72;
    case 'DELIVERED':
      return 88;
    case 'COMPLETED':
      return 100;
    case 'CANCELLED':
      return 0;
    default:
      return 10;
  }
}

export function getProjectHealth({
  status,
  dueDate,
}: {
  status?: string | null;
  dueDate?: Date | null;
}): ProjectHealth {
  const statusKey = status || '';
  const terminal = ['COMPLETED', 'CANCELLED'].includes(statusKey);
  const now = Date.now();

  if (!terminal && dueDate && dueDate.getTime() < now) {
    return 'Delayed';
  }

  if (['PAUSED', 'ON_HOLD', 'REVISION_REQUESTED'].includes(statusKey)) {
    return 'Needs Follow-Up';
  }

  if (!terminal && dueDate) {
    const remaining = dueDate.getTime() - now;
    if (remaining <= 2 * 24 * 60 * 60 * 1000) {
      return 'Needs Follow-Up';
    }
  }

  return 'Excellent';
}

export function getProjectHealthTone(health: ProjectHealth) {
  switch (health) {
    case 'Excellent':
      return 'emerald';
    case 'Delayed':
      return 'rose';
    case 'Needs Follow-Up':
    default:
      return 'amber';
  }
}

export function getNextProjectMilestone(status?: string | null) {
  switch (status) {
    case 'KICKOFF_PENDING':
    case 'PENDING':
      return 'بدء التنفيذ من الخبير';
    case 'ACTIVE':
    case 'IN_PROGRESS':
      return 'رفع أول تسليم';
    case 'PAUSED':
    case 'ON_HOLD':
      return 'استئناف العمل';
    case 'DELIVERED':
      return 'اعتماد التسليم أو طلب تعديل';
    case 'REVISION_REQUESTED':
      return 'إعادة التسليم بعد التعديل';
    case 'COMPLETED':
      return 'لا توجد خطوة تالية';
    case 'CANCELLED':
      return 'المشروع مغلق';
    default:
      return 'متابعة التنفيذ';
  }
}

export function getRequiredActionForRole(status: string | null | undefined, role: string | null | undefined) {
  if (role === 'PROVIDER') {
    switch (status) {
      case 'KICKOFF_PENDING':
      case 'PENDING':
        return 'ابدأ التنفيذ بعد مراجعة النطاق.';
      case 'ACTIVE':
      case 'IN_PROGRESS':
        return 'شارك تحديثاتك وارفع التسليم عند الجاهزية.';
      case 'REVISION_REQUESTED':
        return 'راجع الملاحظات وأعد التسليم.';
      case 'DELIVERED':
        return 'بانتظار قرار التاجر على التسليم.';
      case 'COMPLETED':
        return 'لا يوجد إجراء مطلوب.';
      default:
        return 'راجع حالة المشروع الحالية.';
    }
  }

  if (role === 'ADMIN') {
    switch (status) {
      case 'DELIVERED':
        return 'راقب المراجعة النهائية وأي تصعيد محتمل.';
      case 'REVISION_REQUESTED':
      case 'ON_HOLD':
      case 'PAUSED':
        return 'قد يحتاج المشروع لتدخل تشغيلي.';
      default:
        return 'تابع التنفيذ وتدخل فقط عند الحاجة.';
    }
  }

  switch (status) {
    case 'DELIVERED':
      return 'راجع التسليم واختر الاعتماد أو طلب تعديل.';
    case 'REVISION_REQUESTED':
      return 'انتظر إعادة التسليم وتابع التحديثات.';
    case 'KICKOFF_PENDING':
    case 'PENDING':
      return 'لا يوجد إجراء فوري. بانتظار بدء التنفيذ.';
    case 'ACTIVE':
    case 'IN_PROGRESS':
      return 'راجع الرسائل والملفات عند الحاجة.';
    case 'COMPLETED':
      return 'اكتمل المشروع ولا يوجد إجراء مطلوب.';
    default:
      return 'تابع المشروع من سجل التنفيذ.';
  }
}

export function formatRelativeTime(date?: Date | string | null) {
  if (!date) return 'غير محدد';

  const dateValue = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(dateValue.getTime())) return 'غير محدد';

  const diffMs = Date.now() - dateValue.getTime();
  const absMs = Math.abs(diffMs);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (absMs < hour) {
    const minutes = Math.max(1, Math.round(absMs / minute));
    return diffMs >= 0 ? `قبل ${formatNumber(minutes)} دقيقة` : `خلال ${formatNumber(minutes)} دقيقة`;
  }

  if (absMs < day) {
    const hours = Math.max(1, Math.round(absMs / hour));
    return diffMs >= 0 ? `قبل ${formatNumber(hours)} ساعة` : `خلال ${formatNumber(hours)} ساعة`;
  }

  if (absMs < 7 * day) {
    const days = Math.max(1, Math.round(absMs / day));
    return diffMs >= 0 ? `قبل ${formatNumber(days)} يوم` : `خلال ${formatNumber(days)} يوم`;
  }

  return formatDate(dateValue);
}
