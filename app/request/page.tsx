import { ServiceBriefForm } from '@/components/orders/ServiceBriefForm';

export default function RequestPage() {
  return (
    <main
      className="min-h-screen px-4 py-10 md:px-6 md:py-12"
      style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(6,182,212,0.1) 0%, transparent 65%), #0B132B',
      }}
    >
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="rounded-[2.25rem] border border-white/10 bg-white/5 px-6 py-10 text-center shadow-[0_24px_80px_rgba(2,6,23,0.28)] backdrop-blur-xl md:px-10 md:py-14">
          <div className="mx-auto max-w-4xl">
            <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs font-bold text-cyan-300">
              Managed Execution Platform
            </span>
            <h1 className="mt-5 text-3xl font-bold text-white md:text-5xl">ابدأ طلبك في بروز</h1>
            <p className="mt-4 text-sm leading-8 text-slate-100 md:text-lg">
              أرسل تفاصيل احتياجك، وسيقوم فريق بروز بمراجعة الطلب قبل طرحه على الخبراء المناسبين.
            </p>
          </div>
        </section>

        <ServiceBriefForm
          backHref="/dashboard"
          backLabel="العودة للوحة التحكم"
          redirectAfterSubmit="/dashboard/orders"
        />
      </div>
    </main>
  );
}
