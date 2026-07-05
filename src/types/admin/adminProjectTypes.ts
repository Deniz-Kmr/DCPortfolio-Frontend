export interface AdminProjectTechnology {
  id: number;
  name: string;
  iconUrl: string | null;
  category: string | null;
}

export interface AdminProjectListItem {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  technologies: AdminProjectTechnology[];
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminProjectDetail {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  githubUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  technologies: AdminProjectTechnology[];
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminProjectCreateRequest {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  githubUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  technologyIds: number[];
}

export interface AdminProjectUpdateRequest {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  githubUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  technologyIds: number[];
}
