export interface AdminCvProfile {
  id: number;
  fullName: string;
  title: string;
  summary: string;
  location: string | null;
  email: string;
  phone: string | null;
  githubUrl: string | null;
  linkedInUrl: string | null;
  cvFileUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminCvProfileCreateRequest {
  fullName: string;
  title: string;
  summary: string;
  location: string | null;
  email: string;
  phone: string | null;
  githubUrl: string | null;
  linkedInUrl: string | null;
  cvFileUrl: string | null;
}

export interface AdminCvProfileUpdateRequest {
  fullName: string;
  title: string;
  summary: string;
  location: string | null;
  email: string;
  phone: string | null;
  githubUrl: string | null;
  linkedInUrl: string | null;
  cvFileUrl: string | null;
}
