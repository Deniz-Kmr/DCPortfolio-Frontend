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
  useAdminCertificates,
  useCreateAdminCertificate,
  useDeleteAdminCertificate,
  useUpdateAdminCertificate,
} from '../../features/admin-certificates';
import type {
  AdminCertificateCreateRequest,
  AdminCertificateListItem,
  AdminCertificateUpdateRequest,
} from '../../types/admin';

const certificateFormSchema = z.object({
  title: z.string().min(1, 'Sertifika başlığı zorunludur.'),
  institution: z.string().min(1, 'Kurum zorunludur.'),
  description: z.string().min(1, 'Açıklama zorunludur.'),
  issueDate: z.string().min(1, 'Veriliş tarihi zorunludur.'),
  credentialUrl: z.string(),
  fileUrl: z.string(),
  isPublished: z.boolean(),
  displayOrder: z.number().int('Sıralama tam sayı olmalıdır.').min(0, 'Sıralama 0 veya üstü olmalıdır.'),
});

type CertificateFormValues = z.infer<typeof certificateFormSchema>;

const defaultCertificateFormValues: CertificateFormValues = {
  title: '',
  institution: '',
  description: '',
  issueDate: '',
  credentialUrl: '',
  fileUrl: '',
  isPublished: true,
  displayOrder: 0,
};

