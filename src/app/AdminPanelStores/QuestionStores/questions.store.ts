import {
  signalStore,
  withState,
  withMethods,
  patchState,
  withHooks,
  withComputed,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, effect, inject } from '@angular/core';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  finalize,
  of,
  pipe,
  switchMap,
  tap,
} from 'rxjs';

import { initialQuestionState } from './question.slice';
import { Filter, RequestBody, Sort, Pagination } from '../../models/rquest';

import {
  activateLoading,
  deactivateLoading,
  setError,
  setQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestion,
  setSearchUpdater,
  setPageUpdater,
  setSortUpdater,
  setSuccess,
  setSelectedQuestion,
  setFiltersUpdater,
} from './question.updaters';
import { CertificationService } from '../../Services/certification.service';
import { APICourseQuestion, courseQuestion } from '../../models/certification';
import { createQueryRequest } from '../CertificationStore/store.helper';

type UpdateQuestionPayload = {
  id: string;
  // body: courseQuestion;
  body: any;

};

export const QuestionsStore = signalStore(
  /* ===================== State ===================== */
  withState(initialQuestionState),

  /* ===================== Computed ===================== */
  withComputed(({ page, pageSize, search, sortBy, sortDirection, total,filters }) => ({
    queryRequest: computed<RequestBody>(() => {
      const filtersInner: Filter[] = [
        ...(filters() ?? [])
      ];
      if (search().trim()) {
        filtersInner.push({
          propertyName: 'questionText',
          value: search().trim(),
          operation: 3,
        });
      }

      const sort: Sort[] = [];
      if (sortBy() && sortDirection()) {
        sort.push({
          sortBy: sortBy(),
          sortDirection: sortDirection()!.toUpperCase(),
        });
      }

      const pagination: Pagination = {
        getAll: true,
        pageNumber: page() - 1,
        pageSize: pageSize(),
      };

      return createQueryRequest({
        filters: filtersInner,
        sort,
        pagination,
        columns: [],
      });
    }),

    hasSearch: computed(() => !!search().trim()),
    isFirstPage: computed(() => page() <= 1),
    isLastPage: computed(() => page() * pageSize() >= total()),
  })),

  /* ===================== Sync Methods ===================== */
  withMethods((store) => ({
    setPage(page: number, pageSize?: number) {
      patchState(store, setPageUpdater(page, pageSize));
    },

    setSearch(value: string) {
      patchState(store, setSearchUpdater(value));
    },

    setSort(sort: { active: string; direction: 'asc' | 'desc' | '' }) {
      patchState(store, setSortUpdater(sort.active, sort.direction));
    },

    clearSort() {
      patchState(store, setSortUpdater('', ''));
    },

    setSuccess(success: boolean) {
      patchState(store, setSuccess(success));
    },

    setSelectedQuestion(question: courseQuestion) {
      patchState(store, setSelectedQuestion(question));
    },

    setFilters(filters: Filter[]) {
      patchState(store, setFiltersUpdater(filters));
    },
  })),

  /* ===================== Query ===================== */
  withMethods((store, service = inject(CertificationService)) => ({
    queryQuestions: rxMethod<RequestBody>(
      pipe(
        debounceTime(350),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        tap(() => patchState(store, activateLoading)),
        switchMap((request) =>
          service.searchQuestion(request).pipe(
            tap((res: { questions: APICourseQuestion[]; total: number }) => {
              patchState(store, (s) => ({
                ...s,
                questions: res.questions,
                total: res.total ?? 0,
              }));
            }),
            catchError((err) => {
              patchState(store, setError(err?.message ?? 'Failed to load questions'));
              return of({ questions: [], total: 0 });
            }),
            finalize(() => patchState(store, deactivateLoading))
          )
        )
      )
    ),
  })),

  /* ===================== CRUD ===================== */
  withMethods((store) => {
    const service = inject(CertificationService);

    return {
      addQuestion: rxMethod<courseQuestion>(
        pipe(
          tap(() => patchState(store, activateLoading)),
          switchMap((body) =>
            service.createQuestion(body).pipe(
              tap((question: APICourseQuestion) => {
                patchState(store, addQuestion(question));
                patchState(store, setSuccess(true));
              }),
              catchError((err) => {
                patchState(store, setError(err?.msg ?? 'Failed to add question'));
                return EMPTY;
              }),
              finalize(() => patchState(store, deactivateLoading))
            )
          )
        )
      ),

      updateQuestion: rxMethod<UpdateQuestionPayload>(
        pipe(
          tap(() => patchState(store, activateLoading)),
          switchMap(({ id, body }) =>
            service.updateQuestion(id, body).pipe(
              tap((question: APICourseQuestion) => {
                patchState(store, updateQuestion(question));
                // patchState(store, setSuccess(true));
              }),
              catchError((err) => {
                patchState(store, setError(err?.msg ?? 'Failed to update question'));
                return EMPTY;
              }),
              finalize(() => patchState(store, deactivateLoading))
            )
          )
        )
      ),

      getQuestion: rxMethod<string>(
        pipe(
          tap(() => patchState(store, activateLoading)),
          switchMap((id) =>
            service.getQuestion(id).pipe(
              tap((q: APICourseQuestion) => patchState(store, getQuestion(q))),
              catchError((err) => {
                patchState(store, setError(err?.msg ?? 'Failed to load question'));
                return EMPTY;
              }),
              finalize(() => patchState(store, deactivateLoading))
            )
          )
        )
      ),

      deleteQuestion: rxMethod<string>(
        pipe(
          tap(() => patchState(store, activateLoading)),
          switchMap((id) =>
            service.deleteQuestion(id).pipe(
              tap(() => patchState(store, deleteQuestion(id))),
              catchError((err) => {
                patchState(store, setError(err?.message ?? 'Delete failed'));
                return EMPTY;
              }),
              finalize(() => patchState(store, deactivateLoading))
            )
          )
        )
      ),
    };
  }),

  /* ===================== Init ===================== */
  // withHooks({
  //   onInit(store) {
  //     effect(() => {
  //       store.queryQuestions(store.queryRequest());
  //     });
  //   },
  // })
);
