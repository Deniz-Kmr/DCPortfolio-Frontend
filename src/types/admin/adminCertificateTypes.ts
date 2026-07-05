export interface AdminCertificateListItem {
  id: number;
  title: string;
  institution: string;
  description: string;
  issueDate: string | null;
  credentialUrl: string | null;
  fileUrl: string | null;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminCertificateDetail {
  id: number;
  title: string;
  institution: string;
  description: string;
  issueDate: string | null;
  credentialUrl: string | null;
  fileUrl: string | null;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminCertificateCreateRequest {
  title: string;
  institution: string;
  description: string;
  issueDate: string;
  credentialUrl: string | null;
  fileUrl: string | null;
  isPublished: boolean;
  displayOrder: number;
}

export interface AdminCertificateUpdateRequest {
  title: string;
  institution: string;
  description: string;
  issueDate: string;
  credentialUrl: string | null;
  fileUrl: string | null;
  isPublished: boolean;
  displayOrder: number;
}
