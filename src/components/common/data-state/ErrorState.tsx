type ErrorStateProps = {
  title?: string;
  message?: string;
};

export function ErrorState({
  title = 'Unable to load this section.',
  message = 'Please try again later.',
}: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-400/20 bg-red-500/5 p-6">
      <p className="text-sm font-semibold text-red-200">{title}</p>
      <p className="mt-2 text-sm text-red-100/70">{message}</p>
    </div>
  );
}
