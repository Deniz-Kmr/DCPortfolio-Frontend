import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useMemo, useState } from 'react';

import {
  AdminButton,
  AdminPanel,
  AdminStatusBadge,
  AdminToolbar,
  AdminWindow,
} from '../../components/admin/vintage';
import {
  useAdminProjects,
  useUpdateHomeProjectSelection,
} from '../../features/admin-projects';
import type { AdminProjectListItem } from '../../types/admin';

type SortableProjectRowProps = {
  project: AdminProjectListItem;
  disabled: boolean;
  onRemove: (projectId: number) => void;
};

function SortableProjectRow({
  project,
  disabled,
  onRemove,
}: SortableProjectRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: project.id,
    disabled,
  });

  const projectMark = project.title.trim().slice(0, 2).toLocaleUpperCase('tr');

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={[
        'flex items-center gap-3 border border-[#7C8794] bg-white p-3',
        'shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#C2CAD5]',
        isDragging ? 'relative z-20 opacity-70 shadow-lg' : '',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={() => onRemove(project.id)}
        disabled={disabled}
        aria-label={`${project.title} projesini ana sayfadan çıkar`}
        className="grid h-10 w-10 shrink-0 place-items-center border border-[#8B1E1E] bg-[#F8D7D7] text-xl font-black text-[#7F1D1D] transition hover:bg-[#F5C8C8] disabled:cursor-not-allowed disabled:opacity-50"
      >
        −
      </button>

      <div className="grid h-12 w-12 shrink-0 place-items-center border border-[#9AA4B2] bg-[#E9EDF4] text-xs font-black text-[#334155]">
        {projectMark}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-black text-[#172033]">
            {project.title}
          </h3>
          <AdminStatusBadge tone="online">home</AdminStatusBadge>
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#64748B]">
          {project.shortDescription}
        </p>
      </div>

      <button
        type="button"
        {...attributes}
        {...listeners}
        disabled={disabled}
        aria-label={`${project.title} projesini sırala`}
        className="cursor-grab border border-[#7C8794] bg-[#EEF1F5] px-3 py-2 text-lg font-black text-[#334155] shadow-[inset_1px_1px_0_#ffffff] transition hover:bg-white active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
      >
        ☰
      </button>
    </article>
  );
}

function arraysEqual(first: number[], second: number[]) {
  return (
    first.length === second.length &&
    first.every((projectId, index) => projectId === second[index])
  );
}

function getSavedHomeProjectIds(projects: AdminProjectListItem[]) {
  return [...projects]
    .filter((project) => project.isFeatured)
    .sort((first, second) => {
      const firstOrder = first.homeDisplayOrder ?? first.displayOrder;
      const secondOrder = second.homeDisplayOrder ?? second.displayOrder;

      if (firstOrder !== secondOrder) {
        return firstOrder - secondOrder;
      }

      return first.title.localeCompare(second.title, 'tr');
    })
    .map((project) => project.id)
    .slice(0, 3);
}

export function AdminHomeProjectsPage() {
  const projectsQuery = useAdminProjects();
  const updateSelection = useUpdateHomeProjectSelection();

  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([]);
  const [savedProjectIds, setSavedProjectIds] = useState<number[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (!projectsQuery.data || hasInitialized) {
      return;
    }

    const homeProjectIds = getSavedHomeProjectIds(projectsQuery.data);

    setSelectedProjectIds(homeProjectIds);
    setSavedProjectIds(homeProjectIds);
    setHasInitialized(true);
  }, [hasInitialized, projectsQuery.data]);

  const projectsById = useMemo(() => {
    return new Map(
      (projectsQuery.data ?? []).map((project) => [project.id, project]),
    );
  }, [projectsQuery.data]);

  const selectedProjects = useMemo(() => {
    return selectedProjectIds
      .map((projectId) => projectsById.get(projectId))
      .filter(
        (project): project is AdminProjectListItem => project !== undefined,
      );
  }, [projectsById, selectedProjectIds]);

  const availableProjects = useMemo(() => {
    const selectedIds = new Set(selectedProjectIds);

    return [...(projectsQuery.data ?? [])]
      .filter((project) => !selectedIds.has(project.id))
      .sort((first, second) => {
        if (first.displayOrder !== second.displayOrder) {
          return first.displayOrder - second.displayOrder;
        }

        return first.title.localeCompare(second.title, 'tr');
      });
  }, [projectsQuery.data, selectedProjectIds]);

  const isDirty = !arraysEqual(selectedProjectIds, savedProjectIds);
  const isSelectionFull = selectedProjectIds.length >= 3;

  function addProject(project: AdminProjectListItem) {
    setFeedbackMessage(null);

    if (!project.isPublished) {
      setFeedbackMessage('Yayınlanmamış bir proje ana sayfaya eklenemez.');
      return;
    }

    if (isSelectionFull) {
      setFeedbackMessage('Ana sayfada en fazla 3 proje gösterilebilir.');
      return;
    }

    setSelectedProjectIds((currentIds) => [...currentIds, project.id]);
  }

  function removeProject(projectId: number) {
    setFeedbackMessage(null);
    setSelectedProjectIds((currentIds) =>
      currentIds.filter((id) => id !== projectId),
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setSelectedProjectIds((currentIds) => {
      const oldIndex = currentIds.indexOf(Number(active.id));
      const newIndex = currentIds.indexOf(Number(over.id));

      if (oldIndex === -1 || newIndex === -1) {
        return currentIds;
      }

      return arrayMove(currentIds, oldIndex, newIndex);
    });

    setFeedbackMessage(null);
  }

  async function saveSelection() {
    setFeedbackMessage(null);

    try {
      const projects = await updateSelection.mutateAsync({
        projectIds: selectedProjectIds,
      });

      const savedIds = projects.map((project) => project.id);

      setSelectedProjectIds(savedIds);
      setSavedProjectIds(savedIds);
      setFeedbackMessage('Ana sayfa proje seçimi kaydedildi.');
    } catch {
      // Mutation hatası aşağıdaki hata panelinde gösteriliyor.
    }
  }

  function resetSelection() {
    setSelectedProjectIds(savedProjectIds);
    setFeedbackMessage(null);
  }

  if (projectsQuery.isLoading) {
    return (
      <AdminWindow
        title="Home Projects"
        subtitle="Ana sayfa proje seçimi yükleniyor"
      >
        <AdminPanel>
          <p className="text-sm font-bold text-[#475569]">
            Projeler yükleniyor...
          </p>
        </AdminPanel>
      </AdminWindow>
    );
  }

  if (projectsQuery.isError) {
    return (
      <AdminWindow
        title="Home Projects"
        subtitle="Ana sayfa proje seçimi"
      >
        <AdminPanel>
          <p className="text-sm font-bold text-[#991B1B]">
            {projectsQuery.error.message}
          </p>
        </AdminPanel>
      </AdminWindow>
    );
  }

  return (
    <div className="space-y-6">
      <AdminWindow
        title="Home Projects Control"
        subtitle="PUT /api/admin/projects/home-selection"
        actions={
          <AdminToolbar>
            <AdminStatusBadge tone="online">protected</AdminStatusBadge>
            <AdminStatusBadge tone={isSelectionFull ? 'warning' : 'neutral'}>
              {selectedProjectIds.length}/3 selected
            </AdminStatusBadge>
            {isDirty ? (
              <AdminStatusBadge tone="warning">
                unsaved changes
              </AdminStatusBadge>
            ) : (
              <AdminStatusBadge tone="online">saved</AdminStatusBadge>
            )}
          </AdminToolbar>
        }
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-xl font-black text-[#172033]">
              Ana Sayfa Projeleri
            </h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-[#64748B]">
              Ana sayfada gösterilecek en fazla üç projeyi seç. Seçilen
              projeleri sürükleyerek görüntülenme sırasını değiştir.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <AdminButton
              variant="neutral"
              onClick={resetSelection}
              disabled={!isDirty || updateSelection.isPending}
            >
              Değişiklikleri Geri Al
            </AdminButton>

            <AdminButton
              variant="primary"
              onClick={() => void saveSelection()}
              disabled={!isDirty || updateSelection.isPending}
            >
              {updateSelection.isPending ? 'Kaydediliyor...' : 'Kaydet'}
            </AdminButton>
          </div>
        </div>
      </AdminWindow>

      {feedbackMessage ? (
        <div
          aria-live="polite"
          className="border border-[#7C8794] bg-[#EEF1F5] px-4 py-3 text-sm font-bold text-[#334155]"
        >
          {feedbackMessage}
        </div>
      ) : null}

      {updateSelection.isError ? (
        <div
          role="alert"
          className="border border-[#8B1E1E] bg-[#F8D7D7] px-4 py-3 text-sm font-bold text-[#7F1D1D]"
        >
          {updateSelection.error.message}
        </div>
      ) : null}

      <AdminPanel>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#CBD5E1] pb-3">
          <div>
            <h2 className="text-base font-black text-[#172033]">
              Ana Sayfada Seçilenler
            </h2>
            <p className="mt-1 text-xs text-[#64748B]">
              Sağdaki tutamacı kullanarak sıralayabilirsin.
            </p>
          </div>

          <AdminStatusBadge tone={isSelectionFull ? 'warning' : 'neutral'}>
            {selectedProjectIds.length}/3
          </AdminStatusBadge>
        </div>

        {selectedProjects.length === 0 ? (
          <div className="border border-dashed border-[#9AA4B2] bg-[#F8FAFC] px-4 py-8 text-center">
            <p className="text-sm font-black text-[#475569]">
              Ana sayfa için henüz proje seçilmedi.
            </p>
            <p className="mt-1 text-xs text-[#64748B]">
              Aşağıdaki projelerden en fazla üç tanesini ekleyebilirsin.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selectedProjectIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {selectedProjects.map((project) => (
                  <SortableProjectRow
                    key={project.id}
                    project={project}
                    onRemove={removeProject}
                    disabled={updateSelection.isPending}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </AdminPanel>

      <AdminPanel>
        <div className="mb-4 border-b border-[#CBD5E1] pb-3">
          <h2 className="text-base font-black text-[#172033]">
            Projelerden Seç
          </h2>
          <p className="mt-1 text-xs text-[#64748B]">
            Yayındaki projeleri ana sayfa listesine ekleyebilirsin.
          </p>
        </div>

        {availableProjects.length === 0 ? (
          <div className="border border-dashed border-[#9AA4B2] bg-[#F8FAFC] px-4 py-8 text-center text-sm font-bold text-[#475569]">
            Eklenebilecek başka proje bulunmuyor.
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {availableProjects.map((project) => {
              const cannotAdd =
                !project.isPublished ||
                isSelectionFull ||
                updateSelection.isPending;
              const projectMark = project.title
                .trim()
                .slice(0, 2)
                .toLocaleUpperCase('tr');

              return (
                <article
                  key={project.id}
                  className="flex items-center gap-3 border border-[#7C8794] bg-white p-3 shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#C2CAD5]"
                >
                  <button
                    type="button"
                    onClick={() => addProject(project)}
                    disabled={cannotAdd}
                    aria-label={`${project.title} projesini ana sayfaya ekle`}
                    className="grid h-10 w-10 shrink-0 place-items-center border border-[#166534] bg-[#DCFCE7] text-xl font-black text-[#166534] transition hover:bg-[#BBF7D0] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>

                  <div className="grid h-12 w-12 shrink-0 place-items-center border border-[#9AA4B2] bg-[#E9EDF4] text-xs font-black text-[#334155]">
                    {projectMark}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-black text-[#172033]">
                        {project.title}
                      </h3>

                      <AdminStatusBadge
                        tone={project.isPublished ? 'online' : 'neutral'}
                      >
                        {project.isPublished ? 'published' : 'draft'}
                      </AdminStatusBadge>
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#64748B]">
                      {project.shortDescription}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </AdminPanel>
    </div>
  );
}