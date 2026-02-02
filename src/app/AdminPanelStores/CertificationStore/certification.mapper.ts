// src\app\AdminPanelStores\CertificationStore\certification.mapper.ts
import { APICertification, Certification } from "../../models/certification";


export function mapApiCertificationToCertification(api: APICertification): Certification {
  return {
    oid: api.oid,
    courseCode: api.courseCode,
    courseName: api.courseName,
    courseDescription: api.courseDescription,
    courseLevelLookupId: api.courseLevelLookupId,
    courseCategoryLookupId: api.courseCategoryLookupId,
    createdBy: api.createdBy,
    isActive: api.isActive,
  };
}




export const mapApiCertificationsToCertifications = (certifications: APICertification[]): Certification[] =>
  certifications.map(mapApiCertificationToCertification);
