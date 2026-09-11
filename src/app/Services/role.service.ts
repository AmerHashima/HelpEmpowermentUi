import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse, ApiSearchResponse } from '../models/apiResponse';
import { AppLink, Role, RoleLink, SaveRole, SaveRoleLink } from '../models/role';
import { RequestBody } from '../models/rquest';
import ApiService from '../shared/Services/ApiService/api.service';

@Injectable({ providedIn: 'root' })
export class RoleService {
  constructor(private api: ApiService) {}
  search(request: RequestBody = this.allRequest()): Observable<ApiSearchResponse<Role>> { return this.api.query<ApiSearchResponse<Role>>('Roles/search', request); }
  get(id: string): Observable<Role> { return this.api.getSingle<ApiResponse<Role>>('Roles', id).pipe(map(r => this.unwrap(r, 'Unable to load role'))); }
  create(body: SaveRole): Observable<Role> { return this.api.post<ApiResponse<Role>>('Roles', body, 'Role created successfully').pipe(map(r => this.unwrap(r, 'Unable to create role'))); }
  update(body: SaveRole): Observable<Role> { return this.api.put<ApiResponse<Role>>('Roles', body.oid ?? '', body, 'Role updated successfully').pipe(map(r => this.unwrap(r, 'Unable to update role'))); }
  delete(id: string): Observable<boolean> { return this.api.delete<ApiResponse<boolean>>('Roles', id, 'Role deleted successfully').pipe(map(r => this.unwrap(r, 'Unable to delete role'))); }
  links(): Observable<AppLink[]> { return this.api.query<ApiSearchResponse<AppLink>>('Links/search', this.allRequest()).pipe(map(r => r.data ?? [])); }
  roleLinks(roleId: string): Observable<RoleLink[]> {
    const request = this.allRequest(); request.filters.push({ propertyName: 'RoleId', value: roleId, operation: 0 });
    return this.api.query<ApiSearchResponse<RoleLink>>('RoleLinks/search', request).pipe(map(r => r.data ?? []));
  }
  createRoleLink(body: SaveRoleLink): Observable<RoleLink> { return this.api.post<ApiResponse<RoleLink>>('RoleLinks', body, 'Role link added successfully').pipe(map(r => this.unwrap(r, 'Unable to add role link'))); }
  updateRoleLink(body: SaveRoleLink): Observable<RoleLink> { return this.api.put<ApiResponse<RoleLink>>('RoleLinks', body.oid ?? '', body, 'Role link updated successfully').pipe(map(r => this.unwrap(r, 'Unable to update role link'))); }
  deleteRoleLink(id: string): Observable<boolean> { return this.api.delete<ApiResponse<boolean>>('RoleLinks', id, 'Role link removed successfully').pipe(map(r => this.unwrap(r, 'Unable to remove role link'))); }
  private allRequest(): RequestBody { return { filters: [], sort: [{ sortBy: 'Name', sortDirection: 'asc' }], pagination: { getAll: true, pageNumber: 1, pageSize: 50 }, columns: [] }; }
  private unwrap<T>(response: ApiResponse<T>, fallback: string): T { if (!response.success) throw new Error(response.message || fallback); return response.data; }
}
