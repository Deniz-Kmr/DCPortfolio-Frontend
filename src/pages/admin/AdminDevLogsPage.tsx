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
  useAdminDevLog,
  useAdminDevLogs,
  useCreateAdminDevLog,
  useDeleteAdminDevLog,
  useUpdateAdminDevLog,
} from '../../features/admin-devlogs';
import type {
  AdminDevLogCreateRequest,
  AdminDevLogDetail,
  AdminDevLogListItem,
  AdminDevLogUpdateRequest,
} from '../../types/admin';

const devLogFormSchema = z.object({
  title: z.string().min(1, 'Başlık zorunludur.'),
  content: z.string().min(1, 'İçerik zorunludur.'),
  category: z.string(),
  tags: z.string(),
  logDate: z.string().min(1, 'Log tarihi zorunludur.'),
  isImportant: z.boolean(),
});

type DevLogFormValues = z.infer<typeof devLogFormSchema>;

function getTodayInputDate() {
  return new Date().toISOString().slice(0, 10);
}

const defaultDevLogFormValues: DevLogFormValues = {
  title: '',
  content: '',
  category: '',
  tags: '',
  logDate: getTodayInputDate(),
  isImportant: false,
};

function nullableText(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function toDevLogRequest(
  values: DevLogFormValues,
): AdminDevLogCreateRequest | AdminDevLogUpdateRequest {
  return {
    title: values.title.trim(),
    content: values.content.trim(),
    category: nullableText(values.category),
    tags: nullableText(values.tags),
    logDate: values.logDate,
    isImportant: values.isImportant,
  };
}

function toDevLogFormValues(devLog: AdminDevLogDetail): DevLogFormValues {
  return {
    title: devLog.title,
    content: devLog.content,
    category: devLog.category ?? '',
    tags: devLog.tags ?? '',
    logDate: devLog.logDate.slice(0, 10),
    isImportant: devLog.isImportant,
  };
}

function toDevLogInitialFormValues(devLog: AdminDevLogListItem): DevLogFormValues {
  return {
    title: devLog.title,
    content: '',
    category: devLog.category ?? '',
    tags: devLog.tags ?? '',
    logDate: devLog.logDate.slice(0, 10),
    isImportant: devLog.isImportant,
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'medium',
  }).format(new Date(value));
}

function devLogStatus(devLog: AdminDevLogListItem) {
  return devLog.isImportant ? (
    <AdminStatusBadge tone="warning">important</AdminStatusBadge>
  ) : (
    <AdminStatusBadge tone="neutral">normal</AdminStatusBadge>
  );
}

