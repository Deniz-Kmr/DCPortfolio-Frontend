import type { ReactNode } from 'react';

type AdminToolbarProps = {
  children: ReactNode;
};

export function AdminToolbar({ children }: AdminToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border border-[#9AA4B2] bg-[#E9EDF4] p-2 shadow-[inset_1px_1px_0_#ffffff]">
      {children}
    </div>
  );
}
