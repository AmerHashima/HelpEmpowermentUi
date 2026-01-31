// src\app\AdminPanelStores\CertificationStore\certification.slice.ts
import { certificationState } from "../../models/certification.state";

export const initialCertificationState: certificationState = {
  certifications: [],
  selectedCertification: null,
  loading: false,
  error: null,

  page: 1,
  pageSize: 10,
  total: 0,

  search: '',
  sortBy: 'oid',
  sortDirection: 'asc',
};
