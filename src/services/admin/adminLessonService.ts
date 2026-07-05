import { apiClient } from '../api/apiClient';
import { apiRoutes } from '../api/apiRoutes';
import type { ApiResponse } from '../../types/api/apiResponse';
import type {
  AdminLessonCreateRequest,
  AdminLessonDetail,
  AdminLessonListItem,
  AdminLessonUpdateRequest,
} from '../../types/admin';

export async function getAdminLessons() {
  const response = await apiClient.get<ApiResponse<AdminLessonListItem[]>>(
    apiRoutes.admin.lessons,
  );

  return response.data;
}

export async function getAdminLessonById(id: number) {
  const response = await apiClient.get<ApiResponse<AdminLessonDetail>>(
    apiRoutes.admin.lessonById(id),
  );

  return response.data;
}

export async function createAdminLesson(request: AdminLessonCreateRequest) {
  const response = await apiClient.post<ApiResponse<AdminLessonDetail>>(
    apiRoutes.admin.lessons,
    request,
  );

  return response.data;
}

export async function updateAdminLesson(id: number, request: AdminLessonUpdateRequest) {
  const response = await apiClient.put<ApiResponse<AdminLessonDetail>>(
    apiRoutes.admin.lessonById(id),
    request,
  );

  return response.data;
}

export async function deleteAdminLesson(id: number) {
  const response = await apiClient.delete<ApiResponse<boolean>>(apiRoutes.admin.lessonById(id));

  return response.data;
}
