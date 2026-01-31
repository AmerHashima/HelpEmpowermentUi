// src\app\AdminPanelStores\CertificationStore\store.helper.ts
import { RequestBody } from "../../models/rquest";

export function createQueryRequest({
  filters = [],
  sort = [],
  pagination = { getAll: true, pageNumber: 0, pageSize: 0 },
  columns = []
}: RequestBody): RequestBody {
  return {
    filters,
    sort,
    pagination,
    columns
  };
}
