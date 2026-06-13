import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, Dot } from 'lucide-react';
import { cn } from '@/app/lib/utils';

type Tone = 'slate' | 'cyan' | 'indigo' | 'violet' | 'amber' | 'emerald' | 'rose';

const toneStyles: Record<Tone, string> = {
  slate: 'border-slate-200 bg-slate-50 text-slate-700',
  cyan: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  violet: 'border-violet-200 bg-violet-50 text-violet-700',
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  rose: 'border-rose-200 bg-rose-50 text-rose-700',
};

export function OpsPageHeader({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-[32px] border border-[#E5E7EB] bg-white px-6 py-7 md:px-8 md:py-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl space-y-3">
          {eyebrow ? <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#06B6D4]">{eyebrow}</div> : null}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#0B132B] md:text-[2rem]">{title}</h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-500 md:text-[15px]">{description}</p>
          </div>
          {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}

export function OpsSurface({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn('rounded-[28px] border border-[#E5E7EB] bg-white', className)}>{children}</section>;
}

export function OpsSectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h2 className="text-base font-bold text-[#0B132B]">{title}</h2>
        {description ? <p className="text-sm text-slate-500">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function OpsBadge({ label, tone = 'slate' }: { label: string; tone?: Tone }) {
  return <span className={cn('inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold', toneStyles[tone])}>{label}</span>;
}

export function OpsHealthBadge({ health }: { health: 'Excellent' | 'Needs Follow-Up' | 'Delayed' }) {
  const tone = health === 'Excellent' ? 'emerald' : health === 'Delayed' ? 'rose' : 'amber';
  return <OpsBadge tone={tone} label={health} />;
}

export function OpsProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <span>{label || 'التقدم'}</span>
        <span className="font-semibold text-[#0B132B]">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-[#06B6D4] transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function OpsEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
        <Icon size={24} />
      </div>
      <h3 className="text-base font-bold text-[#0B132B]">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-7 text-slate-500">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function OpsTimeline({
  items,
  emptyTitle,
  emptyDescription,
}: {
  items: Array<{
    id: string;
    title: string;
    description?: string;
    time: string;
    href?: string | null;
    tone?: Tone;
  }>;
  emptyTitle: string;
  emptyDescription: string;
}) {
  if (items.length === 0) {
    return (
      <div className="px-6 py-8 text-center">
        <h3 className="text-sm font-bold text-[#0B132B]">{emptyTitle}</h3>
        <p className="mt-2 text-sm text-slate-500">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 px-6">
      {items.map((item) => {
        const content = (
          <div className="flex gap-4 py-4">
            <div className="flex flex-col items-center">
              <span className={cn('mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full border', toneStyles[item.tone || 'slate'])}>
                <Dot size={18} />
              </span>
              <span className="mt-2 h-full w-px bg-slate-100" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="text-sm font-semibold text-[#0B132B]">{item.title}</div>
                  {item.description ? <div className="mt-1 text-sm leading-6 text-slate-500">{item.description}</div> : null}
                </div>
                <div className="shrink-0 text-xs font-medium text-slate-400">{item.time}</div>
              </div>
            </div>
          </div>
        );

        return item.href ? (
          <Link key={item.id} href={item.href} className="block transition-colors hover:bg-slate-50/80">
            {content}
          </Link>
        ) : (
          <div key={item.id}>{content}</div>
        );
      })}
    </div>
  );
}

export function OpsWorkflowPipeline({
  steps,
}: {
  steps: Array<{ key: string; label: string; count: number }>;
}) {
  return (
    <div className="overflow-x-auto px-6 py-6">
      <div className="flex min-w-max items-center gap-3">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center gap-3">
            <div className="min-w-[138px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="text-[11px] font-semibold text-slate-500">{step.label}</div>
              <div className="mt-2 text-2xl font-bold tracking-tight text-[#0B132B]">{step.count}</div>
            </div>
            {index < steps.length - 1 ? <ArrowLeft size={16} className="text-slate-300" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function OpsTabs({
  tabs,
  active,
}: {
  tabs: Array<{ key: string; label: string; href: string }>;
  active: string;
}) {
  return (
    <div className="overflow-x-auto rounded-[22px] border border-slate-200 bg-white px-3 py-3">
      <div className="flex min-w-max items-center gap-2">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={cn(
                'inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-colors',
                isActive ? 'bg-[#0B132B] text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-[#0B132B]'
              )}
            >
              <span>{tab.label}</span>
              {isActive ? <ChevronLeft size={14} /> : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function OpsMetaGrid({
  items,
  columns = 4,
}: {
  items: Array<{ label: string; value: React.ReactNode }>;
  columns?: 2 | 3 | 4;
}) {
  const gridClass = columns === 2 ? 'md:grid-cols-2' : columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 xl:grid-cols-4';
  return (
    <div className={cn('grid grid-cols-1 gap-3', gridClass)}>
      {items.map((item) => (
        <div key={String(item.label)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
          <div className="text-[11px] font-semibold text-slate-500">{item.label}</div>
          <div className="mt-2 text-sm font-semibold leading-6 text-[#0B132B]">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
