// src\app\AdminPanelStores\QuestionStores\question.state.ts
import { courseQuestion } from "../../models/certification";
import { Filter } from "../../models/rquest";

export interface QuestionState {
  questions: courseQuestion[];
  selectedQuestion: courseQuestion | null;
  success: boolean;
practiceQuestionsSuccess: boolean;

  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  total: number;
  search: string;
  sortBy: string;
  filters: Filter[];
  sortDirection: 'asc' | 'desc' | '';
}
