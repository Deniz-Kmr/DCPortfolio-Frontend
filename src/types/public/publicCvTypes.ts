export interface PublicCvProfile {
  id: number;
  fullName: string;
  title: string;
  summary: string;
  aboutText: string | null;
  location: string | null;
  email: string | null;
  githubUrl: string | null;
  linkedInUrl: string | null;
  cvFileUrl: string | null;
}

export interface PublicExperience {
  id: number;
  companyName: string;
  position: string;
  description: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  displayOrder: number;
}

export interface PublicCv {
  profile: PublicCvProfile | null;
  experiences: PublicExperience[];
}
