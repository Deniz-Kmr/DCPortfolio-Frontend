import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Menu, X } from 'lucide-react';
import { Outlet } from 'react-router-dom';

const desktopNavItems = [
  { label: 'Hakkımda', href: '/#about' },
  { label: 'Projeler', href: '/projects' },
  { label: 'Tech Stack', href: '/#technologies' },
  { label: 'Deneyimler', href: '/#experience' },
  { label: 'Sertifikalar', href: '/#certificates' },
];

const mobileNavItems = [
  { label: 'Ana sayfa', href: '/#hero' },
  ...desktopNavItems,
  { label: 'İletişim', href: '/#contact' },
];

const menuContainerVariants = {
  hidden: {
    transition: {
      staggerChildren: 0.025,
      staggerDirection: -1,
    },
  },
  visible: {
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.045,
    },
  },
};

const menuItemVariants = {
  hidden: {
    opacity: 0,
    x: 18,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    }

    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    }

    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleEscape);
    window.addEventListener('resize', handleResize);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]);

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#EEF1F5] font-['Inter'] text-[#14171C]">
      <header className="sticky top-0 z-40 border-b border-[#DDE2EA]/80 bg-[#EEF1F5]/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-6 sm:py-4">
          <a
            href="/#hero"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D1D7E0] bg-white font-['Manrope'] text-sm font-extrabold tracking-tight text-[#14171C] shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:border-[#14171C]/30"
            aria-label="Ana sayfaya dön"
          >
            DÇ
          </a>

          <div className="hidden items-center gap-1 rounded-full border border-[#D1D7E0] bg-white/85 p-1 shadow-sm shadow-black/5 lg:flex">
            {desktopNavItems.map((item) => (
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
            className="hidden h-10 min-w-[88px] items-center justify-center rounded-xl border border-[#D1D7E0] bg-white px-4 font-['IBM_Plex_Mono'] text-xs font-semibold text-[#14171C] shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:border-[#14171C]/30 hover:bg-[#F7F8FA] lg:inline-flex"
          >
            İletişim
          </a>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D1D7E0] bg-white text-[#14171C] shadow-sm shadow-black/5 transition hover:border-[#14171C]/25 active:scale-95 lg:hidden"
            aria-label="Mobil menüyü aç"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <Menu size={20} strokeWidth={1.9} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.button
              type="button"
              className="absolute inset-0 bg-[#14171C]/45 backdrop-blur-[3px]"
              onClick={closeMobileMenu}
              aria-label="Mobil menüyü kapat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            />

            <motion.aside
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Mobil navigasyon"
              className="absolute right-0 top-0 flex h-[100dvh] w-[min(86vw,360px)] flex-col overflow-y-auto border-l border-[#D1D7E0] bg-[#EEF1F5] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] shadow-2xl shadow-black/25"
              initial={{ x: '100%', opacity: 0.85 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.85 }}
              transition={{
                type: 'spring',
                stiffness: 340,
                damping: 34,
                mass: 0.85,
              }}
            >
              <div className="flex items-center justify-between border-b border-[#D1D7E0] pb-5">
                <a
                  href="/#hero"
                  onClick={closeMobileMenu}
                  className="inline-flex min-w-0 items-center gap-3"
                  aria-label="Ana sayfaya dön"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D1D7E0] bg-white font-['Manrope'] text-sm font-extrabold tracking-tight shadow-sm shadow-black/5">
                    DÇ
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate font-['Manrope'] text-sm font-extrabold">
                      Deniz Çelik
                    </span>

                    <span className="mt-0.5 block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-[0.16em] text-[#64748B]">
                      Portfolio
                    </span>
                  </span>
                </a>

                <button
                  type="button"
                  onClick={closeMobileMenu}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D1D7E0] bg-white text-[#14171C] shadow-sm shadow-black/5 transition hover:border-[#14171C]/25 active:scale-95"
                  aria-label="Mobil menüyü kapat"
                >
                  <X size={20} strokeWidth={1.9} />
                </button>
              </div>

              <motion.nav
                className="mt-6 flex flex-1 flex-col gap-2"
                variants={menuContainerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {mobileNavItems.map((item, index) => {
                  const isContact = item.href === '/#contact';

                  return (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      variants={menuItemVariants}
                      whileTap={{ scale: 0.985 }}
                      className={`flex min-h-12 items-center justify-between rounded-xl border px-4 py-3 transition ${
                        isContact
                          ? 'mt-3 border-[#14171C] bg-[#14171C] text-white shadow-lg shadow-black/10 hover:bg-[#242830]'
                          : 'border-[#D1D7E0] bg-white text-[#14171C] hover:border-[#14171C]/25 hover:bg-[#F7F8FA]'
                      }`}
                    >
                      {isContact ? (
                        <span className="flex min-w-0 items-center gap-2.5 text-white">
                          <Mail
                            size={17}
                            strokeWidth={1.8}
                            className="shrink-0"
                          />

                          <span className="font-['Manrope'] text-sm font-bold text-white">
                            İletişim
                          </span>
                        </span>
                      ) : (
                        <span className="font-['Manrope'] text-sm font-bold">
                          {item.label}
                        </span>
                      )}

                      <span
                        className={`shrink-0 font-['IBM_Plex_Mono'] text-[10px] ${
                          isContact
                            ? 'text-white/55'
                            : 'text-[#94A3B8]'
                        }`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </motion.a>
                  );
                })}
              </motion.nav>

              <motion.div
                className="border-t border-[#D1D7E0] pt-5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.3 }}
              >
                <p className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-[0.14em] text-[#64748B]">
                  Backend · Mobile · AI Integration
                </p>
              </motion.div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-10 border-t border-[#D1D7E0] bg-[#F7F8FA]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-7 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-['IBM_Plex_Mono'] text-[11px] font-medium text-[#475569]">
              © {new Date().getFullYear()} Deniz Çelik. Tüm hakları saklıdır.
            </p>

            <p className="mt-1 font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.14em] text-[#94A3B8]">
              Backend · Mobile · AI Integration
            </p>
          </div>

          <nav
            className="flex flex-wrap items-center gap-x-4 gap-y-2"
            aria-label="Footer navigasyonu"
          >
            <a
              href="/#about"
              className="font-['IBM_Plex_Mono'] text-[10px] text-[#64748B] transition hover:text-[#14171C]"
            >
              Hakkımda
            </a>

            <a
              href="/projects"
              className="font-['IBM_Plex_Mono'] text-[10px] text-[#64748B] transition hover:text-[#14171C]"
            >
              Projeler
            </a>

            <a
              href="/#certificates"
              className="font-['IBM_Plex_Mono'] text-[10px] text-[#64748B] transition hover:text-[#14171C]"
            >
              Sertifikalar
            </a>

            <a
              href="/#contact"
              className="font-['IBM_Plex_Mono'] text-[10px] text-[#64748B] transition hover:text-[#14171C]"
            >
              İletişim
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
