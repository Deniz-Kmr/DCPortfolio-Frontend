import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  AdminButton,
  AdminPanel,
  AdminStatusBadge,
  AdminToolbar,
  AdminWindow,
} from '../../components/admin/vintage';
import {
  useAdminTodo,
  useAdminTodos,
  useCreateAdminTodo,
  useDeleteAdminTodo,
  useUpdateAdminTodo,
} from '../../features/admin-todos';
import type {
  AdminTodoCreateRequest,
  AdminTodoDetail,
  AdminTodoListItem,
  AdminTodoUpdateRequest,
  TodoPriority,
  TodoStatus,
} from '../../types/admin';

const todoStatusOptions: { label: string; value: TodoStatus }[] = [
  { label: "Todo", value: "Todo" as TodoStatus },
  { label: "In Progress", value: "InProgress" as TodoStatus },
  { label: "Done", value: "Done" as TodoStatus },
  { label: "Cancelled", value: "Cancelled" as TodoStatus },
];

const todoPriorityOptions: { label: string; value: TodoPriority }[] = [
  { label: "Low", value: "Low" as TodoPriority },
  { label: "Medium", value: "Medium" as TodoPriority },
  { label: "High", value: "High" as TodoPriority },
];

const todoFormSchema = z.object({
  title: z.string().min(1, 'Todo başlığı zorunludur.'),
  description: z.string(),
  status: z.string().min(1, 'Status zorunludur.'),
  priority: z.string().min(1, 'Priority zorunludur.'),
  dueDate: z.string(),
  completedAt: z.string(),
});

type TodoFormValues = z.infer<typeof todoFormSchema>;

const defaultTodoFormValues: TodoFormValues = {
  title: '',
  description: '',
  status: String(todoStatusOptions[0]?.value ?? ''),
  priority: String(todoPriorityOptions[0]?.value ?? ''),
  dueDate: '',
  completedAt: '',
};

function nullableText(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function getTodoStatus(value: string): TodoStatus {
  const option = todoStatusOptions.find((item) => String(item.value) === value);

  return option?.value ?? (value as TodoStatus);
}

function getTodoPriority(value: string): TodoPriority {
  const option = todoPriorityOptions.find((item) => String(item.value) === value);

  return option?.value ?? (value as TodoPriority);
}

function toTodoCreateRequest(values: TodoFormValues): AdminTodoCreateRequest {
  return {
    title: values.title.trim(),
    description: nullableText(values.description),
    status: getTodoStatus(values.status),
    priority: getTodoPriority(values.priority),
    dueDate: nullableText(values.dueDate),
  };
}

function toTodoUpdateRequest(values: TodoFormValues): AdminTodoUpdateRequest {
  return {
    title: values.title.trim(),
    description: nullableText(values.description),
    status: getTodoStatus(values.status),
    priority: getTodoPriority(values.priority),
    dueDate: nullableText(values.dueDate),
    completedAt: nullableText(values.completedAt),
  };
}

function toTodoFormValues(todo: AdminTodoDetail): TodoFormValues {
  return {
    title: todo.title,
    description: todo.description ?? '',
    status: String(todo.status),
    priority: String(todo.priority),
    dueDate: todo.dueDate?.slice(0, 10) ?? '',
    completedAt: todo.completedAt?.slice(0, 10) ?? '',
  };
}

function toTodoInitialFormValues(todo: AdminTodoListItem): TodoFormValues {
  return {
    title: todo.title,
    description: '',
    status: String(todo.status),
    priority: String(todo.priority),
    dueDate: todo.dueDate?.slice(0, 10) ?? '',
    completedAt: todo.completedAt?.slice(0, 10) ?? '',
  };
}

function formatDate(value: string | null) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'medium',
  }).format(new Date(value));
}

function statusTone(status: TodoStatus) {
  const value = String(status).toLowerCase();

  if (value.includes('complete') || value.includes('done')) {
    return 'online';
  }

  if (value.includes('progress')) {
    return 'warning';
  }

  return 'neutral';
}

function priorityTone(priority: TodoPriority) {
  const value = String(priority).toLowerCase();

  if (value.includes('high') || value.includes('critical')) {
    return 'danger';
  }

  if (value.includes('medium')) {
    return 'warning';
  }

  return 'neutral';
}

