import type { ReactNode } from 'react';

type AdminWindowProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function AdminWindow({
  title,
  subtitle,
  children,
  actions,
  className = '',
}: AdminWindowProps) {
  return (
    <section
      className={[
        'overflow-hidden border border-[#3B4A5F] bg-[#DCE5F2] shadow-[4px_4px_0_rgba(15,23,42,0.18)]',
        className,
      ].join(' ')}
    >
      <header className="flex items-center justify-between gap-4 border-b border-[#1E3A5F] bg-gradient-to-r from-[#17406F] to-[#2C6FA3] px-4 py-2 text-white">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{title}</p>
          {subtitle ? <p className="mt-0.5 truncate text-[11px] text-blue-100">{subtitle}</p> : null}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <span className="h-3 w-3 border border-[#0F2A45] bg-[#E8EEF7]" />
          <span className="h-3 w-3 border border-[#0F2A45] bg-[#E8EEF7]" />
          <span className="h-3 w-3 border border-[#0F2A45] bg-[#F87171]" />
        </div>
      </header>

      {actions ? (
        <div className="border-b border-[#A7B2C2] bg-[#EEF1F5] px-4 py-2">{actions}</div>
      ) : null}

      <div className="bg-[#DCE5F2] p-4">{children}</div>
    </section>
  );
}
