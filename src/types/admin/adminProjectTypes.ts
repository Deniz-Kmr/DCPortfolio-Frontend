export interface AdminProjectTechnology {
  id: number;
  name: string;
  iconUrl: string | null;
  category: string | null;
}

export interface AdminProjectImage {
  id: number;
  imageUrl: string;
  altText: string | null;
  displayOrder: number;
  isCover: boolean;
}

export interface AdminProjectImageRequest {
  imageUrl: string;
  altText: string | null;
  displayOrder: number;
  isCover: boolean;
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
  images: AdminProjectImage[];
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
  images?: AdminProjectImageRequest[];
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
  images?: AdminProjectImageRequest[];
}
