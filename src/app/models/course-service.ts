export interface CourseService {
    oid?: string;
    courseId: string;
    serviceId: string;
    price: number;
    activeTime: number;
    isActive: boolean;
    createdBy: string;
}

export interface APICourseService {
    oid: string;
    courseId?: string;
    courseOid?: string;
    courseName?: string;
    serviceId?: string;
    serviceTypeLookupId?: string;
    serviceTypeNameEn?: string;
    serviceTypeNameAr?: string;
    titleEn?: string;
    titleAr?: string;
    nameEn?: string;
    nameAr?: string;
    serviceNameEn?: string;
    serviceNameAr?: string;
    descriptionEn?: string;
    descriptionAr?: string;
    detailsEn?: string;
    detailsAr?: string;
    price?: number;
    activeTime?: number;
    isActive?: boolean;
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string | null;
    updatedBy?: string | null;
}
