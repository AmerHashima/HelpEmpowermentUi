// src\app\models\certification.ts
export interface Certification {
  oid?: string,
  courseCode: string,
  courseName: string,
  courseDescription: string,
  courseLevelLookupId: string
  courseCategoryLookupId: string
  createdBy: string
}

export interface APICertification {
  courseLevelName: string,
  courseCategoryName: string,
  isActive: true,
  courseCode: string,
  courseName: string,
  courseDescription: string,
  courseLevelLookupId: string
  courseCategoryLookupId: string
  createdBy: string
  createdAt: string,
  updatedAt: string,
  updatedBy: string
}
