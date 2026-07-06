import { EmptyState, ErrorState, LoadingState } from '../../components/common/data-state';
import { EndpointBadge } from '../../components/common/developer';
import { usePublicExperiences } from '../../features/experiences/hooks';
import { apiRoutes } from '../../services/api';

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

export function ExperiencePage() {
  const experiencesQuery = usePublicExperiences();
  const experiences = experiencesQuery.data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-10">
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <EndpointBadge path={apiRoutes.public.experiences} />

          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
            Experience
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            Experience records are served from the backend public endpoint and displayed as a clean
            timeline. No invented companies, roles or dates.
          </p>
        </section>

        {experiencesQuery.isLoading ? (
          <LoadingState title="Loading public experience records..." />
        ) : experiencesQuery.isError ? (
          <ErrorState
            title="Experience records could not be loaded."
            message={getErrorMessage(experiencesQuery.error)}
          />
        ) : experiences.length === 0 ? (
          <EmptyState
            title="No experience records yet."
            message="The public experiences endpoint is available, but no experience record is published yet."
          />
        ) : (
          <section className="space-y-5">
            {experiences.map((experience) => (
              <article
                key={experience.id}
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-100">
                      {experience.companyName}
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold text-slate-50">
                      {experience.position}
                    </h2>

                    {experience.location ? (
                      <p className="mt-2 text-sm text-slate-500">{experience.location}</p>
                    ) : null}
                  </div>

                  <div className="w-fit rounded-full border border-white/10 bg-slate-950/40 px-4 py-2 text-xs text-slate-300">
                    {formatDate(experience.startDate)} —{' '}
                    {experience.isCurrent ? 'Present' : formatDate(experience.endDate)}
                  </div>
                </div>

                <p className="mt-6 whitespace-pre-line text-sm leading-7 text-slate-300">
                  {experience.description}
                </p>
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
