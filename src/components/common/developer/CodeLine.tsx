type CodeLineProps = {
  children: string;
};

export function CodeLine({ children }: CodeLineProps) {
  return (
    <code className="inline-flex rounded-lg border border-white/10 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-300">
      {children}
    </code>
  );
}