function nullableText(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function toCertificateRequest(
  values: CertificateFormValues,
): AdminCertificateCreateRequest | AdminCertificateUpdateRequest {
  return {
    title: values.title.trim(),
    institution: values.institution.trim(),
    description: values.description.trim(),
    issueDate: values.issueDate,
    credentialUrl: nullableText(values.credentialUrl),
    fileUrl: nullableText(values.fileUrl),
    isPublished: values.isPublished,
    displayOrder: values.displayOrder,
  };
}

function toCertificateFormValues(certificate: AdminCertificateListItem): CertificateFormValues {
  return {
    title: certificate.title,
    institution: certificate.institution,
    description: certificate.description,
    issueDate: certificate.issueDate?.slice(0, 10) ?? '',
    credentialUrl: certificate.credentialUrl ?? '',
    fileUrl: certificate.fileUrl ?? '',
    isPublished: certificate.isPublished,
    displayOrder: certificate.displayOrder,
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

function getNextCertificateDisplayOrder(certificates: AdminCertificateListItem[]) {
  if (certificates.length === 0) {
    return 0;
  }

  return Math.max(...certificates.map((certificate) => certificate.displayOrder)) + 1;
}

function certificateStatus(certificate: AdminCertificateListItem) {
  return certificate.isPublished ? (
    <AdminStatusBadge tone="online">published</AdminStatusBadge>
  ) : (
    <AdminStatusBadge tone="neutral">draft</AdminStatusBadge>
  );
}

export function AdminCertificatesPage() {
  const [editingCertificateId, setEditingCertificateId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const certificatesQuery = useAdminCertificates();
  const createCertificate = useCreateAdminCertificate();
  const updateCertificate = useUpdateAdminCertificate();
  const deleteCertificate = useDeleteAdminCertificate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateFormSchema),
    defaultValues: defaultCertificateFormValues,
  });

  const sortedCertificates = useMemo(() => {
    return [...(certificatesQuery.data ?? [])].sort((first, second) => {
      if (first.displayOrder !== second.displayOrder) {
        return first.displayOrder - second.displayOrder;
      }

      return first.title.localeCompare(second.title, 'tr');
    });
  }, [certificatesQuery.data]);

  const nextCertificateDisplayOrder = useMemo(() => {
    return getNextCertificateDisplayOrder(certificatesQuery.data ?? []);
  }, [certificatesQuery.data]);

  function openCreateForm() {
    setEditingCertificateId(null);
    reset({
      ...defaultCertificateFormValues,
      displayOrder: nextCertificateDisplayOrder,
    });
    setIsFormOpen(true);
  }

  function openEditForm(certificate: AdminCertificateListItem) {
    setEditingCertificateId(certificate.id);
    reset(toCertificateFormValues(certificate));
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingCertificateId(null);
    reset(defaultCertificateFormValues);
    setIsFormOpen(false);
  }

  async function onSubmit(values: CertificateFormValues) {
    const request = toCertificateRequest(values);

    if (editingCertificateId) {
      await updateCertificate.mutateAsync({
        id: editingCertificateId,
        request,
      });
    } else {
      await createCertificate.mutateAsync(request);
    }

    closeForm();
  }

  async function handleDelete(certificate: AdminCertificateListItem) {
    const confirmed = window.confirm(
      `"${certificate.title}" sertifikasını silmek istediğine emin misin?`,
    );

    if (!confirmed) {
      return;
    }

    await deleteCertificate.mutateAsync(certificate.id);

    if (editingCertificateId === certificate.id) {
      closeForm();
    }
  }

  const mutationError =
    createCertificate.error?.message ??
    updateCertificate.error?.message ??
    deleteCertificate.error?.message;

  const isMutating =
    createCertificate.isPending ||
    updateCertificate.isPending ||
    deleteCertificate.isPending ||
    isSubmitting;

  return (
    <div className="space-y-6">
      <AdminWindow
        title="Certificate Records"
        subtitle="CRUD /api/admin/certificates"
        actions={
          <AdminToolbar>
            <AdminStatusBadge tone="online">protected</AdminStatusBadge>
            <AdminStatusBadge tone="neutral">{sortedCertificates.length} records</AdminStatusBadge>
            <AdminButton variant="primary" onClick={openCreateForm}>
              Yeni Sertifika
            </AdminButton>
          </AdminToolbar>
        }
      >
        <AdminPanel>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#17406F]">
            Public Certificate Source
          </p>
          <h1 className="mt-3 text-3xl font-black text-[#102A43]">Certificates CRUD</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#334155]">
            Public sertifika alanında yayınlanacak kayıtları yönetir. Create modunda display order
            otomatik atanır; edit modunda elle düzenlenebilir.
          </p>
        </AdminPanel>
      </AdminWindow>

      {isFormOpen ? (
        <AdminWindow
          title={editingCertificateId ? 'Edit Certificate' : 'Create Certificate'}
          subtitle={editingCertificateId ? `Certificate ID: ${editingCertificateId}` : 'New certificate record'}
          actions={
            <AdminToolbar>
              <AdminStatusBadge tone={editingCertificateId ? 'warning' : 'online'}>
                {editingCertificateId ? 'edit mode' : 'create mode'}
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
                    Sertifika Başlığı
                  </label>
                  <input
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('title')}
                  />
                  {errors.title ? (
                    <p className="mt-2 text-xs font-bold text-red-800">{errors.title.message}</p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Kurum</label>
                  <input
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('institution')}
                  />
                  {errors.institution ? (
                    <p className="mt-2 text-xs font-bold text-red-800">
                      {errors.institution.message}
                    </p>
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
                  <p className="mt-2 text-xs font-bold text-red-800">
                    {errors.description.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">
                    Veriliş Tarihi
                  </label>
                  <input
                    type="date"
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('issueDate')}
                  />
                  {errors.issueDate ? (
                    <p className="mt-2 text-xs font-bold text-red-800">
                      {errors.issueDate.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">
                    Display Order
                  </label>
                  <input
                    type="number"
                    readOnly={editingCertificateId === null}
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] read-only:bg-[#D1D7E0] focus:border-[#17406F]"
                    {...register('displayOrder', { valueAsNumber: true })}
                  />
                  <p className="mt-2 text-xs font-bold text-[#17406F]">
                    {editingCertificateId === null
                      ? 'Create modunda mevcut en büyük sıranın +1 değeri otomatik atanır.'
                      : 'Edit modunda sıralamayı elle değiştirebilirsin.'}
                  </p>
                  {errors.displayOrder ? (
                    <p className="mt-2 text-xs font-bold text-red-800">
                      {errors.displayOrder.message}
                    </p>
                  ) : null}
                </div>

                <label className="flex items-center gap-3 self-start border border-[#9AA4B2] bg-[#E9EDF4] p-3 text-sm font-bold text-[#1F2937] shadow-[inset_1px_1px_0_#ffffff] lg:mt-7">
                  <input type="checkbox" {...register('isPublished')} />
                  Published
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">
                    Credential URL
                  </label>
                  <input
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    placeholder="https://..."
                    {...register('credentialUrl')}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">
                    File URL
                  </label>
                  <input
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    placeholder="/images/certificates/example.png"
                    {...register('fileUrl')}
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
                    : editingCertificateId
                      ? 'Sertifikayı Güncelle'
                      : 'Sertifikayı Oluştur'}
                </AdminButton>

                <AdminButton onClick={closeForm}>Vazgeç</AdminButton>
              </div>
            </form>
          </AdminPanel>
        </AdminWindow>
      ) : null}

      <AdminWindow
        title="Certificate List"
        subtitle="List / edit / delete"
        actions={
          <AdminToolbar>
            <AdminStatusBadge
              tone={certificatesQuery.isSuccess ? 'online' : certificatesQuery.isError ? 'danger' : 'warning'}
            >
              {certificatesQuery.isSuccess ? 'online' : certificatesQuery.isError ? 'error' : 'loading'}
            </AdminStatusBadge>
          </AdminToolbar>
        }
      >
        {certificatesQuery.isLoading ? (
          <AdminPanel>
            <p className="text-sm font-bold text-[#334155]">Sertifikalar yükleniyor...</p>
          </AdminPanel>
        ) : certificatesQuery.isError ? (
          <AdminPanel>
            <div className="border border-red-700 bg-red-100 p-4 text-sm font-bold text-red-900">
              {certificatesQuery.error.message}
            </div>
          </AdminPanel>
        ) : sortedCertificates.length === 0 ? (
          <AdminPanel>
            <p className="text-sm font-bold text-[#334155]">
              Henüz sertifika kaydı yok. “Yeni Sertifika” ile ilk kaydı oluşturabilirsin.
            </p>
          </AdminPanel>
        ) : (
          <div className="grid gap-4">
            {sortedCertificates.map((certificate) => (
              <AdminPanel key={certificate.id}>
                <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black text-[#102A43]">{certificate.title}</h2>
                      {certificateStatus(certificate)}
                    </div>

                    <p className="mt-2 text-sm font-bold text-[#17406F]">
                      {certificate.institution} • {formatDate(certificate.issueDate)}
                    </p>

                    <p className="mt-3 max-w-4xl text-sm leading-7 text-[#334155]">
                      {certificate.description}
                    </p>

                    <dl className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                      <div>
                        <dt className="font-black text-[#64748B]">Credential</dt>
                        <dd className="mt-1 break-words text-[#102A43]">
                          {certificate.credentialUrl ?? '-'}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-black text-[#64748B]">File</dt>
                        <dd className="mt-1 break-words text-[#102A43]">
                          {certificate.fileUrl ?? '-'}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-black text-[#64748B]">Order</dt>
                        <dd className="mt-1 text-[#102A43]">{certificate.displayOrder}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="flex flex-wrap items-start gap-2 lg:flex-col">
                    <AdminButton onClick={() => openEditForm(certificate)}>Edit</AdminButton>
                    <AdminButton
                      variant="danger"
                      disabled={deleteCertificate.isPending}
                      onClick={() => {
                        void handleDelete(certificate);
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
