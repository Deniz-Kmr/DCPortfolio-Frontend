import { EmptyState, ErrorState, LoadingState } from '../../components/common/data-state';
import { EndpointBadge } from '../../components/common/developer';
import { useGroupedPublicTechnologies } from '../../features/technologies/hooks';
import { apiRoutes } from '../../services/api';
import { buildBackendFileUrl } from '../../utils/backendUrl';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Please try again later.';
}

function resolveAssetUrl(url: string | null) {
  if (!url) {
    return null;
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return buildBackendFileUrl(url);
}

export function TechnologiesPage() {
  const technologyGroupsQuery = useGroupedPublicTechnologies();
  const technologyGroups = technologyGroupsQuery.data ?? [];
  const visibleTechnologyGroups = technologyGroups.filter((group) => group.technologies.length > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-10">
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <EndpointBadge path={apiRoutes.public.groupedTechnologies} />

          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
            Technology Stack
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            Technologies are grouped by backend categories returned from the public API. No fake
            percentages, no invented proficiency metrics.
          </p>
        </section>

        {technologyGroupsQuery.isLoading ? (
          <LoadingState title="Loading grouped technologies..." />
        ) : technologyGroupsQuery.isError ? (
          <ErrorState
            title="Technologies could not be loaded."
            message={getErrorMessage(technologyGroupsQuery.error)}
          />
        ) : visibleTechnologyGroups.length === 0 ? (
          <EmptyState
            title="No technologies yet."
            message="The grouped technologies endpoint is available, but no public technology is published yet."
          />
        ) : (
          <section className="grid gap-6 lg:grid-cols-2">
            {visibleTechnologyGroups.map((group) => (
              <article
                key={group.category}
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-100">
                    {group.category}
                  </h2>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                    {group.technologies.length} item{group.technologies.length === 1 ? '' : 's'}
                  </span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {group.technologies.map((technology) => {
                    const iconUrl = resolveAssetUrl(technology.iconUrl);

                    return (
                      <div
                        key={technology.id}
                        className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                      >
                        <div className="flex items-center gap-3">
                          {iconUrl ? (
                            <img
                              src={iconUrl}
                              alt=""
                              className="h-9 w-9 rounded-xl border border-white/10 object-contain p-1"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-300/10 font-mono text-xs text-sky-100">
                              {technology.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}

                          <div>
                            <h3 className="font-semibold text-slate-50">{technology.name}</h3>
                            <p className="mt-1 text-xs text-slate-500">{technology.skillLevel}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
