import { PartialStateUpdater } from "@ngrx/signals";
import { certificationState } from "../../models/certification.state";
// import { ApiUser } from "../models/api-user";
import { mapApiCertificationsToCertifications, mapApiCertificationToCertification } from "./certification.mapper";
import { APICertification, Certification } from "../../models/certification";
export const activateLoading: PartialStateUpdater<certificationState> = (state) => ({
  loading: true,
});


export const deactivateLoading: PartialStateUpdater<certificationState> = (state) => ({
  loading: false,
});




export const setError = (err: any): PartialStateUpdater<certificationState> => {
  return () => ({ error: err });
};
// export const setCertifications = (users: ApiUser[]): PartialStateUpdater<certificationState> => {
export const setCertifications = (certifications: APICertification[]): PartialStateUpdater<certificationState> => {
  const mappedCertifications = mapApiCertificationsToCertifications(certifications)
  return () => ({
    certifications: mappedCertifications,
  });
};


export const addCertification = (
  certification: APICertification
): PartialStateUpdater<certificationState> => {
  const mappedCertification: Certification = mapApiCertificationToCertification(certification);
  return (state) => ({
    certifications: [...state.certifications, mappedCertification],
  });
};

export const updateCertification = (
  certification: APICertification
): PartialStateUpdater<certificationState> => {
  const mappedCertification: Certification = mapApiCertificationToCertification(certification);
  return (state) => ({
    certifications: [
      ...state.certifications.filter(u => u.oid !== mappedCertification.oid),
      mappedCertification,
    ],
  });
};


export const getCertification = (
  certification: APICertification
): PartialStateUpdater<certificationState> => {
  const mappedCertification: Certification = mapApiCertificationToCertification(certification);
  return () => ({
    selectedCertification: mappedCertification
  });
};


export const deleteCertification = (
  id: string
): PartialStateUpdater<certificationState> => {
  return (state) => ({
    certifications: [
      ...state.certifications.filter(u => u.oid !== id),
    ],
  });
};


// export const displaySearchResult = (certificayions: ApiUser[]): PartialStateUpdater<certificationState> => {
export const displaySearchResult = (certifications: APICertification[]): PartialStateUpdater<certificationState> => {

  const mappedCertifications = mapApiCertificationsToCertifications(certifications)
  return () => ({
    certifications: mappedCertifications,
  });
};

export const setPageUpdater = (page: number, pageSize?: number): PartialStateUpdater<certificationState> => {
  return (state) => ({
    page,
    pageSize: pageSize ?? state.pageSize,
  });
}

export const setSearchUpdater = (value: string): PartialStateUpdater<certificationState> => {
  return (state) => ({
    search: value.trim(),
    page: 1,
  });
}

export const setSortUpdater = (active: string, direction: 'asc' | 'desc' | ''): PartialStateUpdater<certificationState> => {
  return (state) => ({
    sortBy: active || "",
    sortDirection: direction || "",
    page: 1,
  });
}

export const setSuccess = (success: boolean): PartialStateUpdater<certificationState> => {
  return (state) => ({
    success: success,
  });
};

export const setSelectedCertification = (certification: Certification): PartialStateUpdater<certificationState> => {
  return (state) => ({
    selectedCertification: certification,
  });
};



