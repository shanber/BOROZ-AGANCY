import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import { Activity, Briefcase, DollarSign, Star, TrendingUp, Users } from 'lucide-react';
import prisma from '@/app/lib/prisma';

export default async function ProviderDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.globalRole !== 'PROVIDER') {
    redirect('/login');
  }

  // Double check approval
  if (session.user.approvalStatus !== 'APPROVED') {
    redirect('/dashboard/provider/pending');
  }

  const provider = await prisma.expertProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      services: {
        include: { service: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B132B]">لوحة مقدم الخدمة</h1>
          <p className="text-slate-500 text-sm mt-1">مرحباً بك مجدداً {session.user.name}، إليك ملخص نشاطك</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6 text-[#06B6D4]" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">الأرباح (هذا الشهر)</p>
            <h3 className="text-2xl font-bold text-[#0B132B] mt-1">0 ر.س</h3>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="w-3 h-3" /> +0%
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">الطلبات النشطة</p>
            <h3 className="text-2xl font-bold text-[#0B132B] mt-1">0</h3>
            <p className="text-xs text-slate-400 mt-1">قيد التنفيذ حالياً</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">الخدمات المعروضة</p>
            <h3 className="text-2xl font-bold text-[#0B132B] mt-1">{provider?.services.length || 0}</h3>
            <p className="text-xs text-slate-400 mt-1">مفعلة وتستقبل الطلبات</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">التقييم العام</p>
            <h3 className="text-2xl font-bold text-[#0B132B] mt-1">--</h3>
            <p className="text-xs text-slate-400 mt-1">لا يوجد تقييمات بعد</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#0B132B] mb-4">أحدث الطلبات</h2>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 mb-2">لا توجد طلبات جديدة حالياً.</p>
            <p className="text-sm text-slate-400 mb-6">عندما يقوم عميل بطلب خدماتك، ستظهر هنا.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#0B132B] mb-4">خدماتي المفعلة</h2>
          {provider?.services && provider.services.length > 0 ? (
            <ul className="space-y-3">
              {provider.services.map(s => (
                <li key={s.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-700 font-medium text-sm">{s.service.nameAr || s.service.name}</span>
                  {s.startingPrice && <span className="text-sm text-[#06B6D4] font-semibold">{s.startingPrice} ر.س</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-sm">لم تقم بتفعيل أي خدمات بعد.</p>
          )}
        </div>
      </div>
    </div>
  );
}
