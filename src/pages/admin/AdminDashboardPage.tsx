import { Link } from 'react-router-dom';

import { routePaths } from '../../app/router/routePaths';
import {
  AdminModuleCard,
  AdminPanel,
  AdminStatusBadge,
  AdminToolbar,
  AdminWindow,
} from '../../components/admin/vintage';
import { appConfig } from '../../config';
import { useCurrentAdminUser } from '../../features/admin-auth';
import { useAdminDashboard } from '../../features/admin-dashboard';

const moduleCards = [
  {
    title: 'Projects Control',
    description: 'Public portfolio projelerinin CRUD ekranı sonraki promptta eklenecek.',
    to: routePaths.admin.projects,
  },
  {
    title: 'Technologies Registry',
    description: 'Teknoloji ikonları, görünürlük ve sıralama yönetimi sonraki CRUD akışında eklenecek.',
    to: routePaths.admin.technologies,
  },
  {
    title: 'CV/Profile Record',
    description: 'Profil, CV dosyası ve iletişim kayıtları için yönetim ekranı sonraki promptlarda eklenecek.',
    to: routePaths.admin.cv,
  },
  {
    title: 'Experience Timeline',
    description: 'Deneyim kayıtları ve yayın durumu yönetimi sonraki CRUD ekranında yapılacak.',
    to: routePaths.admin.experiences,
  },
  {
    title: 'Certificate Archive',
    description: 'Sertifika arşivi ve dosya bağlantıları yönetimi sonraki CRUD ekranında eklenecek.',
    to: routePaths.admin.certificates,
  },
];

