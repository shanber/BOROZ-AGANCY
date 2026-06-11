import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | بروز BOROZ',
  description: 'سياسة الخصوصية لمنصة بروز وكيفية جمع واستخدام وحماية بيانات المستخدمين.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0B132B]">
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
          &larr; العودة للرئيسية
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">سياسة الخصوصية</h1>
        <div className="space-y-6 text-sm leading-8 text-slate-300">
          <p>آخر تحديث: 2026</p>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. المقدمة</h2>
            <p>
              تلتزم بروز (BOROZ) بحماية خصوصية مستخدميها. توضح هذه السياسة كيفية جمع واستخدام 
              وحماية المعلومات الشخصية التي تقدمها عند استخدام المنصة.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. المعلومات التي نجمعها</h2>
            <p>قد نجمع المعلومات التالية:</p>
            <ul className="list-disc pr-5 space-y-2 mt-2">
              <li>معلومات الحساب: الاسم، البريد الإلكتروني، رقم الجوال.</li>
              <li>معلومات المتجر: اسم المتجر، رابط المتجر، بيانات الطلبات.</li>
              <li>معلومات المهنة: التخصص، الخبرات، المؤهلات (لمقدمي الخدمات).</li>
              <li>بيانات الاستخدام: الصفحات التي تزورها، الوقت المستغرق، التفاعلات.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. كيفية استخدام المعلومات</h2>
            <p>نستخدم المعلومات لتقديم وتحسين خدمات المنصة، وتشمل:</p>
            <ul className="list-disc pr-5 space-y-2 mt-2">
              <li>إنشاء وإدارة حسابات المستخدمين.</li>
              <li>معالجة الطلبات والمشاريع.</li>
              <li>التواصل معك بخصوص خدماتنا.</li>
              <li>تحسين أداء المنصة وتجربة المستخدم.</li>
              <li>الامتثال للمتطلبات القانونية.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. مشاركة المعلومات</h2>
            <p>
              لا نبيع أو نشارك معلوماتك الشخصية مع أطراف ثالثة لأغراض تسويقية. قد نشارك المعلومات 
              مع مقدمي الخدمات لغرض تنفيذ المشاريع، ومع الجهات النظامية إذا تطلب القانون ذلك.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. حماية المعلومات</h2>
            <p>
              نستخدم إجراءات أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التعديل أو 
              الإفصاح. تشمل هذه الإجراءات التشفير وجدران الحماية وضوابط الوصول.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. ملفات تعريف الارتباط (Cookies)</h2>
            <p>
              نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح. يمكنك التحكم في إعدادات ملفات 
              تعريف الارتباط من متصفحك. قد يؤثر تعطيلها على بعض وظائف المنصة.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. حقوق المستخدم</h2>
            <p>
              لك الحق في الوصول إلى معلوماتك الشخصية أو تصحيحها أو حذفها. يمكنك طلب ذلك عبر 
              التواصل معنا على البريد الإلكتروني أدناه.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. تعديل السياسة</h2>
            <p>
              قد نقوم بتحديث هذه السياسة من وقت لآخر. سنقوم بإشعارك بالتغييرات الجوهرية عبر 
              البريد الإلكتروني أو عبر إشعار في المنصة.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">9. التواصل</h2>
            <p>
              للأسئلة أو الاستفسارات بخصوص سياسة الخصوصية: <a href="mailto:support@boroz.sa" className="text-cyan-400 hover:underline">support@boroz.sa</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
