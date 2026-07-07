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
  useAdminCvProfiles,
  useCreateAdminCvProfile,
  useDeleteAdminCvProfile,
  useUpdateAdminCvProfile,
} from '../../features/admin-cv';
import type {
  AdminCvProfile,
  AdminCvProfileCreateRequest,
  AdminCvProfileUpdateRequest,
} from '../../types/admin';

const cvProfileFormSchema = z.object({
  fullName: z.string().min(1, 'Ad soyad zorunludur.'),
  title: z.string().min(1, 'Ünvan zorunludur.'),
  summary: z.string().min(1, 'Özet zorunludur.'),
  location: z.string(),
  email: z.string().min(1, 'Email zorunludur.').email('Geçerli bir email giriniz.'),
  phone: z.string(),
  githubUrl: z.string(),
  linkedInUrl: z.string(),
  cvFileUrl: z.string(),
});

type CvProfileFormValues = z.infer<typeof cvProfileFormSchema>;

const defaultCvProfileFormValues: CvProfileFormValues = {
  fullName: '',
  title: '',
  summary: '',
  location: '',
  email: '',
  phone: '',
  githubUrl: '',
  linkedInUrl: '',
  cvFileUrl: '',
};

function nullableText(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function toCvProfileRequest(
  values: CvProfileFormValues,
): AdminCvProfileCreateRequest | AdminCvProfileUpdateRequest {
  return {
    fullName: values.fullName.trim(),
    title: values.title.trim(),
    summary: values.summary.trim(),
    location: nullableText(values.location),
    email: values.email.trim(),
    phone: nullableText(values.phone),
    githubUrl: nullableText(values.githubUrl),
    linkedInUrl: nullableText(values.linkedInUrl),
    cvFileUrl: nullableText(values.cvFileUrl),
  };
}

function toCvProfileFormValues(profile: AdminCvProfile): CvProfileFormValues {
  return {
    fullName: profile.fullName,
    title: profile.title,
    summary: profile.summary,
    location: profile.location ?? '',
    email: profile.email,
    phone: profile.phone ?? '',
    githubUrl: profile.githubUrl ?? '',
    linkedInUrl: profile.linkedInUrl ?? '',
    cvFileUrl: profile.cvFileUrl ?? '',
  };
}

function formatDate(value: string | null) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function AdminCvPage() {
  const [editingProfileId, setEditingProfileId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const cvProfilesQuery = useAdminCvProfiles();
  const createCvProfile = useCreateAdminCvProfile();
  const updateCvProfile = useUpdateAdminCvProfile();
  const deleteCvProfile = useDeleteAdminCvProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CvProfileFormValues>({
    resolver: zodResolver(cvProfileFormSchema),
    defaultValues: defaultCvProfileFormValues,
  });

  const sortedProfiles = useMemo(() => {
    return [...(cvProfilesQuery.data ?? [])].sort((first, second) => first.id - second.id);
  }, [cvProfilesQuery.data]);

  function openCreateForm() {
    setEditingProfileId(null);
    reset(defaultCvProfileFormValues);
    setIsFormOpen(true);
  }

  function openEditForm(profile: AdminCvProfile) {
    setEditingProfileId(profile.id);
    reset(toCvProfileFormValues(profile));
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingProfileId(null);
    reset(defaultCvProfileFormValues);
    setIsFormOpen(false);
  }

  async function onSubmit(values: CvProfileFormValues) {
    const request = toCvProfileRequest(values);

    if (editingProfileId) {
      await updateCvProfile.mutateAsync({
        id: editingProfileId,
        request,
      });
    } else {
      await createCvProfile.mutateAsync(request);
    }

    closeForm();
  }

  async function handleDelete(profile: AdminCvProfile) {
    const confirmed = window.confirm(
      `"${profile.fullName}" CV/Profile kaydını silmek istediğine emin misin?`,
    );

    if (!confirmed) {
      return;
    }

    await deleteCvProfile.mutateAsync(profile.id);

    if (editingProfileId === profile.id) {
      closeForm();
    }
  }

  const mutationError =
    createCvProfile.error?.message ??
    updateCvProfile.error?.message ??
    deleteCvProfile.error?.message;

  const isMutating =
    createCvProfile.isPending ||
    updateCvProfile.isPending ||
    deleteCvProfile.isPending ||
    isSubmitting;

  return (
    <div className="space-y-6">
      <AdminWindow
        title="CV/Profile Record"
        subtitle="CRUD /api/admin/cv-profiles"
        actions={
          <AdminToolbar>
            <AdminStatusBadge tone="online">protected</AdminStatusBadge>
            <AdminStatusBadge tone="neutral">{sortedProfiles.length} records</AdminStatusBadge>
            <AdminButton variant="primary" onClick={openCreateForm}>
              Yeni CV/Profile
            </AdminButton>
          </AdminToolbar>
        }
      >
        <AdminPanel>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#17406F]">
            Public Identity Source
          </p>
          <h1 className="mt-3 text-3xl font-black text-[#102A43]">CV/Profile CRUD</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#334155]">
            Public hero, contact ve CV alanlarını besleyen profil kaydını yönetir. Backend
            contract dışında profil resmi gibi ek alanlar uydurulmadı; statik görsel yönetimi ayrı
            asset akışında kalır.
          </p>
        </AdminPanel>
      </AdminWindow>

      {isFormOpen ? (
        <AdminWindow
          title={editingProfileId ? 'Edit CV/Profile' : 'Create CV/Profile'}
          subtitle={editingProfileId ? `Profile ID: ${editingProfileId}` : 'New profile record'}
          actions={
            <AdminToolbar>
              <AdminStatusBadge tone={editingProfileId ? 'warning' : 'online'}>
                {editingProfileId ? 'edit mode' : 'create mode'}
              </AdminStatusBadge>
              <AdminButton onClick={closeForm}>Vazgeç</AdminButton>
            </AdminToolbar>
          }
        >
          <AdminPanel>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Ad Soyad</label>
                  <input
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('fullName')}
                  />
                  {errors.fullName ? (
                    <p className="mt-2 text-xs font-bold text-red-800">{errors.fullName.message}</p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Ünvan</label>
                  <input
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('title')}
                  />
                  {errors.title ? (
                    <p className="mt-2 text-xs font-bold text-red-800">{errors.title.message}</p>
                  ) : null}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Özet</label>
                <textarea
                  rows={6}
                  className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                  {...register('summary')}
                />
                {errors.summary ? (
                  <p className="mt-2 text-xs font-bold text-red-800">{errors.summary.message}</p>
                ) : null}
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Email</label>
                  <input
                    type="email"
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('email')}
                  />
                  {errors.email ? (
                    <p className="mt-2 text-xs font-bold text-red-800">{errors.email.message}</p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Telefon</label>
                  <input
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('phone')}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Lokasyon</label>
                  <input
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('location')}
                  />
                </div>
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
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">LinkedIn URL</label>
                  <input
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('linkedInUrl')}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">CV File URL</label>
                  <input
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    placeholder="/files/cv/deniz-celik-cv.pdf"
                    {...register('cvFileUrl')}
                  />
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
                    : editingProfileId
                      ? 'CV/Profile Güncelle'
                      : 'CV/Profile Oluştur'}
                </AdminButton>

                <AdminButton onClick={closeForm}>Vazgeç</AdminButton>
              </div>
            </form>
          </AdminPanel>
        </AdminWindow>
      ) : null}

      <AdminWindow
        title="CV/Profile Records"
        subtitle="List / edit / delete"
        actions={
          <AdminToolbar>
            <AdminStatusBadge
              tone={cvProfilesQuery.isSuccess ? 'online' : cvProfilesQuery.isError ? 'danger' : 'warning'}
            >
              {cvProfilesQuery.isSuccess ? 'online' : cvProfilesQuery.isError ? 'error' : 'loading'}
            </AdminStatusBadge>
          </AdminToolbar>
        }
      >
        {cvProfilesQuery.isLoading ? (
          <AdminPanel>
            <p className="text-sm font-bold text-[#334155]">CV/Profile kayıtları yükleniyor...</p>
          </AdminPanel>
        ) : cvProfilesQuery.isError ? (
          <AdminPanel>
            <div className="border border-red-700 bg-red-100 p-4 text-sm font-bold text-red-900">
              {cvProfilesQuery.error.message}
            </div>
          </AdminPanel>
        ) : sortedProfiles.length === 0 ? (
          <AdminPanel>
            <p className="text-sm font-bold text-[#334155]">
              Henüz CV/Profile kaydı yok. “Yeni CV/Profile” ile ilk kaydı oluşturabilirsin.
            </p>
          </AdminPanel>
        ) : (
          <div className="grid gap-4">
            {sortedProfiles.map((profile) => (
              <AdminPanel key={profile.id}>
                <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black text-[#102A43]">{profile.fullName}</h2>
                      <AdminStatusBadge tone="online">profile</AdminStatusBadge>
                    </div>

                    <p className="mt-2 text-sm font-bold text-[#17406F]">{profile.title}</p>
                    <p className="mt-3 max-w-4xl text-sm leading-7 text-[#334155]">
                      {profile.summary}
                    </p>

                    <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2 xl:grid-cols-3">
                      <div>
                        <dt className="font-black text-[#64748B]">Email</dt>
                        <dd className="mt-1 break-words text-[#102A43]">{profile.email}</dd>
                      </div>
                      <div>
                        <dt className="font-black text-[#64748B]">Telefon</dt>
                        <dd className="mt-1 text-[#102A43]">{profile.phone ?? '-'}</dd>
                      </div>
                      <div>
                        <dt className="font-black text-[#64748B]">Lokasyon</dt>
                        <dd className="mt-1 text-[#102A43]">{profile.location ?? '-'}</dd>
                      </div>
                      <div>
                        <dt className="font-black text-[#64748B]">GitHub</dt>
                        <dd className="mt-1 break-words text-[#102A43]">{profile.githubUrl ?? '-'}</dd>
                      </div>
                      <div>
                        <dt className="font-black text-[#64748B]">LinkedIn</dt>
                        <dd className="mt-1 break-words text-[#102A43]">{profile.linkedInUrl ?? '-'}</dd>
                      </div>
                      <div>
                        <dt className="font-black text-[#64748B]">CV</dt>
                        <dd className="mt-1 break-words text-[#102A43]">{profile.cvFileUrl ?? '-'}</dd>
                      </div>
                    </dl>

                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#64748B]">
                      Updated: {formatDate(profile.updatedAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-start gap-2 lg:flex-col">
                    <AdminButton onClick={() => openEditForm(profile)}>Edit</AdminButton>
                    <AdminButton
                      variant="danger"
                      disabled={deleteCvProfile.isPending}
                      onClick={() => {
                        void handleDelete(profile);
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
