import { PartialStateUpdater } from '@ngrx/signals';
import { QuestionState } from "./question.state";
import { APICourseQuestion, courseQuestion } from '../../models/certification';
import { Filter } from '../../models/rquest';
import { mapApiQuestionsToCourseQuestions, mapApiQuestionToCourseQuestion } from './question.mapper';


/* ===================== Loading ===================== */

export const activateLoading: PartialStateUpdater<QuestionState> = () => ({
  loading: true,
});

export const deactivateLoading: PartialStateUpdater<QuestionState> = () => ({
  loading: false,
});

/* ===================== Error ===================== */

export const setError = (err: any): PartialStateUpdater<QuestionState> => {
  return () => ({ error: err });
};

/* ===================== Set Questions ===================== */

export const setQuestions = (
  questions: APICourseQuestion[]
): PartialStateUpdater<QuestionState> => {
  const mappedQuestions = mapApiQuestionsToCourseQuestions(questions);
  return () => ({
    questions: mappedQuestions,
  });
  // return () => ({
  //   questions,
  // });
};

/* ===================== Add Question ===================== */

export const addQuestion = (
  question: APICourseQuestion
): PartialStateUpdater<QuestionState> => {
  const mappedQuestion: courseQuestion = mapApiQuestionToCourseQuestion(question);
  return (state) => ({
    questions: [...state.questions, mappedQuestion],
    // questions: [...state.questions, question],

  });
};

/* ===================== Update Question ===================== */

export const updateQuestion = (
  question: APICourseQuestion
): PartialStateUpdater<QuestionState> => {
  const mappedQuestion: courseQuestion = mapApiQuestionToCourseQuestion(question);
  return (state) => ({
    questions: [
      ...state.questions.filter(q => q.oid !== mappedQuestion.oid),
      // ...state.questions.filter(q => q.oid !== question.oid),

      mappedQuestion,
      // question
    ],
  });
};

/* ===================== Get / Select Question ===================== */

export const getQuestion = (
  question: APICourseQuestion
): PartialStateUpdater<QuestionState> => {
  const mappedQuestion: courseQuestion = mapApiQuestionToCourseQuestion(question);
  console.log('mappedQuestion', mappedQuestion);
  return () => ({
    selectedQuestion: mappedQuestion,
  });
};

export const setSelectedQuestion = (
  question: courseQuestion | null
): PartialStateUpdater<QuestionState> => {
  return () => ({
    selectedQuestion: question,
  });
};

/* ===================== Delete Question ===================== */

export const deleteQuestion = (
  id: string
): PartialStateUpdater<QuestionState> => {
  return (state) => ({
    questions: state.questions.filter(q => q.oid !== id),
  });
};

/* ===================== Search Result ===================== */

export const displaySearchResult = (
  questions: APICourseQuestion[]
): PartialStateUpdater<QuestionState> => {
  const mappedQuestions = mapApiQuestionsToCourseQuestions(questions);
  return () => ({
    questions: mappedQuestions,
    // questions: questions,

  });
};

/* ===================== Pagination ===================== */

export const setPageUpdater = (
  page: number,
  pageSize?: number
): PartialStateUpdater<QuestionState> => {
  return (state) => ({
    page,
    pageSize: pageSize ?? state.pageSize,
  });
};

/* ===================== Search ===================== */

export const setSearchUpdater = (
  value: string
): PartialStateUpdater<QuestionState> => {
  return () => ({
    search: value.trim(),
    page: 1,
  });
};

/* ===================== Sorting ===================== */

export const setSortUpdater = (
  active: string,
  direction: 'asc' | 'desc' | ''
): PartialStateUpdater<QuestionState> => {
  return () => ({
    sortBy: active || '',
    sortDirection: direction || '',
    page: 1,
  });
};

/* ===================== Success ===================== */

export const setSuccess = (
  success: boolean
): PartialStateUpdater<QuestionState> => {
  return () => ({
    success,
  });
};

export const setFiltersUpdater = (
  filters: Filter[]
): PartialStateUpdater<QuestionState> => {
  return () => ({
    filters,
    page: 1,
  });
};


