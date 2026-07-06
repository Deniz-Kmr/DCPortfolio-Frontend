import { FileText } from 'lucide-react';

import { EmptyState, ErrorState, LoadingState } from '../../components/common/data-state';
import { usePublicCertificates } from '../../features/certificates/hooks';
import { usePublicCv } from '../../features/cv/hooks';
import { usePublicExperiences } from '../../features/experiences/hooks';
import { usePublicProjects } from '../../features/projects/hooks';
import { useGroupedPublicTechnologies } from '../../features/technologies/hooks';
import { buildBackendFileUrl } from '../../utils/backendUrl';

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
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="currentColor"
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.5v-1.76c-2.78.62-3.37-1.2-3.37-1.2-.45-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 7.1c.85 0 1.7.12 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.78-4.57 5.04.36.32.68.94.68 1.9v2.67c0 .28.18.6.69.5A10.07 10.07 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="currentColor"
    >
      <path d="M6.94 8.98H3.75V20h3.19V8.98ZM5.34 4C4.31 4 3.5 4.8 3.5 5.8c0 .99.8 1.8 1.8 1.8h.03c1.04 0 1.84-.81 1.84-1.8C7.15 4.8 6.37 4 5.34 4ZM20.5 13.68c0-3.05-1.63-4.47-3.8-4.47-1.75 0-2.54.97-2.98 1.65V8.98h-3.19c.04 1.03 0 11.02 0 11.02h3.19v-6.15c0-.33.02-.66.12-.9.26-.66.86-1.35 1.86-1.35 1.31 0 1.84 1 1.84 2.47V20h3.19l-.03-6.32Z" />
    </svg>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-8 text-zinc-400">{description}</p>
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
  const technologyGroups = technologyGroupsQuery.data ?? [];
  const experiences = experiencesQuery.data ?? [];
  const certificates = certificatesQuery.data ?? [];

  const visibleTechnologyGroups = technologyGroups.filter(
    (group) => group.technologies.length > 0,
  );

  const technologyCount = visibleTechnologyGroups.reduce(
    (total, group) => total + group.technologies.length,
    0,
  );

  const cvFileUrl = resolveAssetUrl(profile?.cvFileUrl) ?? buildBackendFileUrl('/files/cv/deniz-celik-cv.pdf');
  const contactItems = [
    profile?.email
      ? {
          label: 'Email',
          value: profile.email,
          href: `mailto:${profile.email}`,
        }
      : null,
    profile?.githubUrl
      ? {
          label: 'GitHub',
          value: 'Profili aç',
          href: profile.githubUrl,
        }
      : null,
    profile?.linkedInUrl
      ? {
          label: 'LinkedIn',
          value: 'Profili aç',
          href: profile.linkedInUrl,
        }
      : null,
    cvFileUrl
      ? {
          label: 'CV',
          value: 'PDF görüntüle',
          href: cvFileUrl,
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string; href: string }>;

  return (
    <div className="bg-[radial-gradient(circle_at_top,_rgba(63,63,70,0.34),_transparent_34rem)]">
      <section id="hero" className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-zinc-500">
              Backend Developer Portfolio
            </p>

            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl">
              {profile?.fullName ?? 'Deniz Çelik'}
            </h1>

            <p className="mt-5 text-xl font-medium text-zinc-300 sm:text-2xl">
              {profile?.title ?? 'Backend odaklı full stack developer'}
            </p>

            <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
              {profile?.summary ??
                'Güvenli API yapıları, yönetilebilir backend sistemleri ve gerçek veriye bağlı sade portfolio deneyimleri üzerine çalışıyorum.'}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="inline-flex items-center rounded-full bg-zinc-50 px-5 py-3 text-sm font-bold text-zinc-950 shadow-sm transition hover:bg-white"
              >
                Projeleri gör
              </a>

              <div className="flex items-center gap-2">
                {profile?.githubUrl ? (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub profilini aç"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
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
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                  >
                    <LinkedinIcon />
                  </a>
                ) : null}

                <a
                  href={cvFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="CV PDF dosyasını aç"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                >
                  <FileText size={18} strokeWidth={1.8} />
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20">
            <div className="rounded-[1.5rem] border border-white/10 bg-zinc-950/70 p-6">
              <p className="text-sm font-medium text-zinc-400">Canlı portfolio verisi</p>

              <div className="mt-6 grid gap-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-zinc-500">Projeler</span>
                  <span className="text-2xl font-semibold text-zinc-50">{projects.length}</span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-zinc-500">Teknolojiler</span>
                  <span className="text-2xl font-semibold text-zinc-50">{technologyCount}</span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-zinc-500">Deneyimler</span>
                  <span className="text-2xl font-semibold text-zinc-50">{experiences.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Sertifikalar</span>
                  <span className="text-2xl font-semibold text-zinc-50">
                    {certificates.length}
                  </span>
                </div>
              </div>

              <p className="mt-6 text-sm leading-6 text-zinc-500">
                Bu alanlar backend public endpointlerinden gelen gerçek kayıtlara göre güncellenir.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <SectionHeader
            eyebrow="Hakkımda"
            title="Sade, güvenilir ve sürdürülebilir sistemler kurmaya odaklanıyorum."
          />

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            {cvQuery.isLoading ? (
              <LoadingState title="Profil bilgileri yükleniyor..." />
            ) : cvQuery.isError ? (
              <ErrorState
                title="Profil bilgileri yüklenemedi."
                message={getErrorMessage(cvQuery.error)}
              />
            ) : profile ? (
              <div className="space-y-5 text-base leading-8 text-zinc-400">
                <p>{profile.summary}</p>

                <div className="flex flex-wrap gap-3 pt-2 text-sm">
                  {profile.location ? (
                    <span className="rounded-full border border-white/10 px-4 py-2 text-zinc-300">
                      {profile.location}
                    </span>
                  ) : null}

                  {profile.email ? (
                    <span className="rounded-full border border-white/10 px-4 py-2 text-zinc-300">
                      {profile.email}
                    </span>
                  ) : null}
                </div>
              </div>
            ) : (
              <EmptyState
                title="Profil bilgileri henüz yayınlanmadı."
                message="CV/Profile kaydı backend tarafında public olarak yayınlandığında bu bölüm otomatik dolacak."
              />
            )}
          </div>
        </div>
      </section>

      <section id="projects" className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Projeler"
            title="Gerçek backend datasından gelen projeler."
            description="Görsel, GitHub ve canlı demo bağlantıları yalnızca backend tarafından yayınlandığında gösterilir."
          />
        </div>

        <div className="mt-10">
          {projectsQuery.isLoading ? (
            <LoadingState title="Projeler yükleniyor..." />
          ) : projectsQuery.isError ? (
            <ErrorState
              title="Projeler yüklenemedi."
              message={getErrorMessage(projectsQuery.error)}
            />
          ) : projects.length === 0 ? (
            <EmptyState
              title="Henüz proje yayınlanmadı."
              message="Public projects endpoint hazır; yayınlanan kayıtlar burada listelenecek."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {projects.map((project) => {
                const imageUrl = resolveAssetUrl(project.imageUrl);

                return (
                  <article
                    key={project.id}
                    className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] transition hover:border-white/20 hover:bg-white/[0.05]"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={project.title}
                        className="h-56 w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-40 items-center justify-center border-b border-white/10 bg-zinc-900/50">
                        <span className="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-600">
                          {project.title}
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-2xl font-semibold tracking-tight text-zinc-50">
                          {project.title}
                        </h3>

                        {project.isFeatured ? (
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                            Öne çıkan
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-4 text-sm leading-7 text-zinc-400">
                        {project.shortDescription}
                      </p>

                      {project.technologies.length > 0 ? (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {project.technologies.map((technology) => (
                            <span
                              key={technology.id}
                              className="rounded-full border border-white/10 bg-zinc-950/50 px-3 py-1 text-xs text-zinc-300"
                            >
                              {technology.name}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-6 flex flex-wrap gap-3">
                        {project.githubUrl ? (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-semibold text-zinc-200 transition hover:text-white"
                          >
                            GitHub ↗
                          </a>
                        ) : null}

                        {project.demoUrl ? (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-semibold text-zinc-200 transition hover:text-white"
                          >
                            Canlı demo ↗
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section id="technologies" className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
        <SectionHeader
          eyebrow="Teknolojiler"
          title="Kullandığım teknolojiler."
          description="Gruplar backend tarafındaki category alanına göre oluşur."
        />

        <div className="mt-10">
          {technologyGroupsQuery.isLoading ? (
            <LoadingState title="Teknolojiler yükleniyor..." />
          ) : technologyGroupsQuery.isError ? (
            <ErrorState
              title="Teknolojiler yüklenemedi."
              message={getErrorMessage(technologyGroupsQuery.error)}
            />
          ) : visibleTechnologyGroups.length === 0 ? (
            <EmptyState
              title="Henüz teknoloji yayınlanmadı."
              message="Grouped technologies endpoint hazır; yayınlanan kayıtlar burada görünecek."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {visibleTechnologyGroups.map((group) => (
                <article
                  key={group.category}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-400">
                      {group.category}
                    </h3>

                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-500">
                      {group.technologies.length}
                    </span>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {group.technologies.map((technology) => (
                      <span
                        key={technology.id}
                        className="rounded-full border border-white/10 bg-zinc-950/50 px-3 py-2 text-sm text-zinc-300"
                      >
                        {technology.name}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="experience" className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
        <SectionHeader
          eyebrow="Deneyimler"
          title="Profesyonel deneyim kayıtları."
          description="Şirket, pozisyon ve tarih bilgileri backend’den yayınlandığında burada listelenir."
        />

        <div className="mt-10">
          {experiencesQuery.isLoading ? (
            <LoadingState title="Deneyimler yükleniyor..." />
          ) : experiencesQuery.isError ? (
            <ErrorState
              title="Deneyimler yüklenemedi."
              message={getErrorMessage(experiencesQuery.error)}
            />
          ) : experiences.length === 0 ? (
            <EmptyState
              title="Henüz deneyim kaydı yayınlanmadı."
              message="Public experiences endpoint hazır; kayıtlar yayınlandığında bu bölüm otomatik dolacak."
            />
          ) : (
            <div className="space-y-4">
              {experiences.map((experience) => (
                <article
                  key={experience.id}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm text-zinc-500">{experience.companyName}</p>
                      <h3 className="mt-1 text-xl font-semibold text-zinc-50">
                        {experience.position}
                      </h3>
                      {experience.location ? (
                        <p className="mt-2 text-sm text-zinc-500">{experience.location}</p>
                      ) : null}
                    </div>

                    <p className="rounded-full border border-white/10 px-4 py-2 text-xs text-zinc-400">
                      {formatDate(experience.startDate)} —{' '}
                      {experience.isCurrent ? 'Devam ediyor' : formatDate(experience.endDate)}
                    </p>
                  </div>

                  <p className="mt-5 whitespace-pre-line text-sm leading-7 text-zinc-400">
                    {experience.description}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="certificates" className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
        <SectionHeader
          eyebrow="Sertifikalar"
          title="Eğitim ve sertifika kayıtları."
          description="Credential ve dosya linkleri sadece backend’de varsa gösterilir."
        />

        <div className="mt-10">
          {certificatesQuery.isLoading ? (
            <LoadingState title="Sertifikalar yükleniyor..." />
          ) : certificatesQuery.isError ? (
            <ErrorState
              title="Sertifikalar yüklenemedi."
              message={getErrorMessage(certificatesQuery.error)}
            />
          ) : certificates.length === 0 ? (
            <EmptyState
              title="Henüz sertifika yayınlanmadı."
              message="Public certificates endpoint hazır; kayıtlar yayınlandığında bu bölüm otomatik dolacak."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {certificates.map((certificate) => {
                const fileUrl = resolveAssetUrl(certificate.fileUrl);
                const issueDate = formatDate(certificate.issueDate);

                return (
                  <article
                    key={certificate.id}
                    className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6"
                  >
                    <p className="text-sm text-zinc-500">{certificate.institution}</p>
                    <h3 className="mt-2 text-xl font-semibold text-zinc-50">
                      {certificate.title}
                    </h3>

                    {issueDate ? (
                      <p className="mt-3 text-xs text-zinc-500">{issueDate}</p>
                    ) : null}

                    {certificate.description ? (
                      <p className="mt-5 text-sm leading-7 text-zinc-400">
                        {certificate.description}
                      </p>
                    ) : null}

                    <div className="mt-6 flex flex-wrap gap-3">
                      {certificate.credentialUrl ? (
                        <a
                          href={certificate.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold text-zinc-200 transition hover:text-white"
                        >
                          Credential ↗
                        </a>
                      ) : null}

                      {fileUrl ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold text-zinc-200 transition hover:text-white"
                        >
                          Dosya ↗
                        </a>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-5 py-16 pb-24 sm:px-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <SectionHeader
              eyebrow="İletişim"
              title="İletişim bilgilerim."
              description="Email, GitHub, LinkedIn ve CV bağlantıları gerçek portfolio verilerine göre gösterilir."
            />

            <div>
              {cvQuery.isLoading ? (
                <LoadingState title="İletişim bilgileri yükleniyor..." />
              ) : cvQuery.isError ? (
                <ErrorState
                  title="İletişim bilgileri yüklenemedi."
                  message={getErrorMessage(cvQuery.error)}
                />
              ) : contactItems.length === 0 ? (
                <EmptyState
                  title="Henüz public iletişim bilgisi yok."
                  message="CV/Profile kaydına email, GitHub, LinkedIn veya CV linki eklendiğinde burada gösterilecek."
                />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {contactItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                      className="rounded-2xl border border-white/10 bg-zinc-950/50 p-5 transition hover:border-white/20 hover:bg-zinc-900/60"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                        {item.label}
                      </p>
                      <p className="mt-3 break-words text-sm text-zinc-200">{item.value}</p>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
