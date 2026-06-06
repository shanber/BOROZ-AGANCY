'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Search, Calendar, DollarSign, BarChart3 } from 'lucide-react';
import { projects, Project } from '@/app/lib/demo-data';

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterTabs = [
    { label: 'الكل', count: projects.length },
    { label: 'نشط', count: projects.filter(p => p.status === 'نشط').length },
    { label: 'متأخر', count: projects.filter(p => p.status === 'متأخر').length },
    { label: 'بانتظار العميل', count: projects.filter(p => p.status === 'بانتظار العميل').length },
    { label: 'مكتمل', count: projects.filter(p => p.status === 'مكتمل').length },
  ];

  // Filter and Search logic
  const filteredProjects = projects.filter((project) => {
    const matchesFilter = activeFilter === 'الكل' || project.status === activeFilter;
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      project.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusStyle = (status: Project['status']) => {
    switch (status) {
      case 'مكتمل':
        return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'نشط':
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'بانتظار العميل':
        return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'متأخر':
        return 'text-red-600 bg-red-50 border-red-100';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#111827] font-sans">المشاريع</h2>
          <p className="text-xs md:text-sm text-[#64748B] mt-1 font-sans">
            متابعة مشاريع العملاء ومراحل التنفيذ ونسب الإنجاز.
          </p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="bg-[#5B4DFF] hover:bg-[#4b3dff] text-white text-xs font-bold shadow-sm shadow-[#5B4DFF]/10 flex items-center gap-1.5 px-4 py-2.5 rounded-xl">
            <Plus size={16} />
            مشروع جديد
          </Button>
        </Link>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl max-w-max">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveFilter(tab.label)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${isActive ? 'bg-white text-[#111827] shadow-sm' : 'text-slate-600 hover:text-[#111827]'}`}
              >
                <span className="font-sans">{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${isActive ? 'bg-[#5B4DFF] text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="w-full lg:w-72">
          <Input
            placeholder="ابحث باسم المشروع أو العميل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={16} className="text-slate-400" />}
            className="bg-white border-slate-200"
          />
        </div>
      </div>

      {/* Conditional Content */}
      {filteredProjects.length === 0 ? (
        <Card className="border border-slate-200/80 shadow-sm">
          <CardBody className="p-12 text-center text-slate-500 space-y-2">
            <p className="text-sm font-sans">لا توجد مشاريع تطابق خيارات الفلترة أو البحث الحالية.</p>
            <button 
              onClick={() => { setActiveFilter('الكل'); setSearchQuery(''); }}
              className="text-xs text-[#5B4DFF] font-bold hover:underline font-sans"
            >
              إعادة ضبط الفلاتر
            </button>
          </CardBody>
        </Card>
      ) : (
        <>
          {/* Projects Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, idx) => (
              <Card key={idx} className="border border-slate-200/80 hover:shadow-md transition-shadow">
                <CardBody className="p-5 space-y-4">
                  {/* Title & Tag */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="font-bold text-xs text-[#111827] font-sans line-clamp-2 leading-relaxed min-h-[36px]">
                        {project.name}
                      </h3>
                      <span className="text-[10px] text-[#64748B] font-bold font-sans block">{project.client}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-sans border shrink-0 ${getStatusStyle(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold font-sans">
                      <span className="text-slate-500">نسبة الإنجاز</span>
                      <span className="text-[#5B4DFF]">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#5B4DFF] h-1.5 rounded-full transition-all duration-500" 
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Meta: Budget & Date */}
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 font-sans">
                    <div className="flex items-center gap-1">
                      <Calendar size={13} className="text-slate-450" />
                      <span>{project.date}</span>
                    </div>
                    <div className="flex items-center gap-1 font-sans">
                      <DollarSign size={13} className="text-emerald-600" />
                      <span className="text-slate-700 font-sans">{project.budget}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Projects List Table */}
          <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-200/60 px-6 py-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-[#5B4DFF]" />
              <h3 className="font-bold text-sm text-[#111827] font-sans">جدول المشاريع التفصيلي</h3>
            </CardHeader>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs whitespace-nowrap min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200/80">
                    <th className="px-6 py-3.5 font-bold font-sans">اسم المشروع</th>
                    <th className="px-6 py-3.5 font-bold font-sans">العميل</th>
                    <th className="px-6 py-3.5 font-bold font-sans text-center">نسبة الإنجاز</th>
                    <th className="px-6 py-3.5 font-bold font-sans">تاريخ البدء</th>
                    <th className="px-6 py-3.5 font-bold font-sans text-left">الميزانية</th>
                    <th className="px-6 py-3.5 font-bold font-sans text-center">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProjects.map((project, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800 font-sans">{project.name}</td>
                      <td className="px-6 py-4 font-semibold text-slate-650 font-sans">{project.client}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 max-w-[120px] mx-auto">
                          <div className="w-16 bg-slate-150 h-1 rounded-full overflow-hidden">
                            <div className="bg-[#5B4DFF] h-1 rounded-full" style={{ width: `${project.progress}%` }} />
                          </div>
                          <span className="font-bold font-sans text-[10px] text-slate-700">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-sans">{project.date}</td>
                      <td className="px-6 py-4 text-left font-bold text-slate-800 font-sans">{project.budget}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sans border ${getStatusStyle(project.status)}`}>
                          {project.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
