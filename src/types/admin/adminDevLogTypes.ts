export interface AdminDevLogListItem {
  id: number;
  title: string;
  category: string | null;
  tags: string | null;
  logDate: string;
  isImportant: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminDevLogDetail {
  id: number;
  title: string;
  content: string;
  category: string | null;
  tags: string | null;
  logDate: string;
  isImportant: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminDevLogCreateRequest {
  title: string;
  content: string;
  category: string | null;
  tags: string | null;
  logDate: string;
  isImportant: boolean;
}

export interface AdminDevLogUpdateRequest {
  title: string;
  content: string;
  category: string | null;
  tags: string | null;
  logDate: string;
  isImportant: boolean;
}
