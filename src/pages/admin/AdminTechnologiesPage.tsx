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
  useAdminTechnologies,
  useCreateAdminTechnology,
  useDeleteAdminTechnology,
  useUpdateAdminTechnology,
} from '../../features/admin-technologies';
import { buildBackendFileUrl } from '../../utils/backendUrl';
import type {
  AdminTechnologyCreateRequest,
  AdminTechnologyListItem,
  AdminTechnologyUpdateRequest,
} from '../../types/admin';

const technologyFormSchema = z.object({
  name: z.string().min(1, 'Teknoloji adı zorunludur.'),
  iconUrl: z.string(),
  category: z.string(),
  skillLevel: z.string(),
  displayOrder: z.number().int('Sıralama tam sayı olmalıdır.').min(0, 'Sıralama 0 veya üstü olmalıdır.'),
  isActive: z.boolean(),
});

type TechnologyFormValues = z.infer<typeof technologyFormSchema>;

const defaultTechnologyFormValues: TechnologyFormValues = {
  name: '',
  iconUrl: '',
  category: '',
  skillLevel: '',
  displayOrder: 0,
  isActive: true,
};

const skillLevelOptions = [
  { label: 'Seçilmedi', value: '' },
  { label: 'Beginner', value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Advanced', value: 'Advanced' },
  { label: 'Expert', value: 'Expert' },
];

const iconOptions = [
  {
    "label": "azure",
    "value": "/images/technologies/azure.svg"
  },
  {
    "label": "csharp",
    "value": "/images/technologies/csharp.svg"
  },
  {
    "label": "dart",
    "value": "/images/technologies/dart.svg"
  },
  {
    "label": "docker",
    "value": "/images/technologies/docker.svg"
  },
  {
    "label": "dotnet",
    "value": "/images/technologies/dotnet.svg"
  },
  {
    "label": "dotnetcore",
    "value": "/images/technologies/dotnetcore.svg"
  },
  {
    "label": "firebase",
    "value": "/images/technologies/firebase.svg"
  },
  {
    "label": "flutter",
    "value": "/images/technologies/flutter.svg"
  },
  {
    "label": "git",
    "value": "/images/technologies/git.svg"
  },
  {
    "label": "github",
    "value": "/images/technologies/github.svg"
  },
  {
    "label": "javascript",
    "value": "/images/technologies/javascript.svg"
  },
  {
    "label": "postgresql",
    "value": "/images/technologies/postgresql.svg"
  },
  {
    "label": "postman",
    "value": "/images/technologies/postman.svg"
  },
  {
    "label": "rider",
    "value": "/images/technologies/rider.svg"
  },
  {
    "label": "sql",
    "value": "/images/technologies/sql.svg"
  },
  {
    "label": "supabase",
    "value": "/images/technologies/supabase.svg"
  },
  {
    "label": "vscode",
    "value": "/images/technologies/vscode.svg"
  }
] as const;

function nullableText(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function resolveIconUrl(url: string | null | undefined) {
  if (!url) {
    return null;
  }

  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }

  return buildBackendFileUrl(url);
}

function toTechnologyRequest(
  values: TechnologyFormValues,
): AdminTechnologyCreateRequest | AdminTechnologyUpdateRequest {
  return {
    name: values.name.trim(),
    iconUrl: nullableText(values.iconUrl),
    category: nullableText(values.category),
    skillLevel: nullableText(values.skillLevel),
    displayOrder: values.displayOrder,
    isActive: values.isActive,
  };
}

function toTechnologyFormValues(technology: AdminTechnologyListItem): TechnologyFormValues {
  return {
    name: technology.name,
    iconUrl: technology.iconUrl ?? '',
    category: technology.category ?? '',
    skillLevel: technology.skillLevel ?? '',
    displayOrder: technology.displayOrder,
    isActive: technology.isActive,
  };
}

function technologyStatus(technology: AdminTechnologyListItem) {
  return technology.isActive ? (
    <AdminStatusBadge tone="online">active</AdminStatusBadge>
  ) : (
    <AdminStatusBadge tone="neutral">passive</AdminStatusBadge>
  );
}

function getNextTechnologyDisplayOrder(items: AdminTechnologyListItem[]) {
  if (items.length === 0) {
    return 0;
  }

  return Math.max(...items.map((item) => item.displayOrder)) + 1;
}

export function AdminTechnologiesPage() {
  const [editingTechnologyId, setEditingTechnologyId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const technologiesQuery = useAdminTechnologies();
  const createTechnology = useCreateAdminTechnology();
  const updateTechnology = useUpdateAdminTechnology();
  const deleteTechnology = useDeleteAdminTechnology();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TechnologyFormValues>({
    resolver: zodResolver(technologyFormSchema),
    defaultValues: defaultTechnologyFormValues,
  });

  const selectedIconUrl = watch('iconUrl');
  const iconPreviewUrl = resolveIconUrl(selectedIconUrl);

  const sortedTechnologies = useMemo(() => {
    return [...(technologiesQuery.data ?? [])].sort((first, second) => {
      if (first.displayOrder !== second.displayOrder) {
        return first.displayOrder - second.displayOrder;
      }

      return first.name.localeCompare(second.name, 'tr');
    });
  }, [technologiesQuery.data]);

  const nextTechnologyDisplayOrder = useMemo(() => {
    return getNextTechnologyDisplayOrder(technologiesQuery.data ?? []);
  }, [technologiesQuery.data]);

  function openCreateForm() {
    setEditingTechnologyId(null);
    reset({
      ...defaultTechnologyFormValues,
      displayOrder: nextTechnologyDisplayOrder,
    });
    setIsFormOpen(true);
  }

  function openEditForm(technology: AdminTechnologyListItem) {
    setEditingTechnologyId(technology.id);
    reset(toTechnologyFormValues(technology));
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingTechnologyId(null);
    reset(defaultTechnologyFormValues);
    setIsFormOpen(false);
  }

  function selectIcon(iconUrl: string) {
    setValue('iconUrl', iconUrl, { shouldDirty: true, shouldValidate: true });
  }

  async function onSubmit(values: TechnologyFormValues) {
    const request = toTechnologyRequest(values);

    if (editingTechnologyId) {
      await updateTechnology.mutateAsync({
        id: editingTechnologyId,
        request,
      });
    } else {
      await createTechnology.mutateAsync(request);
    }

    closeForm();
  }

  async function handleDelete(technology: AdminTechnologyListItem) {
    const confirmed = window.confirm(
      `"${technology.name}" teknolojisini silmek istediğine emin misin? Backend ilişki kuralları uygulanır.`,
    );

    if (!confirmed) {
      return;
    }

    await deleteTechnology.mutateAsync(technology.id);

    if (editingTechnologyId === technology.id) {
      closeForm();
    }
  }

  const mutationError =
    createTechnology.error?.message ??
    updateTechnology.error?.message ??
    deleteTechnology.error?.message;

  const isMutating =
    createTechnology.isPending ||
    updateTechnology.isPending ||
    deleteTechnology.isPending ||
    isSubmitting;

  return (
    <div className="space-y-6">
      <AdminWindow
        title="Technologies Registry"
        subtitle="CRUD /api/admin/technologies"
        actions={
          <AdminToolbar>
            <AdminStatusBadge tone="online">protected</AdminStatusBadge>
            <AdminStatusBadge tone="neutral">{sortedTechnologies.length} records</AdminStatusBadge>
            <AdminButton variant="primary" onClick={openCreateForm}>
              Yeni Teknoloji
            </AdminButton>
          </AdminToolbar>
        }
      >
        <AdminPanel>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#17406F]">
            Technology Registry
          </p>
          <h1 className="mt-3 text-3xl font-black text-[#102A43]">Technologies CRUD</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#334155]">
            Public portfolio ve project stack alanlarında kullanılan teknolojileri yönetir.
            Form alanları backend DTO contract yapısına bağlıdır.
          </p>
        </AdminPanel>
      </AdminWindow>

      {isFormOpen ? (
        <AdminWindow
          title={editingTechnologyId ? 'Edit Technology' : 'Create Technology'}
          subtitle={editingTechnologyId ? `Technology ID: ${editingTechnologyId}` : 'New technology record'}
          actions={
            <AdminToolbar>
              <AdminStatusBadge tone={editingTechnologyId ? 'warning' : 'online'}>
                {editingTechnologyId ? 'edit mode' : 'create mode'}
              </AdminStatusBadge>
              <AdminButton onClick={closeForm}>Vazgeç</AdminButton>
            </AdminToolbar>
          }
        >
          <AdminPanel>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 lg:grid-cols-[1fr_180px]">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">
                      Teknoloji Adı
                    </label>
                    <input
                      className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                      placeholder="C#"
                      {...register('name')}
                    />
                    {errors.name ? (
                      <p className="mt-2 text-xs font-bold text-red-800">{errors.name.message}</p>
                    ) : null}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">
                      Category
                    </label>
                    <input
                      className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                      placeholder="Backend"
                      {...register('category')}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">
                      Skill Level
                    </label>
                    <select
                      className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                      {...register('skillLevel')}
                    >
                      {skillLevelOptions.map((option) => (
                        <option key={option.value || 'empty'} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">
                      Display Order
                    </label>
                    <input
                    type="number"
                    readOnly={editingTechnologyId === null}
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] read-only:bg-[#D1D7E0] focus:border-[#17406F]"
                    {...register('displayOrder', { valueAsNumber: true })}
                  />
                  <p className="mt-2 text-xs font-bold text-[#17406F]">
                    {editingTechnologyId === null
                      ? 'Create modunda mevcut en büyük sıranın +1 değeri otomatik atanır.'
                      : 'Edit modunda sıralamayı elle değiştirebilirsin.'}
                  </p>
                  {errors.displayOrder ? (
                    <p className="mt-2 text-xs font-bold text-red-800">
                      {errors.displayOrder.message}
                    </p>
                  ) : null}
                  </div>

                  <div className="lg:col-span-2">
                    <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">
                      Icon URL
                    </label>
                    <input
                      className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                      placeholder="/images/technologies/csharp.svg"
                      {...register('iconUrl')}
                    />

                    <div className="mt-3 border border-[#9AA4B2] bg-[#E9EDF4] p-3 shadow-[inset_1px_1px_0_#ffffff]">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#17406F]">
                          Existing Icons
                        </p>
                        <AdminStatusBadge tone="neutral">{iconOptions.length} icons</AdminStatusBadge>
                      </div>

                      <div className="grid max-h-56 gap-2 overflow-y-auto sm:grid-cols-2 xl:grid-cols-3">
                        {iconOptions.map((icon) => {
                          const isSelected = selectedIconUrl === icon.value;

                          return (
                            <button
                              key={icon.value}
                              type="button"
                              onClick={() => selectIcon(icon.value)}
                              className={[
                                'flex items-center gap-2 border px-2 py-2 text-left text-xs font-bold shadow-[inset_1px_1px_0_#ffffff] transition',
                                isSelected
                                  ? 'border-[#17406F] bg-[#D7E9FF] text-[#082F5F]'
                                  : 'border-[#9AA4B2] bg-white text-[#334155] hover:bg-[#F8FAFC]',
                              ].join(' ')}
                            >
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-[#9AA4B2] bg-white">
                                <img
                                  src={resolveIconUrl(icon.value) ?? undefined}
                                  alt=""
                                  className="h-5 w-5 object-contain"
                                  loading="lazy"
                                />
                              </span>
                              <span className="min-w-0 truncate">{icon.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 border border-[#9AA4B2] bg-[#E9EDF4] p-3 text-sm font-bold text-[#1F2937] shadow-[inset_1px_1px_0_#ffffff]">
                    <input type="checkbox" {...register('isActive')} />
                    Active
                  </label>
                </div>

                <div className="border border-[#9AA4B2] bg-[#E9EDF4] p-4 shadow-[inset_1px_1px_0_#ffffff]">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#17406F]">
                    Icon Preview
                  </p>

                  <div className="mt-4 flex h-28 items-center justify-center border border-[#7C8794] bg-white shadow-[inset_1px_1px_0_#D1D5DB]">
                    {iconPreviewUrl ? (
                      <img
                        src={iconPreviewUrl}
                        alt=""
                        className="h-16 w-16 object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-xs font-bold text-[#64748B]">No icon</span>
                    )}
                  </div>

                  <p className="mt-3 text-xs leading-5 text-[#64748B]">
                    Relative path backend static asset helper ile çözülür.
                  </p>
                </div>
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
                    : editingTechnologyId
                      ? 'Teknolojiyi Güncelle'
                      : 'Teknolojiyi Oluştur'}
                </AdminButton>

                <AdminButton onClick={closeForm}>Vazgeç</AdminButton>
              </div>
            </form>
          </AdminPanel>
        </AdminWindow>
      ) : null}

      <AdminWindow
        title="Technology Records"
        subtitle="List / edit / delete"
        actions={
          <AdminToolbar>
            <AdminStatusBadge
              tone={technologiesQuery.isSuccess ? 'online' : technologiesQuery.isError ? 'danger' : 'warning'}
            >
              {technologiesQuery.isSuccess ? 'online' : technologiesQuery.isError ? 'error' : 'loading'}
            </AdminStatusBadge>
          </AdminToolbar>
        }
      >
        {technologiesQuery.isLoading ? (
          <AdminPanel>
            <p className="text-sm font-bold text-[#334155]">Teknolojiler yükleniyor...</p>
          </AdminPanel>
        ) : technologiesQuery.isError ? (
          <AdminPanel>
            <div className="border border-red-700 bg-red-100 p-4 text-sm font-bold text-red-900">
              {technologiesQuery.error.message}
            </div>
          </AdminPanel>
        ) : sortedTechnologies.length === 0 ? (
          <AdminPanel>
            <p className="text-sm font-bold text-[#334155]">
              Henüz teknoloji kaydı yok. “Yeni Teknoloji” butonu ile ilk kaydı oluşturabilirsin.
            </p>
          </AdminPanel>
        ) : (
          <div className="overflow-x-auto border border-[#7C8794] bg-[#EEF1F5]">
            <table className="min-w-[860px] w-full border-collapse text-left text-sm">
              <thead className="bg-[#D7E9FF] text-[#082F5F]">
                <tr>
                  <th className="border border-[#9AA4B2] px-3 py-2">Icon</th>
                  <th className="border border-[#9AA4B2] px-3 py-2">Name</th>
                  <th className="border border-[#9AA4B2] px-3 py-2">Category</th>
                  <th className="border border-[#9AA4B2] px-3 py-2">Skill</th>
                  <th className="border border-[#9AA4B2] px-3 py-2">Status</th>
                  <th className="border border-[#9AA4B2] px-3 py-2">Order</th>
                  <th className="border border-[#9AA4B2] px-3 py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedTechnologies.map((technology) => {
                  const iconUrl = resolveIconUrl(technology.iconUrl);

                  return (
                    <tr key={technology.id} className="bg-[#F8FAFC]">
                      <td className="border border-[#B6C1D1] px-3 py-3 align-top">
                        <div className="flex h-11 w-11 items-center justify-center border border-[#9AA4B2] bg-white shadow-[inset_1px_1px_0_#D1D5DB]">
                          {iconUrl ? (
                            <img
                              src={iconUrl}
                              alt=""
                              className="h-8 w-8 object-contain"
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-xs font-black text-[#64748B]">
                              {technology.name.slice(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="border border-[#B6C1D1] px-3 py-3 align-top">
                        <p className="font-black text-[#102A43]">{technology.name}</p>
                        {technology.iconUrl ? (
                          <p className="mt-1 max-w-xs truncate font-mono text-xs text-[#64748B]">
                            {technology.iconUrl}
                          </p>
                        ) : null}
                      </td>

                      <td className="border border-[#B6C1D1] px-3 py-3 align-top">
                        {technology.category ?? '-'}
                      </td>

                      <td className="border border-[#B6C1D1] px-3 py-3 align-top">
                        {technology.skillLevel ?? '-'}
                      </td>

                      <td className="border border-[#B6C1D1] px-3 py-3 align-top">
                        {technologyStatus(technology)}
                      </td>

                      <td className="border border-[#B6C1D1] px-3 py-3 align-top font-black">
                        {technology.displayOrder}
                      </td>

                      <td className="border border-[#B6C1D1] px-3 py-3 align-top">
                        <div className="flex flex-wrap gap-2">
                          <AdminButton onClick={() => openEditForm(technology)}>Edit</AdminButton>
                          <AdminButton
                            variant="danger"
                            disabled={deleteTechnology.isPending}
                            onClick={() => {
                              void handleDelete(technology);
                            }}
                          >
                            Delete
                          </AdminButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminWindow>
    </div>
  );
}
