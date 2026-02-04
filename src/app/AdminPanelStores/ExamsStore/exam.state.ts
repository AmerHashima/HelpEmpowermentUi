import { courseExam } from "../../models/certification";

export interface ExamState {
  exams: courseExam[];
  selectedExam: courseExam | null,
  loading: boolean;
  error: string | null;
}


