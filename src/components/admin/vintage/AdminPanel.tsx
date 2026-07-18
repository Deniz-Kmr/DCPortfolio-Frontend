import type { ReactNode } from 'react';

type AdminPanelProps = {
  children: ReactNode;
  className?: string;
};

export function AdminPanel({ children, className = '' }: AdminPanelProps) {
  return (
    <section
      className={[
        'border border-[#7C8794] bg-[#DCE5F2] p-1 shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#8A94A3]',
        className,
      ].join(' ')}
    >
      <div className="border border-[#B6C1D1] bg-[#F4F6FA] p-4 shadow-[inset_1px_1px_0_#ffffff]">
        {children}
      </div>
    </section>
  );
}
