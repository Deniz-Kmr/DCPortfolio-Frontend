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
  useAdminProject,
  useAdminProjects,
  useCreateAdminProject,
  useDeleteAdminProject,
  useUpdateAdminProject,
} from '../../features/admin-projects';
import { useAdminTechnologies } from '../../features/admin-technologies';
import type {
  AdminProjectCreateRequest,
  AdminProjectDetail,
  AdminProjectListItem,
  AdminProjectUpdateRequest,
} from '../../types/admin';

const projectFormSchema = z.object({
  title: z.string().min(1, 'Başlık zorunludur.'),
  slug: z.string().min(1, 'Slug zorunludur.'),
  shortDescription: z.string().min(1, 'Kısa açıklama zorunludur.'),
  description: z.string().min(1, 'Açıklama zorunludur.'),
  githubUrl: z.string(),
  demoUrl: z.string(),
  imageUrl: z.string(),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  displayOrder: z.number().int('Sıralama tam sayı olmalıdır.').min(0, 'Sıralama 0 veya üstü olmalıdır.'),
  technologyIds: z.array(z.number()),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

const defaultProjectFormValues: ProjectFormValues = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  githubUrl: '',
  demoUrl: '',
  imageUrl: '',
  isFeatured: false,
  isPublished: true,
  displayOrder: 0,
  technologyIds: [],
};

function nullableText(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function toProjectRequest(values: ProjectFormValues): AdminProjectCreateRequest | AdminProjectUpdateRequest {
  return {
    title: values.title.trim(),
    slug: values.slug.trim(),
    shortDescription: values.shortDescription.trim(),
    description: values.description.trim(),
    githubUrl: nullableText(values.githubUrl),
    demoUrl: nullableText(values.demoUrl),
    imageUrl: nullableText(values.imageUrl),
    isFeatured: values.isFeatured,
    isPublished: values.isPublished,
    displayOrder: values.displayOrder,
    technologyIds: values.technologyIds,
  };
}

function toProjectFormValues(project: AdminProjectDetail): ProjectFormValues {
  return {
    title: project.title,
    slug: project.slug,
    shortDescription: project.shortDescription,
    description: project.description,
    githubUrl: project.githubUrl ?? '',
    demoUrl: project.demoUrl ?? '',
    imageUrl: project.imageUrl ?? '',
    isFeatured: project.isFeatured,
    isPublished: project.isPublished,
    displayOrder: project.displayOrder,
    technologyIds: project.technologies.map((technology) => technology.id),
  };
}

function projectStatus(project: AdminProjectListItem) {
  if (!project.isPublished) {
    return <AdminStatusBadge tone="neutral">draft</AdminStatusBadge>;
  }

  if (project.isFeatured) {
    return <AdminStatusBadge tone="online">featured</AdminStatusBadge>;
  }

  return <AdminStatusBadge tone="online">published</AdminStatusBadge>;
}

export function AdminProjectsPage() {
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const projectsQuery = useAdminProjects();
  const technologiesQuery = useAdminTechnologies();
  const selectedProjectQuery = useAdminProject(editingProjectId);

  const createProject = useCreateAdminProject();
  const updateProject = useUpdateAdminProject();
  const deleteProject = useDeleteAdminProject();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: defaultProjectFormValues,
  });

  const selectedTechnologyIds = watch('technologyIds');

  const sortedProjects = useMemo(() => {
    return [...(projectsQuery.data ?? [])].sort((first, second) => {
      if (first.displayOrder !== second.displayOrder) {
        return first.displayOrder - second.displayOrder;
      }

      return first.title.localeCompare(second.title, 'tr');
    });
  }, [projectsQuery.data]);

  const sortedTechnologies = useMemo(() => {
    return [...(technologiesQuery.data ?? [])].sort((first, second) => {
      if (first.displayOrder !== second.displayOrder) {
        return first.displayOrder - second.displayOrder;
      }

      return first.name.localeCompare(second.name, 'tr');
    });
  }, [technologiesQuery.data]);

  useEffect(() => {
    if (selectedProjectQuery.data && editingProjectId) {
      reset(toProjectFormValues(selectedProjectQuery.data));
      setIsFormOpen(true);
    }
  }, [editingProjectId, reset, selectedProjectQuery.data]);

  function openCreateForm() {
    setEditingProjectId(null);
    reset(defaultProjectFormValues);
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingProjectId(null);
    reset(defaultProjectFormValues);
    setIsFormOpen(false);
  }

  function toggleTechnology(technologyId: number) {
    const nextTechnologyIds = selectedTechnologyIds.includes(technologyId)
      ? selectedTechnologyIds.filter((id) => id !== technologyId)
      : [...selectedTechnologyIds, technologyId];

    setValue('technologyIds', nextTechnologyIds, { shouldDirty: true, shouldValidate: true });
  }

  async function onSubmit(values: ProjectFormValues) {
    const request = toProjectRequest(values);

    if (editingProjectId) {
      await updateProject.mutateAsync({
        id: editingProjectId,
        request,
      });
    } else {
      await createProject.mutateAsync(request);
    }

    closeForm();
  }

  async function handleDelete(project: AdminProjectListItem) {
    const confirmed = window.confirm(
      `"${project.title}" projesini silmek istediğine emin misin? Bu işlem backend soft delete kuralına göre çalışır.`,
    );

    if (!confirmed) {
      return;
    }

    await deleteProject.mutateAsync(project.id);

    if (editingProjectId === project.id) {
      closeForm();
    }
  }

  const mutationError =
    createProject.error?.message ?? updateProject.error?.message ?? deleteProject.error?.message;

  const isMutating =
    createProject.isPending || updateProject.isPending || deleteProject.isPending || isSubmitting;

  return (
    <div className="space-y-6">
      <AdminWindow
        title="Projects Control"
        subtitle="CRUD /api/admin/projects"
        actions={
          <AdminToolbar>
            <AdminStatusBadge tone="online">protected</AdminStatusBadge>
            <AdminStatusBadge tone="neutral">{sortedProjects.length} records</AdminStatusBadge>
            <AdminButton variant="primary" onClick={openCreateForm}>
              Yeni Proje
            </AdminButton>
          </AdminToolbar>
        }
      >
        <AdminPanel>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#17406F]">
            Project Registry
          </p>
          <h1 className="mt-3 text-3xl font-black text-[#102A43]">Projects CRUD</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#334155]">
            Public portfolio projelerini backend admin endpointleri üzerinden yönetir. Project form
            backend DTO contract alanlarına sadıktır; fake data veya contract dışı alan kullanılmaz.
          </p>
        </AdminPanel>
      </AdminWindow>

      {isFormOpen ? (
        <AdminWindow
          title={editingProjectId ? 'Edit Project' : 'Create Project'}
          subtitle={editingProjectId ? `Project ID: ${editingProjectId}` : 'New project record'}
          actions={
            <AdminToolbar>
              <AdminStatusBadge tone={editingProjectId ? 'warning' : 'online'}>
                {editingProjectId ? 'edit mode' : 'create mode'}
              </AdminStatusBadge>
              <AdminButton onClick={closeForm}>Vazgeç</AdminButton>
            </AdminToolbar>
          }
        >
          <AdminPanel>
            {selectedProjectQuery.isLoading && editingProjectId ? (
              <p className="text-sm font-bold text-[#334155]">Proje detayı yükleniyor...</p>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Başlık</label>
                    <input
                      className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                      {...register('title')}
                    />
                    {errors.title ? <p className="mt-2 text-xs font-bold text-red-800">{errors.title.message}</p> : null}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Slug</label>
                    <input
                      className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                      {...register('slug')}
                    />
                    {errors.slug ? <p className="mt-2 text-xs font-bold text-red-800">{errors.slug.message}</p> : null}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Kısa Açıklama</label>
                  <textarea
                    rows={3}
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('shortDescription')}
                  />
                  {errors.shortDescription ? (
                    <p className="mt-2 text-xs font-bold text-red-800">{errors.shortDescription.message}</p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Açıklama</label>
                  <textarea
                    rows={6}
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('description')}
                  />
                  {errors.description ? (
                    <p className="mt-2 text-xs font-bold text-red-800">{errors.description.message}</p>
                  ) : null}
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">GitHub URL</label>
                    <input
                      className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                      {...register('githubUrl')}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Demo URL</label>
                    <input
                      className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                      {...register('demoUrl')}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Image URL</label>
                    <input
                      className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                      placeholder="/images/projects/dashboard.png"
                      {...register('imageUrl')}
                    />
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <label className="flex items-center gap-3 border border-[#9AA4B2] bg-[#E9EDF4] p-3 text-sm font-bold text-[#1F2937] shadow-[inset_1px_1px_0_#ffffff]">
                    <input type="checkbox" {...register('isFeatured')} />
                    Featured
                  </label>

                  <label className="flex items-center gap-3 border border-[#9AA4B2] bg-[#E9EDF4] p-3 text-sm font-bold text-[#1F2937] shadow-[inset_1px_1px_0_#ffffff]">
                    <input type="checkbox" {...register('isPublished')} />
                    Published
                  </label>

                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Display Order</label>
                    <input
                      type="number"
                      className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                      {...register('displayOrder', { valueAsNumber: true })}
                    />
                    {errors.displayOrder ? (
                      <p className="mt-2 text-xs font-bold text-red-800">{errors.displayOrder.message}</p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="text-sm font-bold text-[#1F2937]">Technologies</label>
                    <AdminStatusBadge tone="neutral">{selectedTechnologyIds.length} selected</AdminStatusBadge>
                  </div>

                  {technologiesQuery.isLoading ? (
                    <div className="border border-[#9AA4B2] bg-[#E9EDF4] p-4 text-sm font-bold text-[#334155]">
                      Teknolojiler yükleniyor...
                    </div>
                  ) : technologiesQuery.isError ? (
                    <div className="border border-red-700 bg-red-100 p-4 text-sm font-bold text-red-900">
                      {technologiesQuery.error.message}
                    </div>
                  ) : sortedTechnologies.length === 0 ? (
                    <div className="border border-[#9AA4B2] bg-[#E9EDF4] p-4 text-sm font-bold text-[#334155]">
                      Henüz teknoloji yok. Önce Technologies modülünden teknoloji ekleyebilirsin.
                    </div>
                  ) : (
                    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                      {sortedTechnologies.map((technology) => (
                        <label
                          key={technology.id}
                          className="flex items-center gap-3 border border-[#9AA4B2] bg-[#EEF1F5] p-3 text-sm font-bold text-[#1F2937] shadow-[inset_1px_1px_0_#ffffff]"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTechnologyIds.includes(technology.id)}
                            onChange={() => toggleTechnology(technology.id)}
                          />
                          <span className="min-w-0 truncate">{technology.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {mutationError ? (
                  <div className="border border-red-700 bg-red-100 p-4 text-sm font-bold text-red-900">
                    {mutationError}
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3 border-t border-[#B6C1D1] pt-5">
                  <AdminButton type="submit" variant="primary" disabled={isMutating}>
                    {isMutating ? 'Kaydediliyor...' : editingProjectId ? 'Projeyi Güncelle' : 'Projeyi Oluştur'}
                  </AdminButton>

                  <AdminButton onClick={closeForm}>Vazgeç</AdminButton>
                </div>
              </form>
            )}
          </AdminPanel>
        </AdminWindow>
      ) : null}

      <AdminWindow
        title="Project Records"
        subtitle="List / edit / delete"
        actions={
          <AdminToolbar>
            <AdminStatusBadge tone={projectsQuery.isSuccess ? 'online' : projectsQuery.isError ? 'danger' : 'warning'}>
              {projectsQuery.isSuccess ? 'online' : projectsQuery.isError ? 'error' : 'loading'}
            </AdminStatusBadge>
          </AdminToolbar>
        }
      >
        {projectsQuery.isLoading ? (
          <AdminPanel>
            <p className="text-sm font-bold text-[#334155]">Projeler yükleniyor...</p>
          </AdminPanel>
        ) : projectsQuery.isError ? (
          <AdminPanel>
            <div className="border border-red-700 bg-red-100 p-4 text-sm font-bold text-red-900">
              {projectsQuery.error.message}
            </div>
          </AdminPanel>
        ) : sortedProjects.length === 0 ? (
          <AdminPanel>
            <p className="text-sm font-bold text-[#334155]">
              Henüz proje kaydı yok. “Yeni Proje” butonu ile ilk kaydı oluşturabilirsin.
            </p>
          </AdminPanel>
        ) : (
          <div className="overflow-x-auto border border-[#7C8794] bg-[#EEF1F5]">
            <table className="min-w-[920px] w-full border-collapse text-left text-sm">
              <thead className="bg-[#D7E9FF] text-[#082F5F]">
                <tr>
                  <th className="border border-[#9AA4B2] px-3 py-2">Title</th>
                  <th className="border border-[#9AA4B2] px-3 py-2">Slug</th>
                  <th className="border border-[#9AA4B2] px-3 py-2">Status</th>
                  <th className="border border-[#9AA4B2] px-3 py-2">Tech</th>
                  <th className="border border-[#9AA4B2] px-3 py-2">Order</th>
                  <th className="border border-[#9AA4B2] px-3 py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedProjects.map((project) => (
                  <tr key={project.id} className="bg-[#F8FAFC]">
                    <td className="border border-[#B6C1D1] px-3 py-3 align-top">
                      <p className="font-black text-[#102A43]">{project.title}</p>
                      <p className="mt-1 max-w-md text-xs leading-5 text-[#64748B]">
                        {project.shortDescription}
                      </p>
                    </td>
                    <td className="border border-[#B6C1D1] px-3 py-3 align-top font-mono text-xs">
                      {project.slug}
                    </td>
                    <td className="border border-[#B6C1D1] px-3 py-3 align-top">
                      {projectStatus(project)}
                    </td>
                    <td className="border border-[#B6C1D1] px-3 py-3 align-top">
                      {project.technologies.length > 0 ? (
                        <div className="flex max-w-xs flex-wrap gap-1">
                          {project.technologies.map((technology) => (
                            <span
                              key={technology.id}
                              className="border border-[#9AA4B2] bg-white px-2 py-1 text-xs font-bold text-[#334155]"
                            >
                              {technology.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-[#64748B]">No tech</span>
                      )}
                    </td>
                    <td className="border border-[#B6C1D1] px-3 py-3 align-top font-black">
                      {project.displayOrder}
                    </td>
                    <td className="border border-[#B6C1D1] px-3 py-3 align-top">
                      <div className="flex flex-wrap gap-2">
                        <AdminButton
                          onClick={() => {
                            setEditingProjectId(project.id);
                            setIsFormOpen(true);
                          }}
                        >
                          Edit
                        </AdminButton>
                        <AdminButton
                          variant="danger"
                          disabled={deleteProject.isPending}
                          onClick={() => {
                            void handleDelete(project);
                          }}
                        >
                          Delete
                        </AdminButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminWindow>
    </div>
  );
}
