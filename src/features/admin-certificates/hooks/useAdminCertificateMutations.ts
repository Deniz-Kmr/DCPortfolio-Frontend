import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import {
  createAdminCertificate,
  deleteAdminCertificate,
  updateAdminCertificate,
} from '../../../services/admin';
import type {
  AdminCertificateCreateRequest,
  AdminCertificateDetail,
  AdminCertificateUpdateRequest,
} from '../../../types/admin';

type UpdateAdminCertificateVariables = {
  id: number;
  request: AdminCertificateUpdateRequest;
};

function getCertificateMutationErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'Sertifika işlemi tamamlanamadı.';
}

export function useCreateAdminCertificate() {
  const queryClient = useQueryClient();

  return useMutation<AdminCertificateDetail, Error, AdminCertificateCreateRequest>({
    mutationFn: async (request) => {
      const response = await createAdminCertificate(request);

      if (!response.success || !response.data) {
        throw new Error(getCertificateMutationErrorMessage(response.message));
      }

      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.certificates }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}

export function useUpdateAdminCertificate() {
  const queryClient = useQueryClient();

  return useMutation<AdminCertificateDetail, Error, UpdateAdminCertificateVariables>({
    mutationFn: async ({ id, request }) => {
      const response = await updateAdminCertificate(id, request);

      if (!response.success || !response.data) {
        throw new Error(getCertificateMutationErrorMessage(response.message));
      }

      return response.data;
    },
    onSuccess: async (certificate) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.certificates }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.certificateDetail(certificate.id) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}

export function useDeleteAdminCertificate() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: async (id) => {
      const response = await deleteAdminCertificate(id);

      if (!response.success) {
        throw new Error(getCertificateMutationErrorMessage(response.message));
      }

      return Boolean(response.data);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.certificates }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}
