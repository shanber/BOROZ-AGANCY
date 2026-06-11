'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Loader2 } from 'lucide-react';

interface MessageSender {
  id: string;
  name: string;
  role: string;
  roleLabel: string;
}

interface Message {
  id: string;
  body: string;
  createdAt: string;
  projectId: string;
  sender: MessageSender;
  isMine: boolean;
}

export function ProjectMessagesSection({
  projectId,
  messagingBlockedReason = null,
}: {
  projectId: string;
  messagingBlockedReason?: string | null;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [text, setText] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  const canSend = !messagingBlockedReason;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`/api/projects/${projectId}/messages`);
        if (!res.ok) throw new Error('فشل تحميل الرسائل');
        const data = await res.json();
        if (!cancelled) setMessages(data);
      } catch {
        if (!cancelled) setError('تعذر تحميل رسائل المشروع');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [projectId]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending || !canSend) return;

    setSending(true);
    setError('');

    try {
      const res = await fetch(`/api/projects/${projectId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'فشل إرسال الرسالة');
      }

      setMessages((prev) => [...prev, data]);
      setText('');
    } catch (err: any) {
      const msg = err.message;
      if (
        msg.includes('تواصل') ||
        msg.includes('واتساب') ||
        msg.includes('whatsapp') ||
        msg.includes('@')
      ) {
        setError('لا يمكن مشاركة بيانات تواصل خارجية داخل المشروع.');
      } else {
        setError(msg);
      }
    } finally {
      setSending(false);
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('ar-SA-u-nu-latn', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#111827]">
        <MessageSquare size={18} className="text-[#06B6D4]" />
        محادثة المشروع
      </div>
      <p className="mb-4 text-xs text-slate-500">
        استخدم هذه المساحة لتوثيق النقاشات والتحديثات داخل بروز.
      </p>

      {error && (
        <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5">
          <p className="text-xs font-semibold text-red-700">{error}</p>
        </div>
      )}

      <div
        ref={listRef}
        className="mb-4 max-h-[360px] min-h-[120px] overflow-y-auto space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-xs text-slate-500">
            <Loader2 size={14} className="animate-spin" />
            جاري تحميل الرسائل...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare size={24} className="text-slate-300 mb-2" />
            <p className="text-xs text-slate-500">لا توجد رسائل في هذا المشروع حتى الآن.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isMine ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-2.5 ${
                  msg.isMine
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-white border border-slate-200 rounded-tl-sm text-slate-900'
                }`}
              >
                {!msg.isMine && (
                  <p className="mb-0.5 text-[10px] font-semibold text-[#06B6D4]">
                    {msg.sender.name || msg.sender.roleLabel}
                  </p>
                )}
                <p className={`text-xs leading-relaxed whitespace-pre-wrap break-words ${msg.isMine ? '' : 'text-slate-900'}`}>
                  {msg.body}
                </p>
                <p
                  className={`mt-1 text-[9px] ${
                    msg.isMine ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {messagingBlockedReason ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs text-slate-600">{messagingBlockedReason}</p>
        </div>
      ) : (
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب تحديثًا أو استفسارًا متعلقًا بالمشروع..."
            rows={2}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            maxLength={2000}
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300 transition-colors"
            title="إرسال الرسالة"
          >
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      )}
    </div>
  );
}