function formatGeneratedAt(value: string | null | undefined) {
  if (!value) {
    return 'Henüz üretilmedi';
  }

  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function AdminDashboardPage() {
  const currentAdminUser = useCurrentAdminUser();
  const dashboardQuery = useAdminDashboard();
  const dashboard = dashboardQuery.data;

  return (
    <div className="space-y-6">
      <AdminWindow
        title="DCPortfolio Admin Dashboard"
        subtitle="Local control panel foundation"
        actions={
          <AdminToolbar>
            <AdminStatusBadge tone="online">admin ui enabled</AdminStatusBadge>
            <AdminStatusBadge tone={appConfig.isProductionApiTarget ? 'warning' : 'neutral'}>
              api target: {appConfig.apiTarget}
            </AdminStatusBadge>
            <AdminStatusBadge tone="neutral">
              env: {appConfig.appEnvironment}
            </AdminStatusBadge>
          </AdminToolbar>
        }
      >
        <AdminPanel>
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#17406F]">
                Control Center
              </p>

              <h1 className="mt-3 text-3xl font-black text-[#102A43]">
                Local Admin Foundation
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#334155]">
                Bu panel local kullanım için hazırlanmış admin foundation ekranıdır. Login,
                protected route, logout, dashboard endpoint bağlantısı ve modül girişleri hazırdır.
                CRUD ekranları sonraki promptlarda bu temel üzerine eklenecek.
              </p>
            </div>

            <div className="border border-[#9AA4B2] bg-[#E9EDF4] p-4 shadow-[inset_1px_1px_0_#ffffff]">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#17406F]">
                Session
              </p>

              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="font-bold text-[#64748B]">Kullanıcı</dt>
                  <dd className="mt-1 font-black text-[#102A43]">
                    {currentAdminUser.data?.fullName ?? 'Admin'}
                  </dd>
                </div>

                <div>
                  <dt className="font-bold text-[#64748B]">Email</dt>
                  <dd className="mt-1 break-words font-semibold text-[#334155]">
                    {currentAdminUser.data?.email ?? 'Oturum doğrulanıyor'}
                  </dd>
                </div>

                <div>
                  <dt className="font-bold text-[#64748B]">Role</dt>
                  <dd className="mt-1">
                    <AdminStatusBadge tone="online">
                      {currentAdminUser.data?.role ?? 'checking'}
                    </AdminStatusBadge>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </AdminPanel>
      </AdminWindow>

      <AdminWindow
        title="Dashboard Endpoint"
        subtitle="GET /api/admin/dashboard"
        actions={
          <AdminToolbar>
            <AdminStatusBadge tone={dashboardQuery.isSuccess ? 'online' : dashboardQuery.isError ? 'danger' : 'warning'}>
              {dashboardQuery.isSuccess ? 'online' : dashboardQuery.isError ? 'error' : 'loading'}
            </AdminStatusBadge>
            <AdminStatusBadge tone="neutral">
              generated: {formatGeneratedAt(dashboard?.generatedAt)}
            </AdminStatusBadge>
          </AdminToolbar>
        }
      >
        {dashboardQuery.isLoading ? (
          <AdminPanel>
            <p className="text-sm font-bold text-[#334155]">Dashboard verileri yükleniyor...</p>
          </AdminPanel>
        ) : dashboardQuery.isError ? (
          <AdminPanel>
            <div className="border border-red-700 bg-red-100 p-4 text-sm font-semibold text-red-900">
              {dashboardQuery.error.message}
            </div>
            <p className="mt-4 text-sm leading-7 text-[#334155]">
              Backend çalışmıyorsa veya token geçersizse canlı dashboard verisi gösterilemez.
              Fake metrik yazılmadı.
            </p>
          </AdminPanel>
        ) : dashboard ? (
          <div className="grid gap-4 lg:grid-cols-3">
            <AdminPanel>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#17406F]">
                Portfolio
              </p>
              <dl className="mt-4 grid gap-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-[#B6C1D1] pb-2">
                  <dt>Toplam Proje</dt>
                  <dd className="font-black">{dashboard.portfolioSummary.totalProjects}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#B6C1D1] pb-2">
                  <dt>Yayında Proje</dt>
                  <dd className="font-black">{dashboard.portfolioSummary.publishedProjects}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#B6C1D1] pb-2">
                  <dt>Teknoloji</dt>
                  <dd className="font-black">{dashboard.portfolioSummary.totalTechnologies}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Aktif Teknoloji</dt>
                  <dd className="font-black">{dashboard.portfolioSummary.activeTechnologies}</dd>
                </div>
              </dl>
            </AdminPanel>

            <AdminPanel>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#17406F]">
                Records
              </p>
              <dl className="mt-4 grid gap-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-[#B6C1D1] pb-2">
                  <dt>CV Profile</dt>
                  <dd className="font-black">{dashboard.portfolioSummary.totalCvProfiles}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#B6C1D1] pb-2">
                  <dt>Deneyim</dt>
                  <dd className="font-black">{dashboard.portfolioSummary.totalExperiences}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#B6C1D1] pb-2">
                  <dt>Yayında Deneyim</dt>
                  <dd className="font-black">{dashboard.portfolioSummary.publishedExperiences}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Yayında Sertifika</dt>
                  <dd className="font-black">{dashboard.portfolioSummary.publishedCertificates}</dd>
                </div>
              </dl>
            </AdminPanel>

            <AdminPanel>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#17406F]">
                Tracking
              </p>
              <dl className="mt-4 grid gap-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-[#B6C1D1] pb-2">
                  <dt>DevLog</dt>
                  <dd className="font-black">{dashboard.trackingSummary.totalDevLogs}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#B6C1D1] pb-2">
                  <dt>Lesson</dt>
                  <dd className="font-black">{dashboard.trackingSummary.totalLessons}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#B6C1D1] pb-2">
                  <dt>English Plan</dt>
                  <dd className="font-black">{dashboard.trackingSummary.totalEnglishPlans}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Roadmap</dt>
                  <dd className="font-black">{dashboard.trackingSummary.totalRoadmaps}</dd>
                </div>
              </dl>
            </AdminPanel>
          </div>
        ) : (
          <AdminPanel>
            <p className="text-sm font-bold text-[#334155]">
              Dashboard endpointinden veri dönmedi. Fake metrik gösterilmiyor.
            </p>
          </AdminPanel>
        )}
      </AdminWindow>

      <AdminWindow title="Module Switchboard" subtitle="CRUD screens will be added later">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {moduleCards.map((module) => (
            <AdminModuleCard
              key={module.to}
              title={module.title}
              description={module.description}
              to={module.to}
              status="next"
            />
          ))}
        </div>
      </AdminWindow>

      <AdminWindow title="Quick Navigation" subtitle="Admin placeholders">
        <AdminPanel>
          <div className="flex flex-wrap gap-2">
            {moduleCards.map((module) => (
              <Link
                key={module.to}
                to={module.to}
                className="border border-[#7C8794] bg-[#EEF1F5] px-3 py-2 text-sm font-bold text-[#1F2937] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#9AA4B2] transition hover:bg-white"
              >
                {module.title}
              </Link>
            ))}
          </div>
        </AdminPanel>
      </AdminWindow>
    </div>
  );
}
