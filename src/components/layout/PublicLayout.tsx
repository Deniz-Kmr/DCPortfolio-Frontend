import { Outlet } from 'react-router-dom';

const navItems = [
  { label: 'Hakkımda', href: '/#about' },
  { label: 'Projeler', href: '/projects' },
  { label: 'Tech Stack', href: '/#technologies' },
  { label: 'Deneyimler', href: '/#experience' },
];

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#EEF1F5] font-['Inter'] text-[#14171C]">
      <header className="sticky top-0 z-40 border-b border-[#DDE2EA]/80 bg-[#EEF1F5]/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6">
          <a
            href="/#hero"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#D1D7E0] bg-white font-['Manrope'] text-sm font-extrabold tracking-tight text-[#14171C] shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:border-[#14171C]/30"
            aria-label="Ana sayfaya dön"
          >
            DÇ
          </a>

          <div className="hidden items-center gap-1 rounded-full border border-[#D1D7E0] bg-white/85 p-1 shadow-sm shadow-black/5 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 font-['IBM_Plex_Mono'] text-xs font-medium text-[#4B5563] transition hover:bg-[#EEF1F5] hover:text-[#14171C]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <a
            href="/#contact"
            className="inline-flex h-10 min-w-[88px] items-center justify-center rounded-xl border border-[#D1D7E0] bg-white px-4 font-['IBM_Plex_Mono'] text-xs font-semibold text-[#14171C] shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:border-[#14171C]/30 hover:bg-[#F7F8FA]"
          >
            İletişim
          </a>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
