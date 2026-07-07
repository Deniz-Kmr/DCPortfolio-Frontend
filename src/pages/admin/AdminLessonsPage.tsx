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
  useAdminLesson,
  useAdminLessons,
  useCreateAdminLesson,
  useDeleteAdminLesson,
  useUpdateAdminLesson,
} from '../../features/admin-lessons';
import type {
  AdminLessonCreateRequest,
  AdminLessonDetail,
  AdminLessonListItem,
  AdminLessonUpdateRequest,
} from '../../types/admin';

const lessonFormSchema = z.object({
  title: z.string().min(1, 'Lesson başlığı zorunludur.'),
  topic: z.string().min(1, 'Topic zorunludur.'),
  notes: z.string(),
  resourceUrl: z.string(),
  studyDate: z.string().min(1, 'Çalışma tarihi zorunludur.'),
  durationMinutes: z.number().int('Süre tam sayı olmalıdır.').min(0, 'Süre 0 veya üstü olmalıdır.'),
  isCompleted: z.boolean(),
});

type LessonFormValues = z.infer<typeof lessonFormSchema>;

function getTodayInputDate() {
  return new Date().toISOString().slice(0, 10);
}

const defaultLessonFormValues: LessonFormValues = {
  title: '',
  topic: '',
  notes: '',
  resourceUrl: '',
  studyDate: getTodayInputDate(),
  durationMinutes: 60,
  isCompleted: false,
};

function nullableText(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function toLessonRequest(
  values: LessonFormValues,
): AdminLessonCreateRequest | AdminLessonUpdateRequest {
  return {
    title: values.title.trim(),
    topic: values.topic.trim(),
    notes: nullableText(values.notes),
    resourceUrl: nullableText(values.resourceUrl),
    studyDate: values.studyDate,
    durationMinutes: values.durationMinutes,
    isCompleted: values.isCompleted,
  };
}

function toLessonFormValues(lesson: AdminLessonDetail): LessonFormValues {
  return {
    title: lesson.title,
    topic: lesson.topic,
    notes: lesson.notes ?? '',
    resourceUrl: lesson.resourceUrl ?? '',
    studyDate: lesson.studyDate.slice(0, 10),
    durationMinutes: lesson.durationMinutes,
    isCompleted: lesson.isCompleted,
  };
}

function toLessonInitialFormValues(lesson: AdminLessonListItem): LessonFormValues {
  return {
    title: lesson.title,
    topic: lesson.topic,
    notes: '',
    resourceUrl: '',
    studyDate: lesson.studyDate.slice(0, 10),
    durationMinutes: lesson.durationMinutes,
    isCompleted: lesson.isCompleted,
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

function lessonStatus(lesson: AdminLessonListItem) {
  return lesson.isCompleted ? (
    <AdminStatusBadge tone="online">completed</AdminStatusBadge>
  ) : (
    <AdminStatusBadge tone="warning">in progress</AdminStatusBadge>
  );
}

function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} dk`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} sa`;
  }

  return `${hours} sa ${remainingMinutes} dk`;
}

