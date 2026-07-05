export interface AdminExperienceListItem {
  id: number;
  companyName: string;
  position: string;
  description: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminExperienceDetail {
  id: number;
  companyName: string;
  position: string;
  description: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminExperienceCreateRequest {
  companyName: string;
  position: string;
  description: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  isPublished: boolean;
  displayOrder: number;
}

export interface AdminExperienceUpdateRequest {
  companyName: string;
  position: string;
  description: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  isPublished: boolean;
  displayOrder: number;
}
