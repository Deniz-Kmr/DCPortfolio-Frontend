import { Link } from 'react-router-dom';

const FONT_DISPLAY = "font-['Manrope']";
const FONT_MONO = "font-['IBM_Plex_Mono']";

export function NotFoundPage() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#EEF1F5] px-5 py-16 sm:px-6 lg:py-24">
      <section className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-xl border border-[#D1D7E0] bg-white shadow-sm shadow-black/5">
          <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="border-b border-[#D1D7E0] bg-[#F7F8FA] p-7 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
              <div className="flex items-center gap-2.5">
                <span className={`${FONT_MONO} rounded bg-[#EF4444]/10 px-2 py-1 text-[11px] font-semibold text-[#B91C1C]`}>
                  GET
                </span>
                <span className={`${FONT_MONO} text-sm text-[#14171C]`}>/not-found</span>
                <span className="h-px flex-1 bg-[#94A3B8]/80" />
                <span className={`${FONT_MONO} text-[11px] font-medium text-[#64748B]`}>404</span>
              </div>

              <p className={`${FONT_MONO} mt-10 text-sm font-semibold uppercase tracking-[0.28em] text-[#EF4444]`}>
                404
              </p>

              <h1 className={`${FONT_DISPLAY} mt-4 text-4xl font-extrabold tracking-tight text-[#14171C] sm:text-5xl`}>
                Sayfa bulunamadı.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-8 text-[#4B5563]">
                Aradığın sayfa taşınmış, kaldırılmış ya da bu ortamda aktif olmayabilir.
              </p>
            </div>

            <div className="flex flex-col justify-center p-7 sm:p-8 lg:p-10">
              <div className="rounded-xl border border-[#D1D7E0] bg-[#F7F8FA] p-6 sm:p-7">
                <p className={`${FONT_MONO} text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748B]`}>
                  response body
                </p>

                <div className={`${FONT_MONO} mt-5 space-y-2 text-sm leading-7 text-[#334155]`}>
                  <p>{'{'}</p>
                  <p className="pl-4">
                    <span className="text-[#64748B]">"success"</span>: <span className="text-[#B91C1C]">false</span>,
                  </p>
                  <p className="pl-4">
                    <span className="text-[#64748B]">"status"</span>: <span className="text-[#14171C]">404</span>,
                  </p>
                  <p className="pl-4">
                    <span className="text-[#64748B]">"message"</span>: <span className="text-[#14171C]">"Page not found"</span>
                  </p>
                  <p>{'}'}</p>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/"
                    className={`${FONT_MONO} inline-flex items-center justify-center rounded-lg border border-[#D1D7E0] bg-white px-5 py-3 text-sm font-semibold text-[#14171C] shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:border-[#14171C]/25`}
                  >
                    Ana sayfaya dön
                  </Link>

                  <Link
                    to="/projects"
                    className={`${FONT_MONO} inline-flex items-center justify-center rounded-lg border border-[#D1D7E0] bg-white px-5 py-3 text-sm font-semibold text-[#14171C] shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:border-[#14171C]/25`}
                  >
                    Projeleri incele
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
