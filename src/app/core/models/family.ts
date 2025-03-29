export interface Family {
  id?: number;
  familyPhoto: string | null;
  familyName: string;
  description: string;
  adminId?: number | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}
