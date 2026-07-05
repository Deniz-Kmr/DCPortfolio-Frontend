import { NavLink, Outlet } from 'react-router-dom';

import { routePaths } from '../../app/router/routePaths';

const navItems = [
  { label: 'Home', to: routePaths.public.home },
  { label: 'About', to: routePaths.public.about },
  { label: 'Projects', to: routePaths.public.projects },
  { label: 'Skills', to: routePaths.public.technologies },
  { label: 'CV', to: routePaths.public.cv },
  { label: 'Contact', to: routePaths.public.contact },
];

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-white/10 bg-slate-950/90">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <NavLink
            to={routePaths.public.home}
            className="text-sm font-semibold tracking-[0.25em] text-sky-300"
          >
            DCPORTFOLIO
          </NavLink>

          <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === routePaths.public.home}
                className={({ isActive }) =>
                  isActive ? 'text-white' : 'transition hover:text-white'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
