// src\app\AdminPanelStores\ExamsStore\exam.state.ts
import { APIExam, courseExam } from "../../models/certification";

export interface ExamState {
  // exams: courseExam[];
  // selectedExam: courseExam | null,
  exams: APIExam[];
  selectedExam: APIExam | null,
  success: boolean,
  loading: boolean;
  error: string | null;
}


