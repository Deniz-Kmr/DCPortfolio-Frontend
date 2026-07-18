export function AdminDisabledPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#EEF1F5] px-5 py-10 font-['Inter'] text-[#14171C] sm:px-6">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-[#2563EB]/10 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-96 w-96 rounded-full bg-[#16A34A]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <section className="w-full overflow-hidden rounded-[2rem] border border-[#D1D7E0] bg-white/90 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="flex flex-col gap-4 border-b border-[#E3E6EA] bg-[#F7F8FA]/90 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="font-['IBM_Plex_Mono'] inline-flex rounded-md bg-[#EF4444]/10 px-2.5 py-1 text-[11px] font-bold text-[#DC2626]">
                403
              </span>

              <span className="font-['IBM_Plex_Mono'] truncate text-sm font-medium text-[#14171C]">
                GET /admin
              </span>

              <span className="hidden h-px w-20 bg-[#CBD5E1] sm:block" />

              <span className="font-['IBM_Plex_Mono'] text-[11px] font-semibold text-[#64748B]">
                FORBIDDEN
              </span>
            </div>

            <span className="font-['IBM_Plex_Mono'] w-fit rounded-full border border-[#16A34A]/20 bg-[#16A34A]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#16A34A]">
              Public portfolio online
            </span>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="p-7 sm:p-10 lg:p-12">
              <span className="font-['IBM_Plex_Mono'] inline-flex rounded-full border border-[#EF4444]/20 bg-[#EF4444]/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#DC2626]">
                Admin UI Disabled
              </span>

              <h1 className="font-['Manrope'] mt-7 max-w-xl text-4xl font-extrabold tracking-tight text-[#14171C] sm:text-5xl">
                Admin alanı canlı ortamda kapalı.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-[#4B5563]">
                Bu ekran bir hata değil; production-facing portfolio build içinde admin arayüzü bilinçli olarak dışarıya kapatıldı.
              </p>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#64748B]">
                Public sayfalar aktif kalır. İçerik yönetimi yalnızca local/development ortamında, yetkili admin hesabı ile yapılır.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="/"
                  aria-label="Ana sayfaya dön"
                  className="inline-flex h-11 min-w-[180px] items-center justify-center gap-2 rounded-xl border border-[#14171C] bg-[#14171C] px-5 font-['IBM_Plex_Mono'] text-xs font-bold shadow-sm shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#0F1115]"
                >
                  <span aria-hidden="true" className="text-white">←</span>
                  <span className="text-white">Ana sayfaya dön</span>
                </a>

                <a
                  href="/projects"
                  aria-label="Projeleri incele"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#D1D7E0] bg-white px-5 font-['IBM_Plex_Mono'] text-xs font-bold text-[#14171C] shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:border-[#14171C]/30 hover:bg-[#F7F8FA]"
                >
                  <span>Projeleri incele</span>
                  <span aria-hidden="true">→</span>
                </a>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#E3E6EA] bg-[#F7F8FA] p-4">
                  <p className="font-['IBM_Plex_Mono'] text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                    Mode
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#14171C]">Production</p>
                </div>

                <div className="rounded-2xl border border-[#E3E6EA] bg-[#F7F8FA] p-4">
                  <p className="font-['IBM_Plex_Mono'] text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                    Admin
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#DC2626]">Disabled</p>
                </div>

                <div className="rounded-2xl border border-[#E3E6EA] bg-[#F7F8FA] p-4">
                  <p className="font-['IBM_Plex_Mono'] text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                    Public
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#16A34A]">Available</p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E3E6EA] bg-[#0F1115] p-7 text-white sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#EF4444]" />
                    <span className="h-3 w-3 rounded-full bg-[#F59E0B]" />
                    <span className="h-3 w-3 rounded-full bg-[#16A34A]" />
                  </div>

                  <span className="font-['IBM_Plex_Mono'] rounded-md border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">
                    security check
                  </span>
                </div>

                <div className="space-y-4 font-['IBM_Plex_Mono'] text-xs leading-7 sm:text-sm">
                  <p>
                    <span className="text-[#64748B]">const</span>{' '}
                    <span className="text-[#93C5FD]">adminAccess</span>{' '}
                    <span className="text-[#CBD5E1]">=</span>{' '}
                    <span className="text-[#FCA5A5]">false</span>
                  </p>

                  <p>
                    <span className="text-[#64748B]">const</span>{' '}
                    <span className="text-[#93C5FD]">publicPortfolio</span>{' '}
                    <span className="text-[#CBD5E1]">=</span>{' '}
                    <span className="text-[#86EFAC]">"online"</span>
                  </p>

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-[#94A3B8]">
                      response
                    </p>

                    <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p>
                        <span className="text-[#CBD5E1]">{'{'}</span>
                      </p>
                      <p className="pl-4">
                        <span className="text-[#93C5FD]">status</span>
                        <span className="text-[#CBD5E1]">: </span>
                        <span className="text-[#FCA5A5]">403</span>
                        <span className="text-[#CBD5E1]">,</span>
                      </p>
                      <p className="pl-4">
                        <span className="text-[#93C5FD]">message</span>
                        <span className="text-[#CBD5E1]">: </span>
                        <span className="text-[#86EFAC]">"Admin UI is disabled in production."</span>
                      </p>
                      <p>
                        <span className="text-[#CBD5E1]">{'}'}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-3xl border border-[#16A34A]/20 bg-[#16A34A]/10 p-5">
                <p className="font-['IBM_Plex_Mono'] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#86EFAC]">
                  Protected by configuration
                </p>
                <p className="mt-3 text-sm leading-7 text-[#D1FAE5]">
                  Public build içinde admin route’ları görünür olsa bile arayüz kapalı sayfasına yönlendirilir.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
