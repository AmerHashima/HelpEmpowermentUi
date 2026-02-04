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
import { switchMap, tap, catchError, finalize, EMPTY } from 'rxjs';

import { CertificationService } from '../../Services/certification.service';
import { CertificationsStore } from '../CertificationStore/certification.store';
import {
  activateLoading, deactivateLoading,
  setError,
  setExams,
  deleteExam as deleteExamUpdater, } from './exam.updaters';
import { initialExamsState } from './exam.slice';
import { APIExam } from '../../models/certification';

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
