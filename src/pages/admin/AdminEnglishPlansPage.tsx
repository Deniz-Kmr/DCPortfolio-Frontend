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
  useAdminEnglishPlan,
  useAdminEnglishPlans,
  useCreateAdminEnglishPlan,
  useDeleteAdminEnglishPlan,
  useUpdateAdminEnglishPlan,
} from '../../features/admin-english-plans';
import type {
  AdminEnglishPlanCreateRequest,
  AdminEnglishPlanDetail,
  AdminEnglishPlanListItem,
  AdminEnglishPlanUpdateRequest,
} from '../../types/admin';

const englishPlanFormSchema = z.object({
  title: z.string().min(1, 'Plan başlığı zorunludur.'),
  description: z.string(),
  level: z.string().min(1, 'Seviye zorunludur.'),
  focusArea: z.string(),
  dailyGoal: z.string(),
  weeklyGoal: z.string(),
  startDate: z.string().min(1, 'Başlangıç tarihi zorunludur.'),
  targetDate: z.string(),
  isActive: z.boolean(),
  notes: z.string(),
});

type EnglishPlanFormValues = z.infer<typeof englishPlanFormSchema>;

function getTodayInputDate() {
  return new Date().toISOString().slice(0, 10);
}

const defaultEnglishPlanFormValues: EnglishPlanFormValues = {
  title: '',
  description: '',
  level: 'B1',
  focusArea: '',
  dailyGoal: '',
  weeklyGoal: '',
  startDate: getTodayInputDate(),
  targetDate: '',
  isActive: true,
  notes: '',
};

const levelSuggestions = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

