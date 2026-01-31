// src\app\models\certification.state.ts

import { Certification } from "./certification";

export interface certificationState {
  certifications: Certification[];
  selectedCertification: Certification | null;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  total: number;
  search: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc' | '';
}