export function AdminDevLogsPage() {
  const [editingDevLogId, setEditingDevLogId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const devLogsQuery = useAdminDevLogs();
  const selectedDevLogQuery = useAdminDevLog(editingDevLogId);
  const createDevLog = useCreateAdminDevLog();
  const updateDevLog = useUpdateAdminDevLog();
  const deleteDevLog = useDeleteAdminDevLog();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DevLogFormValues>({
    resolver: zodResolver(devLogFormSchema),
    defaultValues: defaultDevLogFormValues,
  });

  const sortedDevLogs = useMemo(() => {
    return [...(devLogsQuery.data ?? [])].sort((first, second) => {
      if (first.isImportant !== second.isImportant) {
        return first.isImportant ? -1 : 1;
      }

      return new Date(second.logDate).getTime() - new Date(first.logDate).getTime();
    });
  }, [devLogsQuery.data]);

  useEffect(() => {
    if (!editingDevLogId || !selectedDevLogQuery.data) {
      return;
    }

    reset(toDevLogFormValues(selectedDevLogQuery.data));
  }, [editingDevLogId, reset, selectedDevLogQuery.data]);

  function openCreateForm() {
    setEditingDevLogId(null);
    reset({
      ...defaultDevLogFormValues,
      logDate: getTodayInputDate(),
    });
    setIsFormOpen(true);
  }

  function openEditForm(devLog: AdminDevLogListItem) {
    setEditingDevLogId(devLog.id);
    reset(toDevLogInitialFormValues(devLog));
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingDevLogId(null);
    reset({
      ...defaultDevLogFormValues,
      logDate: getTodayInputDate(),
    });
    setIsFormOpen(false);
  }

  async function onSubmit(values: DevLogFormValues) {
    const request = toDevLogRequest(values);

    if (editingDevLogId) {
      await updateDevLog.mutateAsync({
        id: editingDevLogId,
        request,
      });
    } else {
      await createDevLog.mutateAsync(request);
    }

    closeForm();
  }

  async function handleDelete(devLog: AdminDevLogListItem) {
    const confirmed = window.confirm(`"${devLog.title}" DevLog kaydını silmek istediğine emin misin?`);

    if (!confirmed) {
      return;
    }

    await deleteDevLog.mutateAsync(devLog.id);

    if (editingDevLogId === devLog.id) {
      closeForm();
    }
  }

  const mutationError =
    createDevLog.error?.message ?? updateDevLog.error?.message ?? deleteDevLog.error?.message;

  const isMutating =
    createDevLog.isPending || updateDevLog.isPending || deleteDevLog.isPending || isSubmitting;

  const isEditingDetailLoading = editingDevLogId !== null && selectedDevLogQuery.isLoading;

  return (
    <div className="space-y-6">
      <AdminWindow
        title="Developer Logs"
        subtitle="CRUD /api/admin/dev-logs"
        actions={
          <AdminToolbar>
            <AdminStatusBadge tone="online">protected</AdminStatusBadge>
            <AdminStatusBadge tone="neutral">{sortedDevLogs.length} records</AdminStatusBadge>
            <AdminButton variant="primary" onClick={openCreateForm}>
              Yeni DevLog
            </AdminButton>
          </AdminToolbar>
        }
      >
        <AdminPanel>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#17406F]">
            Developer Journal
          </p>
          <h1 className="mt-3 text-3xl font-black text-[#102A43]">DevLogs CRUD</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#334155]">
            Geliştirme notları, karar kayıtları ve önemli teknik öğrenimleri yönetir. Edit modunda
            içerik detail endpoint üzerinden yüklenir.
          </p>
        </AdminPanel>
      </AdminWindow>

      {isFormOpen ? (
        <AdminWindow
          title={editingDevLogId ? 'Edit DevLog' : 'Create DevLog'}
          subtitle={editingDevLogId ? `DevLog ID: ${editingDevLogId}` : 'New developer log'}
          actions={
            <AdminToolbar>
              <AdminStatusBadge tone={editingDevLogId ? 'warning' : 'online'}>
                {editingDevLogId ? 'edit mode' : 'create mode'}
              </AdminStatusBadge>
              {isEditingDetailLoading ? <AdminStatusBadge tone="warning">detail loading</AdminStatusBadge> : null}
              <AdminButton onClick={closeForm}>Vazgeç</AdminButton>
            </AdminToolbar>
          }
        >
          <AdminPanel>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 lg:grid-cols-2">
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
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Log Tarihi</label>
                  <input
                    type="date"
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('logDate')}
                  />
                  {errors.logDate ? (
                    <p className="mt-2 text-xs font-bold text-red-800">{errors.logDate.message}</p>
                  ) : null}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">İçerik</label>
                <textarea
                  rows={8}
                  className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                  {...register('content')}
                />
                {errors.content ? (
                  <p className="mt-2 text-xs font-bold text-red-800">{errors.content.message}</p>
                ) : null}
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Category</label>
                  <input
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    placeholder="Frontend, Backend, Security..."
                    {...register('category')}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Tags</label>
                  <input
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    placeholder="react, admin, crud"
                    {...register('tags')}
                  />
                </div>

                <label className="flex items-center gap-3 self-start border border-[#9AA4B2] bg-[#E9EDF4] p-3 text-sm font-bold text-[#1F2937] shadow-[inset_1px_1px_0_#ffffff] lg:mt-7">
                  <input type="checkbox" {...register('isImportant')} />
                  Important
                </label>
              </div>

              {selectedDevLogQuery.isError ? (
                <div className="border border-red-700 bg-red-100 p-4 text-sm font-bold text-red-900">
                  {selectedDevLogQuery.error.message}
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
                    : editingDevLogId
                      ? 'DevLog Güncelle'
                      : 'DevLog Oluştur'}
                </AdminButton>

                <AdminButton onClick={closeForm}>Vazgeç</AdminButton>
              </div>
            </form>
          </AdminPanel>
        </AdminWindow>
      ) : null}

      <AdminWindow
        title="DevLog Records"
        subtitle="List / edit / delete"
        actions={
          <AdminToolbar>
            <AdminStatusBadge
              tone={devLogsQuery.isSuccess ? 'online' : devLogsQuery.isError ? 'danger' : 'warning'}
            >
              {devLogsQuery.isSuccess ? 'online' : devLogsQuery.isError ? 'error' : 'loading'}
            </AdminStatusBadge>
          </AdminToolbar>
        }
      >
        {devLogsQuery.isLoading ? (
          <AdminPanel>
            <p className="text-sm font-bold text-[#334155]">DevLog kayıtları yükleniyor...</p>
          </AdminPanel>
        ) : devLogsQuery.isError ? (
          <AdminPanel>
            <div className="border border-red-700 bg-red-100 p-4 text-sm font-bold text-red-900">
              {devLogsQuery.error.message}
            </div>
          </AdminPanel>
        ) : sortedDevLogs.length === 0 ? (
          <AdminPanel>
            <p className="text-sm font-bold text-[#334155]">
              Henüz DevLog kaydı yok. “Yeni DevLog” ile ilk kaydı oluşturabilirsin.
            </p>
          </AdminPanel>
        ) : (
          <div className="grid gap-4">
            {sortedDevLogs.map((devLog) => (
              <AdminPanel key={devLog.id}>
                <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black text-[#102A43]">{devLog.title}</h2>
                      {devLogStatus(devLog)}
                    </div>

                    <p className="mt-2 text-sm font-bold text-[#17406F]">
                      {formatDate(devLog.logDate)}
                      {devLog.category ? ` • ${devLog.category}` : ''}
                    </p>

                    {devLog.tags ? (
                      <p className="mt-3 font-mono text-xs font-bold text-[#64748B]">{devLog.tags}</p>
                    ) : null}

                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#64748B]">
                      Updated: {devLog.updatedAt ? formatDate(devLog.updatedAt) : '-'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-start gap-2 lg:flex-col">
                    <AdminButton onClick={() => openEditForm(devLog)}>Edit</AdminButton>
                    <AdminButton
                      variant="danger"
                      disabled={deleteDevLog.isPending}
                      onClick={() => {
                        void handleDelete(devLog);
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
