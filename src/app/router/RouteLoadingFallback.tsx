export function RouteLoadingFallback() {
  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#EEF1F5] px-6">
      <div className="rounded-xl border border-[#D1D7E0] bg-white px-6 py-5 text-center shadow-sm shadow-black/5">
        <p className="font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">
          Loading
        </p>
        <p className="mt-3 font-['Inter'] text-sm text-[#14171C]">
          Sayfa yükleniyor...
        </p>
      </div>
    </section>
  );
}
