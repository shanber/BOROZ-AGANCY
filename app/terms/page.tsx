import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'شروط الاستخدام | بروز BOROZ',
  description: 'شروط استخدام منصة بروز لإدارة وتنفيذ المشاريع بين التجار والخبراء.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0B132B]">
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
          &larr; العودة للرئيسية
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">شروط الاستخدام</h1>
        <div className="space-y-6 text-sm leading-8 text-slate-300">
          <p>آخر تحديث: 2026</p>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. مقدمة</h2>
            <p>
              بروز (BOROZ) هي منصة مُدارة لإدارة وتنفيذ المشاريع بين التجار ومقدمي الخدمات والخبراء. 
              باستخدامك للمنصة، فإنك توافق على هذه الشروط. إذا لم توافق، يُرجى عدم استخدام المنصة.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. تعريفات</h2>
            <ul className="list-disc pr-5 space-y-2">
              <li><strong>المنصة:</strong> موقع بروز الإلكتروني والخدمات المرتبطة به.</li>
              <li><strong>التاجر:</strong> صاحب متجر سلة المسجل في المنصة لطلب الخدمات.</li>
              <li><strong>مقدم الخدمة:</strong> الخبير أو مقدم الخدمة المعتمد في المنصة.</li>
              <li><strong>المشروع:</strong> العمل المتفق عليه بين التاجر ومقدم الخدمة عبر المنصة.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. استخدام المنصة</h2>
            <p>
              تُستخدم المنصة حصريًا لطلب وتقديم وإدارة الخدمات المعلنة. جميع الاتصالات المتعلقة 
              بالمشاريع يجب أن تتم داخل المنصة. يمنع مشاركة معلومات الاتصال الشخصية (بريد إلكتروني، 
              رقم هاتف، واتساب) بين التاجر ومقدم الخدمة داخل المنصة.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. حسابات المستخدمين</h2>
            <p>
              أنت مسؤول عن الحفاظ على سرية معلومات حسابك. يجب أن تكون جميع المعلومات المقدمة دقيقة 
              وكاملة. يحق لبروز تعليق أو إنهاء أي حساب ينتهك هذه الشروط.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. عمولة المنصة</h2>
            <p>
              تحصل بروز عمولة على كل مشروع يتم تنفيذه عبر المنصة. نسبة العمولة قابلة للتغيير ويتم 
              الإعلان عنها في إعدادات المنصة. يتم احتساب العمولة عند اعتماد التسليم النهائي للمشروع.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. الملكية الفكرية</h2>
            <p>
              جميع المواد والمخرجات المسلمة إلى التاجر تصبح ملكًا للتاجر بعد استكمال الدفع. تحتفظ 
              بروز بحقوق المحتوى الخاص بالمنصة بما في ذلك التصميم والنصوص والبرمجيات.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. حدود المسؤولية</h2>
            <p>
              بروز هي منصة وسيطة لإدارة المشاريع وليست طرفًا في عقود التنفيذ. لا تتحمل بروز مسؤولية 
              جودة العمل المقدم من مقدمي الخدمة، ولكنها تسهل عملية المراجعة والتسليم.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. تعديل الشروط</h2>
            <p>
              يحق لبروز تعديل هذه الشروط في أي وقت. سيتم إشعار المستخدمين بالتغييرات الجوهرية. 
              استمرار استخدام المنصة بعد التعديل يعني الموافقة على الشروط المعدلة.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">9. التواصل</h2>
            <p>
              للتواصل مع بروز بخصوص هذه الشروط: <a href="mailto:support@boroz.sa" className="text-cyan-400 hover:underline">support@boroz.sa</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
