import { Link } from 'react-router-dom';

import { EmptyState, ErrorState, LoadingState } from '../../components/common/data-state';
import { CodeLine, EndpointBadge } from '../../components/common/developer';
import { usePublicCertificates } from '../../features/certificates/hooks';
import { usePublicCv } from '../../features/cv/hooks';
import { usePublicExperiences } from '../../features/experiences/hooks';
import { useFeaturedPublicProjects, usePublicProjects } from '../../features/projects/hooks';
import { useGroupedPublicTechnologies } from '../../features/technologies/hooks';
import { apiRoutes } from '../../services/api';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Please try again later.';
}

export function HomePage() {
  const projectsQuery = usePublicProjects();
  const featuredProjectsQuery = useFeaturedPublicProjects();
  const technologyGroupsQuery = useGroupedPublicTechnologies();
  const cvQuery = usePublicCv();
  const experiencesQuery = usePublicExperiences();
  const certificatesQuery = usePublicCertificates();

  const profile = cvQuery.data?.profile ?? null;
  const allProjects = projectsQuery.data ?? [];
  const featuredProjects = featuredProjectsQuery.data ?? [];
  const projectPreviewItems = featuredProjects.length > 0 ? featuredProjects : allProjects;
  const isProjectPreviewFromFeatured = featuredProjects.length > 0;

  const technologyGroups = technologyGroupsQuery.data ?? [];
  const experiences = experiencesQuery.data ?? [];
  const certificates = certificatesQuery.data ?? [];

  const visibleTechnologyGroups = technologyGroups
    .filter((group) => group.technologies.length > 0)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-20">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8 lg:p-10">
            <EndpointBadge path={apiRoutes.public.projects} />

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.35em] text-sky-200/80">
              Backend-focused full stack developer
            </p>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-50 sm:text-6xl">
              {profile?.fullName ?? 'Deniz Çelik'}
            </h1>

            <p className="mt-4 text-xl font-medium text-sky-100 sm:text-2xl">
              {profile?.title ?? 'Backend-Focused Full Stack Developer'}
            </p>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
              {profile?.summary ??
                'I build secure APIs, admin systems and product-ready backend architectures.'}
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

              <Link
                to="/contact"
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-sky-300/40 hover:text-sky-100"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-sky-950/20">
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <span className="h-3 w-3 rounded-full bg-red-300/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-300/70" />
              <span className="h-3 w-3 rounded-full bg-emerald-300/70" />
              <span className="ml-3 text-xs text-slate-500">public-api.contract.ts</span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <CodeLine>{`GET ${apiRoutes.public.projects}`}</CodeLine>
              <CodeLine>{`GET ${apiRoutes.public.technologies}`}</CodeLine>
              <CodeLine>ApiResponse&lt;T&gt;</CodeLine>
              <CodeLine>React Query cache</CodeLine>
            </div>

            <div className="mt-6 rounded-2xl border border-sky-300/10 bg-sky-300/[0.04] p-4">
              <p className="text-sm leading-6 text-slate-300">
                Public pages consume typed backend endpoints directly. Data cards below are rendered
                from the API response, not from hardcoded portfolio content.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <EndpointBadge
                path={
                  isProjectPreviewFromFeatured
                    ? apiRoutes.public.featuredProjects
                    : apiRoutes.public.projects
                }
              />

              <h2 className="mt-4 text-2xl font-semibold text-slate-50">
                {isProjectPreviewFromFeatured ? 'Featured Projects' : 'Projects from API'}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                {isProjectPreviewFromFeatured
                  ? 'Selected projects served from the featured public endpoint.'
                  : 'No featured project is published yet, so this section previews real public project data.'}
              </p>
            </div>

            <Link to="/projects" className="text-sm font-semibold text-sky-200 hover:text-sky-100">
              All projects →
            </Link>
          </div>

          {featuredProjectsQuery.isLoading || projectsQuery.isLoading ? (
            <LoadingState title="Loading public projects..." />
          ) : featuredProjectsQuery.isError && projectsQuery.isError ? (
            <ErrorState
              title="Projects could not be loaded."
              message={getErrorMessage(featuredProjectsQuery.error ?? projectsQuery.error)}
            />
          ) : projectPreviewItems.length === 0 ? (
            <EmptyState
              title="No public projects yet."
              message="The public projects endpoint is ready, but no project is published yet."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {projectPreviewItems.slice(0, 3).map((project) => (
                <article
                  key={project.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-sky-300/30 hover:bg-white/[0.055]"
                >
                  <div className="flex min-h-40 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-semibold text-slate-50">{project.title}</h3>

                      {project.isFeatured ? (
                        <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs text-sky-100">
                          Featured
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                      {project.shortDescription}
                    </p>

                    {project.technologies.length > 0 ? (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.technologies.slice(0, 5).map((technology) => (
                          <span
                            key={technology.id}
                            className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300"
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
              ))}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <EndpointBadge path={apiRoutes.public.groupedTechnologies} />

              <h2 className="mt-4 text-2xl font-semibold text-slate-50">Technology Stack</h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Grouped technology data returned by the backend public contract.
              </p>
            </div>

            <Link
              to="/technologies"
              className="text-sm font-semibold text-sky-200 hover:text-sky-100"
            >
              View stack →
            </Link>
          </div>

          {technologyGroupsQuery.isLoading ? (
            <LoadingState title="Loading technology stack..." />
          ) : technologyGroupsQuery.isError ? (
            <ErrorState
              title="Technology stack could not be loaded."
              message={getErrorMessage(technologyGroupsQuery.error)}
            />
          ) : visibleTechnologyGroups.length === 0 ? (
            <EmptyState
              title="No technologies yet."
              message="The grouped technologies endpoint is ready, but no public technology is published yet."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {visibleTechnologyGroups.map((group) => (
                <article
                  key={group.category}
                  className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-100">
                    {group.category}
                  </h3>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {group.technologies.slice(0, 8).map((technology) => (
                      <span
                        key={technology.id}
                        className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1 text-xs text-slate-300"
                      >
                        {technology.name}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
            <EndpointBadge path={apiRoutes.public.experiences} />

            <h2 className="mt-4 text-2xl font-semibold text-slate-50">Experience Snapshot</h2>

            <div className="mt-6">
              {experiencesQuery.isLoading ? (
                <LoadingState title="Loading experience snapshot..." />
              ) : experiencesQuery.isError ? (
                <ErrorState
                  title="Experience data could not be loaded."
                  message={getErrorMessage(experiencesQuery.error)}
                />
              ) : experiences.length === 0 ? (
                <EmptyState
                  title="No experience records yet."
                  message="Experience data will appear here when published from the backend."
                />
              ) : (
                <div className="space-y-4">
                  {experiences.slice(0, 2).map((experience) => (
                    <article
                      key={experience.id}
                      className="rounded-2xl border border-white/10 bg-slate-950/40 p-5"
                    >
                      <p className="text-sm text-sky-100">{experience.companyName}</p>
                      <h3 className="mt-1 font-semibold text-slate-50">{experience.position}</h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                        {experience.description}
                      </p>
                    </article>
                  ))}

                  <Link
                    to="/experience"
                    className="inline-flex text-sm font-semibold text-sky-200 hover:text-sky-100"
                  >
                    Full experience →
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
            <EndpointBadge path={apiRoutes.public.certificates} />

            <h2 className="mt-4 text-2xl font-semibold text-slate-50">Certificates Snapshot</h2>

            <div className="mt-6">
              {certificatesQuery.isLoading ? (
                <LoadingState title="Loading certificate snapshot..." />
              ) : certificatesQuery.isError ? (
                <ErrorState
                  title="Certificates could not be loaded."
                  message={getErrorMessage(certificatesQuery.error)}
                />
              ) : certificates.length === 0 ? (
                <EmptyState
                  title="No certificates yet."
                  message="Certificate data will appear here when published from the backend."
                />
              ) : (
                <div className="space-y-4">
                  {certificates.slice(0, 2).map((certificate) => (
                    <article
                      key={certificate.id}
                      className="rounded-2xl border border-white/10 bg-slate-950/40 p-5"
                    >
                      <p className="text-sm text-sky-100">{certificate.institution}</p>
                      <h3 className="mt-1 font-semibold text-slate-50">{certificate.title}</h3>

                      {certificate.description ? (
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                          {certificate.description}
                        </p>
                      ) : null}
                    </article>
                  ))}

                  <Link
                    to="/certificates"
                    className="inline-flex text-sm font-semibold text-sky-200 hover:text-sky-100"
                  >
                    All certificates →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