function nullableText(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function toEnglishPlanRequest(
  values: EnglishPlanFormValues,
): AdminEnglishPlanCreateRequest | AdminEnglishPlanUpdateRequest {
  return {
    title: values.title.trim(),
    description: nullableText(values.description),
    level: values.level.trim(),
    focusArea: nullableText(values.focusArea),
    dailyGoal: nullableText(values.dailyGoal),
    weeklyGoal: nullableText(values.weeklyGoal),
    startDate: values.startDate,
    targetDate: nullableText(values.targetDate),
    isActive: values.isActive,
    notes: nullableText(values.notes),
  };
}

function toEnglishPlanFormValues(plan: AdminEnglishPlanDetail): EnglishPlanFormValues {
  return {
    title: plan.title,
    description: plan.description ?? '',
    level: plan.level,
    focusArea: plan.focusArea ?? '',
    dailyGoal: plan.dailyGoal ?? '',
    weeklyGoal: plan.weeklyGoal ?? '',
    startDate: plan.startDate.slice(0, 10),
    targetDate: plan.targetDate?.slice(0, 10) ?? '',
    isActive: plan.isActive,
    notes: plan.notes ?? '',
  };
}

function toEnglishPlanInitialFormValues(plan: AdminEnglishPlanListItem): EnglishPlanFormValues {
  return {
    title: plan.title,
    description: '',
    level: plan.level,
    focusArea: plan.focusArea ?? '',
    dailyGoal: '',
    weeklyGoal: '',
    startDate: plan.startDate.slice(0, 10),
    targetDate: plan.targetDate?.slice(0, 10) ?? '',
    isActive: plan.isActive,
    notes: '',
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

function englishPlanStatus(plan: AdminEnglishPlanListItem) {
  return plan.isActive ? (
    <AdminStatusBadge tone="online">active</AdminStatusBadge>
  ) : (
    <AdminStatusBadge tone="neutral">passive</AdminStatusBadge>
  );
}

export function AdminEnglishPlansPage() {
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const englishPlansQuery = useAdminEnglishPlans();
  const selectedPlanQuery = useAdminEnglishPlan(editingPlanId);
  const createEnglishPlan = useCreateAdminEnglishPlan();
  const updateEnglishPlan = useUpdateAdminEnglishPlan();
  const deleteEnglishPlan = useDeleteAdminEnglishPlan();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnglishPlanFormValues>({
    resolver: zodResolver(englishPlanFormSchema),
    defaultValues: defaultEnglishPlanFormValues,
  });

  const sortedPlans = useMemo(() => {
    return [...(englishPlansQuery.data ?? [])].sort((first, second) => {
      if (first.isActive !== second.isActive) {
        return first.isActive ? -1 : 1;
      }

      return new Date(second.startDate).getTime() - new Date(first.startDate).getTime();
    });
  }, [englishPlansQuery.data]);

  useEffect(() => {
    if (!editingPlanId || !selectedPlanQuery.data) {
      return;
    }

    reset(toEnglishPlanFormValues(selectedPlanQuery.data));
  }, [editingPlanId, reset, selectedPlanQuery.data]);

  function openCreateForm() {
    setEditingPlanId(null);
    reset({
      ...defaultEnglishPlanFormValues,
      startDate: getTodayInputDate(),
    });
    setIsFormOpen(true);
  }

  function openEditForm(plan: AdminEnglishPlanListItem) {
    setEditingPlanId(plan.id);
    reset(toEnglishPlanInitialFormValues(plan));
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingPlanId(null);
    reset({
      ...defaultEnglishPlanFormValues,
      startDate: getTodayInputDate(),
    });
    setIsFormOpen(false);
  }

  async function onSubmit(values: EnglishPlanFormValues) {
    const request = toEnglishPlanRequest(values);

    if (editingPlanId) {
      await updateEnglishPlan.mutateAsync({
        id: editingPlanId,
        request,
      });
    } else {
      await createEnglishPlan.mutateAsync(request);
    }

    closeForm();
  }

  async function handleDelete(plan: AdminEnglishPlanListItem) {
    const confirmed = window.confirm(`"${plan.title}" English plan kaydını silmek istediğine emin misin?`);

    if (!confirmed) {
      return;
    }

    await deleteEnglishPlan.mutateAsync(plan.id);

    if (editingPlanId === plan.id) {
      closeForm();
    }
  }

  const mutationError =
    createEnglishPlan.error?.message ??
    updateEnglishPlan.error?.message ??
    deleteEnglishPlan.error?.message;

  const isMutating =
    createEnglishPlan.isPending ||
    updateEnglishPlan.isPending ||
    deleteEnglishPlan.isPending ||
    isSubmitting;

  const isEditingDetailLoading = editingPlanId !== null && selectedPlanQuery.isLoading;

  return (
    <div className="space-y-6">
      <AdminWindow
        title="English Plans"
        subtitle="CRUD /api/admin/english-plans"
        actions={
          <AdminToolbar>
            <AdminStatusBadge tone="online">protected</AdminStatusBadge>
            <AdminStatusBadge tone="neutral">{sortedPlans.length} records</AdminStatusBadge>
            <AdminStatusBadge tone="online">
              {sortedPlans.filter((plan) => plan.isActive).length} active
            </AdminStatusBadge>
            <AdminButton variant="primary" onClick={openCreateForm}>
              Yeni English Plan
            </AdminButton>
          </AdminToolbar>
        }
      >
        <AdminPanel>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#17406F]">
            Language Learning Tracker
          </p>
          <h1 className="mt-3 text-3xl font-black text-[#102A43]">English Plans CRUD</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#334155]">
            İngilizce çalışma planlarını, seviye bilgisini, hedefleri ve notları yönetir. Level
            backend tarafında string olduğu için UI öneri listesi sunar ama contract dışı enum
            zorlamaz.
          </p>
        </AdminPanel>
      </AdminWindow>

      {isFormOpen ? (
        <AdminWindow
          title={editingPlanId ? 'Edit English Plan' : 'Create English Plan'}
          subtitle={editingPlanId ? `English Plan ID: ${editingPlanId}` : 'New English plan record'}
          actions={
            <AdminToolbar>
              <AdminStatusBadge tone={editingPlanId ? 'warning' : 'online'}>
                {editingPlanId ? 'edit mode' : 'create mode'}
              </AdminStatusBadge>
              {isEditingDetailLoading ? <AdminStatusBadge tone="warning">detail loading</AdminStatusBadge> : null}
              <AdminButton onClick={closeForm}>Vazgeç</AdminButton>
            </AdminToolbar>
          }
        >
          <AdminPanel>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
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
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Level</label>
                  <input
                    list="english-level-suggestions"
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('level')}
                  />
                  <datalist id="english-level-suggestions">
                    {levelSuggestions.map((level) => (
                      <option key={level} value={level} />
                    ))}
                  </datalist>
                  {errors.level ? (
                    <p className="mt-2 text-xs font-bold text-red-800">{errors.level.message}</p>
                  ) : null}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Description</label>
                <textarea
                  rows={4}
                  className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                  {...register('description')}
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">
                    Focus Area
                  </label>
                  <input
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    placeholder="Speaking, Listening, Grammar..."
                    {...register('focusArea')}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('startDate')}
                  />
                  {errors.startDate ? (
                    <p className="mt-2 text-xs font-bold text-red-800">{errors.startDate.message}</p>
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
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">
                    Daily Goal
                  </label>
                  <textarea
                    rows={3}
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('dailyGoal')}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">
                    Weekly Goal
                  </label>
                  <textarea
                    rows={3}
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('weeklyGoal')}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Notes</label>
                <textarea
                  rows={4}
                  className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                  {...register('notes')}
                />
              </div>

              <label className="flex items-center gap-3 border border-[#9AA4B2] bg-[#E9EDF4] p-3 text-sm font-bold text-[#1F2937] shadow-[inset_1px_1px_0_#ffffff]">
                <input type="checkbox" {...register('isActive')} />
                Active
              </label>

              {selectedPlanQuery.isError ? (
                <div className="border border-red-700 bg-red-100 p-4 text-sm font-bold text-red-900">
                  {selectedPlanQuery.error.message}
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
                    : editingPlanId
                      ? 'English Plan Güncelle'
                      : 'English Plan Oluştur'}
                </AdminButton>

                <AdminButton onClick={closeForm}>Vazgeç</AdminButton>
              </div>
            </form>
          </AdminPanel>
        </AdminWindow>
      ) : null}

      <AdminWindow
        title="English Plan Records"
        subtitle="List / edit / delete"
        actions={
          <AdminToolbar>
            <AdminStatusBadge
              tone={englishPlansQuery.isSuccess ? 'online' : englishPlansQuery.isError ? 'danger' : 'warning'}
            >
              {englishPlansQuery.isSuccess ? 'online' : englishPlansQuery.isError ? 'error' : 'loading'}
            </AdminStatusBadge>
          </AdminToolbar>
        }
      >
        {englishPlansQuery.isLoading ? (
          <AdminPanel>
            <p className="text-sm font-bold text-[#334155]">English plan kayıtları yükleniyor...</p>
          </AdminPanel>
        ) : englishPlansQuery.isError ? (
          <AdminPanel>
            <div className="border border-red-700 bg-red-100 p-4 text-sm font-bold text-red-900">
              {englishPlansQuery.error.message}
            </div>
          </AdminPanel>
        ) : sortedPlans.length === 0 ? (
          <AdminPanel>
            <p className="text-sm font-bold text-[#334155]">
              Henüz English plan kaydı yok. “Yeni English Plan” ile ilk kaydı oluşturabilirsin.
            </p>
          </AdminPanel>
        ) : (
          <div className="grid gap-4">
            {sortedPlans.map((plan) => (
              <AdminPanel key={plan.id}>
                <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black text-[#102A43]">{plan.title}</h2>
                      {englishPlanStatus(plan)}
                      <AdminStatusBadge tone="neutral">{plan.level}</AdminStatusBadge>
                    </div>

                    <p className="mt-2 text-sm font-bold text-[#17406F]">
                      {formatDate(plan.startDate)} → {formatDate(plan.targetDate)}
                      {plan.focusArea ? ` • ${plan.focusArea}` : ''}
                    </p>

                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#64748B]">
                      Updated: {formatDate(plan.updatedAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-start gap-2 lg:flex-col">
                    <AdminButton onClick={() => openEditForm(plan)}>Edit</AdminButton>
                    <AdminButton
                      variant="danger"
                      disabled={deleteEnglishPlan.isPending}
                      onClick={() => {
                        void handleDelete(plan);
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
