import { Link } from 'react-router-dom';

import { EmptyState, ErrorState, LoadingState } from '../../components/common/data-state';
import { CodeLine, EndpointBadge } from '../../components/common/developer';
import { usePublicCv } from '../../features/cv/hooks';
import { apiRoutes } from '../../services/api';
import { buildBackendFileUrl } from '../../utils/backendUrl';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Please try again later.';
}

function formatDate(value: string | null) {
  if (!value) {
    return 'Present';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
  }).format(date);
}

function resolveFileUrl(url: string | null) {
  if (!url) {
    return buildBackendFileUrl('/files/cv/deniz-celik-cv.pdf');
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return buildBackendFileUrl(url);
}

export function CvPage() {
  const cvQuery = usePublicCv();
  const cv = cvQuery.data ?? null;
  const profile = cv?.profile ?? null;
  const experiences = cv?.experiences ?? [];
  const cvPdfUrl = resolveFileUrl(profile?.cvFileUrl ?? null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-10">
        <section className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
            <EndpointBadge path={apiRoutes.public.cv} />

            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
              CV
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
              Public CV data is loaded from the backend contract. Profile and experience records are
              rendered only when the API publishes them.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={cvPdfUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-200"
              >
                View CV PDF ↗
              </a>

              <Link
                to="/experience"
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-sky-300/40 hover:text-sky-100"
              >
                Experience
              </Link>

              <Link
                to="/certificates"
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-sky-300/40 hover:text-sky-100"
              >
                Certificates
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <h2 className="text-lg font-semibold text-slate-50">API Contract</h2>

            <div className="mt-5 space-y-3">
              <CodeLine>{`GET ${apiRoutes.public.cv}`}</CodeLine>
              <CodeLine>{'ApiResponse<PublicCv>'}</CodeLine>
              <CodeLine>{`staticFile: ${'/files/cv/deniz-celik-cv.pdf'}`}</CodeLine>
            </div>
          </div>
        </section>

        {cvQuery.isLoading ? (
          <LoadingState title="Loading CV profile..." />
        ) : cvQuery.isError ? (
          <ErrorState
            title="CV data could not be loaded."
            message={getErrorMessage(cvQuery.error)}
          />
        ) : !profile ? (
          <EmptyState
            title="No CV profile yet."
            message="The public CV endpoint is available, but no CV profile is published yet."
          />
        ) : (
          <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <aside className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <h2 className="text-2xl font-semibold text-slate-50">{profile.fullName}</h2>
              <p className="mt-2 text-sky-100">{profile.title}</p>

              <p className="mt-5 text-sm leading-7 text-slate-300">{profile.summary}</p>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm text-slate-400">
                {profile.location ? <p>Location: {profile.location}</p> : null}
                {profile.email ? <p>Email: {profile.email}</p> : null}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {profile.githubUrl ? (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-sky-200 hover:text-sky-100"
                  >
                    GitHub ↗
                  </a>
                ) : null}

                {profile.linkedInUrl ? (
                  <a
                    href={profile.linkedInUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-sky-200 hover:text-sky-100"
                  >
                    LinkedIn ↗
                  </a>
                ) : null}
              </div>
            </aside>

            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <h2 className="text-2xl font-semibold text-slate-50">Experience from CV</h2>

              {experiences.length === 0 ? (
                <div className="mt-6">
                  <EmptyState
                    title="No CV experience records yet."
                    message="Experience records can still be viewed from the dedicated experience endpoint when published."
                  />
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {experiences.map((experience) => (
                    <article
                      key={experience.id}
                      className="rounded-2xl border border-white/10 bg-slate-950/40 p-5"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm text-sky-100">{experience.companyName}</p>
                          <h3 className="mt-1 font-semibold text-slate-50">
                            {experience.position}
                          </h3>
                        </div>

                        <p className="text-xs text-slate-500">
                          {formatDate(experience.startDate)} —{' '}
                          {experience.isCurrent ? 'Present' : formatDate(experience.endDate)}
                        </p>
                      </div>

                      <p className="mt-4 text-sm leading-7 text-slate-400">
                        {experience.description}
                      </p>

                      {experience.location ? (
                        <p className="mt-3 text-xs text-slate-500">{experience.location}</p>
                      ) : null}
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
