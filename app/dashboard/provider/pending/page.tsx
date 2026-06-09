import { ShieldCheck, Clock, ArrowRight, XCircle, AlertTriangle, Briefcase, FileText } from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/app/lib/prisma';
import LogoutButton from './LogoutButton';

export default async function PendingApprovalPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.globalRole !== 'PROVIDER') {
    redirect('/login');
  }

  const status = session.user.approvalStatus;

  if (status === 'APPROVED') {
    redirect('/dashboard');
  }

  const provider = await prisma.expertProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      services: {
        include: { service: { include: { category: true } } }
      },
      portfolioItems: true
    }
  });

  const renderContent = () => {
    switch (status) {
      case 'REJECTED':
        return (
          <>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#111827] mb-3">
              نأسف، تم رفض طلبك
            </h1>
            <p className="text-[#475569] mb-8 leading-relaxed text-base">
              بعد المراجعة، لم نتمكن من قبول طلب انضمامك لمنصة بروز في الوقت الحالي. يمكنك التواصل مع الدعم الفني لمزيد من التفاصيل.
            </p>
          </>
        );
      case 'SUSPENDED':
        return (
          <>
            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-yellow-100">
              <AlertTriangle className="w-10 h-10 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#111827] mb-3">
              حسابك موقوف مؤقتاً
            </h1>
            <p className="text-[#475569] mb-8 leading-relaxed text-base">
              تم إيقاف حسابك من قبل الإدارة. يرجى التواصل مع فريق الدعم الفني لحل المشكلة واستعادة وصولك للمنصة.
            </p>
          </>
        );
      case 'PENDING':
      default:
        return (
          <>
            <div className="w-20 h-20 bg-[#06B6D4]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#06B6D4]/20">
              <Clock className="w-10 h-10 text-[#06B6D4]" />
            </div>
            <h1 className="text-2xl font-bold text-[#111827] mb-2">
              {session.user.name ? `أهلاً ${session.user.name}` : 'أهلاً بك'}
            </h1>
            <p className="text-base font-semibold text-[#06B6D4] mb-4">طلبك قيد المراجعة</p>
            <p className="text-[#475569] mb-8 leading-relaxed text-base">
              فريقنا يقوم حالياً بمراجعة طلب انضمامك كمقدم خدمة على منصة بروز.
              <br />
              تستغرق المراجعة عادة بين 24 إلى 48 ساعة عمل لضمان جودة مقدمي الخدمات المعتمدين لدينا.
            </p>
            <div className="bg-[#F8FAFC] rounded-xl p-6 mb-8 text-right border border-[#E5E7EB]">
              <h3 className="text-[#111827] font-semibold flex items-center justify-end gap-2 mb-4">
                ماذا بعد؟ <ShieldCheck className="w-5 h-5 text-[#06B6D4]" />
              </h3>
              <ul className="space-y-3 text-[#475569] text-sm mb-6">
                <li className="flex items-center justify-end gap-2">
                  <span>سنقوم بمراجعة معرض أعمالك وخبراتك</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B132B]" />
                </li>
                <li className="flex items-center justify-end gap-2">
                  <span>سيصلك إشعار بالبريد الإلكتروني فور الموافقة</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B132B]" />
                </li>
              </ul>

              {provider && (
                <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] space-y-4 text-sm text-[#475569]">
                  <h4 className="text-[#111827] font-semibold border-b border-[#E5E7EB] pb-2 mb-2">ملخص طلبك</h4>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-[#111827] font-medium">{provider.specialtyTitle}</span>
                    <span className="text-[#475569]">التخصص</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#111827] font-medium flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-[#06B6D4]"/> {provider.services.length}</span>
                    <span className="text-[#475569]">الخدمات المحددة</span>
                  </div>
                  {provider.services.length > 0 && (
                    <div className="text-xs text-[#475569] text-right">
                      {Array.from(new Set(provider.services.map(s => s.service.category?.nameAr))).join('، ')}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#E5E7EB]">
                    <span className="text-[#111827] font-medium flex items-center gap-1.5"><FileText className="w-4 h-4 text-[#06B6D4]"/> {provider.portfolioItems.length + (provider.portfolioUrl ? 1 : 0) + (provider.linkedinUrl ? 1 : 0)}</span>
                    <span className="text-[#475569]">الأعمال المرفقة</span>
                  </div>
                </div>
              )}
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      {/* Subtle decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#06B6D4] opacity-[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0B132B] opacity-[0.03] rounded-full blur-3xl" />
      </div>

      <div className="max-w-xl w-full bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-8 md:p-10 text-center relative z-10">
        {renderContent()}

        <div className="flex gap-4 justify-center mt-6">
          <LogoutButton />
          <Link href="/" className="px-6 py-2.5 bg-[#0B132B] hover:bg-slate-800 text-white rounded-lg transition-colors font-medium flex items-center gap-2 shadow-sm">
            العودة للرئيسية <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
