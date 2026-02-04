import { courseExam } from "../../models/certification";

export interface ExamState {
  exams: courseExam[];
  selectedExam: courseExam | null,
  success:boolean,
  loading: boolean;
  error: string | null;
}


