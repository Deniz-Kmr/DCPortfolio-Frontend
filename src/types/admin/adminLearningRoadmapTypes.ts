import type { RoadmapStatus } from './adminEnumTypes';

export interface AdminLearningRoadmapListItem {
  id: number;
  title: string;
  category: string;
  status: RoadmapStatus;
  targetDate: string | null;
  completedAt: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminLearningRoadmapDetail {
  id: number;
  title: string;
  category: string;
  description: string | null;
  status: RoadmapStatus;
  targetDate: string | null;
  completedAt: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminLearningRoadmapCreateRequest {
  title: string;
  category: string;
  description: string | null;
  status: RoadmapStatus;
  targetDate: string | null;
  displayOrder: number;
}

export interface AdminLearningRoadmapUpdateRequest {
  title: string;
  category: string;
  description: string | null;
  status: RoadmapStatus;
  targetDate: string | null;
  completedAt: string | null;
  displayOrder: number;
}
