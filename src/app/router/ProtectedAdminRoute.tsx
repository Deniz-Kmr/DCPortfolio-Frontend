import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { appConfig } from '../../config';
import { useCurrentAdminUser } from '../../features/admin-auth';
import { clearAccessToken, getAccessToken } from '../../services/auth';
import { AdminDisabledPage } from '../../pages/common/AdminDisabledPage';
import { routePaths } from './routePaths';

type ProtectedAdminRouteProps = {
  children: ReactNode;
};

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const location = useLocation();
  const token = getAccessToken();
  const currentAdminUser = useCurrentAdminUser();

  if (!appConfig.enableAdminUi) {
    return <AdminDisabledPage />;
  }

  if (!token) {
    return (
      <Navigate
        to={routePaths.admin.login}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (currentAdminUser.isLoading || currentAdminUser.isFetching) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-50">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
            Admin Session
          </p>
          <p className="mt-4 text-slate-300">Oturum doğrulanıyor...</p>
        </div>
      </section>
    );
  }

  if (currentAdminUser.isError || !currentAdminUser.data) {
    clearAccessToken();

    return (
      <Navigate
        to={routePaths.admin.login}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (currentAdminUser.data.role !== 'Admin') {
    clearAccessToken();

    return (
      <Navigate
        to={routePaths.admin.login}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}
