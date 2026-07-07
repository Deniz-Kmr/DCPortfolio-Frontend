import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { routePaths } from '../../app/router/routePaths';
import { AdminEnvironmentBanner } from '../../components/admin/AdminEnvironmentBanner';
import { useAdminLogin, useCurrentAdminUser } from '../../features/admin-auth';
import { getAccessToken } from '../../services/auth';

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
    if (hasToken && currentAdminUser.isSuccess) {
      navigate(routePaths.admin.dashboard, { replace: true });
    }
  }, [currentAdminUser.isSuccess, hasToken, navigate]);

  async function onSubmit(values: LoginFormValues) {
    await adminLogin.mutateAsync(values);
    navigate(routePaths.admin.dashboard, { replace: true });
  }

  return (
    <section className="min-h-screen bg-slate-950 text-slate-50">
      <AdminEnvironmentBanner />

      <div className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl shadow-black/30">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
            Secure Admin
          </p>

          <h1 className="mt-4 text-3xl font-bold text-white">Admin Login</h1>

          <p className="mt-4 text-sm leading-6 text-slate-300">
            Local admin panel için backend kimlik doğrulaması kullanılır. Token güvenli şekilde
            mevcut tokenStorage akışıyla saklanır.
          </p>

          {hasToken && currentAdminUser.isLoading ? (
            <div className="mt-6 rounded-xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-sm text-sky-100">
              Mevcut oturum kontrol ediliyor...
            </div>
          ) : null}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-slate-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300"
                placeholder="admin@dcportfolio.local"
                {...register('email')}
              />
              {errors.email ? (
                <p className="mt-2 text-sm text-red-300">{errors.email.message}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-slate-200">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password ? (
                <p className="mt-2 text-sm text-red-300">{errors.password.message}</p>
              ) : null}
            </div>

            {adminLogin.isError ? (
              <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
                {adminLogin.error.message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={adminLogin.isPending}
              className="w-full rounded-xl border border-sky-300/30 bg-sky-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {adminLogin.isPending ? 'Giriş yapılıyor...' : 'Giriş yap'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
