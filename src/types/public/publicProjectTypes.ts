export interface PublicProjectTechnology {
  id: number;
  name: string;
  iconUrl: string | null;
  category: string;
  skillLevel: string;
}

export interface PublicProjectImage {
  id: number;
  imageUrl: string;
  altText: string | null;
  displayOrder: number;
  isCover: boolean;
}

export interface PublicProjectListItem {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  githubUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isFeatured: boolean;
  technologies: PublicProjectTechnology[];
}

export interface PublicProjectDetail {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  githubUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  createdAt: string;
  images: PublicProjectImage[];
  technologies: PublicProjectTechnology[];
}
