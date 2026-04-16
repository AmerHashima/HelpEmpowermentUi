export interface CourseVideo {
  oid: string;
  courseOid: string;
  courseName: string;
  nameEn: string;
  nameAr: string;
  videoUrl: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  durationSeconds: number | null;
  orderNo: number | null;
  videoTypeLookupId: string | null;
  videoTypeName: string | null;
  isPreview: boolean;
  isActive: boolean;
  createdAt: string | null;
  attachments: any[];
}

export interface CourseVideoAttachment {
  oid: string;
  courseVideoOid: string;
  videoName: string;
  fileName: string;
  fileUrl: string;
  fileTypeLookupId: string | null;
  fileTypeName: string | null;
  createdAt: string | null;
}
