import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, FileText, Mail } from 'lucide-react';

import { EmptyState, ErrorState, LoadingState } from '../../components/common/data-state';
import { usePublicCertificates } from '../../features/certificates/hooks';
import { usePublicCv } from '../../features/cv/hooks';
import { usePublicExperiences } from '../../features/experiences/hooks';
import { usePublicProjects } from '../../features/projects/hooks';
import { useGroupedPublicTechnologies } from '../../features/technologies/hooks';
import { buildBackendFileUrl } from '../../utils/backendUrl';

/**
 * FONT SETUP (add to index.html <head>, once):
 *
 * <link rel="preconnect" href="https://fonts.googleapis.com">
 * <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
 * <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
 *
 * Concept: the page reads like API documentation for a person — every
 * section is a labeled HTTP route (GET /projeler, POST /iletişim), and the
 * hero is a live-looking request/response panel built from real profile data.
 *
 * Tokens:
 *   paper   #F7F8FA  page background
 *   surface #FFFFFF  card surface
 *   line    #E3E6EA  hairline borders
 *   ink     #14171C  primary text
 *   mute    #6B7280  secondary text
 *   get     #2563EB  GET method blue
 *   post    #16A34A  POST method green
 *   code    #0F1115  code panel background
 */

const FONT_DISPLAY = "font-['Manrope']";
const FONT_MONO = "font-['IBM_Plex_Mono']";
const FONT_BODY = "font-['Inter']";

const motionViewport = { once: true, amount: 0.18 } as const;

const pageFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const sectionFade: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const cardFade: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: "easeOut" },
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

function formatDate(value: string | null) {
  if (!value) {
    return 'Devam ediyor';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'short',
  }).format(date);
}

function GithubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.5v-1.76c-2.78.62-3.37-1.2-3.37-1.2-.45-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 7.1c.85 0 1.7.12 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.78-4.57 5.04.36.32.68.94.68 1.9v2.67c0 .28.18.6.69.5A10.07 10.07 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
      <path d="M6.94 8.98H3.75V20h3.19V8.98ZM5.34 4C4.31 4 3.5 4.8 3.5 5.8c0 .99.8 1.8 1.8 1.8h.03c1.04 0 1.84-.81 1.84-1.8C7.15 4.8 6.37 4 5.34 4ZM20.5 13.68c0-3.05-1.63-4.47-3.8-4.47-1.75 0-2.54.97-2.98 1.65V8.98h-3.19c.04 1.03 0 11.02 0 11.02h3.19v-6.15c0-.33.02-.66.12-.9.26-.66.86-1.35 1.86-1.35 1.31 0 1.84 1 1.84 2.47V20h3.19l-.03-6.32Z" />
    </svg>
  );
}

/** Method badge, e.g. GET / POST — colored like an API client. */
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

/** Route-style section header: METHOD /path ............ 200 OK */
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
        <span className="h-px flex-1 bg-[#94A3B8]/80" />
        <span className={`${FONT_MONO} text-[11px] text-[#64748B]`}>200 OK</span>
      </div>
      <h2 className={` mt-4 text-xl font-extrabold uppercase tracking-[0.12em] text-[#14171C] sm:text-2xl`}>
        {title}
      </h2>
      {description ? (
        <p className={`${FONT_BODY} mt-4 text-base leading-8 text-[#6B7280]`}>{description}</p>
      ) : null}
    </div>
  );
}

