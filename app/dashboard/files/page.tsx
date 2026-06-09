import React from 'react';
import { CheckSquare } from 'lucide-react';

export default function FilesPlaceholderPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 text-center">
      <div className="w-16 h-16 bg-[#06B6D4]/10 rounded-full flex items-center justify-center text-[#06B6D4] mb-4">
        <CheckSquare size={32} />
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-2 font-sans">الملفات (قريباً)</h2>
      <p className="text-slate-500 max-w-md mx-auto font-sans">
        ستتمكن من إدارة ملفات المشاريع والمهام المشتركة مع المستقلين في هذا القسم.
      </p>
    </div>
  );
}
