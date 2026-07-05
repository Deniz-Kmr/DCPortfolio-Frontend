import { Link } from 'react-router-dom';

import { routePaths } from '../../app/router/routePaths';

export function HomePage() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
          Deniz Çelik • Full Stack Developer
        </p>

        <h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-tight text-white md:text-7xl">
          Product-first portfolio powered by a real backend.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          A clean frontend foundation for projects, technologies, CV, experience,
          certificates and a private admin panel connected to the DCPortfolio API.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            to={routePaths.public.projects}
            className="rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
          >
            Explore Projects
          </Link>

          <Link
            to={routePaths.public.cv}
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            View CV
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <p className="text-sm font-semibold text-sky-300">Frontend Foundation</p>
        <div className="mt-6 grid gap-4">
          {[
            'Backend-aligned routing',
            'React Query data layer',
            'Admin-ready structure',
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-slate-200"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
