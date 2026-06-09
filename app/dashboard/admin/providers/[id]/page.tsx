import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { redirect, notFound } from 'next/navigation';
import prisma from '@/app/lib/prisma';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Clock, XCircle, AlertTriangle, User, Mail, Briefcase, Calendar, Link as LinkIcon } from 'lucide-react';
import ProviderDetailsClient from './ProviderDetailsClient';
import { formatShortDate, formatDate } from '@/app/lib/formatters';

export default async function AdminProviderDetailsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.globalRole !== 'ADMIN') {
    redirect('/dashboard');
  }

  const providerId = params.id;

  const provider = await prisma.expertProfile.findUnique({
    where: { id: providerId },
    include: {
      user: true,
      services: {
        include: {
          service: {
            include: {
              category: true,
            }
          },
        }
      },
      portfolioItems: true,
    },
  });

  if (!provider) {
    notFound();
  }

  let reviewer = null;
  if (provider.reviewedById) {
    reviewer = await prisma.user.findUnique({
      where: { id: provider.reviewedById },
      select: { name: true }
    });
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium border border-green-200">
            <BadgeCheck className="w-4 h-4" />
            معتمد
          </span>
        );
      case 'PENDING':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200">
            <Clock className="w-4 h-4" />
            قيد المراجعة
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-sm font-medium border border-red-200">
            <XCircle className="w-4 h-4" />
            مرفوض
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-700 text-sm font-medium border border-yellow-200">
            <AlertTriangle className="w-4 h-4" />
            موقوف
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link 
          href="/dashboard/admin/providers" 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للقائمة
        </Link>
        <div className="flex items-center gap-2">
          {getStatusBadge(provider.approvalStatus)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Info & Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-center w-20 h-20 bg-slate-100 text-slate-400 rounded-full mx-auto mb-4">
              <User className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-center text-slate-900 mb-1">{provider.user.name}</h2>
            <p className="text-center text-slate-500 text-sm mb-6">{provider.specialtyTitle || 'مستقل غير محدد التخصص'}</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-slate-400" />
                <a href={`mailto:${provider.user.email}`} className="text-slate-600 hover:text-[#06B6D4] truncate">
                  {provider.user.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">سجل في {formatShortDate(provider.createdAt)}</span>
              </div>
              {provider.yearsOfExperience !== null && (
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">خبرة {provider.yearsOfExperience} سنوات</span>
                </div>
              )}
              {provider.portfolioUrl && (
                <div className="flex items-center gap-3 text-sm">
                  <LinkIcon className="w-4 h-4 text-slate-400" />
                  <a href={provider.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-[#06B6D4] hover:underline truncate">
                    معرض الأعمال
                  </a>
                </div>
              )}
              {provider.linkedinUrl && (
                <div className="flex items-center gap-3 text-sm">
                  <LinkIcon className="w-4 h-4 text-slate-400" />
                  <a href={provider.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[#06B6D4] hover:underline truncate">
                    حساب LinkedIn
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons (Client Component) */}
          <ProviderDetailsClient 
            providerId={provider.id} 
            currentStatus={provider.approvalStatus} 
          />
        </div>

        {/* Right Column: Bio, Services, Review Notes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Bio */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">نبذة عن المستقل</h3>
            <p className="text-slate-600 whitespace-pre-wrap text-sm leading-relaxed">
              {provider.bio || 'لم يقم المستقل بكتابة نبذة عن نفسه.'}
            </p>
          </div>

          {/* Services */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">الخدمات المقدمة</h3>
            {provider.services.length === 0 ? (
              <p className="text-slate-500 text-sm">لم يقم المستقل بتحديد خدمات بعد.</p>
            ) : (
              <div className="space-y-4">
                {/* Group services by category */}
                {Array.from(new Set(provider.services.map(s => s.service.category?.nameAr || s.service.categoryId))).map(categoryName => (
                  <div key={categoryName || 'uncategorized'}>
                    <h4 className="font-semibold text-slate-700 mb-2">{categoryName}</h4>
                    <ul className="space-y-2">
                      {provider.services.filter(s => (s.service.category?.nameAr || s.service.categoryId) === categoryName).map((es) => (
                        <li key={es.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <span className="text-slate-700 font-medium text-sm">{es.service.nameAr || es.service.name}</span>
                          {es.startingPrice && (
                            <span className="text-slate-500 text-xs">يبدأ من {es.startingPrice} ر.س</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Portfolio Items */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">الأعمال السابقة</h3>
            {provider.portfolioItems.length === 0 && !provider.portfolioUrl && !provider.linkedinUrl ? (
              <p className="text-slate-500 text-sm">لم يقم المستقل بإضافة أعمال سابقة.</p>
            ) : (
              <div className="space-y-4">
                {provider.portfolioItems.map((item) => (
                  <div key={item.id} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h4 className="font-semibold text-slate-900">{item.title}</h4>
                    {item.description && <p className="text-sm text-slate-600 mt-1">{item.description}</p>}
                    {item.projectUrl && (
                      <a href={item.projectUrl} target="_blank" rel="noreferrer" className="text-sm text-[#06B6D4] hover:underline mt-2 inline-block">
                        عرض المشروع
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Review Details if any */}
          {(provider.reviewedAt || provider.rejectionReason) && (
            <div className={`bg-slate-50 rounded-xl shadow-sm border p-6 ${provider.approvalStatus === 'REJECTED' ? 'border-red-200' : 'border-slate-200'}`}>
              <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">تفاصيل المراجعة</h3>
              <div className="space-y-3 text-sm">
                {provider.reviewedAt && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">تاريخ المراجعة:</span>
                    <span className="text-slate-700">{formatDate(provider.reviewedAt)}</span>
                  </div>
                )}
                {reviewer?.name && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">تمت المراجعة بواسطة:</span>
                    <span className="text-slate-700">{reviewer.name}</span>
                  </div>
                )}
                {provider.rejectionReason && (
                  <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
                    <span className="block font-semibold mb-1">سبب الرفض:</span>
                    <p>{provider.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
