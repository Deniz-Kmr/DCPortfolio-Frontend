type PublicPlaceholderPageProps = {
  title: string;
  description: string;
};

export function PublicPlaceholderPage({
  title,
  description,
}: PublicPlaceholderPageProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
        Public Portfolio
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
        {description}
      </p>
    </section>
  );
}
