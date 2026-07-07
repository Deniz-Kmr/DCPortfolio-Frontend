import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { AdminStatusBadge } from './AdminStatusBadge';

type AdminModuleCardProps = {
  title: string;
  description: string;
  to?: string;
  status?: string;
  children?: ReactNode;
};

export function AdminModuleCard({
  title,
  description,
  to,
  status = 'ready',
  children,
}: AdminModuleCardProps) {
  const content = (
    <article className="h-full border border-[#7C8794] bg-[#EEF1F5] p-4 shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#A7B2C2] transition hover:bg-white">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-extrabold text-[#102A43]">{title}</h3>
        <AdminStatusBadge tone="warning">{status}</AdminStatusBadge>
      </div>

      <p className="mt-3 text-sm leading-6 text-[#334155]">{description}</p>

      {children ? <div className="mt-4">{children}</div> : null}
    </article>
  );

  if (!to) {
    return content;
  }

  return (
    <Link to={to} className="block h-full">
      {content}
    </Link>
  );
}
