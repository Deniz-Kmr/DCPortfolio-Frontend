import { Link } from 'react-router-dom';

import { EmptyState, ErrorState, LoadingState } from '../../components/common/data-state';
import { EndpointBadge } from '../../components/common/developer';
import { usePublicProjects } from '../../features/projects/hooks';
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

export function ProjectsPage() {
  const projectsQuery = usePublicProjects();
  const projects = projectsQuery.data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-10">
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <EndpointBadge path={apiRoutes.public.projects} />

          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
            Projects
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            Public project data is rendered from the backend API contract. Each card reflects
            published project records, linked technologies and safe external URLs.
          </p>
        </section>

        {projectsQuery.isLoading ? (
          <LoadingState title="Loading public projects..." />
        ) : projectsQuery.isError ? (
          <ErrorState
            title="Projects could not be loaded."
            message={getErrorMessage(projectsQuery.error)}
          />
        ) : projects.length === 0 ? (
          <EmptyState
            title="No public projects yet."
            message="The public projects endpoint is available, but no project is published yet."
          />
        ) : (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => {
              const imageUrl = resolveAssetUrl(project.imageUrl);

              return (
                <article
                  key={project.id}
                  className="flex min-h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] transition hover:border-sky-300/30 hover:bg-white/[0.055]"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={project.title}
                      className="h-48 w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="border-b border-white/10 bg-slate-950/70 p-5">
                      <div className="rounded-2xl border border-sky-300/10 bg-sky-300/[0.04] p-4 font-mono text-xs text-slate-300">
                        <p>project.slug = "{project.slug}"</p>
                        <p className="mt-2">response.type = "PublicProjectListItem"</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-xl font-semibold text-slate-50">{project.title}</h2>

                      {project.isFeatured ? (
                        <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs text-sky-100">
                          Featured
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-400">
                      {project.shortDescription}
                    </p>

                    {project.technologies.length > 0 ? (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.technologies.map((technology) => (
                          <span
                            key={technology.id}
                            className="rounded-full border border-white/10 bg-slate-950/40 px-3 py-1 text-xs text-slate-300"
                          >
                            {technology.name}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-auto flex flex-wrap gap-3 pt-6">
                      {project.slug ? (
                        <Link
                          to={`/projects/${project.slug}`}
                          className="text-sm font-semibold text-sky-200 hover:text-sky-100"
                        >
                          Details →
                        </Link>
                      ) : null}

                      {project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold text-slate-300 hover:text-slate-100"
                        >
                          GitHub ↗
                        </a>
                      ) : null}

                      {project.demoUrl ? (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold text-slate-300 hover:text-slate-100"
                        >
                          Demo ↗
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}
