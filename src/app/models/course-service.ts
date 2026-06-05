export interface CourseService {
    oid?: string;
    courseOid: string;
    serviceTypeLookupId: string;
    titleEn: string;
    titleAr: string;
    descriptionEn: string;
    descriptionAr: string;
    isActive: boolean;
    createdBy: string;
}

export interface APICourseService {
    oid: string;
    courseOid: string;
    courseName?: string;
    serviceTypeLookupId: string;
    serviceTypeNameEn?: string;
    serviceTypeNameAr?: string;
    titleEn: string;
    titleAr: string;
    nameEn?: string;
    nameAr?: string;
    serviceNameEn?: string;
    serviceNameAr?: string;
    descriptionEn: string;
    descriptionAr: string;
    detailsEn?: string;
    detailsAr?: string;
    isActive: boolean;
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string | null;
    updatedBy?: string | null;
}
