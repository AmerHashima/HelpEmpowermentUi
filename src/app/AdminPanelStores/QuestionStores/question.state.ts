import { courseQuestion } from "../../models/certification";

export interface QuestionState {
  questions: courseQuestion[];
  selectedQuestion: courseQuestion | null;
  success: boolean;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  total: number;
  search: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc' | '';
}
