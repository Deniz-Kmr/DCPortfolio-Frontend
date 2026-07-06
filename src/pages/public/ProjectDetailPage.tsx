import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

import { EmptyState, ErrorState, LoadingState } from '../../components/common/data-state';
import { usePublicProjectDetail } from '../../features/projects/hooks';
import { buildBackendFileUrl } from '../../utils/backendUrl';

const FONT_DISPLAY = "font-['Manrope']";
const FONT_MONO = "font-['IBM_Plex_Mono']";
const FONT_BODY = "font-['Inter']";

const motionViewport = { once: true, amount: 0.18 } as const;

const pageFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

const sectionFade: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
};

const cardFade: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: 'easeOut' },
  },
};

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

function RouteLine({ path }: { path: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <MethodBadge method="GET" />
      <span className={`${FONT_MONO} text-sm text-[#14171C]`}>{path}</span>
      <span className="h-px flex-1 bg-[#94A3B8]/80" />
      <span className={`${FONT_MONO} text-[11px] font-medium text-[#64748B]`}>200 OK</span>
    </div>
  );
}

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const projectQuery = usePublicProjectDetail(slug);
  const project = projectQuery.data ?? null;
  const imageUrl = resolveAssetUrl(project?.imageUrl);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  if (!slug) {
    return (
      <div className={`${FONT_BODY} bg-[#EEF1F5]`}>
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
          <ErrorState
            title="Proje adresi bulunamadı."
            message="Projeler sayfasına geri dönüp tekrar deneyebilirsin."
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageFade}
      className={`${FONT_BODY} min-h-screen bg-[#EEF1F5]`}
    >
      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            to="/projects"
            className={`${FONT_MONO} inline-flex items-center justify-center gap-2 rounded-md border border-[#D1D7E0] bg-white px-4 py-2 text-xs font-semibold text-[#14171C] shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:border-[#14171C]/30 hover:bg-[#F7F8FA]`}
          >
            <ArrowRight className="rotate-180" size={14} strokeWidth={1.9} />
            <span>Projeler sayfasına dön</span>
          </Link>
        </div>

        {projectQuery.isLoading ? (
          <LoadingState title="Proje detayı yükleniyor..." />
        ) : projectQuery.isError ? (
          <ErrorState
            title="Proje detayı yüklenemedi."
            message={getErrorMessage(projectQuery.error)}
          />
        ) : !project ? (
          <EmptyState
            title="Proje bulunamadı."
            message="Backend bu slug için yayınlanan bir proje döndürmedi."
          />
        ) : (
          <article className="space-y-8">
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={motionViewport}
              variants={sectionFade}
              className="overflow-hidden rounded-xl border border-[#D1D7E0] bg-white shadow-sm shadow-black/5"
            >
              <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="flex flex-col justify-center p-7 sm:p-8 lg:p-10">
                  <RouteLine path={`/projeler/${project.slug}`} />

                  <h1 className={` mt-6 text-4xl font-extrabold tracking-tight text-[#14171C] sm:text-5xl`}>
                    {project.title}
                  </h1>

                  <p className="mt-5 max-w-2xl text-base leading-8 text-[#4B5563] sm:text-lg">
                    {project.shortDescription}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
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

                <div className="bg-[#F7F8FA] p-4 lg:border-l lg:border-[#D1D7E0]">
                  {imageUrl ? (
                    <button
                      type="button"
                      onClick={() => setPreviewImageUrl(imageUrl)}
                      className="group block w-full rounded-md bg-white p-3 text-left shadow-sm shadow-black/5 transition hover:-translate-y-1"
                      aria-label={`${project.title} görselini büyüt`}
                    >
                      <img
                        src={imageUrl}
                        alt={project.title}
                        className="aspect-video w-full rounded-md object-contain transition duration-300 group-hover:scale-[1.01]"
                        loading="lazy"
                      />
                    </button>
                  ) : (
                    <div className={`${FONT_MONO} flex aspect-video items-center justify-center rounded-md border border-dashed border-[#C7CFDB] bg-white p-4 text-xs text-[#64748B]`}>
                      /projects/{project.slug}
                    </div>
                  )}
                </div>
              </div>
            </motion.section>

            <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={motionViewport}
                variants={cardFade}
                className="rounded-xl border border-[#D1D7E0] bg-white p-7 shadow-sm shadow-black/5 sm:p-8"
              >
                <RouteLine path="/proje-hakkında" />

                <h2 className={` mt-5 text-lg font-extrabold uppercase tracking-[0.12em] text-[#14171C] sm:text-xl`}>
                  PROJE ÖZETİ
                </h2>

                <p className="mt-5 whitespace-pre-line text-sm leading-8 text-[#4B5563] sm:text-base">
                  {project.description}
                </p>
              </motion.div>

              <motion.aside
                initial="hidden"
                whileInView="visible"
                viewport={motionViewport}
                variants={cardFade}
                className="rounded-xl border border-[#D1D7E0] bg-white p-7 shadow-sm shadow-black/5 sm:p-8"
              >
                <RouteLine path="/stack" />

                <h2 className={`${FONT_DISPLAY} mt-5 text-lg font-extrabold uppercase tracking-[0.12em] text-[#14171C] sm:text-xl`}>
                  KULLANILAN TEKNOLOJİLER
                </h2>

                {project.technologies.length === 0 ? (
                  <p className="mt-5 text-sm leading-7 text-[#6B7280]">
                    Bu projeye henüz teknoloji bağlanmadı.
                  </p>
                ) : (
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {project.technologies.map((technology) => {
                      const iconUrl = resolveAssetUrl(
                        (technology as { iconUrl?: string | null }).iconUrl,
                      );

                      return (
                        <div
                          key={technology.id}
                          className="flex items-center gap-3 rounded-lg border border-[#D1D7E0] bg-[#F7F8FA] p-3 transition hover:-translate-y-0.5 hover:border-[#2563EB]/35 hover:bg-white"
                        >
                          {iconUrl ? (
                            <img
                              src={iconUrl}
                              alt=""
                              className="h-10 w-10 shrink-0 rounded-md border border-[#D1D7E0] bg-white p-1.5 object-contain"
                              loading="lazy"
                            />
                          ) : (
                            <div className={`${FONT_MONO} flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#D1D7E0] bg-white text-[11px] font-semibold text-[#64748B]`}>
                              {technology.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#14171C]">
                              {technology.name}
                            </p>
                            <p className={`${FONT_MONO} mt-1 text-[10px] uppercase tracking-[0.12em] text-[#64748B]`}>
                              project stack
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.aside>
            </section>

            {imageUrl ? (
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={motionViewport}
                variants={sectionFade}
                className="rounded-xl border border-[#D1D7E0] bg-white p-7 shadow-sm shadow-black/5 sm:p-8"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="max-w-3xl">
                    <RouteLine path="/galeri" />

                    <h2 className={` mt-5 text-lg font-extrabold uppercase tracking-[0.12em] text-[#14171C] sm:text-xl`}>
                      PROJE GALERİSİ
                    </h2>
                  </div>

                  <p className={`${FONT_MONO} text-xs font-medium text-[#64748B]`}>
                    Ekran görüntüsünü büyütmek için tıkla.
                  </p>
                </div>

                <div className="mt-7 grid gap-5 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setPreviewImageUrl(imageUrl)}
                    className="group rounded-md bg-[#F7F8FA] p-3 text-left transition hover:-translate-y-1"
                    aria-label={`${project.title} galeri görselini büyüt`}
                  >
                    <img
                      src={imageUrl}
                      alt={`${project.title} ekran görüntüsü`}
                      className="aspect-video w-full rounded-md bg-white object-contain p-2 transition duration-300 group-hover:scale-[1.01]"
                      loading="lazy"
                    />
                  </button>
                </div>
              </motion.section>
            ) : null}
          </article>
        )}
      </main>

      {previewImageUrl ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#14171C]/80 p-4 backdrop-blur-sm"
          onClick={() => setPreviewImageUrl(null)}
          role="presentation"
        >
          <button
            type="button"
            className={`${FONT_MONO} absolute right-5 top-5 rounded-md border border-white/20 bg-white px-4 py-2 text-xs font-semibold text-[#14171C] shadow-sm shadow-black/20 transition hover:bg-[#F7F8FA]`}
            onClick={() => setPreviewImageUrl(null)}
          >
            Kapat
          </button>

          <img
            src={previewImageUrl}
            alt="Büyütülmüş proje görseli"
            className="max-h-[88vh] w-full max-w-6xl rounded-xl bg-white object-contain p-3 shadow-2xl shadow-black/40"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </motion.div>
  );
}
