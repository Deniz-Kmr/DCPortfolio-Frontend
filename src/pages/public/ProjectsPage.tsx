import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';

import { EmptyState, ErrorState, LoadingState } from '../../components/common/data-state';
import { usePublicProjects } from '../../features/projects/hooks';
import { buildBackendFileUrl } from '../../utils/backendUrl';

const FONT_DISPLAY = "font-['Manrope']";
const FONT_MONO = "font-['IBM_Plex_Mono']";
const FONT_BODY = "font-['Inter']";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Lütfen daha sonra tekrar deneyin.';
}

function resolveAssetUrl(url: string | null | undefined) {
  if (!url) {
    return null;
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return buildBackendFileUrl(url);
}

function MethodBadge({ method }: { method: 'GET' | 'POST' }) {
  const isGet = method === 'GET';

  return (
    <span
      className={`${FONT_MONO} inline-flex items-center justify-center rounded px-2 py-0.5 text-[11px] font-semibold ${
        isGet ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#F59E0B]/15 text-[#B45309]'
      }`}
    >
      {method}
    </span>
  );
}

function RouteHeader({
  method,
  path,
  title,
  description,
}: {
  method: 'GET' | 'POST';
  path: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2.5">
        <MethodBadge method={method} />
        <span className={`${FONT_MONO} text-sm text-[#14171C]`}>{path}</span>
        <span className="h-px flex-1 bg-[#C7CFDB]" />
        <span className={`${FONT_MONO} text-[11px] font-medium text-[#64748B]`}>200 OK</span>
      </div>

      <h1 className={` mt-4 text-xl font-extrabold uppercase tracking-[0.12em] text-[#14171C] sm:text-2xl`}>
        {title}
      </h1>

      {description ? (
        <p className="mt-5 max-w-2xl text-base leading-8 text-[#4B5563] sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function ProjectsPage() {
  const projectsQuery = usePublicProjects();
  const projects = projectsQuery.data ?? [];

  return (
    <div className={`${FONT_BODY} bg-[#EEF1F5]`}>
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-16 sm:px-6 sm:pb-14 sm:pt-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <RouteHeader
            method="GET"
            path="/projeler"
            title="TÜM PROJELER"
            description="Yayınladığım tüm projeleri, kullanılan teknolojileri ve detay sayfalarını buradan inceleyebilirsin."
          />

          <a
            href="/#hero"
            className={`${FONT_MONO} inline-flex w-fit rounded-md border border-[#D1D7E0] bg-white px-4 py-2 text-xs font-medium text-[#14171C] shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:border-[#14171C]/30 hover:bg-[#F7F8FA]`}
          >
            <span>Ana sayfa</span>
            <ArrowRight size={14} strokeWidth={1.9} />
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-6">
        {projectsQuery.isLoading ? (
          <LoadingState title="Projeler yükleniyor..." />
        ) : projectsQuery.isError ? (
          <ErrorState
            title="Projeler yüklenemedi."
            message={getErrorMessage(projectsQuery.error)}
          />
        ) : projects.length === 0 ? (
          <EmptyState
            title="Henüz yayınlanan proje yok."
            message="Projeler yayınlandığında bu sayfada listelenecek."
          />
        ) : (
          <div className="grid gap-6">
            {projects.map((project, index) => {
              const imageUrl = resolveAssetUrl(project.imageUrl);

              return (
                <article
                  key={project.id}
                  className="overflow-hidden rounded-xl border border-[#D1D7E0] bg-white shadow-sm shadow-black/5 transition hover:-translate-y-1 hover:border-[#14171C]/25"
                >
                  <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="bg-[#F7F8FA] p-4 lg:border-r lg:border-[#D1D7E0]">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={project.title}
                          className="aspect-video h-full w-full rounded-md bg-white object-contain p-3"
                          loading="lazy"
                        />
                      ) : (
                        <div className={`${FONT_MONO} flex aspect-video items-center justify-center rounded-md border border-dashed border-[#C7CFDB] bg-white p-4 text-xs text-[#64748B]`}>
                          /projects/{project.slug}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-center p-6 sm:p-8">
                      <div className="flex items-center gap-2">
                        <MethodBadge method="GET" />
                        <span className={`${FONT_MONO} text-xs text-[#64748B]`}>
                          /projeler/{project.slug}
                        </span>
                        <span className="h-px flex-1 bg-[#C7CFDB]" />
                        <span className={`${FONT_MONO} text-[11px] font-medium text-[#64748B]`}>
                          200 OK
                        </span>
                      </div>

                      <p className={`${FONT_MONO} mt-5 text-xs font-medium text-[#9CA3AF]`}>
                        0{index + 1} / Project
                      </p>

                      <h2 className={`${FONT_DISPLAY} mt-3 text-3xl font-extrabold tracking-tight text-[#14171C]`}>
                        {project.title}
                      </h2>

                      <p className="mt-4 text-sm leading-7 text-[#4B5563] sm:text-base">
                        {project.shortDescription}
                      </p>

                      {project.technologies.length > 0 ? (
                        <div className="mt-6 flex flex-wrap gap-2">
                          {project.technologies.slice(0, 10).map((technology) => (
                            <span
                              key={technology.id}
                              className={`${FONT_MONO} rounded-md border border-[#D1D7E0] bg-[#F7F8FA] px-3 py-1.5 text-xs font-medium text-[#374151]`}
                            >
                              {technology.name}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-[#D1D7E0] pt-5">
                        <Link
                          to={`/projects/${project.slug}`}
                          className={`${FONT_MONO} inline-flex items-center justify-center gap-2 rounded-md border border-[#D1D7E0] bg-white px-5 py-2.5 text-sm font-semibold text-[#14171C] shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:border-[#14171C]/30 hover:bg-[#F7F8FA]`}
                        >
                          <span>Detayları gör</span>
                          <ArrowRight size={14} strokeWidth={1.9} />
                        </Link>

                        {project.githubUrl ? (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`${FONT_MONO} inline-flex items-center justify-center gap-2 rounded-md border border-[#D1D7E0] bg-white px-5 py-2.5 text-sm font-semibold text-[#14171C] shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:border-[#14171C]/30 hover:bg-[#F7F8FA]`}
                          >
                            <span>GitHub</span>
                            <ExternalLink size={14} strokeWidth={1.9} />
                          </a>
                        ) : null}

                        {project.demoUrl ? (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`${FONT_MONO} inline-flex items-center justify-center gap-2 rounded-md border border-[#16A34A]/25 bg-[#16A34A]/10 px-5 py-2.5 text-sm font-semibold text-[#16A34A] transition hover:-translate-y-0.5 hover:bg-[#16A34A]/15`}
                          >
                            <span>Demo</span>
                            <ExternalLink size={14} strokeWidth={1.9} />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
