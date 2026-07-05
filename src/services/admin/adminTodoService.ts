import { apiClient } from '../api/apiClient';
import { apiRoutes } from '../api/apiRoutes';
import type { ApiResponse } from '../../types/api/apiResponse';
import type {
  AdminTodoCreateRequest,
  AdminTodoDetail,
  AdminTodoListItem,
  AdminTodoUpdateRequest,
} from '../../types/admin';

export async function getAdminTodos() {
  const response = await apiClient.get<ApiResponse<AdminTodoListItem[]>>(apiRoutes.admin.todos);

  return response.data;
}

export async function getAdminTodoById(id: number) {
  const response = await apiClient.get<ApiResponse<AdminTodoDetail>>(
    apiRoutes.admin.todoById(id),
  );

  return response.data;
}

export async function createAdminTodo(request: AdminTodoCreateRequest) {
  const response = await apiClient.post<ApiResponse<AdminTodoDetail>>(
    apiRoutes.admin.todos,
    request,
  );

  return response.data;
}

export async function updateAdminTodo(id: number, request: AdminTodoUpdateRequest) {
  const response = await apiClient.put<ApiResponse<AdminTodoDetail>>(
    apiRoutes.admin.todoById(id),
    request,
  );

  return response.data;
}

export async function deleteAdminTodo(id: number) {
  const response = await apiClient.delete<ApiResponse<boolean>>(apiRoutes.admin.todoById(id));

  return response.data;
}
