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
  useAdminLearningRoadmap,
  useAdminLearningRoadmaps,
  useCreateAdminLearningRoadmap,
  useDeleteAdminLearningRoadmap,
  useUpdateAdminLearningRoadmap,
} from '../../features/admin-learning-roadmaps';
import type {
  AdminLearningRoadmapCreateRequest,
  AdminLearningRoadmapDetail,
  AdminLearningRoadmapListItem,
  AdminLearningRoadmapUpdateRequest,
  RoadmapStatus,
} from '../../types/admin';

const roadmapStatusOptions: { label: string; value: RoadmapStatus }[] = [
  { label: 'Planned', value: 'Planned' },
  { label: 'In Progress', value: 'InProgress' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Paused', value: 'Paused' },
];

const roadmapFormSchema = z.object({
  title: z.string().min(1, 'Roadmap başlığı zorunludur.'),
  category: z.string().min(1, 'Kategori zorunludur.'),
  description: z.string(),
  status: z.string().min(1, 'Status zorunludur.'),
  targetDate: z.string(),
  completedAt: z.string(),
  displayOrder: z.number().int('Sıralama tam sayı olmalıdır.').min(0, 'Sıralama 0 veya üstü olmalıdır.'),
});

type RoadmapFormValues = z.infer<typeof roadmapFormSchema>;

const defaultRoadmapFormValues: RoadmapFormValues = {
  title: '',
  category: '',
  description: '',
  status: 'Planned',
  targetDate: '',
  completedAt: '',
  displayOrder: 0,
};

function nullableText(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function getRoadmapStatus(value: string): RoadmapStatus {
  const option = roadmapStatusOptions.find((item) => item.value === value);

  return option?.value ?? (value as RoadmapStatus);
}

function toRoadmapCreateRequest(values: RoadmapFormValues): AdminLearningRoadmapCreateRequest {
  return {
    title: values.title.trim(),
    category: values.category.trim(),
    description: nullableText(values.description),
    status: getRoadmapStatus(values.status),
    targetDate: nullableText(values.targetDate),
    displayOrder: values.displayOrder,
  };
}

function toRoadmapUpdateRequest(values: RoadmapFormValues): AdminLearningRoadmapUpdateRequest {
  return {
    title: values.title.trim(),
    category: values.category.trim(),
    description: nullableText(values.description),
    status: getRoadmapStatus(values.status),
    targetDate: nullableText(values.targetDate),
    completedAt: nullableText(values.completedAt),
    displayOrder: values.displayOrder,
  };
}

function toRoadmapFormValues(roadmap: AdminLearningRoadmapDetail): RoadmapFormValues {
  return {
    title: roadmap.title,
    category: roadmap.category,
    description: roadmap.description ?? '',
    status: roadmap.status,
    targetDate: roadmap.targetDate?.slice(0, 10) ?? '',
    completedAt: roadmap.completedAt?.slice(0, 10) ?? '',
    displayOrder: roadmap.displayOrder,
  };
}

function toRoadmapInitialFormValues(roadmap: AdminLearningRoadmapListItem): RoadmapFormValues {
  return {
    title: roadmap.title,
    category: roadmap.category,
    description: '',
    status: roadmap.status,
    targetDate: roadmap.targetDate?.slice(0, 10) ?? '',
    completedAt: roadmap.completedAt?.slice(0, 10) ?? '',
    displayOrder: roadmap.displayOrder,
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

function getNextRoadmapDisplayOrder(roadmaps: AdminLearningRoadmapListItem[]) {
  if (roadmaps.length === 0) {
    return 0;
  }

  return Math.max(...roadmaps.map((roadmap) => roadmap.displayOrder)) + 1;
}

function roadmapStatusTone(status: RoadmapStatus) {
  if (status === 'Completed') {
    return 'online';
  }

  if (status === 'InProgress') {
    return 'warning';
  }

  if (status === 'Paused') {
    return 'danger';
  }

  return 'neutral';
}

export function AdminLearningRoadmapsPage() {
  const [editingRoadmapId, setEditingRoadmapId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const roadmapsQuery = useAdminLearningRoadmaps();
  const selectedRoadmapQuery = useAdminLearningRoadmap(editingRoadmapId);
  const createRoadmap = useCreateAdminLearningRoadmap();
  const updateRoadmap = useUpdateAdminLearningRoadmap();
  const deleteRoadmap = useDeleteAdminLearningRoadmap();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoadmapFormValues>({
    resolver: zodResolver(roadmapFormSchema),
    defaultValues: defaultRoadmapFormValues,
  });

  const sortedRoadmaps = useMemo(() => {
    return [...(roadmapsQuery.data ?? [])].sort((first, second) => {
      if (first.displayOrder !== second.displayOrder) {
        return first.displayOrder - second.displayOrder;
      }

      return first.title.localeCompare(second.title, 'tr');
    });
  }, [roadmapsQuery.data]);

  const nextRoadmapDisplayOrder = useMemo(() => {
    return getNextRoadmapDisplayOrder(roadmapsQuery.data ?? []);
  }, [roadmapsQuery.data]);

  useEffect(() => {
    if (!editingRoadmapId || !selectedRoadmapQuery.data) {
      return;
    }

    reset(toRoadmapFormValues(selectedRoadmapQuery.data));
  }, [editingRoadmapId, reset, selectedRoadmapQuery.data]);

  function openCreateForm() {
    setEditingRoadmapId(null);
    reset({
      ...defaultRoadmapFormValues,
      displayOrder: nextRoadmapDisplayOrder,
    });
    setIsFormOpen(true);
  }

  function openEditForm(roadmap: AdminLearningRoadmapListItem) {
    setEditingRoadmapId(roadmap.id);
    reset(toRoadmapInitialFormValues(roadmap));
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingRoadmapId(null);
    reset(defaultRoadmapFormValues);
    setIsFormOpen(false);
  }

  async function onSubmit(values: RoadmapFormValues) {
    if (editingRoadmapId) {
      await updateRoadmap.mutateAsync({
        id: editingRoadmapId,
        request: toRoadmapUpdateRequest(values),
      });
    } else {
      await createRoadmap.mutateAsync(toRoadmapCreateRequest(values));
    }

    closeForm();
  }

  async function handleDelete(roadmap: AdminLearningRoadmapListItem) {
    const confirmed = window.confirm(
      `"${roadmap.title}" learning roadmap kaydını silmek istediğine emin misin?`,
    );

    if (!confirmed) {
      return;
    }

    await deleteRoadmap.mutateAsync(roadmap.id);

    if (editingRoadmapId === roadmap.id) {
      closeForm();
    }
  }

  const mutationError =
    createRoadmap.error?.message ?? updateRoadmap.error?.message ?? deleteRoadmap.error?.message;

  const isMutating =
    createRoadmap.isPending || updateRoadmap.isPending || deleteRoadmap.isPending || isSubmitting;

  const isEditingDetailLoading = editingRoadmapId !== null && selectedRoadmapQuery.isLoading;

  const completedCount = sortedRoadmaps.filter((roadmap) => roadmap.status === 'Completed').length;
  const activeCount = sortedRoadmaps.filter((roadmap) => roadmap.status === 'InProgress').length;

  return (
    <div className="space-y-6">
      <AdminWindow
        title="Learning Roadmaps"
        subtitle="CRUD /api/admin/learning-roadmaps"
        actions={
          <AdminToolbar>
            <AdminStatusBadge tone="online">protected</AdminStatusBadge>
            <AdminStatusBadge tone="neutral">{sortedRoadmaps.length} records</AdminStatusBadge>
            <AdminStatusBadge tone="warning">{activeCount} active</AdminStatusBadge>
            <AdminStatusBadge tone="online">{completedCount} completed</AdminStatusBadge>
            <AdminButton variant="primary" onClick={openCreateForm}>
              Yeni Roadmap
            </AdminButton>
          </AdminToolbar>
        }
      >
        <AdminPanel>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#17406F]">
            Learning Roadmap Tracker
          </p>
          <h1 className="mt-3 text-3xl font-black text-[#102A43]">Learning Roadmaps CRUD</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#334155]">
            Öğrenme hedefleri, kategori, durum ve hedef tarihlerini yönetir. Create modunda display
            order otomatik atanır; edit modunda sıralama ve completedAt elle düzenlenebilir.
          </p>
        </AdminPanel>
      </AdminWindow>

      {isFormOpen ? (
        <AdminWindow
          title={editingRoadmapId ? 'Edit Learning Roadmap' : 'Create Learning Roadmap'}
          subtitle={editingRoadmapId ? `Roadmap ID: ${editingRoadmapId}` : 'New roadmap record'}
          actions={
            <AdminToolbar>
              <AdminStatusBadge tone={editingRoadmapId ? 'warning' : 'online'}>
                {editingRoadmapId ? 'edit mode' : 'create mode'}
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
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Category</label>
                  <input
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    placeholder="Backend, Frontend, English..."
                    {...register('category')}
                  />
                  {errors.category ? (
                    <p className="mt-2 text-xs font-bold text-red-800">{errors.category.message}</p>
                  ) : null}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Description</label>
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
                    {roadmapStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.status ? (
                    <p className="mt-2 text-xs font-bold text-red-800">{errors.status.message}</p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">
                    Target Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('targetDate')}
                  />
                </div>

                {editingRoadmapId ? (
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

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">
                    Display Order
                  </label>
                  <input
                    type="number"
                    readOnly={editingRoadmapId === null}
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] read-only:bg-[#D1D7E0] focus:border-[#17406F]"
                    {...register('displayOrder', { valueAsNumber: true })}
                  />
                  <p className="mt-2 text-xs font-bold text-[#17406F]">
                    {editingRoadmapId === null
                      ? 'Create modunda mevcut en büyük sıranın +1 değeri otomatik atanır.'
                      : 'Edit modunda sıralamayı elle değiştirebilirsin.'}
                  </p>
                  {errors.displayOrder ? (
                    <p className="mt-2 text-xs font-bold text-red-800">
                      {errors.displayOrder.message}
                    </p>
                  ) : null}
                </div>
              </div>

              {selectedRoadmapQuery.isError ? (
                <div className="border border-red-700 bg-red-100 p-4 text-sm font-bold text-red-900">
                  {selectedRoadmapQuery.error.message}
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
                    : editingRoadmapId
                      ? 'Roadmap Güncelle'
                      : 'Roadmap Oluştur'}
                </AdminButton>

                <AdminButton onClick={closeForm}>Vazgeç</AdminButton>
              </div>
            </form>
          </AdminPanel>
        </AdminWindow>
      ) : null}

      <AdminWindow
        title="Learning Roadmap Records"
        subtitle="List / edit / delete"
        actions={
          <AdminToolbar>
            <AdminStatusBadge
              tone={roadmapsQuery.isSuccess ? 'online' : roadmapsQuery.isError ? 'danger' : 'warning'}
            >
              {roadmapsQuery.isSuccess ? 'online' : roadmapsQuery.isError ? 'error' : 'loading'}
            </AdminStatusBadge>
          </AdminToolbar>
        }
      >
        {roadmapsQuery.isLoading ? (
          <AdminPanel>
            <p className="text-sm font-bold text-[#334155]">Learning roadmap kayıtları yükleniyor...</p>
          </AdminPanel>
        ) : roadmapsQuery.isError ? (
          <AdminPanel>
            <div className="border border-red-700 bg-red-100 p-4 text-sm font-bold text-red-900">
              {roadmapsQuery.error.message}
            </div>
          </AdminPanel>
        ) : sortedRoadmaps.length === 0 ? (
          <AdminPanel>
            <p className="text-sm font-bold text-[#334155]">
              Henüz roadmap kaydı yok. “Yeni Roadmap” ile ilk kaydı oluşturabilirsin.
            </p>
          </AdminPanel>
        ) : (
          <div className="grid gap-4">
            {sortedRoadmaps.map((roadmap) => (
              <AdminPanel key={roadmap.id}>
                <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black text-[#102A43]">{roadmap.title}</h2>
                      <AdminStatusBadge tone={roadmapStatusTone(roadmap.status)}>
                        {roadmap.status}
                      </AdminStatusBadge>
                      <AdminStatusBadge tone="neutral">order {roadmap.displayOrder}</AdminStatusBadge>
                    </div>

                    <p className="mt-2 text-sm font-bold text-[#17406F]">
                      {roadmap.category} • Target: {formatDate(roadmap.targetDate)}
                    </p>

                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                      <div>
                        <dt className="font-black text-[#64748B]">Completed At</dt>
                        <dd className="mt-1 text-[#102A43]">{formatDate(roadmap.completedAt)}</dd>
                      </div>
                      <div>
                        <dt className="font-black text-[#64748B]">Created</dt>
                        <dd className="mt-1 text-[#102A43]">{formatDate(roadmap.createdAt)}</dd>
                      </div>
                      <div>
                        <dt className="font-black text-[#64748B]">Updated</dt>
                        <dd className="mt-1 text-[#102A43]">{formatDate(roadmap.updatedAt)}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="flex flex-wrap items-start gap-2 lg:flex-col">
                    <AdminButton onClick={() => openEditForm(roadmap)}>Edit</AdminButton>
                    <AdminButton
                      variant="danger"
                      disabled={deleteRoadmap.isPending}
                      onClick={() => {
                        void handleDelete(roadmap);
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
