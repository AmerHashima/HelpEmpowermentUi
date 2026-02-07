import { courseQuestion } from "../../models/certification";
import { Filter } from "../../models/rquest";

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
filters: Filter[];
  sortDirection: 'asc' | 'desc' | '';
}
