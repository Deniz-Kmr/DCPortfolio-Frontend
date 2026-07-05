export interface AdminTechnologyListItem {
  id: number;
  name: string;
  iconUrl: string | null;
  category: string | null;
  skillLevel: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminTechnologyDetail {
  id: number;
  name: string;
  iconUrl: string | null;
  category: string | null;
  skillLevel: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminTechnologyCreateRequest {
  name: string;
  iconUrl: string | null;
  category: string | null;
  skillLevel: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface AdminTechnologyUpdateRequest {
  name: string;
  iconUrl: string | null;
  category: string | null;
  skillLevel: string | null;
  displayOrder: number;
  isActive: boolean;
}
