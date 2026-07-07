import type { ReactNode } from 'react';

type AdminStatusBadgeTone = 'online' | 'warning' | 'danger' | 'neutral';

type AdminStatusBadgeProps = {
  children: ReactNode;
  tone?: AdminStatusBadgeTone;
};

const toneClasses: Record<AdminStatusBadgeTone, string> = {
  online: 'border-emerald-700 bg-emerald-100 text-emerald-900',
  warning: 'border-amber-700 bg-amber-100 text-amber-950',
  danger: 'border-red-700 bg-red-100 text-red-900',
  neutral: 'border-slate-500 bg-slate-100 text-slate-800',
};

export function AdminStatusBadge({ children, tone = 'neutral' }: AdminStatusBadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em]',
        toneClasses[tone],
      ].join(' ')}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
