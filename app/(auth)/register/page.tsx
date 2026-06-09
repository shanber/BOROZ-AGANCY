import Link from 'next/link';
import Image from 'next/image';
import { Store, UserCircle2, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'التسجيل | بروز',
  description: 'اختر نوع الحساب المناسب وابدأ رحلتك داخل المنصة.',
};

export default function RegisterHubPage() {
  return (
    <div className="min-h-screen bg-[#0B132B] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl relative z-10">
        
        {/* Logo & Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-8">
            <Image 
              src="/شعار%20بروز.svg" 
              alt="بروز" 
              width={100}
              height={40}
              className="h-10 w-auto object-contain brightness-0 invert opacity-90 mx-auto" 
            />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            اختر طريقة استخدام بروز
          </h1>
          <p className="text-slate-400 text-lg">
            انضم إلى بروز كتاجر أو كمستقل وابدأ رحلتك داخل المنصة.
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Card 1: Merchant */}
          <div className="bg-[#111C44] border border-[#1E293B] rounded-2xl p-8 flex flex-col h-full hover:border-[#06B6D4] transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#06B6D4] opacity-[0.03] rounded-bl-full group-hover:opacity-[0.08] transition-opacity" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-[#06B6D4]/10 rounded-xl flex items-center justify-center text-[#06B6D4]">
                <Store className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-white">تسجيل متجر</h2>
            </div>
            
            <p className="text-slate-300 mb-8 flex-grow leading-relaxed">
              اطلب خدمات لمتجرك، استقبل عروضًا لاحقًا، وتابع مشاريعك من لوحة واحدة.
            </p>

            <Link 
              href="/register/merchant"
              className="w-full py-4 px-6 bg-[#06B6D4] hover:bg-[#0891B2] text-white rounded-xl font-bold text-center transition-colors flex items-center justify-center gap-2 group-hover:gap-3"
            >
              تسجيل متجر
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>

          {/* Card 2: Provider */}
          <div className="bg-[#111C44] border border-[#1E293B] rounded-2xl p-8 flex flex-col h-full hover:border-[#22C55E] transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E] opacity-[0.03] rounded-bl-full group-hover:opacity-[0.08] transition-opacity" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-[#22C55E]/10 rounded-xl flex items-center justify-center text-[#22C55E]">
                <UserCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-white">تسجيل مقدم خدمة</h2>
            </div>
            
            <p className="text-slate-300 mb-8 flex-grow leading-relaxed">
              قدّم طلب الانضمام كمقدم خدمة، اختر خدماتك، وأرفق نماذج من أعمالك للمراجعة.
            </p>

            <Link 
              href="/register/provider"
              className="w-full py-4 px-6 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl font-bold text-center transition-colors flex items-center justify-center gap-2 group-hover:gap-3"
            >
              تسجيل مقدم خدمة
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>

        </div>

        {/* Login Link */}
        <div className="text-center mt-12">
          <p className="text-slate-400 mb-4">
            لديك حساب بالفعل؟
          </p>
          <Link 
            href="/login" 
            className="inline-flex py-3 px-8 border border-[#1E293B] hover:bg-[#1E293B] text-white rounded-xl font-medium transition-colors"
          >
            تسجيل الدخول
          </Link>
        </div>

      </div>
    </div>
  );
}
