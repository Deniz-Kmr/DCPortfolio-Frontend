import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { routePaths } from '../../app/router/routePaths';
import { AdminEnvironmentBanner } from '../../components/admin/AdminEnvironmentBanner';
import {
  AdminButton,
  AdminField,
  AdminPanel,
  AdminStatusBadge,
  AdminWindow,
} from '../../components/admin/vintage';
import { appConfig } from '../../config';
import { useAdminLogin, useCurrentAdminUser } from '../../features/admin-auth';
import { clearAccessToken, getAccessToken } from '../../services/auth';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email zorunludur.')
    .email('Geçerli bir email giriniz.'),
  password: z.string().min(1, 'Şifre zorunludur.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function AdminLoginPage() {
  const navigate = useNavigate();
  const adminLogin = useAdminLogin();
  const currentAdminUser = useCurrentAdminUser();
  const hasToken = Boolean(getAccessToken());

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (hasToken && currentAdminUser.isSuccess && currentAdminUser.data.role === 'Admin') {
      navigate(routePaths.admin.dashboard, { replace: true });
    }

    if (hasToken && currentAdminUser.isError) {
      clearAccessToken();
    }
  }, [currentAdminUser.data?.role, currentAdminUser.isError, currentAdminUser.isSuccess, hasToken, navigate]);

  async function onSubmit(values: LoginFormValues) {
    try {
      await adminLogin.mutateAsync(values);
      navigate(routePaths.admin.dashboard, { replace: true });
    } catch {
      // Hata mesajı mutation state üzerinden ekranda gösteriliyor.
    }
  }

  return (
    <section className="min-h-screen bg-[#7F9DB9] bg-[linear-gradient(135deg,#7F9DB9_0%,#C8D7EA_45%,#EEF1F5_100%)] text-[#1F2937]">
      <AdminEnvironmentBanner />

      <div className="flex min-h-screen items-center justify-center px-5 py-12">
        <AdminWindow
          title="DCPortfolio Local Admin"
          subtitle="Windows control panel style login"
          className="w-full max-w-[520px]"
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <AdminStatusBadge tone="online">local ui</AdminStatusBadge>
              <AdminStatusBadge tone={appConfig.isProductionApiTarget ? 'warning' : 'neutral'}>
                api: {appConfig.apiTarget}
              </AdminStatusBadge>
            </div>
          }
        >
          <AdminPanel>
            <div className="mb-6 border border-[#9AA4B2] bg-[#E9EDF4] p-4 shadow-[inset_1px_1px_0_#ffffff]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#17406F]">
                Secure workstation
              </p>
              <h1 className="mt-2 text-2xl font-black text-[#102A43]">Admin Login</h1>
              <p className="mt-3 text-sm leading-6 text-[#334155]">
                Local admin panel için backend kimlik doğrulaması kullanılır. Token mevcut
                tokenStorage akışıyla saklanır ve ekranda gösterilmez.
              </p>
            </div>

            {hasToken && currentAdminUser.isLoading ? (
              <div className="mb-5 border border-[#17406F] bg-[#D7E9FF] px-3 py-2 text-sm font-semibold text-[#082F5F]">
                Mevcut oturum kontrol ediliyor...
              </div>
            ) : null}

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <AdminField label="Email" error={errors.email?.message}>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                  placeholder="admin@dcportfolio.local"
                  {...register('email')}
                />
              </AdminField>

              <AdminField label="Şifre" error={errors.password?.message}>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                  placeholder="••••••••"
                  {...register('password')}
                />
              </AdminField>

              {adminLogin.isError ? (
                <div className="border border-red-700 bg-red-100 px-3 py-2 text-sm font-semibold text-red-900">
                  {adminLogin.error.message}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 border-t border-[#B6C1D1] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">
                  JWT + Admin role required
                </p>

                <AdminButton type="submit" variant="primary" disabled={adminLogin.isPending}>
                  {adminLogin.isPending ? 'Giriş yapılıyor...' : 'Giriş yap'}
                </AdminButton>
              </div>
            </form>
          </AdminPanel>
        </AdminWindow>
      </div>
    </section>
  );
}
