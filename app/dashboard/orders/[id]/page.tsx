'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { orders, Order } from '@/app/lib/demo-data';
import {
  ArrowRight,
  ShoppingCart,
  User,
  Phone,
  Mail,
  Link2,
  DollarSign,
  MessageSquare,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Send,
} from 'lucide-react';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const orderId = params.id;
  const foundOrder = orders.find((o) => o.id === orderId);

  // Status and details state
  const [order, setOrder] = useState<Order | undefined>(foundOrder);
  const [messageText, setMessageText] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showMsgAlert, setShowMsgAlert] = useState(false);

  if (!order) {
    return (
      <div className="space-y-6 max-w-md mx-auto py-12 animate-fade-in">
        <Card className="border-red-200 bg-red-50/20 text-center">
          <CardBody className="p-8 space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-red-950 font-sans">الطلب غير موجود</h3>
              <p className="text-sm text-red-700 font-sans">
                عذراً، لم نتمكن من العثور على الطلب الرقم <span className="font-bold">{orderId}</span> في قاعدة البيانات.
              </p>
            </div>
            <div className="pt-4">
              <Link href="/dashboard/orders">
                <Button className="bg-[#5B4DFF] hover:bg-[#4b3dff] text-white w-full py-2.5 rounded-xl font-sans font-bold text-xs">
                  العودة لقائمة الطلبات
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Map status to step progress
  // Timeline:
  // 1. تم استلام الطلب (New)
  // 2. قيد المراجعة (New/Review)
  // 3. بانتظار اعتماد العميل (Awaiting Client)
  // 4. قيد التنفيذ (In Progress)
  // 5. مكتمل (Completed)
  const steps = [
    { label: 'تم استلام الطلب', status: 'جديد' },
    { label: 'قيد المراجعة', status: 'جديد' },
    { label: 'بانتظار اعتماد العميل', status: 'بانتظار العميل' },
    { label: 'قيد التنفيذ', status: 'قيد التنفيذ' },
    { label: 'مكتمل', status: 'مكتمل' },
  ];

  const getActiveStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'جديد':
        return 1; // Completed step 1, step 2 in progress
      case 'بانتظار العميل':
        return 2; // Completed step 1, 2, step 3 in progress
      case 'قيد التنفيذ':
        return 3; // Completed step 1, 2, 3, step 4 in progress
      case 'مكتمل':
        return 4; // All completed
      default:
        return 0;
    }
  };

  const currentStepIdx = getActiveStepIndex(order.status);

  const handleUpdateStatus = (newStatus: Order['status']) => {
    setOrder({
      ...order,
      status: newStatus,
    });
    setShowStatusModal(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    // Simulate sending message
    setShowMsgAlert(true);
    setMessageText('');
    setTimeout(() => {
      setShowMsgAlert(false);
    }, 3500);
  };

  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'مكتمل':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'قيد التنفيذ':
        return 'bg-[#5B4DFF]/10 text-[#5B4DFF] border border-[#5B4DFF]/20';
      case 'بانتظار العميل':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'جديد':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/orders"
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200/80 rounded-xl text-slate-600 hover:text-slate-900 transition-colors"
            title="العودة للطلبات"
          >
            <ArrowRight size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold text-[#111827] font-sans">{order.id}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sans ${getStatusStyle(order.status)}`}>
                {order.status}
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#64748B] mt-1 font-sans">
              تفاصيل ومجريات الطلب الخاص بـ <span className="font-bold text-slate-700">{order.storeName}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowStatusModal(true)}
            className="border border-slate-200 text-xs font-bold flex items-center gap-1.5 px-3 py-2 rounded-xl"
          >
            <RefreshCw size={14} />
            تحديث الحالة
          </Button>
          <Link href="/dashboard/orders">
            <Button variant="ghost" className="text-slate-600 hover:bg-slate-100 text-xs font-bold px-3 py-2 rounded-xl border border-transparent">
              العودة للطلبات
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Details on left, timeline on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: 2 columns details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Details Card */}
          <Card className="border border-slate-200/80 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-200/60 px-6 py-4 flex items-center gap-2">
              <ShoppingCart size={18} className="text-[#5B4DFF]" />
              <h3 className="font-bold text-sm text-[#111827] font-sans">بيانات الخدمة المطلوبة</h3>
            </CardHeader>
            <CardBody className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1 font-sans">الخدمة المطلوبة</span>
                  <span className="text-sm font-bold text-[#111827] font-sans">{order.serviceLabel}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1 font-sans">الميزانية المقررة</span>
                  <span className="text-sm font-bold text-[#111827] font-sans flex items-center gap-1">
                    <DollarSign size={16} className="text-emerald-600" />
                    {order.price}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-1 font-sans">وصف الطلب</span>
                <p className="text-xs text-slate-650 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 font-sans">
                  {order.description}
                </p>
              </div>

              {order.notes && (
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1 font-sans">ملاحظات إضافية</span>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans bg-slate-50/40 p-3 rounded-xl border border-slate-100 border-dashed">
                    {order.notes}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Client Card */}
          <Card className="border border-slate-200/80 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-200/60 px-6 py-4 flex items-center gap-2">
              <User size={18} className="text-[#5B4DFF]" />
              <h3 className="font-bold text-sm text-[#111827] font-sans">بيانات العميل</h3>
            </CardHeader>
            <CardBody className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                      <User size={16} />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 font-bold block font-sans">اسم المسؤول</span>
                      <span className="text-xs font-semibold text-slate-800 font-sans">{order.managerName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                      <Phone size={16} />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 font-bold block font-sans">رقم الجوال</span>
                      <span className="text-xs font-semibold text-slate-800 font-sans" style={{ direction: 'ltr' }}>{order.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                      <Mail size={16} />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 font-bold block font-sans">البريد الإلكتروني</span>
                      <span className="text-xs font-semibold text-slate-800 font-sans">{order.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                      <Link2 size={16} />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 font-bold block font-sans">رابط متجر سلة</span>
                      <a
                        href={order.sallaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-[#5B4DFF] hover:underline font-sans truncate block max-w-[200px]"
                      >
                        {order.sallaUrl}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Side: Timeline & Chat mock */}
        <div className="space-y-6">
          {/* Timeline Card */}
          <Card className="border border-slate-200/80 shadow-sm">
            <CardHeader className="bg-white border-b border-slate-200/80 px-5 py-4">
              <h3 className="font-bold text-sm text-[#111827] font-sans">مسار تقدم الطلب</h3>
            </CardHeader>
            <CardBody className="p-5">
              <div className="relative pr-4 border-r-2 border-slate-100 space-y-6 py-2">
                {steps.map((step, idx) => {
                  const isCompleted = idx < currentStepIdx || order.status === 'مكتمل';
                  const isCurrent = idx === currentStepIdx && order.status !== 'مكتمل';
                  
                  return (
                    <div key={idx} className="relative flex gap-3 items-start">
                      {/* Circle indicator */}
                      <div
                        className={`absolute -right-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${isCompleted ? 'bg-[#5B4DFF] border-[#5B4DFF]' : isCurrent ? 'bg-white border-[#5B4DFF] ring-4 ring-[#5B4DFF]/25' : 'bg-white border-slate-200'}`}
                      />
                      
                      <div className="space-y-0.5">
                        <span className={`text-xs font-bold font-sans block ${isCompleted || isCurrent ? 'text-slate-800' : 'text-slate-400'}`}>
                          {step.label}
                        </span>
                        <span className="text-[9px] text-slate-450 font-sans block">
                          {isCompleted ? 'مكتمل' : isCurrent ? 'قيد المتابعة حالياً' : 'مجدول'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          {/* Quick Chat card */}
          <Card className="border border-slate-200/80 shadow-sm">
            <CardHeader className="bg-white border-b border-slate-200/80 px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#111827] font-sans flex items-center gap-1.5">
                <MessageSquare size={16} className="text-[#5B4DFF]" />
                مراسلة العميل
              </h3>
            </CardHeader>
            <CardBody className="p-5 space-y-4">
              {showMsgAlert && (
                <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-xl text-[10px] font-bold font-sans flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  تم إرسال الرسالة للعميل (Demo) بنجاح!
                </div>
              )}
              <form onSubmit={handleSendMessage} className="space-y-3">
                <textarea
                  placeholder="اكتب رسالة للعميل حول مستجدات الطلب..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={3}
                  className="input-base text-xs min-h-[70px] resize-none"
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-[#5B4DFF] hover:bg-[#4b3dff] text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                >
                  <Send size={12} />
                  إرسال الرسالة
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Update Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 shadow-xl animate-scale-in">
            <h3 className="text-sm font-bold text-[#111827] font-sans">تحديث حالة الطلب</h3>
            <p className="text-xs text-slate-500 font-sans leading-relaxed">
              اختر الحالة الجديدة للطلب لتحديث العرض والمسار الزمني فوراً.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {(['جديد', 'قيد التنفيذ', 'بانتظار العميل', 'مكتمل'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => handleUpdateStatus(st)}
                  className={`py-2 px-3 rounded-xl border text-[11px] font-bold font-sans transition-all text-center ${order.status === st ? 'bg-[#5B4DFF]/10 text-[#5B4DFF] border-[#5B4DFF]/30 ring-2 ring-[#5B4DFF]/10' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-650'}`}
                >
                  {st}
                </button>
              ))}
            </div>
            <div className="pt-2 flex justify-end">
              <Button
                variant="ghost"
                onClick={() => setShowStatusModal(false)}
                className="text-xs font-bold text-slate-500 hover:bg-slate-55"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
