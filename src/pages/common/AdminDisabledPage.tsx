import { Link } from 'react-router-dom';

import { routePaths } from '../../app/router/routePaths';

export function AdminDisabledPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col justify-center px-6 py-20 text-slate-50">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
        Admin UI Disabled
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-6xl">
        Admin area is not available here.
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
        This production-facing portfolio build does not expose the admin interface.
        Content management is handled from a local or private admin environment.
      </p>
      <Link
        to={routePaths.public.home}
        className="mt-8 inline-flex w-fit rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
      >
        Back to public portfolio
      </Link>
    </section>
  );
}
