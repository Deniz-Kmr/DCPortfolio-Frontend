type EmptyStateProps = {
  title?: string;
  message?: string;
};

export function EmptyState({
  title = 'No content yet.',
  message = 'This section will be updated soon.',
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-sm font-semibold text-slate-100">{title}</p>
      <p className="mt-2 text-sm text-slate-400">{message}</p>
    </div>
  );
}
