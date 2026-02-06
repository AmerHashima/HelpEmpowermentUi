// src/app/AdminPanelStores/ExamsStore/exams.store.ts
import {
  signalStore,
  withState,
  withMethods,
  patchState,
  withHooks,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { effect, inject } from '@angular/core';
import { switchMap, tap, catchError, finalize, EMPTY, pipe } from 'rxjs';

import { CertificationService } from '../../Services/certification.service';
import { CertificationsStore } from '../CertificationStore/certification.store';
import {
  activateLoading, deactivateLoading,
  setError,
  setExams,
  deleteExam as deleteExamUpdater,
  addExam,
  updateExam,
  setSuccess,
  getExam, } from './exam.updaters';
import { initialExamsState } from './exam.slice';
import { APIExam, courseExam } from '../../models/certification';

type updatedExamPayLoad = {
  id: string;
  body: courseExam;
};
export const ExamsStore = signalStore(
  withState(initialExamsState),

  withMethods((store, service = inject(CertificationService)) => ({
    loadExams: rxMethod<string>(
      switchMap((certificationOid) => {
        patchState(store, activateLoading);

        return service.getCertificationExams(certificationOid).pipe(
          tap((exams: APIExam[]) => {
            patchState(store, setExams(exams));
          }),
          catchError((err) => {
            patchState(
              store,
              setError(err?.message || 'Failed to load exams')
            );
            return EMPTY;
          }),
          finalize(() => patchState(store, deactivateLoading))
        );
      })
    ),

      addExam: rxMethod<courseExam>(
            pipe(
              tap(() => patchState(store, activateLoading)),
              switchMap((body) =>
                service.createExam(body).pipe(
                  tap((exam: APIExam) => {
                    patchState(store, addExam(exam));
                    patchState(store, setSuccess(true));
                  }),
                  catchError((err) => {
                    patchState(store, setError(err?.msg ?? 'Failed to add exam'));
                    return EMPTY;
                  }),
                  finalize(() => patchState(store, deactivateLoading))
                )
              )
            )
          ),
    updateExam: rxMethod<updatedExamPayLoad>(
          pipe(
            tap(() => patchState(store, activateLoading)),
            switchMap(({ id, body }) =>
              service.updateExam(id, body).pipe(
                tap((exam: APIExam) => {
                  patchState(store, updateExam(exam));
                }),
                catchError((err) => {
                  patchState(store, setError(err?.msg ?? 'Failed to update exam'));
                  return EMPTY;
                }),
                finalize(() => patchState(store, deactivateLoading))
              )
            )
          )
        ),

            getExam: rxMethod<string>(
                pipe(
                  tap(() => patchState(store, activateLoading)),
                  switchMap((id) =>
                    service.getExam(id).pipe(
                      tap((exam: APIExam) => patchState(store, getExam(exam))),
                      catchError((err) => {
                        patchState(store, setError(err?.msg ?? 'Failed to load exam'));
                        return EMPTY;
                      }),
                      finalize(() => patchState(store, deactivateLoading))
                    )
                  )
                )
              ),
    deleteExam: rxMethod<string>(
      switchMap((examId) => {
        patchState(store, activateLoading);

        return service.deleteExam(examId).pipe(
          tap(() => patchState(store, deleteExamUpdater(examId))),
          catchError((err) => {
            patchState(
              store,
              setError(err?.message || 'Failed to delete exam')
            );
            return EMPTY;
          }),
          finalize(() => patchState(store, deactivateLoading))
        );
      })
    ),
      setSuccess(success: boolean) {
          patchState(store, setSuccess(success));
        },
  })),

  withHooks({
    onInit(store) {
      const certificationsStore = inject(CertificationsStore);

      effect(() => {
        const certification = certificationsStore.selectedCertification();
        if (certification?.oid) {
          store.loadExams(certification.oid);
        }
      });
    },
  })
);
