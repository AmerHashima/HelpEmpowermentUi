import { ExamState } from "./exam.state";

export const initialExamsState: ExamState = {
  exams: [],
  selectedExam:null,
  success:false,
  loading: false,
  error: null,
};
