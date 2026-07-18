import type { TodoPriority, TodoStatus } from './adminEnumTypes';

export interface AdminTodoListItem {
  id: number;
  title: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminTodoDetail {
  id: number;
  title: string;
  description: string | null;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminTodoCreateRequest {
  title: string;
  description: string | null;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate: string | null;
}

export interface AdminTodoUpdateRequest {
  title: string;
  description: string | null;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate: string | null;
  completedAt: string | null;
}
