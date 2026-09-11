export interface Role { oid: string; name: string; description: string; isActive: boolean; }
export interface SaveRole { oid?: string; name: string; description: string; isActive: boolean; createdBy?: string; updatedBy?: string; }
export interface AppLink { oid: string; nameAr: string; nameEn: string; path: string; isActive: boolean; }
export interface RoleLink { oid: string; roleId: string; linkId: string; canRead: boolean; canWrite: boolean; canEdit: boolean; canDelete: boolean; isActive: boolean; }
export interface SaveRoleLink extends Omit<RoleLink, 'oid'> { oid?: string; createdBy?: string; updatedBy?: string; }
