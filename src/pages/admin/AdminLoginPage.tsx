import { AdminEnvironmentBanner } from '../../components/admin/AdminEnvironmentBanner';

export function AdminLoginPage() {
  return (
    <section className="min-h-screen bg-slate-950 text-slate-50">
      <AdminEnvironmentBanner />
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
            Secure Admin
          </p>
          <h1 className="mt-4 text-3xl font-bold text-white">Admin Login</h1>
          <p className="mt-4 text-slate-300">
            Auth flow will be implemented later with safe token handling.
          </p>
        </div>
      </div>
    </section>
  );
}
