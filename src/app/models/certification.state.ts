import { Certification } from "./certification";

export interface certificationState {
  certifications: Certification[];
  selectedCertification: Certification | null;
  success: boolean;
  operationType: string
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  total: number;
  search: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc' | '';
}
