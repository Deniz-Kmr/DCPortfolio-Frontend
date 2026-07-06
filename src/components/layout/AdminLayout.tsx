import { NavLink, Outlet } from 'react-router-dom';

import { routePaths } from '../../app/router/routePaths';
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
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <aside className="fixed bottom-0 left-0 top-0 hidden w-72 border-r border-white/10 bg-slate-900 p-6 lg:block">
        <NavLink
          to={routePaths.admin.dashboard}
          className="text-sm font-semibold tracking-[0.25em] text-sky-300"
        >
          ADMIN
        </NavLink>

        <nav className="mt-10 flex flex-col gap-2 text-sm">
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
      </aside>

      <main className="min-h-screen lg:pl-72">
        <AdminEnvironmentBanner />
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
