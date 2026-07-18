import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
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
  useAdminExperiences,
  useCreateAdminExperience,
  useDeleteAdminExperience,
  useUpdateAdminExperience,
} from '../../features/admin-experiences';
import type {
  AdminExperienceCreateRequest,
  AdminExperienceListItem,
  AdminExperienceUpdateRequest,
} from '../../types/admin';

const experienceFormSchema = z.object({
  companyName: z.string().min(1, 'Kurum/şirket adı zorunludur.'),
  position: z.string().min(1, 'Pozisyon zorunludur.'),
  description: z.string().min(1, 'Açıklama zorunludur.'),
  location: z.string(),
  startDate: z.string().min(1, 'Başlangıç tarihi zorunludur.'),
  endDate: z.string(),
  isCurrent: z.boolean(),
  isPublished: z.boolean(),
  displayOrder: z.number().int('Sıralama tam sayı olmalıdır.').min(0, 'Sıralama 0 veya üstü olmalıdır.'),
});

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

const defaultExperienceFormValues: ExperienceFormValues = {
  companyName: '',
  position: '',
  description: '',
  location: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  isPublished: true,
  displayOrder: 0,
};

function nullableText(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function nullableDate(value: string, isCurrent: boolean) {
  if (isCurrent) {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function toExperienceRequest(
  values: ExperienceFormValues,
): AdminExperienceCreateRequest | AdminExperienceUpdateRequest {
  return {
    companyName: values.companyName.trim(),
    position: values.position.trim(),
    description: values.description.trim(),
    location: nullableText(values.location),
    startDate: values.startDate,
    endDate: nullableDate(values.endDate, values.isCurrent),
    isCurrent: values.isCurrent,
    isPublished: values.isPublished,
    displayOrder: values.displayOrder,
  };
}

function toExperienceFormValues(experience: AdminExperienceListItem): ExperienceFormValues {
  return {
    companyName: experience.companyName,
    position: experience.position,
    description: experience.description,
    location: experience.location ?? '',
    startDate: experience.startDate.slice(0, 10),
    endDate: experience.endDate?.slice(0, 10) ?? '',
    isCurrent: experience.isCurrent,
    isPublished: experience.isPublished,
    displayOrder: experience.displayOrder,
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

function experienceStatus(experience: AdminExperienceListItem) {
  if (!experience.isPublished) {
    return <AdminStatusBadge tone="neutral">draft</AdminStatusBadge>;
  }

  if (experience.isCurrent) {
    return <AdminStatusBadge tone="online">current</AdminStatusBadge>;
  }

  return <AdminStatusBadge tone="online">published</AdminStatusBadge>;
}

function getNextDisplayOrder(experiences: AdminExperienceListItem[]) {
  if (experiences.length === 0) {
    return 0;
  }

  return Math.max(...experiences.map((experience) => experience.displayOrder)) + 1;
}

export function AdminExperiencesPage() {
  const [editingExperienceId, setEditingExperienceId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const experiencesQuery = useAdminExperiences();
  const createExperience = useCreateAdminExperience();
  const updateExperience = useUpdateAdminExperience();
  const deleteExperience = useDeleteAdminExperience();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: defaultExperienceFormValues,
  });

  const isCurrent = watch('isCurrent');

  const sortedExperiences = useMemo(() => {
    return [...(experiencesQuery.data ?? [])].sort((first, second) => {
      if (first.isCurrent !== second.isCurrent) {
        return first.isCurrent ? -1 : 1;
      }

      if (first.displayOrder !== second.displayOrder) {
        return first.displayOrder - second.displayOrder;
      }

      return new Date(second.startDate).getTime() - new Date(first.startDate).getTime();
    });
  }, [experiencesQuery.data]);

  const nextDisplayOrder = useMemo(() => {
    return getNextDisplayOrder(experiencesQuery.data ?? []);
  }, [experiencesQuery.data]);

  function openCreateForm() {
    setEditingExperienceId(null);
    reset({
      ...defaultExperienceFormValues,
      displayOrder: nextDisplayOrder,
    });
    setIsFormOpen(true);
  }

  function openEditForm(experience: AdminExperienceListItem) {
    setEditingExperienceId(experience.id);
    reset(toExperienceFormValues(experience));
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingExperienceId(null);
    reset(defaultExperienceFormValues);
    setIsFormOpen(false);
  }

  async function onSubmit(values: ExperienceFormValues) {
    const request = toExperienceRequest(values);

    if (editingExperienceId) {
      await updateExperience.mutateAsync({
        id: editingExperienceId,
        request,
      });
    } else {
      await createExperience.mutateAsync(request);
    }

    closeForm();
  }

  async function handleDelete(experience: AdminExperienceListItem) {
    const confirmed = window.confirm(
      `"${experience.companyName} - ${experience.position}" deneyimini silmek istediğine emin misin?`,
    );

    if (!confirmed) {
      return;
    }

    await deleteExperience.mutateAsync(experience.id);

    if (editingExperienceId === experience.id) {
      closeForm();
    }
  }

  const mutationError =
    createExperience.error?.message ??
    updateExperience.error?.message ??
    deleteExperience.error?.message;

  const isMutating =
    createExperience.isPending ||
    updateExperience.isPending ||
    deleteExperience.isPending ||
    isSubmitting;

  return (
    <div className="space-y-6">
      <AdminWindow
        title="Experience Timeline"
        subtitle="CRUD /api/admin/experiences"
        actions={
          <AdminToolbar>
            <AdminStatusBadge tone="online">protected</AdminStatusBadge>
            <AdminStatusBadge tone="neutral">{sortedExperiences.length} records</AdminStatusBadge>
            <AdminButton variant="primary" onClick={openCreateForm}>
              Yeni Deneyim
            </AdminButton>
          </AdminToolbar>
        }
      >
        <AdminPanel>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#17406F]">
            Public Timeline Source
          </p>
          <h1 className="mt-3 text-3xl font-black text-[#102A43]">Experiences CRUD</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#334155]">
            Public deneyim timeline verilerini yönetir. Önemli kural: isCurrent true ise public
            tarafta “Devam ediyor” görünür ve endDate backend’e null gönderilir.
          </p>
        </AdminPanel>
      </AdminWindow>

      {isFormOpen ? (
        <AdminWindow
          title={editingExperienceId ? 'Edit Experience' : 'Create Experience'}
          subtitle={editingExperienceId ? `Experience ID: ${editingExperienceId}` : 'New experience record'}
          actions={
            <AdminToolbar>
              <AdminStatusBadge tone={editingExperienceId ? 'warning' : 'online'}>
                {editingExperienceId ? 'edit mode' : 'create mode'}
              </AdminStatusBadge>
              <AdminButton onClick={closeForm}>Vazgeç</AdminButton>
            </AdminToolbar>
          }
        >
          <AdminPanel>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">
                    Kurum / Şirket
                  </label>
                  <input
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('companyName')}
                  />
                  {errors.companyName ? (
                    <p className="mt-2 text-xs font-bold text-red-800">{errors.companyName.message}</p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Pozisyon</label>
                  <input
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('position')}
                  />
                  {errors.position ? (
                    <p className="mt-2 text-xs font-bold text-red-800">{errors.position.message}</p>
                  ) : null}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Açıklama</label>
                <textarea
                  rows={5}
                  className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                  {...register('description')}
                />
                {errors.description ? (
                  <p className="mt-2 text-xs font-bold text-red-800">{errors.description.message}</p>
                ) : null}
              </div>

              <div className="grid gap-4 lg:grid-cols-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Lokasyon</label>
                  <input
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('location')}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">
                    Başlangıç Tarihi
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
                    Bitiş Tarihi
                  </label>
                  <input
                    type="date"
                    disabled={isCurrent}
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] disabled:bg-[#D1D7E0] focus:border-[#17406F]"
                    {...register('endDate')}
                  />
                  {isCurrent ? (
                    <p className="mt-2 text-xs font-bold text-[#17406F]">
                      Current seçili olduğu için endDate null gönderilir.
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">
                    Display Order
                  </label>
                  <input
                    type="number"
                    readOnly={!editingExperienceId}
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] read-only:bg-[#D1D7E0] focus:border-[#17406F]"
                    {...register('displayOrder', { valueAsNumber: true })}
                  />
                  <p className="mt-2 text-xs font-bold text-[#17406F]">
                    {editingExperienceId
                      ? 'Edit modunda sıralamayı elle değiştirebilirsin.'
                      : 'Create modunda mevcut en büyük sıranın +1 değeri otomatik atanır.'}
                  </p>
                  {errors.displayOrder ? (
                    <p className="mt-2 text-xs font-bold text-red-800">{errors.displayOrder.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-3 border border-[#9AA4B2] bg-[#E9EDF4] p-3 text-sm font-bold text-[#1F2937] shadow-[inset_1px_1px_0_#ffffff]">
                  <input type="checkbox" {...register('isCurrent')} />
                  Current / Devam ediyor
                </label>

                <label className="flex items-center gap-3 border border-[#9AA4B2] bg-[#E9EDF4] p-3 text-sm font-bold text-[#1F2937] shadow-[inset_1px_1px_0_#ffffff]">
                  <input type="checkbox" {...register('isPublished')} />
                  Published
                </label>
              </div>

              {mutationError ? (
                <div className="border border-red-700 bg-red-100 p-4 text-sm font-bold text-red-900">
                  {mutationError}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3 border-t border-[#B6C1D1] pt-5">
                <AdminButton type="submit" variant="primary" disabled={isMutating}>
                  {isMutating
                    ? 'Kaydediliyor...'
                    : editingExperienceId
                      ? 'Deneyimi Güncelle'
                      : 'Deneyimi Oluştur'}
                </AdminButton>

                <AdminButton onClick={closeForm}>Vazgeç</AdminButton>
              </div>
            </form>
          </AdminPanel>
        </AdminWindow>
      ) : null}

      <AdminWindow
        title="Experience Records"
        subtitle="List / edit / delete"
        actions={
          <AdminToolbar>
            <AdminStatusBadge
              tone={experiencesQuery.isSuccess ? 'online' : experiencesQuery.isError ? 'danger' : 'warning'}
            >
              {experiencesQuery.isSuccess ? 'online' : experiencesQuery.isError ? 'error' : 'loading'}
            </AdminStatusBadge>
          </AdminToolbar>
        }
      >
        {experiencesQuery.isLoading ? (
          <AdminPanel>
            <p className="text-sm font-bold text-[#334155]">Deneyimler yükleniyor...</p>
          </AdminPanel>
        ) : experiencesQuery.isError ? (
          <AdminPanel>
            <div className="border border-red-700 bg-red-100 p-4 text-sm font-bold text-red-900">
              {experiencesQuery.error.message}
            </div>
          </AdminPanel>
        ) : sortedExperiences.length === 0 ? (
          <AdminPanel>
            <p className="text-sm font-bold text-[#334155]">
              Henüz deneyim kaydı yok. “Yeni Deneyim” ile ilk kaydı oluşturabilirsin.
            </p>
          </AdminPanel>
        ) : (
          <div className="grid gap-4">
            {sortedExperiences.map((experience) => (
              <AdminPanel key={experience.id}>
                <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black text-[#102A43]">
                        {experience.position}
                      </h2>
                      {experienceStatus(experience)}
                    </div>

                    <p className="mt-2 text-sm font-bold text-[#17406F]">
                      {experience.companyName}
                      {experience.location ? ` • ${experience.location}` : ''}
                    </p>

                    <p className="mt-3 max-w-4xl text-sm leading-7 text-[#334155]">
                      {experience.description}
                    </p>

                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                      <div>
                        <dt className="font-black text-[#64748B]">Başlangıç</dt>
                        <dd className="mt-1 text-[#102A43]">{formatDate(experience.startDate)}</dd>
                      </div>
                      <div>
                        <dt className="font-black text-[#64748B]">Bitiş</dt>
                        <dd className="mt-1 text-[#102A43]">
                          {experience.isCurrent ? 'Devam ediyor' : formatDate(experience.endDate)}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-black text-[#64748B]">Order</dt>
                        <dd className="mt-1 text-[#102A43]">{experience.displayOrder}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="flex flex-wrap items-start gap-2 lg:flex-col">
                    <AdminButton onClick={() => openEditForm(experience)}>Edit</AdminButton>
                    <AdminButton
                      variant="danger"
                      disabled={deleteExperience.isPending}
                      onClick={() => {
                        void handleDelete(experience);
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
