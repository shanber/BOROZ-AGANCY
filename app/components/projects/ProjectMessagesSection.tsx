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
    <div className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 md:p-7">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-[#0B132B]">
            <MessageSquare size={18} className="text-[#06B6D4]" />
            Messages
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            استخدم هذه المساحة لتوثيق القرارات والتوضيحات والتحديثات التنفيذية داخل بروز فقط.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-xs font-semibold text-red-700">{error}</p>
        </div>
      )}

      <div
        ref={listRef}
        className="mb-5 max-h-[420px] min-h-[160px] overflow-y-auto space-y-4 rounded-[24px] border border-slate-200 bg-[#F8FAFC] p-4 md:p-5"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-xs text-slate-500">
            <Loader2 size={14} className="animate-spin" />
            جاري تحميل الرسائل...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <MessageSquare size={24} className="text-slate-300 mb-2" />
            <p className="text-sm text-slate-500">لا توجد رسائل في هذا المشروع حتى الآن.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isMine ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[88%] rounded-[22px] px-4 py-3.5 shadow-sm ${
                  msg.isMine
                    ? 'bg-[#0B132B] text-white rounded-tr-md'
                    : 'border border-slate-200 bg-white text-slate-900 rounded-tl-md'
                }`}
              >
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold">
                  <span className={msg.isMine ? 'text-white/70' : 'text-[#06B6D4]'}>
                    {msg.isMine ? 'أنت' : msg.sender.name || msg.sender.roleLabel}
                  </span>
                  {!msg.isMine ? <span className="text-slate-300">•</span> : null}
                  {!msg.isMine ? <span className="text-slate-400">{msg.sender.roleLabel}</span> : null}
                </div>
                <p className={`text-sm leading-7 whitespace-pre-wrap break-words ${msg.isMine ? 'text-white' : 'text-slate-900'}`}>
                  {msg.body}
                </p>
                <p
                  className={`mt-3 text-[10px] ${
                    msg.isMine ? 'text-white/55' : 'text-slate-400'
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
        <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">
          <p className="text-sm leading-7 text-slate-600">{messagingBlockedReason}</p>
        </div>
      ) : (
        <form onSubmit={handleSend} className="flex items-end gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب تحديثًا أو استفسارًا متعلقًا بالمشروع..."
            rows={3}
            className="flex-1 resize-none rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20"
            maxLength={2000}
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-[#0B132B] text-white transition-colors hover:bg-[#16213C] disabled:bg-slate-300"
            title="إرسال الرسالة"
          >
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      )}
    </div>
  );
}
