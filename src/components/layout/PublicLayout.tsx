import { Outlet } from 'react-router-dom';

const navItems = [
  { label: 'Hakkımda', href: '/#about' },
  { label: 'Projeler', href: '/#projects' },
  { label: 'Teknolojiler', href: '/#technologies' },
  { label: 'Deneyimler', href: '/#experience' },
  { label: 'Sertifikalar', href: '/#certificates' },
  { label: 'İletişim', href: '/#contact' },
];

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/85 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
          <a
            href="/#hero"
            className="text-sm font-semibold tracking-[0.22em] text-zinc-100 transition hover:text-white"
          >
            DENİZ ÇELİK
          </a>

          <div className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-zinc-100">
                {item.label}
              </a>
            ))}
          </div>

          <a
            href="/#contact"
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.04]"
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
