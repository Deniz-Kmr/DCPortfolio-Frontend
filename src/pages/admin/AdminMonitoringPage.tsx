import { useState, type ReactNode } from 'react';

import {
  AdminPanel,
  AdminStatusBadge,
  AdminToolbar,
  AdminWindow,
} from '../../components/admin/vintage';
import { appConfig } from '../../config';
import {
  useAdminMonitoringHealth,
  useAdminMonitoringHistory,
  useAdminMonitoringSummary,
  useAdminMonitoringTraffic,
} from '../../features/admin-monitoring';
import type { AdminMonitoringPathMetric } from '../../types/admin';

type StatusTone = 'online' | 'warning' | 'danger' | 'neutral';

type MetricCardProps = {
  label: string;
  value: ReactNode;
  hint?: string;
};

function getStatusTone(status: string | null | undefined): StatusTone {
  const normalized = status?.trim().toLowerCase() ?? '';

  if (
    normalized.includes('normal') ||
    normalized.includes('healthy') ||
    normalized.includes('online') ||
    normalized === 'ok'
  ) {
    return 'online';
  }

  if (
    normalized.includes('warning') ||
    normalized.includes('review') ||
    normalized.includes('monitoring') ||
    normalized.includes('degraded')
  ) {
    return 'warning';
  }

  if (
    normalized.includes('critical') ||
    normalized.includes('error') ||
    normalized.includes('unhealthy') ||
    normalized.includes('down')
  ) {
    return 'danger';
  }

  return 'neutral';
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('tr-TR').format(value);
}

function formatDecimal(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat('tr-TR', {
    maximumFractionDigits,
  }).format(value);
}

function formatPercent(value: number) {
  return `${formatDecimal(value, 1)}%`;
}

function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return 'Veri yok';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return 'Tarih yok';
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'medium',
  }).format(date);
}

function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <div className="border border-[#9AA4B2] bg-[#E9EDF4] p-4 shadow-[inset_1px_1px_0_#ffffff]">
      <p className="text-[11px] font-black uppercase tracking-[0.15em] text-[#17406F]">
        {label}
      </p>

      <p className="mt-2 break-words text-2xl font-black text-[#102A43]">
        {value}
      </p>

      {hint ? (
        <p className="mt-2 text-xs font-semibold leading-5 text-[#64748B]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function ErrorPanel({ message }: { message: string }) {
  return (
    <AdminPanel>
      <div className="border border-red-700 bg-red-100 p-4 text-sm font-semibold text-red-900">
        {message}
      </div>
    </AdminPanel>
  );
}

function LoadingPanel({ message }: { message: string }) {
  return (
    <AdminPanel>
      <p className="text-sm font-bold text-[#334155]">{message}</p>
    </AdminPanel>
  );
}

function UnavailablePanel({ message }: { message: string }) {
  return (
    <AdminPanel>
      <div className="border border-amber-700 bg-amber-100 p-4 text-sm font-semibold text-amber-950">
        {message}
      </div>
    </AdminPanel>
  );
}

function PathMetrics({
  title,
  items,
}: {
  title: string;
  items: AdminMonitoringPathMetric[];
}) {
  return (
    <AdminPanel>
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#17406F]">
        {title}
      </p>

      {items.length === 0 ? (
        <p className="mt-4 text-sm font-semibold text-[#64748B]">
          Gösterilecek kayıt yok.
        </p>
      ) : (
        <div className="mt-4 space-y-2">
          {items.map((item) => (
            <div
              key={`${title}-${item.path}`}
              className="flex items-start justify-between gap-4 border-b border-[#B6C1D1] pb-2 text-sm last:border-b-0 last:pb-0"
            >
              <span className="min-w-0 break-all font-semibold text-[#334155]">
                {item.path}
              </span>

              <span className="shrink-0 font-black text-[#102A43]">
                {formatNumber(item.count)}
              </span>
            </div>
          ))}
        </div>
      )}
    </AdminPanel>
  );
}

function PortList({ ports }: { ports: number[] }) {
  if (ports.length === 0) {
    return <span className="font-semibold text-[#64748B]">Yok</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ports.map((port) => (
        <span
          key={port}
          className="border border-[#7C8794] bg-[#EEF1F5] px-2 py-1 text-xs font-black text-[#334155]"
        >
          {port}
        </span>
      ))}
    </div>
  );
}