export function AdminLessonsPage() {
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const lessonsQuery = useAdminLessons();
  const selectedLessonQuery = useAdminLesson(editingLessonId);
  const createLesson = useCreateAdminLesson();
  const updateLesson = useUpdateAdminLesson();
  const deleteLesson = useDeleteAdminLesson();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: defaultLessonFormValues,
  });

  const sortedLessons = useMemo(() => {
    return [...(lessonsQuery.data ?? [])].sort((first, second) => {
      if (first.isCompleted !== second.isCompleted) {
        return first.isCompleted ? 1 : -1;
      }

      return new Date(second.studyDate).getTime() - new Date(first.studyDate).getTime();
    });
  }, [lessonsQuery.data]);

  useEffect(() => {
    if (!editingLessonId || !selectedLessonQuery.data) {
      return;
    }

    reset(toLessonFormValues(selectedLessonQuery.data));
  }, [editingLessonId, reset, selectedLessonQuery.data]);

  function openCreateForm() {
    setEditingLessonId(null);
    reset({
      ...defaultLessonFormValues,
      studyDate: getTodayInputDate(),
    });
    setIsFormOpen(true);
  }

  function openEditForm(lesson: AdminLessonListItem) {
    setEditingLessonId(lesson.id);
    reset(toLessonInitialFormValues(lesson));
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingLessonId(null);
    reset({
      ...defaultLessonFormValues,
      studyDate: getTodayInputDate(),
    });
    setIsFormOpen(false);
  }

  async function onSubmit(values: LessonFormValues) {
    const request = toLessonRequest(values);

    if (editingLessonId) {
      await updateLesson.mutateAsync({
        id: editingLessonId,
        request,
      });
    } else {
      await createLesson.mutateAsync(request);
    }

    closeForm();
  }

  async function handleDelete(lesson: AdminLessonListItem) {
    const confirmed = window.confirm(`"${lesson.title}" lesson kaydını silmek istediğine emin misin?`);

    if (!confirmed) {
      return;
    }

    await deleteLesson.mutateAsync(lesson.id);

    if (editingLessonId === lesson.id) {
      closeForm();
    }
  }

  const mutationError =
    createLesson.error?.message ?? updateLesson.error?.message ?? deleteLesson.error?.message;

  const isMutating =
    createLesson.isPending || updateLesson.isPending || deleteLesson.isPending || isSubmitting;

  const isEditingDetailLoading = editingLessonId !== null && selectedLessonQuery.isLoading;

  const totalDuration = sortedLessons.reduce((total, lesson) => total + lesson.durationMinutes, 0);
  const completedCount = sortedLessons.filter((lesson) => lesson.isCompleted).length;

  return (
    <div className="space-y-6">
      <AdminWindow
        title="Lesson Tracker"
        subtitle="CRUD /api/admin/lessons"
        actions={
          <AdminToolbar>
            <AdminStatusBadge tone="online">protected</AdminStatusBadge>
            <AdminStatusBadge tone="neutral">{sortedLessons.length} records</AdminStatusBadge>
            <AdminStatusBadge tone="online">{completedCount} completed</AdminStatusBadge>
            <AdminStatusBadge tone="warning">{formatDuration(totalDuration)}</AdminStatusBadge>
            <AdminButton variant="primary" onClick={openCreateForm}>
              Yeni Lesson
            </AdminButton>
          </AdminToolbar>
        }
      >
        <AdminPanel>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#17406F]">
            Learning Session Tracker
          </p>
          <h1 className="mt-3 text-3xl font-black text-[#102A43]">Lessons CRUD</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#334155]">
            Çalışma oturumları, konu başlıkları, süre ve kaynak notlarını yönetir. Edit modunda
            notes ve resourceUrl detail endpoint üzerinden yüklenir.
          </p>
        </AdminPanel>
      </AdminWindow>

      {isFormOpen ? (
        <AdminWindow
          title={editingLessonId ? 'Edit Lesson' : 'Create Lesson'}
          subtitle={editingLessonId ? `Lesson ID: ${editingLessonId}` : 'New lesson record'}
          actions={
            <AdminToolbar>
              <AdminStatusBadge tone={editingLessonId ? 'warning' : 'online'}>
                {editingLessonId ? 'edit mode' : 'create mode'}
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
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Topic</label>
                  <input
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    placeholder="React, English, .NET..."
                    {...register('topic')}
                  />
                  {errors.topic ? (
                    <p className="mt-2 text-xs font-bold text-red-800">{errors.topic.message}</p>
                  ) : null}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">Notes</label>
                <textarea
                  rows={6}
                  className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                  {...register('notes')}
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">
                    Study Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('studyDate')}
                  />
                  {errors.studyDate ? (
                    <p className="mt-2 text-xs font-bold text-red-800">{errors.studyDate.message}</p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">
                    Duration Minutes
                  </label>
                  <input
                    type="number"
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    {...register('durationMinutes', { valueAsNumber: true })}
                  />
                  {errors.durationMinutes ? (
                    <p className="mt-2 text-xs font-bold text-red-800">
                      {errors.durationMinutes.message}
                    </p>
                  ) : null}
                </div>

                <div className="lg:col-span-2">
                  <label className="mb-1.5 block text-sm font-bold text-[#1F2937]">
                    Resource URL
                  </label>
                  <input
                    className="w-full border border-[#7C8794] bg-white px-3 py-2 text-sm text-[#111827] outline-none shadow-[inset_1px_1px_0_#D1D5DB] focus:border-[#17406F]"
                    placeholder="https://..."
                    {...register('resourceUrl')}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 border border-[#9AA4B2] bg-[#E9EDF4] p-3 text-sm font-bold text-[#1F2937] shadow-[inset_1px_1px_0_#ffffff]">
                <input type="checkbox" {...register('isCompleted')} />
                Completed
              </label>

              {selectedLessonQuery.isError ? (
                <div className="border border-red-700 bg-red-100 p-4 text-sm font-bold text-red-900">
                  {selectedLessonQuery.error.message}
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
                    : editingLessonId
                      ? 'Lesson Güncelle'
                      : 'Lesson Oluştur'}
                </AdminButton>

                <AdminButton onClick={closeForm}>Vazgeç</AdminButton>
              </div>
            </form>
          </AdminPanel>
        </AdminWindow>
      ) : null}

      <AdminWindow
        title="Lesson Records"
        subtitle="List / edit / delete"
        actions={
          <AdminToolbar>
            <AdminStatusBadge
              tone={lessonsQuery.isSuccess ? 'online' : lessonsQuery.isError ? 'danger' : 'warning'}
            >
              {lessonsQuery.isSuccess ? 'online' : lessonsQuery.isError ? 'error' : 'loading'}
            </AdminStatusBadge>
          </AdminToolbar>
        }
      >
        {lessonsQuery.isLoading ? (
          <AdminPanel>
            <p className="text-sm font-bold text-[#334155]">Lesson kayıtları yükleniyor...</p>
          </AdminPanel>
        ) : lessonsQuery.isError ? (
          <AdminPanel>
            <div className="border border-red-700 bg-red-100 p-4 text-sm font-bold text-red-900">
              {lessonsQuery.error.message}
            </div>
          </AdminPanel>
        ) : sortedLessons.length === 0 ? (
          <AdminPanel>
            <p className="text-sm font-bold text-[#334155]">
              Henüz lesson kaydı yok. “Yeni Lesson” ile ilk kaydı oluşturabilirsin.
            </p>
          </AdminPanel>
        ) : (
          <div className="grid gap-4">
            {sortedLessons.map((lesson) => (
              <AdminPanel key={lesson.id}>
                <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black text-[#102A43]">{lesson.title}</h2>
                      {lessonStatus(lesson)}
                    </div>

                    <p className="mt-2 text-sm font-bold text-[#17406F]">
                      {lesson.topic} • {formatDate(lesson.studyDate)}
                    </p>

                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                      <div>
                        <dt className="font-black text-[#64748B]">Duration</dt>
                        <dd className="mt-1 text-[#102A43]">
                          {formatDuration(lesson.durationMinutes)}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-black text-[#64748B]">Created</dt>
                        <dd className="mt-1 text-[#102A43]">{formatDate(lesson.createdAt)}</dd>
                      </div>
                      <div>
                        <dt className="font-black text-[#64748B]">Updated</dt>
                        <dd className="mt-1 text-[#102A43]">{formatDate(lesson.updatedAt)}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="flex flex-wrap items-start gap-2 lg:flex-col">
                    <AdminButton onClick={() => openEditForm(lesson)}>Edit</AdminButton>
                    <AdminButton
                      variant="danger"
                      disabled={deleteLesson.isPending}
                      onClick={() => {
                        void handleDelete(lesson);
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