export function HomePage() {
  const cvQuery = usePublicCv();
  const projectsQuery = usePublicProjects();
  const technologyGroupsQuery = useGroupedPublicTechnologies();
  const experiencesQuery = usePublicExperiences();
  const certificatesQuery = usePublicCertificates();

  const profile = cvQuery.data?.profile ?? null;
  const projects = projectsQuery.data ?? [];
  const homepageProjects = projects.slice(0, 3);
  const technologyGroups = technologyGroupsQuery.data ?? [];
  const experiences = experiencesQuery.data ?? [];
  const certificates = certificatesQuery.data ?? [];
  const sortedExperiences = [...experiences].sort((first, second) => {
    const getSortDate = (experience: (typeof experiences)[number]) => {
      if (experience.isCurrent) {
        return Number.POSITIVE_INFINITY;
      }

      const endDate = experience.endDate
        ? new Date(experience.endDate).getTime()
        : Number.NaN;

      if (!Number.isNaN(endDate)) {
        return endDate;
      }

      return new Date(experience.startDate).getTime();
    };

    return getSortDate(second) - getSortDate(first);
  });

  const visibleTechnologyGroups = technologyGroups.filter(
    (group) => group.technologies.length > 0,
  );

  const cvFileUrl = resolveAssetUrl(profile?.cvFileUrl) ?? buildBackendFileUrl('/files/cv/deniz-celik-cv.pdf');
  const contactItems = [
    profile?.email
      ? { label: 'Email', value: profile.email, href: `mailto:${profile.email}` }
      : null,
    profile?.githubUrl
      ? { label: 'GitHub', value: 'Profili aç', href: profile.githubUrl }
      : null,
    profile?.linkedInUrl
      ? { label: 'LinkedIn', value: 'Profili aç', href: profile.linkedInUrl }
      : null,
    cvFileUrl ? { label: 'CV', value: 'PDF görüntüle', href: cvFileUrl } : null,
  ].filter(Boolean) as Array<{ label: string; value: string; href: string }>;

  const displayName = profile?.fullName ?? 'Deniz Çelik';
  const displaySummary =
    profile?.summary ??
    'Güvenli API yapıları, yönetilebilir backend sistemleri ve gerçek veriye bağlı sade portfolio deneyimleri üzerine çalışıyorum.';

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageFade}
      className={` bg-[#EEF1F5]`}
    >
      <motion.section initial="hidden" whileInView="visible" viewport={motionViewport} variants={sectionFade} id="hero" className="mx-auto max-w-6xl px-5 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E3E6EA] bg-white px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#16A34A] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#16A34A]" />
              </span>
              <span className={`${FONT_MONO} text-[11px] uppercase tracking-[0.14em] text-[#16A34A]`}>
                Yeni fırsatlara açık
              </span>
            </div>

            <h1 className={`${FONT_DISPLAY} mt-6 text-5xl font-extrabold tracking-tight text-[#14171C] sm:text-6xl`}>
              {displayName}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2">
              {['Backend Developer', 'Mobile Developer', 'NLP & AI Specialist'].map((role) => (
                <span
                  key={role}
                  className={`${FONT_MONO} rounded-md border border-[#E3E6EA] bg-white px-3 py-1.5 text-xs font-medium text-[#374151]`}
                >
                  {role}
                </span>
              ))}
            </div>

            <p className="mt-7 max-w-lg text-base leading-8 text-[#4B5563] sm:text-lg">
              {displaySummary}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              {profile?.githubUrl ? (
                  <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub profilini aç"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#D1D7E0] bg-white text-[#14171C] shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:border-[#2563EB]/50 hover:text-[#2563EB]"
                >
                  <GithubIcon />
                </a>
              ) : null}

              {profile?.linkedInUrl ? (
                  <a
                  href={profile.linkedInUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn profilini aç"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#D1D7E0] bg-white text-[#14171C] shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:border-[#2563EB]/50 hover:text-[#2563EB]"
                >
                  <LinkedinIcon />
                </a>
              ) : null}
                <a
                href={cvFileUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="CV PDF dosyasını aç"
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#D1D7E0] bg-white text-[#14171C] shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:border-[#2563EB]/50 hover:text-[#2563EB]"
              >
                <FileText size={18} strokeWidth={1.8} />
              </a>
                <a
                href="/projects"
                className={` inline-flex h-11 items-center justify-center rounded-md border border-[#D1D7E0] bg-white px-5 text-sm font-semibold text-[#14171C] shadow-sm shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#F7F8FA]`}
              >
                <span>Projeleri gör</span>
                <ArrowRight size={14} strokeWidth={1.9} />
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[300px] lg:ml-auto">
            <div className="absolute -inset-4 rounded-[2rem] bg-[#2563EB]/10 blur-2xl" />

            <div className="relative rounded-2xl border border-[#D1D7E0] bg-white p-3 shadow-xl shadow-black/10">
              <div className="mb-2 flex items-center gap-2 px-1 py-0.5">
                <MethodBadge method="GET" />

                <span className={`${FONT_MONO} text-xs text-[#4B5563]`}>
                  /profile
                </span>

                <span className="h-px flex-1 bg-[#94A3B8]/80" />

                <span className={`${FONT_MONO} text-[11px] font-medium text-[#475569]`}>
                  200 OK
                </span>
              </div>

              <img
                src={resolveAssetUrl("/images/profile/deniz-celik.jpg") ?? undefined}
                alt="Deniz Çelik"
                className="aspect-[4/5] w-full rounded-xl object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section initial="hidden" whileInView="visible" viewport={motionViewport} variants={sectionFade} id="about" className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-2.5">
            <MethodBadge method="GET" />
            <span className="font-['IBM_Plex_Mono'] text-sm text-[#14171C]">/hakkımda</span>
            <span className="h-px flex-1 bg-[#94A3B8]/80" />
            <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#64748B]">200 OK</span>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.article
            initial="hidden"
            whileInView="visible"
            viewport={motionViewport}
            variants={cardFade}
            className="rounded-xl border border-[#E3E6EA] bg-white p-7 shadow-sm shadow-black/5 sm:p-8"
          >
            <p className="font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-[0.16em] text-[#16A34A]">
              Hakkımda
            </p>

            <div className="mt-5 space-y-5 text-base leading-8 text-[#374151]">
              <p>
                Merhaba, ben Deniz Çelik.
              </p>

              <p>
                İskenderun Teknik Üniversitesi Bilgisayar Mühendisliği bölümünden 3.11 genel not ortalamasıyla mezun oldum. .NET, C#, ASP.NET Core, PostgreSQL ve Flutter ile backend odaklı, veri yönetimi güçlü ve kullanıcıya ulaşan uçtan uca uygulamalar geliştirmeye odaklanıyorum.
              </p>

              <p>
                Yazılım geliştirme sürecinde yalnızca kod yazmayı değil; kurumların dijital dönüşüm süreçlerine katkı sağlayan, rutin işleri otomatikleştiren ve operasyonel yükü azaltan çözümler üretmeyi önemsiyorum. API mimarisi, servis sorumlulukları, veri akışı ve güvenlik gibi backend konularının yanında; sunucu yönetimi, ağ altyapısı ve sistem çözümleriyle de projelere daha bütünsel yaklaşmaya çalışıyorum.
              </p>

              <p>
                Amacım; sürdürülebilir, geliştirilebilir ve gerçek ihtiyaçlara cevap veren yazılım çözümleri üreterek kurumsal süreçlere teknik değer katmak.
              </p>
            </div>
          </motion.article>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              {
                title: 'Backend',
                text: 'ASP.NET Core, C#, Entity Framework Core, JWT, validation ve PostgreSQL ile güvenli, yönetilebilir ve sürdürülebilir API yapıları geliştiriyorum.',
              },
              {
                title: 'Mobil',
                text: 'Flutter ile backend servislerine bağlı, sade, anlaşılır ve kullanıcı odaklı mobil uygulama arayüzleri geliştiriyorum.',
              },
              {
                title: 'Sistem & AI',
                text: 'Sunucu, ağ altyapısı, otomasyon ve AI/NLP entegrasyonlarını gerçek ürün senaryolarına değer katacak şekilde ele alıyorum.',
              },
            ].map((item) => (
              <motion.article
                initial="hidden"
                whileInView="visible"
                viewport={motionViewport}
                variants={cardFade}
                key={item.title}
                className="rounded-xl border border-[#E3E6EA] bg-white p-5 shadow-sm shadow-black/5 transition hover:-translate-y-1 hover:border-[#2563EB]/30"
              >
                <h3 className="font-['Manrope'] text-lg font-bold text-[#14171C]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#6B7280]">{item.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>
      <motion.section
        id="projects"
        initial="hidden"
        whileInView="visible"
        viewport={motionViewport}
        variants={sectionFade}
        className="mx-auto max-w-6xl px-5 py-16 sm:px-6"
      >
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5">
              <MethodBadge method="GET" />
              <span className={`${FONT_MONO} text-sm text-[#14171C]`}>/projeler?limit=3</span>
              <span className="h-px flex-1 bg-[#94A3B8]/80" />
              <span className={`${FONT_MONO} text-[11px] font-medium text-[#64748B]`}>200 OK</span>
            </div>

            <h2 className={`${FONT_DISPLAY} mt-4 text-xl font-extrabold uppercase tracking-[0.12em] text-[#14171C] sm:text-2xl`}>
              ÖNE ÇIKAN ÇALIŞMALAR
            </h2>

            <p className={`${FONT_BODY} mt-4 max-w-2xl text-base leading-8 text-[#6B7280]`}>
              Backend, mobil uygulama, veri yönetimi ve sistem entegrasyonu odağında geliştirdiğim projelerden bazıları burada yer alır. Tüm çalışmalarımı ve proje detaylarını projeler sayfasında inceleyebilirsin.
            </p>
          </div>

          <Link
            to="/projects"
            className={`${FONT_MONO} inline-flex w-fit items-center justify-center gap-2 rounded-md border border-[#D1D7E0] bg-white px-5 py-2.5 text-sm font-semibold text-[#14171C] shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:border-[#14171C]/30 hover:bg-[#F7F8FA]`}
          >
            <span>Tüm projeleri incele</span>
            <ArrowRight size={14} strokeWidth={1.9} />
          </Link>
        </div>

        {projectsQuery.isLoading ? (
          <LoadingState title="Projeler yükleniyor..." />
        ) : projectsQuery.isError ? (
          <ErrorState
            title="Projeler yüklenemedi."
            message={getErrorMessage(projectsQuery.error)}
          />
        ) : homepageProjects.length === 0 ? (
          <EmptyState
            title="Henüz yayınlanan proje yok."
            message="Projeler yayınlandığında bu bölümde en fazla 3 proje gösterilecek."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {homepageProjects.map((project) => {
              const projectImageUrl = resolveAssetUrl(project.imageUrl);

              return (
                <motion.article
                  key={project.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={motionViewport}
                  variants={cardFade}
                  className="flex min-h-full flex-col overflow-hidden rounded-xl border border-[#D1D7E0] bg-white shadow-sm shadow-black/5 transition hover:-translate-y-1 hover:border-[#2563EB]/30"
                >
                  <div className="bg-[#F7F8FA] p-3">
                    {projectImageUrl ? (
                      <img
                        src={projectImageUrl}
                        alt={project.title}
                        className="aspect-video w-full rounded-md bg-white object-contain p-2"
                        loading="lazy"
                      />
                    ) : (
                      <div className={`${FONT_MONO} flex aspect-video items-center justify-center rounded-md border border-dashed border-[#C7CFDB] bg-white p-4 text-xs text-[#64748B]`}>
                        /projects/{project.slug}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2">
                      <MethodBadge method="GET" />
                      <span className={`${FONT_MONO} truncate text-xs text-[#64748B]`}>
                        /projeler/{project.slug}
                      </span>
                    </div>

                    <h3 className={`${FONT_DISPLAY} mt-4 text-xl font-bold tracking-tight text-[#14171C]`}>
                      {project.title}
                    </h3>

                    <p className={`${FONT_BODY} mt-3 line-clamp-3 text-sm leading-7 text-[#4B5563]`}>
                      {project.shortDescription}
                    </p>

                    {project.technologies.length > 0 ? (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.technologies.slice(0, 4).map((technology) => (
                          <span
                            key={technology.id}
                            className={`${FONT_MONO} rounded-md border border-[#D1D7E0] bg-[#F7F8FA] px-2.5 py-1 text-[11px] font-medium text-[#374151]`}
                          >
                            {technology.name}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-[#D1D7E0] pt-5">
                      <Link
                        to={`/projects/${project.slug}`}
                        className={`${FONT_MONO} inline-flex items-center justify-center gap-2 rounded-md border border-[#D1D7E0] bg-white px-4 py-2 text-xs font-semibold text-[#14171C] shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:border-[#14171C]/30 hover:bg-[#F7F8FA]`}
                      >
                        <span>Detay</span>
                        <ArrowRight size={14} strokeWidth={1.9} />
                      </Link>

                      {project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`${FONT_MONO} inline-flex items-center justify-center gap-2 rounded-md border border-[#D1D7E0] bg-white px-4 py-2 text-xs font-semibold text-[#14171C] shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:border-[#14171C]/30 hover:bg-[#F7F8FA]`}
                        >
                          <span>GitHub</span>
                            <ExternalLink size={14} strokeWidth={1.9} />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </motion.section>


      <motion.section initial="hidden" whileInView="visible" viewport={motionViewport} variants={sectionFade} id="technologies" className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
        <RouteHeader
          method="GET"
          path="/stack"
          title="Teknik yetkinlikler"
          description="Backend, mobil uygulama, veritabanı, sistem yönetimi ve AI odaklı geliştirme süreçlerinde kullandığım teknolojiler, araçlar ve yaklaşımlar."
        />

        {technologyGroupsQuery.isLoading ? (
          <LoadingState title="Teknolojiler yükleniyor..." />
        ) : technologyGroupsQuery.isError ? (
          <ErrorState title="Teknolojiler yüklenemedi." message={getErrorMessage(technologyGroupsQuery.error)} />
        ) : visibleTechnologyGroups.length === 0 ? (
          <EmptyState
            title="Henüz teknoloji yayınlanmadı."
            message="Grouped technologies endpoint hazır; yayınlanan kayıtlar burada görünecek."
          />
        ) : (
          <div className="mt-8 grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleTechnologyGroups.map((group) => (
              <motion.article
                  initial="hidden"
                  whileInView="visible"
                  viewport={motionViewport}
                  variants={cardFade}
                key={group.category}
                className="rounded-xl border border-[#E3E6EA] bg-white p-5 transition hover:-translate-y-1 hover:border-[#2563EB]/30"
              >
                <h3 className={`${FONT_MONO} text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748B]`}>
                  {group.category}
                </h3>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  {group.technologies.map((technology) => {
                    const iconUrl = resolveAssetUrl(technology.iconUrl);

                    return (
                      <div
                        key={technology.id}
                        className="flex items-center gap-2 rounded-md border border-[#E3E6EA] bg-[#F7F8FA] px-3 py-2 transition hover:-translate-y-0.5 hover:border-[#2563EB]/40"
                      >
                        {iconUrl ? (
                          <img
                            src={iconUrl}
                            alt=""
                            className="h-8 w-8 shrink-0 rounded-md border border-[#D1D7E0] bg-white p-1 object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <div className={`${FONT_MONO} flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#E3E6EA] bg-white text-[10px] font-semibold text-[#6B7280]`}>
                            {technology.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}

                        <span className="text-sm font-medium text-[#14171C]">{technology.name}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </motion.section>

      <motion.section initial="hidden" whileInView="visible" viewport={motionViewport} variants={sectionFade} id="experience" className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
        <RouteHeader
          method="GET"
          path="/deneyim"
          title="Deneyim kayıtları"
          description="Staj, araştırma projesi ve ürün geliştirme süreçlerinde aldığım teknik sorumluluklar."
        />

        {experiencesQuery.isLoading ? (
          <LoadingState title="Deneyimler yükleniyor..." />
        ) : experiencesQuery.isError ? (
          <ErrorState title="Deneyimler yüklenemedi." message={getErrorMessage(experiencesQuery.error)} />
        ) : sortedExperiences.length === 0 ? (
          <EmptyState
            title="Deneyim kayıtları yakında eklenecek."
            message="Yayınlanan deneyimler burada zaman çizelgesi olarak gösterilecek."
          />
        ) : (
          <div className="relative mt-10">
            <div className="absolute left-4 top-3 hidden h-[calc(100%-1.5rem)] w-px bg-[#94A3B8]/70 md:block" />

            <div className="space-y-5">
              {sortedExperiences.map((experience) => (
                <motion.article
                  initial="hidden"
                  whileInView="visible"
                  viewport={motionViewport}
                  variants={cardFade}
                  key={experience.id}
                  className="relative md:pl-12"
                >
                  <span className="absolute left-[0.56rem] top-8 hidden h-3 w-3 rounded-full border border-[#16A34A]/40 bg-[#16A34A] shadow-sm shadow-[#16A34A]/30 md:block" />

                  <div className="rounded-xl border border-[#E3E6EA] bg-white p-6 shadow-sm shadow-black/5 transition hover:-translate-y-1 hover:border-[#2563EB]/30 sm:p-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className={`${FONT_MONO} text-xs font-semibold text-[#2563EB]`}>
                          {experience.companyName}
                        </p>

                        <h3 className={`${FONT_DISPLAY} mt-2 text-2xl font-bold tracking-tight text-[#14171C]`}>
                          {experience.position}
                        </h3>

                        {experience.location ? (
                          <p className="mt-2 text-sm text-[#64748B]">{experience.location}</p>
                        ) : null}
                      </div>

                      <p className={`${FONT_MONO} w-fit rounded-md border border-[#E3E6EA] bg-[#F7F8FA] px-4 py-2 text-xs font-medium text-[#6B7280]`}>
                        {formatDate(experience.startDate)} — {experience.isCurrent ? 'Devam ediyor' : formatDate(experience.endDate)}
                      </p>
                    </div>

                    <p className="mt-6 max-w-4xl whitespace-pre-line text-sm leading-8 text-[#4B5563] sm:text-base">
                      {experience.description}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}
      </motion.section>

      <motion.section initial="hidden" whileInView="visible" viewport={motionViewport} variants={sectionFade} id="certificates" className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
        <RouteHeader
          method="GET"
          path="/sertifikalar"
          title="Sertifikalar"
          description="Teknik gelişim sürecimde tamamladığım eğitimler ve doğrulanabilir sertifika kayıtları."
        />

        {certificatesQuery.isLoading ? (
          <LoadingState title="Sertifikalar yükleniyor..." />
        ) : certificatesQuery.isError ? (
          <ErrorState title="Sertifikalar yüklenemedi." message={getErrorMessage(certificatesQuery.error)} />
        ) : certificates.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-[#E3E6EA] bg-white/60 p-7 sm:p-8">
            <p className={`${FONT_MONO} text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]`}>
              Yakında
            </p>
            <h3 className={`${FONT_DISPLAY} mt-4 text-2xl font-bold tracking-tight text-[#14171C]`}>
              Sertifika kayıtları eklenecek.
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6B7280]">
              Tamamlanan eğitimler, credential bağlantıları ve sertifika dosyaları hazırlandıkça bu bölümde yayınlanacak.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((certificate) => {
              const fileUrl = resolveAssetUrl(certificate.fileUrl);
              const issueDate = formatDate(certificate.issueDate);

              return (
                <motion.article
                  initial="hidden"
                  whileInView="visible"
                  viewport={motionViewport}
                  variants={cardFade}
                  key={certificate.id}
                  className="rounded-xl border border-[#E3E6EA] bg-white p-6 transition hover:-translate-y-1 hover:border-[#2563EB]/30"
                >
                  <p className={`${FONT_MONO} text-xs font-semibold text-[#2563EB]`}>
                    {certificate.institution}
                  </p>

                  <h3 className={`${FONT_DISPLAY} mt-3 text-xl font-bold tracking-tight text-[#14171C]`}>
                    {certificate.title}
                  </h3>

                  {issueDate ? (
                    <p className={`${FONT_MONO} mt-3 text-xs font-medium text-[#64748B]`}>{issueDate}</p>
                  ) : null}

                  {certificate.description ? (
                    <p className="mt-5 text-sm leading-7 text-[#6B7280]">{certificate.description}</p>
                  ) : null}

                  {certificate.credentialUrl || fileUrl ? (
                    <div className="mt-6 flex flex-wrap gap-3 border-t border-[#E3E6EA] pt-5">
                      {certificate.credentialUrl ? (
                        <a
                          href={certificate.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${certificate.title} sertifika doğrulama bağlantısını aç`}
                          className={`${FONT_MONO} group/link inline-flex items-center justify-center gap-2 rounded-lg border border-[#D1D7E0] bg-white px-4 py-2.5 text-xs font-semibold text-[#14171C] shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:border-[#2563EB]/45 hover:bg-[#F7F8FA] hover:text-[#2563EB]`}
                        >
                          <span>Sertifikayı Görüntüle</span>
                          <ExternalLink
                            size={14}
                            strokeWidth={1.9}
                            className="transition group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                          />
                        </a>
                      ) : null}

                      {fileUrl ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${certificate.title} sertifika dosyasını aç`}
                          className={`${FONT_MONO} group/link inline-flex items-center justify-center gap-2 rounded-lg border border-[#E3E6EA] bg-[#F7F8FA] px-4 py-2.5 text-xs font-semibold text-[#14171C] transition hover:-translate-y-0.5 hover:border-[#14171C]/30 hover:bg-white`}
                        >
                          <span>Dosyayı Aç</span>
                          <ExternalLink
                            size={14}
                            strokeWidth={1.9}
                            className="transition group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                          />
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </motion.article>
              );
            })}
          </div>
        )}
      </motion.section>

      <motion.section initial="hidden" whileInView="visible" viewport={motionViewport} variants={sectionFade} id="contact" className="mx-auto max-w-6xl px-5 py-16 pb-24 sm:px-6">
        <div className="overflow-hidden rounded-xl border border-[#D1D7E0] bg-white shadow-sm shadow-black/5">
          <div className="grid gap-0 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="border-b border-[#D1D7E0] bg-[#F7F8FA] p-7 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
              <div className="flex items-center gap-2.5">
                <MethodBadge method="POST" />
                <span className="font-['IBM_Plex_Mono'] text-sm text-[#14171C]">/iletişim</span>
                <span className="h-px flex-1 bg-[#94A3B8]/80" />
                <span className="font-['IBM_Plex_Mono'] text-[11px] font-medium text-[#64748B]">200 OK</span>
              </div>

              <h2 className="font-['Manrope'] mt-6 text-4xl font-extrabold tracking-tight text-[#14171C] sm:text-5xl">
                Birlikte çalışalım.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-8 text-[#4B5563]">
                Yeni projeler, iş birlikleri veya teknik konular için bana ulaşabilirsin.
              </p>

              <p className="mt-6 max-w-xl text-sm leading-7 text-[#64748B]">
                GitHub ve LinkedIn üzerinden çalışmalarımı inceleyebilir, CV dosyamı görüntüleyebilir veya doğrudan e-posta gönderebilirsin.
              </p>
            </div>

            <div className="p-7 sm:p-8 lg:p-10">
              {cvQuery.isLoading ? (
                <LoadingState title="İletişim bilgileri yükleniyor..." />
              ) : cvQuery.isError ? (
                <ErrorState title="İletişim bilgileri yüklenemedi." message={getErrorMessage(cvQuery.error)} />
              ) : contactItems.length === 0 ? (
                <EmptyState
                  title="İletişim bilgileri yakında eklenecek."
                  message="Email, GitHub, LinkedIn veya CV bağlantıları yayınlandığında burada gösterilecek."
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {contactItems.map((item) => {
                    const actionLabel =
                      item.label === 'Email'
                        ? 'Mail gönder'
                        : item.label === 'CV'
                          ? 'CV dosyasını aç'
                          : 'Profili aç';

                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                        rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                        className="group flex min-h-[170px] flex-col items-center justify-center rounded-xl border border-[#D1D7E0] bg-[#F7F8FA] p-5 text-center shadow-sm shadow-black/5 transition hover:-translate-y-1 hover:border-[#14171C]/25 hover:bg-white"
                      >
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-[#D1D7E0] bg-white text-[#14171C] shadow-sm shadow-black/5">
                          {item.label === 'Email' ? (
                            <Mail size={18} strokeWidth={1.8} />
                          ) : item.label === 'GitHub' ? (
                            <GithubIcon />
                          ) : item.label === 'LinkedIn' ? (
                            <LinkedinIcon />
                          ) : (
                            <FileText size={18} strokeWidth={1.8} />
                          )}
                        </span>

                        <p className="font-['IBM_Plex_Mono'] mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                          {item.label}
                        </p>

                        <p className="font-['IBM_Plex_Mono'] mt-5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#14171C] transition group-hover:text-[#2563EB]">
                          <span>{actionLabel}</span>
                          <ArrowRight size={14} strokeWidth={1.9} />
                        </p>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.section>




    </motion.div>
  );
}
