// src/app/AdminPanelStores/ExamsStore/exams.updaters.ts

import { PartialStateUpdater } from "@ngrx/signals";
import { APIExam } from "../../models/certification";
import { ExamState } from './exam.state';
import { ServerRoute } from '@angular/ssr';


export const setExams = (exams: APIExam[]) => (state: ExamState) => ({
  ...state,
  exams,
});

export const addExam = (exam: APIExam) => (state: ExamState) => ({
  ...state,
  exams: [...state.exams, exam],
});

export const deleteExam = (id: string) => (state: ExamState) => ({
  ...state,
  exams: state.exams.filter(e => e.oid !== id),
});

export const getExam = (
  exam: APIExam
): PartialStateUpdater<ExamState> => {
  // const mappedCertification: Certification = mapApiCertificationToCertification(certification);
  return () => ({
    // selectedExam: mappedExam
    selectedExam: exam
  });
};
export const activateLoading = (state: ExamState) => ({
  ...state,
  loading: true,
  error: null,
});

export const deactivateLoading = (state: ExamState) => ({
  ...state,
  loading: false,
});

export const setError = (error: string) => (state: ExamState) => ({
  ...state,
  error,
  loading: false,
});

export const setSuccess = (success: boolean) => (state: ExamState) => ({
  ...state,
  success,
});




export const updateExam = (updatedExam: APIExam) => (state: ExamState) => ({
  ...state,
  exams: state.exams.map((e) => (e.oid === updatedExam.oid ? updatedExam : e)),
});
