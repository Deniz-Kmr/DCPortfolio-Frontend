export interface AdminLessonListItem {
  id: number;
  title: string;
  topic: string;
  studyDate: string;
  durationMinutes: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminLessonDetail {
  id: number;
  title: string;
  topic: string;
  notes: string | null;
  resourceUrl: string | null;
  studyDate: string;
  durationMinutes: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminLessonCreateRequest {
  title: string;
  topic: string;
  notes: string | null;
  resourceUrl: string | null;
  studyDate: string;
  durationMinutes: number;
  isCompleted: boolean;
}

export interface AdminLessonUpdateRequest {
  title: string;
  topic: string;
  notes: string | null;
  resourceUrl: string | null;
  studyDate: string;
  durationMinutes: number;
  isCompleted: boolean;
}
