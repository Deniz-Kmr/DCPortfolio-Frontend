import { EmptyState, ErrorState, LoadingState } from '../../components/common/data-state';
import { EndpointBadge } from '../../components/common/developer';
import { usePublicCertificates } from '../../features/certificates/hooks';
import { apiRoutes } from '../../services/api';
import { buildBackendFileUrl } from '../../utils/backendUrl';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Please try again later.';
}

function formatDate(value: string | null) {
  if (!value) {
    return null;
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

function resolveAssetUrl(url: string | null) {
  if (!url) {
    return null;
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return buildBackendFileUrl(url);
}

export function CertificatesPage() {
  const certificatesQuery = usePublicCertificates();
  const certificates = certificatesQuery.data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-10">
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <EndpointBadge path={apiRoutes.public.certificates} />

          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
            Certificates
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            Certificate cards are rendered from the backend public endpoint. Credential links and
            files are shown only when they are published by the API.
          </p>
        </section>

        {certificatesQuery.isLoading ? (
          <LoadingState title="Loading public certificates..." />
        ) : certificatesQuery.isError ? (
          <ErrorState
            title="Certificates could not be loaded."
            message={getErrorMessage(certificatesQuery.error)}
          />
        ) : certificates.length === 0 ? (
          <EmptyState
            title="No certificates yet."
            message="The public certificates endpoint is available, but no certificate is published yet."
          />
        ) : (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {certificates.map((certificate) => {
              const fileUrl = resolveAssetUrl(certificate.fileUrl);
              const issueDate = formatDate(certificate.issueDate);

              return (
                <article
                  key={certificate.id}
                  className="flex min-h-full flex-col rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-sky-300/30 hover:bg-white/[0.055]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-sky-100">{certificate.institution}</p>
                      <h2 className="mt-2 text-xl font-semibold text-slate-50">
                        {certificate.title}
                      </h2>
                    </div>

                    {issueDate ? (
                      <span className="rounded-full border border-white/10 bg-slate-950/40 px-3 py-1 text-xs text-slate-400">
                        {issueDate}
                      </span>
                    ) : null}
                  </div>

                  {certificate.description ? (
                    <p className="mt-5 line-clamp-5 text-sm leading-7 text-slate-400">
                      {certificate.description}
                    </p>
                  ) : null}

                  <div className="mt-auto flex flex-wrap gap-3 pt-6">
                    {certificate.credentialUrl ? (
                      <a
                        href={certificate.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-sky-200 hover:text-sky-100"
                      >
                        Credential ↗
                      </a>
                    ) : null}

                    {fileUrl ? (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-slate-300 hover:text-slate-100"
                      >
                        File ↗
                      </a>
                    ) : null}

                    {!certificate.credentialUrl && !fileUrl ? (
                      <p className="text-sm text-slate-500">No public credential link yet.</p>
                    ) : null}
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
