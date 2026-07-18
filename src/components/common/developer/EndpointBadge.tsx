type EndpointBadgeProps = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
};

export function EndpointBadge({ method = 'GET', path }: EndpointBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-medium text-sky-100">
      <span className="text-sky-300">{method}</span>
      <span className="font-mono text-slate-300">{path}</span>
    </div>
  );
}
