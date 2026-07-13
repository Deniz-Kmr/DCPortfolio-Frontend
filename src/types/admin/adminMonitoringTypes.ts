export interface AdminMonitoringPathMetric {
  path: string;
  count: number;
}

export interface AdminMonitoringBackup {
  name: string;
  sizeBytes: number;
  sizeHuman: string;
  modifiedAt: string | null;
}

export interface AdminMonitoringTrafficSummary {
  totalRequests: number;
  approximateVisitors: number;
  pageViews: number;
  frontendRequests: number;
  apiRequests: number;
  mediaRequests: number;
  botLikeRequests: number;
  suspiciousRequests: number;
  responseMegabytes: number;
  success2xx: number;
  redirect3xx: number;
  clientError4xx: number;
  serverError5xx: number;
  rateLimited429: number;
  averageRequestTimeSeconds: number;
  maximumRequestTimeSeconds: number;
}

export interface AdminMonitoringHealthSummary {
  memoryUsedPercent: number;
  swapUsedPercent: number;
  diskUsedPercent: number;
  runningContainers: number;
  expectedContainers: number;
  containerRestartTotal: number;
  successfulHttpChecks: number;
  totalHttpChecks: number;
  publicListeningPorts: number[];
  forbiddenPublicPortsDetected: number[];
  tlsDaysRemaining: number;
  manualBackupCount: number;
  latestManualBackup: AdminMonitoringBackup | null;
}

export interface AdminMonitoringSummary {
  available: boolean;
  message: string;
  date: string | null;
  generatedAt: string | null;
  overallStatus: string;
  overallReasons: string[];
  trafficStatus: string;
  healthStatus: string;
  publicApiRateLimitEnabled: boolean;
  traffic: AdminMonitoringTrafficSummary;
  health: AdminMonitoringHealthSummary;
  topFrontendPages: AdminMonitoringPathMetric[];
  topApiEndpoints: AdminMonitoringPathMetric[];
}

export interface AdminMonitoringTrafficCounters {
  totalRequests: number;
  approximateVisitors: number;
  pageViews: number;
  humanLikePageViews: number;
  frontendRequests: number;
  apiRequests: number;
  mediaRequests: number;
  staticRequests: number;
  botLikeRequests: number;
  suspiciousRequests: number;
  responseBytes: number;
  responseMegabytes: number;
}

export interface AdminMonitoringStatusCounters {
  success2xx: number;
  redirect3xx: number;
  clientError4xx: number;
  serverError5xx: number;
  rateLimited429: number;
}

export interface AdminMonitoringPerformance {
  averageRequestTimeSeconds: number;
  maximumRequestTimeSeconds: number;
}

export interface AdminMonitoringTraffic {
  available: boolean;
  message: string;
  date: string | null;
  generatedAt: string | null;
  monitoringStatus: string;
  monitoringReasons: string[];
  notes: string[];
  hardTrafficLimitEnabled: boolean;
  traffic: AdminMonitoringTrafficCounters;
  statuses: AdminMonitoringStatusCounters;
  performance: AdminMonitoringPerformance;
  topFrontendPages: AdminMonitoringPathMetric[];
  topApiEndpoints: AdminMonitoringPathMetric[];
}

export interface AdminMonitoringSystem {
  cpuCount: number;
  loadAverageOneMinute: number;
  loadAverageFiveMinutes: number;
  loadAverageFifteenMinutes: number;
  uptimeSeconds: number;
  uptimeHours: number;
  memoryUsedPercent: number;
  swapUsedPercent: number;
  diskUsedPercent: number;
}

export interface AdminMonitoringContainer {
  name: string;
  exists: boolean;
  running: boolean;
  status: string;
  health: string;
  restartCount: number;
  startedAt: string | null;
  cpuPercent: string;
  memoryUsage: string;
  memoryPercent: string;
  networkIo: string;
  blockIo: string;
  pids: string;
}

export interface AdminMonitoringDocker {
  serviceActive: boolean;
  containers: AdminMonitoringContainer[];
}

export interface AdminMonitoringNetwork {
  publicListeningPorts: number[];
  expectedPublicPorts: number[];
  forbiddenPublicPortsDetected: number[];
  unexpectedPublicPorts: number[];
}

export interface AdminMonitoringHttpCheck {
  name: string;
  ok: boolean;
  status: number;
  elapsedMilliseconds: number;
  error: string | null;
}

export interface AdminMonitoringTls {
  ok: boolean;
  expiresAt: string | null;
  daysRemaining: number;
  error: string | null;
}

export interface AdminMonitoringOperations {
  logrotateTimerActive: boolean;
  logrotateTimerEnabled: boolean;
  accessLogExists: boolean;
  accessLogSizeBytes: number;
  errorLogExists: boolean;
  errorLogSizeBytes: number;
  manualBackupCount: number;
  latestManualBackup: AdminMonitoringBackup | null;
}

export interface AdminMonitoringHealth {
  available: boolean;
  message: string;
  generatedAt: string | null;
  healthStatus: string;
  healthReasons: string[];
  system: AdminMonitoringSystem;
  docker: AdminMonitoringDocker;
  network: AdminMonitoringNetwork;
  httpChecks: AdminMonitoringHttpCheck[];
  tls: AdminMonitoringTls;
  operations: AdminMonitoringOperations;
}

export interface AdminMonitoringHistoryItem {
  date: string | null;
  generatedAt: string | null;
  overallStatus: string;
  trafficStatus: string;
  healthStatus: string;
  totalRequests: number;
  approximateVisitors: number;
  apiRequests: number;
  clientError4xx: number;
  serverError5xx: number;
  rateLimited429: number;
  memoryUsedPercent: number;
  swapUsedPercent: number;
  diskUsedPercent: number;
  containerRestartTotal: number;
  tlsDaysRemaining: number;
  manualBackupCount: number;
}

export interface AdminMonitoringHistory {
  available: boolean;
  message: string;
  requestedDays: number;
  items: AdminMonitoringHistoryItem[];
}