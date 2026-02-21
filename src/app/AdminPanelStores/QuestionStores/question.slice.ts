// src\app\AdminPanelStores\QuestionStores\question.slice.ts
import { QuestionState } from "./question.state";

export const initialQuestionState: QuestionState = {
  questions: [],
  selectedQuestion: null,
  loading: false,
  error: null,
  success: false,
  page: 1,
  pageSize: 10,
  total: 0,
  filters: [],
  search: '',
  sortBy: 'orderNo',
  sortDirection: 'desc',

};
