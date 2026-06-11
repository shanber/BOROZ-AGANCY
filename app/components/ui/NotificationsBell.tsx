'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Loader2 } from 'lucide-react';

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  url: string | null;
  readAt: string | null;
  createdAt: string;
};

export function NotificationsBell() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  const loadNotifications = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifications', { cache: 'no-store' });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data) return;
      setUnreadCount(data.unreadCount || 0);
      setNotifications(data.notifications || []);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markRead = async (notificationId: string) => {
    await fetch(`/api/notifications/${encodeURIComponent(notificationId)}/read`, {
      method: 'PATCH',
    }).catch(() => null);
  };

  const markAllRead = async () => {
    await fetch('/api/notifications/read-all', {
      method: 'PATCH',
    }).catch(() => null);
    await loadNotifications();
  };

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.readAt) {
      await markRead(notification.id);
    }
    await loadNotifications();
    setOpen(false);
    if (notification.url) {
      router.push(notification.url);
    }
  };

  const toggleOpen = async () => {
    const nextState = !open;
    setOpen(nextState);
    if (nextState) {
      await loadNotifications();
    }
  };

  const badgeLabel = unreadCount > 99 ? '+99' : String(unreadCount);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={toggleOpen}
        className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors"
        aria-label="التنبيهات"
      >
        <Bell size={18} className="text-slate-600" />
        {unreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
            {badgeLabel}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute left-0 top-full mt-2 z-50 w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <div className="text-sm font-bold text-[#111827]">التنبيهات</div>
              <div className="text-[11px] text-slate-500">راجع التفاصيل داخل بروز</div>
            </div>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[11px] font-bold text-[#06B6D4] hover:text-[#0891B2]"
              >
                تحديد الكل كمقروء
              </button>
            ) : null}
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm font-bold text-slate-500">
                <Loader2 size={16} className="animate-spin" />
                جاري تحميل التنبيهات...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-500">لا توجد تنبيهات جديدة</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleNotificationClick(notification)}
                    className={`block w-full px-4 py-4 text-right transition-colors hover:bg-slate-50 ${notification.readAt ? 'bg-white' : 'bg-cyan-50/40'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-[#111827]">{notification.title}</div>
                        <div className="mt-1 max-w-full whitespace-pre-wrap break-words text-xs leading-6 text-slate-600 [overflow-wrap:anywhere] line-clamp-2">
                          {notification.message}
                        </div>
                      </div>
                      {!notification.readAt ? <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" /> : null}
                    </div>
                    <div className="mt-2 text-[11px] text-slate-400">
                      {new Date(notification.createdAt).toLocaleString('en-GB')}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
