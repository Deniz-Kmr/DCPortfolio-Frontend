import { useQueryClient } from '@tanstack/react-query';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { routePaths } from '../../app/router/routePaths';
import { queryKeys } from '../../services/api/queryKeys';
import { clearAccessToken } from '../../services/auth';
import { AdminEnvironmentBanner } from '../admin/AdminEnvironmentBanner';

const adminItems = [
  { label: 'Dashboard', to: routePaths.admin.dashboard },
  { label: 'Projects', to: routePaths.admin.projects },
  { label: 'Technologies', to: routePaths.admin.technologies },
  { label: 'CV', to: routePaths.admin.cv },
  { label: 'Experiences', to: routePaths.admin.experiences },
  { label: 'Certificates', to: routePaths.admin.certificates },
  { label: 'DevLogs', to: routePaths.admin.devlogs },
  { label: 'Todos', to: routePaths.admin.todos },
  { label: 'Lessons', to: routePaths.admin.lessons },
  { label: 'English Plans', to: routePaths.admin.englishPlans },
  { label: 'Roadmaps', to: routePaths.admin.learningRoadmaps },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function handleLogout() {
    clearAccessToken();
    queryClient.removeQueries({ queryKey: queryKeys.auth.me });
    navigate(routePaths.admin.login, { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <aside className="fixed bottom-0 left-0 top-0 hidden w-72 border-r border-white/10 bg-slate-900 p-6 lg:flex lg:flex-col">
        <NavLink
          to={routePaths.admin.dashboard}
          className="text-sm font-semibold tracking-[0.25em] text-sky-300"
        >
          ADMIN
        </NavLink>

        <nav className="mt-10 flex flex-1 flex-col gap-2 text-sm">
          {adminItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'rounded-xl px-4 py-3 transition',
                  isActive
                    ? 'bg-sky-400/10 text-sky-100'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-left text-sm font-semibold text-red-100 transition hover:bg-red-400/15"
        >
          Çıkış yap
        </button>
      </aside>

      <main className="min-h-screen lg:pl-72">
        <AdminEnvironmentBanner />

        <div className="border-b border-white/10 bg-slate-900/90 px-6 py-4 lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <NavLink
              to={routePaths.admin.dashboard}
              className="text-sm font-semibold tracking-[0.25em] text-sky-300"
            >
              ADMIN
            </NavLink>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-100"
            >
              Çıkış
            </button>
          </div>

          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 text-xs">
            {adminItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'shrink-0 rounded-lg px-3 py-2 transition',
                    isActive
                      ? 'bg-sky-400/10 text-sky-100'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
