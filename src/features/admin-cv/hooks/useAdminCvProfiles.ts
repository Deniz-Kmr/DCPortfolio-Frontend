import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import {
  createAdminCvProfile,
  deleteAdminCvProfile,
  getAdminCvProfiles,
  updateAdminCvProfile,
} from '../../../services/admin';
import type {
  AdminCvProfile,
  AdminCvProfileCreateRequest,
  AdminCvProfileUpdateRequest,
} from '../../../types/admin';

type UpdateAdminCvProfileVariables = {
  id: number;
  request: AdminCvProfileUpdateRequest;
};

function getCvProfileErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'CV/Profile işlemi tamamlanamadı.';
}

export function useAdminCvProfiles() {
  return useQuery<AdminCvProfile[], Error>({
    queryKey: queryKeys.admin.cvProfiles,
    queryFn: async () => {
      const response = await getAdminCvProfiles();

      if (!response.success || !response.data) {
        throw new Error(getCvProfileErrorMessage(response.message));
      }

      return response.data;
    },
  });
}

export function useCreateAdminCvProfile() {
  const queryClient = useQueryClient();

  return useMutation<AdminCvProfile, Error, AdminCvProfileCreateRequest>({
    mutationFn: async (request) => {
      const response = await createAdminCvProfile(request);

      if (!response.success || !response.data) {
        throw new Error(getCvProfileErrorMessage(response.message));
      }

      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.cvProfiles }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}

export function useUpdateAdminCvProfile() {
  const queryClient = useQueryClient();

  return useMutation<AdminCvProfile, Error, UpdateAdminCvProfileVariables>({
    mutationFn: async ({ id, request }) => {
      const response = await updateAdminCvProfile(id, request);

      if (!response.success || !response.data) {
        throw new Error(getCvProfileErrorMessage(response.message));
      }

      return response.data;
    },
    onSuccess: async (profile) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.cvProfiles }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.cvProfileDetail(profile.id) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}

export function useDeleteAdminCvProfile() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: async (id) => {
      const response = await deleteAdminCvProfile(id);

      if (!response.success) {
        throw new Error(getCvProfileErrorMessage(response.message));
      }

      return Boolean(response.data);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.cvProfiles }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}
