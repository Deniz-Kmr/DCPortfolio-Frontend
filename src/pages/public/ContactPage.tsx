import { Link } from 'react-router-dom';

import { EmptyState, ErrorState, LoadingState } from '../../components/common/data-state';
import { CodeLine, EndpointBadge } from '../../components/common/developer';
import { usePublicCv } from '../../features/cv/hooks';
import { apiRoutes } from '../../services/api';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Please try again later.';
}

export function ContactPage() {
  const cvQuery = usePublicCv();
  const profile = cvQuery.data?.profile ?? null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-10">
        <section className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
            <EndpointBadge path={apiRoutes.public.cv} />

            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
              Contact
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
              Let’s talk about backend systems, APIs and product-ready architectures. Contact links
              are shown from the public CV profile when they are published by the backend.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/projects"
                className="rounded-full bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-200"
              >
                View projects
              </Link>

              <Link
                to="/cv"
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-sky-300/40 hover:text-sky-100"
              >
                View CV
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <h2 className="text-lg font-semibold text-slate-50">Contact Source</h2>

            <div className="mt-5 space-y-3">
              <CodeLine>{`GET ${apiRoutes.public.cv}`}</CodeLine>
              <CodeLine>{'profile.email | profile.githubUrl | profile.linkedInUrl'}</CodeLine>
            </div>
          </div>
        </section>

        {cvQuery.isLoading ? (
          <LoadingState title="Loading contact profile..." />
        ) : cvQuery.isError ? (
          <ErrorState
            title="Contact profile could not be loaded."
            message={getErrorMessage(cvQuery.error)}
          />
        ) : !profile ? (
          <EmptyState
            title="No public contact profile yet."
            message="Publish email, GitHub or LinkedIn in the CV profile to show contact links here."
          />
        ) : (
          <section className="grid gap-6 md:grid-cols-3">
            {profile.email ? (
              <a
                href={`mailto:${profile.email}`}
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-sky-300/30 hover:bg-white/[0.055]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-100">
                  Email
                </p>
                <p className="mt-4 break-words text-sm text-slate-300">{profile.email}</p>
              </a>
            ) : null}

            {profile.githubUrl ? (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-sky-300/30 hover:bg-white/[0.055]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-100">
                  GitHub
                </p>
                <p className="mt-4 text-sm text-slate-300">Open profile ↗</p>
              </a>
            ) : null}

            {profile.linkedInUrl ? (
              <a
                href={profile.linkedInUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-sky-300/30 hover:bg-white/[0.055]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-100">
                  LinkedIn
                </p>
                <p className="mt-4 text-sm text-slate-300">Open profile ↗</p>
              </a>
            ) : null}

            {!profile.email && !profile.githubUrl && !profile.linkedInUrl ? (
              <div className="md:col-span-3">
                <EmptyState
                  title="No contact links published yet."
                  message="The CV profile exists, but contact links are currently empty."
                />
              </div>
            ) : null}
          </section>
        )}
      </div>
    </div>
  );
}