export function AdminTodosPage() {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const todosQuery = useAdminTodos();
  const selectedTodoQuery = useAdminTodo(editingTodoId);
  const createTodo = useCreateAdminTodo();
  const updateTodo = useUpdateAdminTodo();
  const deleteTodo = useDeleteAdminTodo();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TodoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: defaultTodoFormValues,
  });

  const sortedTodos = useMemo(() => {
    return [...(todosQuery.data ?? [])].sort((first, second) => {
      const firstDue = first.dueDate ? new Date(first.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      const secondDue = second.dueDate ? new Date(second.dueDate).getTime() : Number.MAX_SAFE_INTEGER;

      if (firstDue !== secondDue) {
        return firstDue - secondDue;
      }

      return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
    });
  }, [todosQuery.data]);

  useEffect(() => {
    if (!editingTodoId || !selectedTodoQuery.data) {
      return;
    }

    reset(toTodoFormValues(selectedTodoQuery.data));
  }, [editingTodoId, reset, selectedTodoQuery.data]);

  function openCreateForm() {
    setEditingTodoId(null);
    reset(defaultTodoFormValues);
    setIsFormOpen(true);
  }

  function openEditForm(todo: AdminTodoListItem) {
    setEditingTodoId(todo.id);
    reset(toTodoInitialFormValues(todo));
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingTodoId(null);
    reset(defaultTodoFormValues);
    setIsFormOpen(false);
  }

  async function onSubmit(values: TodoFormValues) {
    if (editingTodoId) {
      await updateTodo.mutateAsync({
        id: editingTodoId,
        request: toTodoUpdateRequest(values),
      });
    } else {
      await createTodo.mutateAsync(toTodoCreateRequest(values));
    }

    closeForm();
  }

  async function handleDelete(todo: AdminTodoListItem) {
    const confirmed = window.confirm(`"${todo.title}" todo kaydını silmek istediğine emin misin?`);

    if (!confirmed) {
      return;
    }

    await deleteTodo.mutateAsync(todo.id);

    if (editingTodoId === todo.id) {
      closeForm();
    }
  }

  const mutationError =
    createTodo.error?.message ?? updateTodo.error?.message ?? deleteTodo.error?.message;

  const isMutating = createTodo.isPending || updateTodo.isPending || deleteTodo.isPending || isSubmitting;

  const isEditingDetailLoading = editingTodoId !== null && selectedTodoQuery.isLoading;

  return (
    <div className="space-y-6">
      <AdminWindow
        title="Todo Board"
        subtitle="CRUD /api/admin/todos"
        actions={
          <AdminToolbar>
            <AdminStatusBadge tone="online">protected</AdminStatusBadge>
            <AdminStatusBadge tone="neutral">{sortedTodos.length} records</AdminStatusBadge>
            <AdminButton variant="primary" onClick={openCreateForm}>
              Yeni Todo
            </AdminButton>
          </AdminToolbar>
        }
      >
        <AdminPanel>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#17406F]">
            Productivity Tracker
          </p>
          <h1 className="mt-3 text-3xl font-black text-[#102A43]">Todos CRUD</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#334155]">
            Admin tarafındaki iş takibi kayıtlarını yönetir. Status ve priority değerleri backend
            enum/type contract yapısından select olarak gelir.
          </p>
        </AdminPanel>
      </AdminWindow>

      {isFormOpen ? (
        <AdminWindow
          title={editingTodoId ? 'Edit Todo' : 'Create Todo'}
          subtitle={editingTodoId ? `Todo ID: ${editingTodoId}` : 'New todo record'}
          actions={
            <AdminToolbar>
              <AdminStatusBadge tone={editingTodoId ? 'warning' : 'online'}>
                {editingTodoId ? 'edit mode' : 'create mode'}
              </AdminStatusBadge>
              {isEditingDetailLoading ? <AdminStatusBadge tone="warning">detail loading</AdminStatusBadge> : null}
              <AdminButton onClick={closeForm}>Vazgeç</AdminButton>
            </AdminToolbar>
          }
        >
          <AdminPanel>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Başlık</label>
                <input
                  className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                  {...register('title')}
                />
                {errors.title ? (
                  <p className="mt-2 text-xs font-bold text-red-800">{errors.title.message}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Açıklama</label>
                <textarea
                  rows={5}
                  className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                  {...register('description')}
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Status</label>
                  <select
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('status')}
                  >
                    {todoStatusOptions.map((option) => (
                      <option key={String(option.value)} value={String(option.value)}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.status ? (
                    <p className="mt-2 text-xs font-bold text-red-800">{errors.status.message}</p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Priority</label>
                  <select
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('priority')}
                  >
                    {todoPriorityOptions.map((option) => (
                      <option key={String(option.value)} value={String(option.value)}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.priority ? (
                    <p className="mt-2 text-xs font-bold text-red-800">{errors.priority.message}</p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Due Date</label>
                  <input
                    type="date"
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('dueDate')}
                  />
                </div>

                {editingTodoId ? (
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">
                      Completed At
                    </label>
                    <input
                      type="date"
                      className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                      {...register('completedAt')}
                    />
                  </div>
                ) : (
                  <div className="border border-[#9AA4B2] bg-[#E9EDF4] p-3 text-xs font-bold leading-5 text-[#17406F] shadow-[inset_1px_1px_0_#ffffff] lg:mt-7">
                    Completed At sadece edit modunda gönderilir.
                  </div>
                )}
              </div>

              {selectedTodoQuery.isError ? (
                <div className="border border-red-700 bg-red-100 p-4 text-sm font-bold text-red-900">
                  {selectedTodoQuery.error.message}
                </div>
              ) : null}

              {mutationError ? (
                <div className="border border-red-700 bg-red-100 p-4 text-sm font-bold text-red-900">
                  {mutationError}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3 border-t border-[#B6C1D1] pt-5">
                <AdminButton type="submit" variant="primary" disabled={isMutating || isEditingDetailLoading}>
                  {isMutating
                    ? 'Kaydediliyor...'
                    : editingTodoId
                      ? 'Todo Güncelle'
                      : 'Todo Oluştur'}
                </AdminButton>

                <AdminButton onClick={closeForm}>Vazgeç</AdminButton>
              </div>
            </form>
          </AdminPanel>
        </AdminWindow>
      ) : null}

      <AdminWindow
        title="Todo Records"
        subtitle="List / edit / delete"
        actions={
          <AdminToolbar>
            <AdminStatusBadge
              tone={todosQuery.isSuccess ? 'online' : todosQuery.isError ? 'danger' : 'warning'}
            >
              {todosQuery.isSuccess ? 'online' : todosQuery.isError ? 'error' : 'loading'}
            </AdminStatusBadge>
          </AdminToolbar>
        }
      >
        {todosQuery.isLoading ? (
          <AdminPanel>
            <p className="text-sm font-bold text-[#334155]">Todo kayıtları yükleniyor...</p>
          </AdminPanel>
        ) : todosQuery.isError ? (
          <AdminPanel>
            <div className="border border-red-700 bg-red-100 p-4 text-sm font-bold text-red-900">
              {todosQuery.error.message}
            </div>
          </AdminPanel>
        ) : sortedTodos.length === 0 ? (
          <AdminPanel>
            <p className="text-sm font-bold text-[#334155]">
              Henüz todo kaydı yok. “Yeni Todo” ile ilk kaydı oluşturabilirsin.
            </p>
          </AdminPanel>
        ) : (
          <div className="grid gap-4">
            {sortedTodos.map((todo) => (
              <AdminPanel key={todo.id}>
                <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black text-[#102A43]">{todo.title}</h2>
                      <AdminStatusBadge tone={statusTone(todo.status)}>{String(todo.status)}</AdminStatusBadge>
                      <AdminStatusBadge tone={priorityTone(todo.priority)}>{String(todo.priority)}</AdminStatusBadge>
                    </div>

                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                      <div>
                        <dt className="font-black text-[#64748B]">Due Date</dt>
                        <dd className="mt-1 text-[#102A43]">{formatDate(todo.dueDate)}</dd>
                      </div>
                      <div>
                        <dt className="font-black text-[#64748B]">Completed At</dt>
                        <dd className="mt-1 text-[#102A43]">{formatDate(todo.completedAt)}</dd>
                      </div>
                      <div>
                        <dt className="font-black text-[#64748B]">Updated</dt>
                        <dd className="mt-1 text-[#102A43]">{formatDate(todo.updatedAt)}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="flex flex-wrap items-start gap-2 lg:flex-col">
                    <AdminButton onClick={() => openEditForm(todo)}>Edit</AdminButton>
                    <AdminButton
                      variant="danger"
                      disabled={deleteTodo.isPending}
                      onClick={() => {
                        void handleDelete(todo);
                      }}
                    >
                      Delete
                    </AdminButton>
                  </div>
                </div>
              </AdminPanel>
            ))}
          </div>
        )}
      </AdminWindow>
    </div>
  );
}
