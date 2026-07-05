export interface PublicCertificate {
  id: number;
  title: string;
  institution: string;
  description: string | null;
  issueDate: string | null;
  credentialUrl: string | null;
  fileUrl: string | null;
  displayOrder: number;
}
