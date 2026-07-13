import { useQuery } from '@tanstack/react-query';

import {
  getAdminMonitoringHealth,
  getAdminMonitoringHistory,
  getAdminMonitoringSummary,
  getAdminMonitoringTraffic,
} from '../../../services/admin';
import { queryKeys } from '../../../services/api/queryKeys';
import { getAccessToken } from '../../../services/auth';
import type {
  AdminMonitoringHealth,
  AdminMonitoringHistory,
  AdminMonitoringSummary,
  AdminMonitoringTraffic,
} from '../../../types/admin';

function getMonitoringErrorMessage(
  message: string | null | undefined,
  fallbackMessage: string,
) {
  return message?.trim() || fallbackMessage;
}

export function useAdminMonitoringSummary() {
  const hasToken = Boolean(getAccessToken());

  return useQuery<AdminMonitoringSummary, Error>({
    queryKey: queryKeys.admin.monitoringSummary,
    enabled: hasToken,
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const response = await getAdminMonitoringSummary();

      if (!response.success || !response.data) {
        throw new Error(
          getMonitoringErrorMessage(
            response.message,
            'Production monitoring özeti yüklenemedi.',
          ),
        );
      }

      return response.data;
    },
  });
}

export function useAdminMonitoringTraffic() {
  const hasToken = Boolean(getAccessToken());

  return useQuery<AdminMonitoringTraffic, Error>({
    queryKey: queryKeys.admin.monitoringTraffic,
    enabled: hasToken,
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const response = await getAdminMonitoringTraffic();

      if (!response.success || !response.data) {
        throw new Error(
          getMonitoringErrorMessage(
            response.message,
            'Production trafik raporu yüklenemedi.',
          ),
        );
      }

      return response.data;
    },
  });
}

export function useAdminMonitoringHealth() {
  const hasToken = Boolean(getAccessToken());

  return useQuery<AdminMonitoringHealth, Error>({
    queryKey: queryKeys.admin.monitoringHealth,
    enabled: hasToken,
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const response = await getAdminMonitoringHealth();

      if (!response.success || !response.data) {
        throw new Error(
          getMonitoringErrorMessage(
            response.message,
            'Production sağlık raporu yüklenemedi.',
          ),
        );
      }

      return response.data;
    },
  });
}

export function useAdminMonitoringHistory(days: number) {
  const hasToken = Boolean(getAccessToken());

  return useQuery<AdminMonitoringHistory, Error>({
    queryKey: queryKeys.admin.monitoringHistory(days),
    enabled: hasToken,
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const response = await getAdminMonitoringHistory(days);

      if (!response.success || !response.data) {
        throw new Error(
          getMonitoringErrorMessage(
            response.message,
            'Production monitoring geçmişi yüklenemedi.',
          ),
        );
      }

      return response.data;
    },
  });
}