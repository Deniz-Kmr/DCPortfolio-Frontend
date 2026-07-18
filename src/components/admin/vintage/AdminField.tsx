import type { ReactNode } from 'react';

type AdminFieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

export function AdminField({ label, error, children }: AdminFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">{label}</label>
      {children}
      {error ? (
        <p className="mt-2 border border-red-700 bg-red-100 px-2 py-1 text-xs font-semibold text-red-900">
          {error}
        </p>
      ) : null}
    </div>
  );
}
