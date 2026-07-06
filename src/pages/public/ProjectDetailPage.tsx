import { Link, useParams } from 'react-router-dom';

import { EmptyState, ErrorState, LoadingState } from '../../components/common/data-state';
import { CodeLine, EndpointBadge } from '../../components/common/developer';
import { usePublicProjectDetail } from '../../features/projects/hooks';
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

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
}

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const projectQuery = usePublicProjectDetail(slug);
  const project = projectQuery.data ?? null;
  const imageUrl = project ? resolveAssetUrl(project.imageUrl) : null;

  if (!slug) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState title="Project slug is missing." message="Please return to the projects page." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-10">
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <EndpointBadge path={apiRoutes.public.projectBySlug(slug)} />

          <div className="mt-6">
            <Link to="/projects" className="text-sm font-semibold text-sky-200 hover:text-sky-100">
              ← Back to projects
            </Link>
          </div>
        </section>

        {projectQuery.isLoading ? (
          <LoadingState title="Loading project detail..." />
        ) : projectQuery.isError ? (
          <ErrorState
            title="Project detail could not be loaded."
            message={getErrorMessage(projectQuery.error)}
          />
        ) : !project ? (
          <EmptyState
            title="Project not found."
            message="The backend did not return a project for this slug."
          />
        ) : (
          <article className="grid gap-8 lg:grid-cols-[1fr_0.75fr]">
            <div className="space-y-8">
              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
                      {project.title}
                    </h1>

                    <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                      {project.shortDescription}
                    </p>
                  </div>

                  {project.isFeatured ? (
                    <span className="w-fit rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs text-sky-100">
                      Featured
                    </span>
                  ) : null}
                </div>

                <div className="mt-8 border-t border-white/10 pt-8">
                  <h2 className="text-xl font-semibold text-slate-50">Project Overview</h2>
                  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-300">
                    {project.description}
                  </p>
                </div>
              </div>

              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={project.title}
                  className="max-h-[460px] w-full rounded-3xl border border-white/10 object-cover"
                  loading="lazy"
                />
              ) : null}
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
                <h2 className="text-lg font-semibold text-slate-50">API Contract</h2>

                <div className="mt-5 space-y-3">
                  <CodeLine>{`GET ${apiRoutes.public.projectBySlug(slug)}`}</CodeLine>
                  <CodeLine>ApiResponse&lt;PublicProjectDetail&gt;</CodeLine>
                  <CodeLine>{`createdAt: ${formatDate(project.createdAt)}`}</CodeLine>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                <h2 className="text-lg font-semibold text-slate-50">Tech Stack</h2>

                {project.technologies.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-400">
                    No technologies are linked to this project yet.
                  </p>
                ) : (
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
                )}
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                <h2 className="text-lg font-semibold text-slate-50">Links</h2>

                <div className="mt-5 flex flex-wrap gap-3">
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-sky-300/40 hover:text-sky-100"
                    >
                      GitHub ↗
                    </a>
                  ) : null}

                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-sky-300/40 hover:text-sky-100"
                    >
                      Demo ↗
                    </a>
                  ) : null}

                  {!project.githubUrl && !project.demoUrl ? (
                    <p className="text-sm text-slate-400">No external links are published yet.</p>
                  ) : null}
                </div>
              </div>
            </aside>
          </article>
        )}
      </div>
    </div>
  );
}
