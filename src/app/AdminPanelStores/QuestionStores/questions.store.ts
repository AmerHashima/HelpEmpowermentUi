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
  concatMap,
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
import { APIAnswer, APICourseQuestion, courseQuestion } from '../../models/certification';
import { createQueryRequest } from '../CertificationStore/store.helper';
import { mapApiQuestionsToCourseQuestions } from './question.mapper';
import { ToastrService } from 'ngx-toastr';
import { ToastingMessagesService } from '../../shared/Services/ToastingMessages/toasting-messages.service';

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

    setSelectedQuestion(question: courseQuestion|null) {
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
        // distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        tap(() => patchState(store, activateLoading)),
        switchMap((request) =>
          service.searchQuestion(request).pipe(
            tap(() => console.log('in query questions')),
            tap((res: { questions: APICourseQuestion[]; total: number }) => {
              patchState(store, (s) => ({
                ...s,
                questions: mapApiQuestionsToCourseQuestions(res.questions),
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
  })),

  /* ===================== CRUD ===================== */
  withMethods((store) => {
    const service = inject(CertificationService);
    const toasting = inject(ToastingMessagesService);

    return {
      addQuestion: rxMethod<courseQuestion>(
        pipe(
          tap(() => patchState(store, activateLoading)),
          switchMap((body) =>
            service.createQuestion(body).pipe(
              tap((question: APICourseQuestion) => {
                patchState(store, addQuestion(question));
                tap(() => toasting.showToast('Question has been deleted', 'success')),
                patchState(store, setSuccess(true));
              }),
              catchError((err) => {
                patchState(store, setError(err?.msg ?? 'Failed to add question'));
                toasting.showToast('Question failed to be added', 'error')
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
          // swiychMap(({ id, body }) =>
          concatMap(({ id, body }) =>
            service.updateQuestion(id, body).pipe(
              tap((questiupdateon: APICourseQuestion) => {

                // patchState(store, updateQuestion(questiupdateon));
                // patchState(store, setSuccess(true));
              }),
              // tap(() => {
              //   const question = store.selectedQuestion();
              //   if (!question?.oid) return;
              //   store.getQuestion(question.oid);
              // }),
              catchError((err) => {
                patchState(store, setError(err?.msg ?? 'Failed to update question'));
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
              tap(() => toasting.showToast('Question has been deleted','success')),
              catchError((err) => {
                patchState(store, setError(err?.message ?? 'Delete failed'));
                toasting.showToast('Question failed to be deleted', 'error')
                return EMPTY;
              }),
              finalize(() => patchState(store, deactivateLoading))
            )
          )
        )
      ),

    };
  }),
  withMethods((store) => {
    const service = inject(CertificationService);
     const toasting=inject(ToastingMessagesService);
    return {
      addAnswer: rxMethod<courseQuestion>(
        pipe(
          tap(() => patchState(store, activateLoading)),
          concatMap((body) =>
            service.createAnswer(body).pipe(
              tap(() => {
                 console.log('createSyccessfully');
              }),
              // tap(() => {
              //   const question = store.selectedQuestion();
              //   if (!question?.oid) return;
              //   store.getQuestion(question.oid);
              // }),
              catchError((err) => {
                patchState(store, setError(err?.msg ?? 'Failed to add answer'));
                return EMPTY;
              }),
              finalize(() => patchState(store, deactivateLoading))
            )
          )
        )
      ),
      deleteAnswer: rxMethod<string>(
        pipe(
          tap(() => patchState(store, activateLoading)),
          concatMap((id) =>
            service.deleteAnswer(id).pipe(
              // tap(() => patchState(store, deleteAnswer(id))),
              tap(() => toasting.showToast('Answer has been deleted', 'success')),
              tap(() => {
                const question = store.selectedQuestion();
                if (!question?.oid) return;
                store.getQuestion(question.oid);
              }),
              catchError((err) => {
                patchState(store, setError(err?.message ?? 'Delete failed'));
                toasting.showToast('Answer failed to be deleted', 'error')
                return EMPTY;
              }),
              finalize(() => patchState(store, deactivateLoading))
            )
          )
        )
      ),
      updateQuestion$(payload: any) {
        patchState(store, activateLoading);
        return service.updateQuestion(payload.id, payload.body).pipe(
          tap(updated => console.log('update sucess')),

          // tap(updated => patchState(store, updateQuestion(updated))),
          catchError(err => {
            patchState(store, setError(err?.message ?? 'Update failed'));
            console.log(err?.message);
            console.log('update failed')
            return of(null);
          }),
          finalize(() => patchState(store, deactivateLoading))
        );
      },

addAnswer$(answer: any) {
        return service.createAnswer(answer).pipe(
          tap(() => {
            // console.log('created');
          }),
          catchError(err => {
            patchState(store, setError(err?.message ?? 'failed to add failed'));
            return of(null);
          }),
          finalize(() => patchState(store, deactivateLoading))
        );
      }
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
