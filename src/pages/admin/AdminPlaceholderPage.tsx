type AdminPlaceholderPageProps = {
  title: string;
  description: string;
};

export function AdminPlaceholderPage({
  title,
  description,
}: AdminPlaceholderPageProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
        Admin Panel
      </p>
      <h1 className="mt-4 text-3xl font-bold text-white">{title}</h1>
      <p className="mt-4 max-w-3xl text-slate-300">{description}</p>
    </section>
  );
}
