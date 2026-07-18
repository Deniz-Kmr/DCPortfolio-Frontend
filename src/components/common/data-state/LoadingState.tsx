type LoadingStateProps = {
  title?: string;
};

export function LoadingState({ title = 'Loading content...' }: LoadingStateProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-slate-300">
      <div className="h-2 w-24 animate-pulse rounded-full bg-sky-300/40" />
      <p className="mt-4 text-sm">{title}</p>
    </div>
  );
}
