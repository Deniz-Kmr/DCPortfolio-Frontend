export interface PublicTechnology {
  id: number;
  name: string;
  iconUrl: string | null;
  category: string;
  skillLevel: string;
  displayOrder: number;
}

export interface PublicTechnologyGroup {
  category: string;
  technologies: PublicTechnology[];
}
