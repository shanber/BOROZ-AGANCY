'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Send, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function MessagesPage() {
  const mockConversations = [
    { name: 'م. خالد عبد الرحمن (مقدم خدمة)', lastMsg: 'تم ربط الدفع بنجاح، يرجى المراجعة.', time: 'منذ 10 دقائق', active: true },
    { name: 'عمر اليافعي (تصميم)', lastMsg: 'أرسلت لك المسودة الأولى للثيم المخصص.', time: 'أمس، 3:45 م', active: false },
    { name: 'سارة العتيبي (SEO)', lastMsg: 'بدأنا في كتابة الميتا والتجهيز الأولي للكلمات.', time: '2 يونيو 2026', active: false },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in font-sans">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 rtl:mr-3 rtl:ml-0">
            <p className="text-sm text-yellow-700 font-bold">
              ملاحظة: البيانات المعروضة في هذه الصفحة هي بيانات تجريبية (Placeholder) وليست حقيقية. سيتم ربطها بقاعدة البيانات في المرحلة القادمة.
            </p>
          </div>
        </div>
      </div>
      <div className="border-b border-slate-200/60 pb-5">
        <h2 className="text-xl md:text-2xl font-bold text-[#111827]">الرسائل والمناقشات</h2>
        <p className="text-xs md:text-sm text-[#64748B] mt-1">
          تواصل مباشرة مع مقدمي الخدمات والخبراء للاتفاق حول المتطلبات والتنفيذ.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[550px]">
        {/* Chats List */}
        <Card className="border border-slate-200 overflow-hidden flex flex-col h-full bg-white rounded-2xl">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-xs text-slate-800">المحادثات النشطة</h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {mockConversations.map((c, idx) => (
              <button
                key={idx}
                className={`w-full text-right p-4 flex gap-3 transition-colors hover:bg-slate-50 ${
                  c.active ? 'bg-[#06B6D4]/5 border-r-4 border-[#06B6D4]' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
                  <User size={18} />
                </div>
                <div className="space-y-1 overflow-hidden">
                  <div className="flex justify-between items-center gap-2">
                    <h4 className="font-bold text-xs text-slate-800 truncate">{c.name}</h4>
                    <span className="text-[9px] text-slate-450 shrink-0">{c.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">{c.lastMsg}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2 border border-slate-200 overflow-hidden flex flex-col h-full bg-white rounded-2xl">
          <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <div className="w-10 h-10 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-bold text-xs">
              خ أ
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-850">م. خالد عبد الرحمن (مقدم خدمة)</h4>
              <span className="text-[9px] text-emerald-500 font-medium">نشط الآن</span>
            </div>
          </div>

          <div className="flex-1 p-4 bg-slate-50/30 overflow-y-auto space-y-4">
            <div className="flex gap-3 text-right">
              <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                <User size={14} />
              </div>
              <div className="bg-white border border-slate-150 rounded-2xl rounded-tr-none p-3 max-w-[70%] space-y-1">
                <p className="text-xs text-slate-700 leading-relaxed">
                  مرحباً بك! لقد استلمت طلب تخصيص المتجر، وجاري العمل على ضبط بوابات الدفع حالياً.
                </p>
                <span className="block text-[8px] text-slate-400 text-left">10:15 ص</span>
              </div>
            </div>

            <div className="flex gap-3 text-left justify-end">
              <div className="bg-[#06B6D4] text-white rounded-2xl rounded-tl-none p-3 max-w-[70%] space-y-1">
                <p className="text-xs leading-relaxed">
                  ممتاز جداً يا خالد. هل ستقوم بضبط الشحن أيضاً مع نفس الطلب؟
                </p>
                <span className="block text-[8px] text-[#0B132B]/60 text-right">10:18 ص</span>
              </div>
            </div>

            <div className="flex gap-3 text-right">
              <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                <User size={14} />
              </div>
              <div className="bg-white border border-slate-150 rounded-2xl rounded-tr-none p-3 max-w-[70%] space-y-1">
                <p className="text-xs text-slate-700 leading-relaxed">
                  نعم بالتأكيد، قمت بتهيئة سمسا وسيكون الشحن مفعلاً تلقائياً. تم ربط الدفع بنجاح، يرجى المراجعة.
                </p>
                <span className="block text-[8px] text-slate-400 text-left">10:25 ص</span>
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#06B6D4] focus:border-[#06B6D4] bg-white"
            />
            <Button className="bg-[#06B6D4] hover:bg-[#0891B2] text-white p-2.5 rounded-xl">
              <Send size={15} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
