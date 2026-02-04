// src/app/AdminPanelStores/ExamsStore/exams.updaters.ts

import { APIExam } from "../../models/certification";
import { ExamState } from "./exam.state";


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
