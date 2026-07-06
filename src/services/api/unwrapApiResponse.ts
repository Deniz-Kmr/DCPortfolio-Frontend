import type { ApiResponse } from '../../types/api/apiResponse';

export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw new Error(response.message ?? 'Request failed.');
  }

  if (response.data === null || response.data === undefined) {
    throw new Error(response.message ?? 'No data returned.');
  }

  return response.data;
}

export function unwrapNullableApiResponse<T>(response: ApiResponse<T | null>): T | null {
  if (!response.success) {
    throw new Error(response.message ?? 'Request failed.');
  }

  return response.data ?? null;
}