export function AdminMonitoringPage() {
  const [historyDays, setHistoryDays] = useState(7);

  const summaryQuery = useAdminMonitoringSummary();
  const trafficQuery = useAdminMonitoringTraffic();
  const healthQuery = useAdminMonitoringHealth();
  const historyQuery = useAdminMonitoringHistory(historyDays);

  const summary = summaryQuery.data;
  const traffic = trafficQuery.data;
  const health = healthQuery.data;
  const history = historyQuery.data;

  const isRefreshing =
    summaryQuery.isFetching ||
    trafficQuery.isFetching ||
    healthQuery.isFetching ||
    historyQuery.isFetching;

  async function handleRefresh() {
    await Promise.all([
      summaryQuery.refetch(),
      trafficQuery.refetch(),
      healthQuery.refetch(),
      historyQuery.refetch(),
    ]);
  }

  return (
    <div className="space-y-6">
      <AdminWindow
        title="Production Monitoring"
        subtitle="Private local dashboard powered by production reports"
        actions={
          <AdminToolbar>
            <AdminStatusBadge tone="online">admin only</AdminStatusBadge>

            <AdminStatusBadge
              tone={appConfig.isProductionApiTarget ? 'warning' : 'neutral'}
            >
              api {appConfig.apiTarget}
            </AdminStatusBadge>

            <button
              type="button"
              disabled={isRefreshing}
              onClick={() => void handleRefresh()}
              className="border border-[#17406F] bg-[#D7E9FF] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#082F5F] shadow-[inset_1px_1px_0_#ffffff] transition hover:bg-white disabled:cursor-wait disabled:opacity-60"
            >
              {isRefreshing ? 'Raporlar yükleniyor' : 'Raporları yeniden yükle'}
            </button>
          </AdminToolbar>
        }
      >
        <AdminPanel>
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#17406F]">
                Operations Console
              </p>

              <h1 className="mt-3 text-3xl font-black text-[#102A43]">
                Production Health & Traffic
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#334155]">
                Bu ekran yalnız local admin arayüzünde görünür. Veriler Admin JWT
                ile production API üzerinden alınır. Ham log, IP adresi, sunucu
                yolu, kontrol URL&apos;si veya secret gösterilmez.
              </p>
            </div>

            <div className="border border-[#9AA4B2] bg-[#E9EDF4] p-4 shadow-[inset_1px_1px_0_#ffffff]">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#17406F]">
                Last Update
              </p>

              <p className="mt-3 text-sm font-black text-[#102A43]">
                {formatDateTime(summary?.generatedAt)}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <AdminStatusBadge tone={getStatusTone(summary?.overallStatus)}>
                  {summary?.overallStatus || 'loading'}
                </AdminStatusBadge>

                <AdminStatusBadge tone="neutral">
                  {summary?.date ? formatDate(summary.date) : 'report date'}
                </AdminStatusBadge>
              </div>
            </div>
          </div>
        </AdminPanel>
      </AdminWindow>

      <AdminWindow
        title="Production Summary"
        subtitle="GET /api/admin/monitoring/summary"
        actions={
          <AdminToolbar>
            <AdminStatusBadge tone={getStatusTone(summary?.trafficStatus)}>
              traffic {summary?.trafficStatus || 'loading'}
            </AdminStatusBadge>

            <AdminStatusBadge tone={getStatusTone(summary?.healthStatus)}>
              health {summary?.healthStatus || 'loading'}
            </AdminStatusBadge>

            <AdminStatusBadge
              tone={summary?.publicApiRateLimitEnabled ? 'warning' : 'neutral'}
            >
              rate limit {summary?.publicApiRateLimitEnabled ? 'on' : 'off'}
            </AdminStatusBadge>
          </AdminToolbar>
        }
      >
        {summaryQuery.isLoading ? (
          <LoadingPanel message="Production monitoring özeti yükleniyor..." />
        ) : summaryQuery.isError ? (
          <ErrorPanel message={summaryQuery.error.message} />
        ) : !summary?.available ? (
          <UnavailablePanel
            message={summary?.message ?? 'Monitoring özeti kullanılamıyor.'}
          />
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Toplam İstek"
                value={formatNumber(summary.traffic.totalRequests)}
              />

              <MetricCard
                label="Yaklaşık Ziyaretçi"
                value={formatNumber(summary.traffic.approximateVisitors)}
              />

              <MetricCard
                label="API İsteği"
                value={formatNumber(summary.traffic.apiRequests)}
              />

              <MetricCard
                label="5xx"
                value={formatNumber(summary.traffic.serverError5xx)}
                hint="Sunucu hataları"
              />

              <MetricCard
                label="Bellek"
                value={formatPercent(summary.health.memoryUsedPercent)}
              />

              <MetricCard
                label="Disk"
                value={formatPercent(summary.health.diskUsedPercent)}
              />

              <MetricCard
                label="Container"
                value={`${summary.health.runningContainers}/${summary.health.expectedContainers}`}
                hint={`Restart: ${summary.health.containerRestartTotal}`}
              />

              <MetricCard
                label="TLS"
                value={`${summary.health.tlsDaysRemaining} gün`}
                hint="Sertifika kalan süresi"
              />
            </div>

            {summary.overallReasons.length > 0 ? (
              <AdminPanel>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#17406F]">
                  Status Reasons
                </p>

                <ul className="mt-4 space-y-2 text-sm font-semibold text-[#334155]">
                  {summary.overallReasons.map((reason) => (
                    <li
                      key={reason}
                      className="border-l-4 border-[#2C6FA3] bg-[#EEF1F5] px-3 py-2"
                    >
                      {reason}
                    </li>
                  ))}
                </ul>
              </AdminPanel>
            ) : null}

            <div className="grid gap-4 xl:grid-cols-2">
              <PathMetrics
                title="Top Frontend Pages"
                items={summary.topFrontendPages}
              />

              <PathMetrics
                title="Top API Endpoints"
                items={summary.topApiEndpoints}
              />
            </div>
          </div>
        )}
      </AdminWindow>

      <AdminWindow
        title="Traffic Monitoring"
        subtitle="GET /api/admin/monitoring/traffic"
        actions={
          <AdminToolbar>
            <AdminStatusBadge tone={getStatusTone(traffic?.monitoringStatus)}>
              {traffic?.monitoringStatus || 'loading'}
            </AdminStatusBadge>

            <AdminStatusBadge
              tone={traffic?.hardTrafficLimitEnabled ? 'warning' : 'neutral'}
            >
              hard limit {traffic?.hardTrafficLimitEnabled ? 'on' : 'off'}
            </AdminStatusBadge>
          </AdminToolbar>
        }
      >
        {trafficQuery.isLoading ? (
          <LoadingPanel message="Production trafik raporu yükleniyor..." />
        ) : trafficQuery.isError ? (
          <ErrorPanel message={trafficQuery.error.message} />
        ) : !traffic?.available ? (
          <UnavailablePanel
            message={traffic?.message ?? 'Trafik raporu kullanılamıyor.'}
          />
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Page View"
                value={formatNumber(traffic.traffic.pageViews)}
              />

              <MetricCard
                label="Human-like View"
                value={formatNumber(traffic.traffic.humanLikePageViews)}
              />

              <MetricCard
                label="Bot-like Request"
                value={formatNumber(traffic.traffic.botLikeRequests)}
              />

              <MetricCard
                label="Suspicious Request"
                value={formatNumber(traffic.traffic.suspiciousRequests)}
              />

              <MetricCard
                label="2xx"
                value={formatNumber(traffic.statuses.success2xx)}
              />

              <MetricCard
                label="4xx"
                value={formatNumber(traffic.statuses.clientError4xx)}
              />

              <MetricCard
                label="429"
                value={formatNumber(traffic.statuses.rateLimited429)}
              />

              <MetricCard
                label="5xx"
                value={formatNumber(traffic.statuses.serverError5xx)}
              />

              <MetricCard
                label="Ortalama Süre"
                value={`${formatDecimal(
                  traffic.performance.averageRequestTimeSeconds,
                  3,
                )} sn`}
              />

              <MetricCard
                label="Maksimum Süre"
                value={`${formatDecimal(
                  traffic.performance.maximumRequestTimeSeconds,
                  3,
                )} sn`}
              />

              <MetricCard
                label="Response"
                value={`${formatDecimal(
                  traffic.traffic.responseMegabytes,
                  2,
                )} MB`}
              />

              <MetricCard
                label="Statik İstek"
                value={formatNumber(traffic.traffic.staticRequests)}
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <PathMetrics
                title="Traffic Top Pages"
                items={traffic.topFrontendPages}
              />

              <PathMetrics
                title="Traffic Top API"
                items={traffic.topApiEndpoints}
              />
            </div>
          </div>
        )}
      </AdminWindow>

      <AdminWindow
        title="Infrastructure Health"
        subtitle="GET /api/admin/monitoring/health"
        actions={
          <AdminToolbar>
            <AdminStatusBadge tone={getStatusTone(health?.healthStatus)}>
              {health?.healthStatus || 'loading'}
            </AdminStatusBadge>

            <AdminStatusBadge
              tone={health?.docker.serviceActive ? 'online' : 'danger'}
            >
              docker {health?.docker.serviceActive ? 'active' : 'inactive'}
            </AdminStatusBadge>

            <AdminStatusBadge tone={health?.tls.ok ? 'online' : 'danger'}>
              tls {health?.tls.ok ? 'ok' : 'error'}
            </AdminStatusBadge>
          </AdminToolbar>
        }
      >
        {healthQuery.isLoading ? (
          <LoadingPanel message="Production sağlık raporu yükleniyor..." />
        ) : healthQuery.isError ? (
          <ErrorPanel message={healthQuery.error.message} />
        ) : !health?.available ? (
          <UnavailablePanel
            message={health?.message ?? 'Sağlık raporu kullanılamıyor.'}
          />
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="CPU"
                value={`${formatNumber(health.system.cpuCount)} core`}
                hint={`Load: ${formatDecimal(
                  health.system.loadAverageOneMinute,
                  2,
                )}`}
              />

              <MetricCard
                label="Uptime"
                value={`${formatDecimal(health.system.uptimeHours, 1)} saat`}
              />

              <MetricCard
                label="Bellek"
                value={formatPercent(health.system.memoryUsedPercent)}
              />

              <MetricCard
                label="Swap"
                value={formatPercent(health.system.swapUsedPercent)}
              />

              <MetricCard
                label="Disk"
                value={formatPercent(health.system.diskUsedPercent)}
              />

              <MetricCard
                label="TLS"
                value={`${health.tls.daysRemaining} gün`}
                hint={formatDateTime(health.tls.expiresAt)}
              />

              <MetricCard
                label="Backup"
                value={formatNumber(health.operations.manualBackupCount)}
                hint={
                  health.operations.latestManualBackup?.sizeHuman ??
                  'Backup bilgisi yok'
                }
              />

              <MetricCard
                label="HTTP Checks"
                value={`${health.httpChecks.filter((check) => check.ok).length}/${health.httpChecks.length}`}
              />
            </div>

            <AdminPanel>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#17406F]">
                Network Ports
              </p>

              <div className="mt-4 grid gap-4 lg:grid-cols-4">
                <div>
                  <p className="mb-2 text-xs font-bold text-[#64748B]">
                    Public
                  </p>
                  <PortList ports={health.network.publicListeningPorts} />
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold text-[#64748B]">
                    Expected
                  </p>
                  <PortList ports={health.network.expectedPublicPorts} />
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold text-[#64748B]">
                    Forbidden
                  </p>
                  <PortList
                    ports={health.network.forbiddenPublicPortsDetected}
                  />
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold text-[#64748B]">
                    Unexpected
                  </p>
                  <PortList ports={health.network.unexpectedPublicPorts} />
                </div>
              </div>
            </AdminPanel>

            <AdminPanel>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#17406F]">
                Containers
              </p>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-[#D7E9FF] text-[#082F5F]">
                      <th className="border border-[#9AA4B2] px-3 py-2">
                        Container
                      </th>
                      <th className="border border-[#9AA4B2] px-3 py-2">
                        Status
                      </th>
                      <th className="border border-[#9AA4B2] px-3 py-2">
                        Health
                      </th>
                      <th className="border border-[#9AA4B2] px-3 py-2">
                        Restart
                      </th>
                      <th className="border border-[#9AA4B2] px-3 py-2">
                        CPU
                      </th>
                      <th className="border border-[#9AA4B2] px-3 py-2">
                        Memory
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {health.docker.containers.map((container) => (
                      <tr key={container.name} className="bg-[#EEF1F5]">
                        <td className="border border-[#B6C1D1] px-3 py-2 font-black">
                          {container.name}
                        </td>

                        <td className="border border-[#B6C1D1] px-3 py-2">
                          <AdminStatusBadge
                            tone={container.running ? 'online' : 'danger'}
                          >
                            {container.status || 'unknown'}
                          </AdminStatusBadge>
                        </td>

                        <td className="border border-[#B6C1D1] px-3 py-2">
                          <AdminStatusBadge
                            tone={getStatusTone(container.health)}
                          >
                            {container.health || 'none'}
                          </AdminStatusBadge>
                        </td>

                        <td className="border border-[#B6C1D1] px-3 py-2 font-black">
                          {container.restartCount}
                        </td>

                        <td className="border border-[#B6C1D1] px-3 py-2">
                          {container.cpuPercent || '-'}
                        </td>

                        <td className="border border-[#B6C1D1] px-3 py-2">
                          {container.memoryUsage || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AdminPanel>

            <AdminPanel>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#17406F]">
                HTTP Checks
              </p>

              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                {health.httpChecks.map((check) => (
                  <div
                    key={check.name}
                    className="border border-[#9AA4B2] bg-[#EEF1F5] p-3 shadow-[inset_1px_1px_0_#ffffff]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-black text-[#102A43]">{check.name}</p>

                      <AdminStatusBadge tone={check.ok ? 'online' : 'danger'}>
                        {check.ok ? 'ok' : 'failed'}
                      </AdminStatusBadge>
                    </div>

                    <p className="mt-3 text-sm font-semibold text-[#334155]">
                      HTTP {check.status}
                    </p>

                    <p className="mt-1 text-xs text-[#64748B]">
                      {formatDecimal(check.elapsedMilliseconds, 1)} ms
                    </p>

                    {check.error ? (
                      <p className="mt-2 text-xs font-bold text-red-800">
                        {check.error}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </AdminPanel>
          </div>
        )}
      </AdminWindow>

      <AdminWindow
        title="Monitoring History"
        subtitle="GET /api/admin/monitoring/history"
        actions={
          <AdminToolbar>
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#334155]">
              Dönem
              <select
                value={historyDays}
                onChange={(event) =>
                  setHistoryDays(Number(event.target.value))
                }
                className="border border-[#7C8794] bg-[#EEF1F5] px-3 py-2 text-sm font-bold text-[#1F2937]"
              >
                <option value={3}>3 gün</option>
                <option value={7}>7 gün</option>
                <option value={14}>14 gün</option>
              </select>
            </label>

            <AdminStatusBadge
              tone={history?.available ? 'online' : 'neutral'}
            >
              {history?.items.length ?? 0} report
            </AdminStatusBadge>
          </AdminToolbar>
        }
      >
        {historyQuery.isLoading ? (
          <LoadingPanel message="Monitoring geçmişi yükleniyor..." />
        ) : historyQuery.isError ? (
          <ErrorPanel message={historyQuery.error.message} />
        ) : !history?.available ? (
          <UnavailablePanel
            message={history?.message ?? 'Monitoring geçmişi kullanılamıyor.'}
          />
        ) : (
          <AdminPanel>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[#D7E9FF] text-[#082F5F]">
                    <th className="border border-[#9AA4B2] px-3 py-2">
                      Tarih
                    </th>
                    <th className="border border-[#9AA4B2] px-3 py-2">
                      Durum
                    </th>
                    <th className="border border-[#9AA4B2] px-3 py-2">
                      İstek
                    </th>
                    <th className="border border-[#9AA4B2] px-3 py-2">
                      Ziyaretçi
                    </th>
                    <th className="border border-[#9AA4B2] px-3 py-2">
                      API
                    </th>
                    <th className="border border-[#9AA4B2] px-3 py-2">
                      4xx
                    </th>
                    <th className="border border-[#9AA4B2] px-3 py-2">
                      5xx
                    </th>
                    <th className="border border-[#9AA4B2] px-3 py-2">
                      RAM
                    </th>
                    <th className="border border-[#9AA4B2] px-3 py-2">
                      Disk
                    </th>
                    <th className="border border-[#9AA4B2] px-3 py-2">
                      Restart
                    </th>
                    <th className="border border-[#9AA4B2] px-3 py-2">
                      TLS
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {history.items.map((item, index) => (
                    <tr
                      key={`${item.date ?? 'unknown'}-${index}`}
                      className="bg-[#EEF1F5]"
                    >
                      <td className="border border-[#B6C1D1] px-3 py-2 font-black">
                        {formatDate(item.date)}
                      </td>

                      <td className="border border-[#B6C1D1] px-3 py-2">
                        <AdminStatusBadge
                          tone={getStatusTone(item.overallStatus)}
                        >
                          {item.overallStatus || 'unknown'}
                        </AdminStatusBadge>
                      </td>

                      <td className="border border-[#B6C1D1] px-3 py-2">
                        {formatNumber(item.totalRequests)}
                      </td>

                      <td className="border border-[#B6C1D1] px-3 py-2">
                        {formatNumber(item.approximateVisitors)}
                      </td>

                      <td className="border border-[#B6C1D1] px-3 py-2">
                        {formatNumber(item.apiRequests)}
                      </td>

                      <td className="border border-[#B6C1D1] px-3 py-2">
                        {formatNumber(item.clientError4xx)}
                      </td>

                      <td className="border border-[#B6C1D1] px-3 py-2">
                        {formatNumber(item.serverError5xx)}
                      </td>

                      <td className="border border-[#B6C1D1] px-3 py-2">
                        {formatPercent(item.memoryUsedPercent)}
                      </td>

                      <td className="border border-[#B6C1D1] px-3 py-2">
                        {formatPercent(item.diskUsedPercent)}
                      </td>

                      <td className="border border-[#B6C1D1] px-3 py-2">
                        {item.containerRestartTotal}
                      </td>

                      <td className="border border-[#B6C1D1] px-3 py-2">
                        {item.tlsDaysRemaining} gün
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminPanel>
        )}
      </AdminWindow>
    </div>
  );
}