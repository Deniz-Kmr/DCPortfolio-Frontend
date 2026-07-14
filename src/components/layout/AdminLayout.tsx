import { useQueryClient } from '@tanstack/react-query';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { routePaths } from '../../app/router/routePaths';
import { AdminStatusBadge } from '../../components/admin/vintage';
import { appConfig } from '../../config';
import { queryKeys } from '../../services/api/queryKeys';
import { clearAccessToken } from '../../services/auth';
import { AdminEnvironmentBanner } from '../admin/AdminEnvironmentBanner';

const adminItems = [
  { label: 'Dashboard', to: routePaths.admin.dashboard },
  { label: 'Monitoring', to: routePaths.admin.monitoring },
  { label: 'Projects', to: routePaths.admin.projects },
  { label: 'Home Projects', to: routePaths.admin.homeProjects },
  { label: 'Technologies', to: routePaths.admin.technologies },
  { label: 'CV/Profile', to: routePaths.admin.cv },
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
    <div className="min-h-screen bg-[#B9C7D8] text-[#1F2937]">
      <aside className="fixed bottom-0 left-0 top-0 hidden w-72 border-r border-[#3B4A5F] bg-[#DCE5F2] shadow-[inset_-1px_0_0_#ffffff] lg:flex lg:flex-col">
        <div className="border-b border-[#1E3A5F] bg-gradient-to-r from-[#17406F] to-[#2C6FA3] px-5 py-4 text-white">
          <NavLink to={routePaths.admin.dashboard} className="block text-sm font-black tracking-[0.2em]">
            DCPORTFOLIO
          </NavLink>
          <p className="mt-1 text-[11px] font-semibold text-blue-100">Local Admin Console</p>
        </div>

        <div className="border-b border-[#9AA4B2] bg-[#EEF1F5] px-4 py-3">
          <div className="flex flex-wrap gap-2">
            <AdminStatusBadge tone="online">ui enabled</AdminStatusBadge>
            <AdminStatusBadge tone={appConfig.isProductionApiTarget ? 'warning' : 'neutral'}>
              api {appConfig.apiTarget}
            </AdminStatusBadge>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3 text-sm">
          {adminItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'border px-3 py-2 font-bold transition shadow-[inset_1px_1px_0_#ffffff]',
                  isActive
                    ? 'border-[#17406F] bg-[#D7E9FF] text-[#082F5F]'
                    : 'border-[#9AA4B2] bg-[#EEF1F5] text-[#334155] hover:bg-white',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[#9AA4B2] bg-[#EEF1F5] p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full border border-[#8B1E1E] bg-[#F8D7D7] px-3 py-2 text-left text-sm font-black text-[#7F1D1D] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#C66] transition hover:bg-[#F5C8C8]"
          >
            Çıkış yap
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-72">
        <AdminEnvironmentBanner />

        <div className="border-b border-[#3B4A5F] bg-[#DCE5F2] lg:hidden">
          <div className="bg-gradient-to-r from-[#17406F] to-[#2C6FA3] px-4 py-3 text-white">
            <div className="flex items-center justify-between gap-4">
              <NavLink to={routePaths.admin.dashboard} className="text-sm font-black tracking-[0.18em]">
                ADMIN
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                className="border border-[#8B1E1E] bg-[#F8D7D7] px-3 py-1.5 text-xs font-black text-[#7F1D1D]"
              >
                Çıkış
              </button>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto border-t border-[#9AA4B2] bg-[#EEF1F5] p-3 text-xs">
            {adminItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'shrink-0 border px-3 py-2 font-bold shadow-[inset_1px_1px_0_#ffffff]',
                    isActive
                      ? 'border-[#17406F] bg-[#D7E9FF] text-[#082F5F]'
                      : 'border-[#9AA4B2] bg-[#EEF1F5] text-[#334155]',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
