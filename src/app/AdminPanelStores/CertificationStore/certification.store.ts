// src\app\AdminPanelStores\CertificationStore\certification.store.ts
import { signalStore, withState, withMethods, patchState, withHooks, withComputed } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, effect, inject } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, finalize, of, pipe, switchMap, tap } from 'rxjs';
// import { active } from 'sortablejs';
import { initialCertificationState } from './certification.slice';
import { CertificationService } from '../../Services/certification.service';
import { Filter, RequestBody, Sort, Pagination } from '../../models/rquest';
import {
  activateLoading, addCertification, deleteCertification, getCertification,
  updateCertification, deactivateLoading, setError,
  setSearchUpdater,
  setPageUpdater,
  setSortUpdater
}
  from './certification.updaters';
import { APICertification, Certification } from '../../models/certification';
import { createQueryRequest } from './store.helper';

type UpdateUserPayload = {
  id: string;
  body: Certification;
};

export const CertificationsStore = signalStore(
  withState(initialCertificationState),
  withComputed(({ page, pageSize, search, sortBy, sortDirection, total }) => ({
    queryRequest: computed<RequestBody>(() => {
      const filters: Filter[] = [];

      if (search().trim()) {
        filters.push({
          propertyName: 'courseCode',
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

      console.log({
        filters,
        sort,
        pagination,
        columns: [],
      })
      return createQueryRequest({
        filters,
        sort,
        pagination,
        columns: [],
      });
    }),

    // Optional: nicer API for template / debugging
    hasSearch: computed(() => !!search().trim()),
    isFirstPage: computed(() => page() <= 1),
    isLastPage: computed(() => {
      const loaded = page() * pageSize();
      return loaded >= total();
    }),
  })),
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
      patchState(store, setSortUpdater("", ""));
    },
  })),
  withMethods((store, certifcationService = inject(CertificationService)) => ({
    queryCertifications: rxMethod<RequestBody>(
      pipe(
        debounceTime(350),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        tap(() => patchState(store, activateLoading)),
        switchMap((request: RequestBody) =>
          certifcationService.search(request).pipe(
            tap((response: { certifications: APICertification[]; total: number }) => {
              patchState(store, (s) => ({
                ...s,
                certifications: response.certifications,
                total: response.total ?? 0
              }));
            }),
            catchError((err) => {
              patchState(store, setError(err.message || 'Failed to load users'));
              return of({ users: [], total: 0 });
            }),
            finalize(() => patchState(store, deactivateLoading))
          )
        )
      )
    ),

  })),
  withMethods((store) => {
    const certifcationService = inject(CertificationService);
    return {
      addCertification: rxMethod<Certification>(
        pipe(
          tap(() => patchState(store, activateLoading)),
          switchMap((body) =>
            certifcationService.createCertification(body).pipe(
              tap((certifcation: APICertification) => patchState(store, addCertification(certifcation))),
              catchError((err) => {
                patchState(store, setError(err?.msg ?? 'Failed to add Certification'));
                return EMPTY;
              }),
              finalize(() => patchState(store, deactivateLoading))
            )
          )
        )
      ),
      updateCertification: rxMethod<UpdateUserPayload>(
        pipe(
          tap(() => patchState(store, activateLoading)),
          switchMap(({ id, body }) =>
            certifcationService.updateCertification(id, body).pipe(
              tap((certification: APICertification) => patchState(store, updateCertification(certification))),
              catchError((err) => {
                patchState(store, setError(err?.msg ?? 'Failed to update certification'));
                return EMPTY;
              }),
              finalize(() => patchState(store, deactivateLoading))
            )
          )
        )
      ),
      getCertification: rxMethod<string>(
        pipe(
          tap(() => patchState(store, activateLoading)),
          switchMap((id) =>
            certifcationService.getCertification(id).pipe(
              tap((Certification: APICertification) => patchState(store, getCertification(Certification))),
              catchError((err) => {
                patchState(store, setError(err?.msg ?? 'Failed to load Certification'));
                return EMPTY;
              }),
              finalize(() => patchState(store, deactivateLoading))
            )
          )
        )
      ),
      deleteCertification: rxMethod<string>(
        pipe(
          tap(() => patchState(store, activateLoading)),
          switchMap((id) =>
            certifcationService.deleteCertification(id).pipe(
              tap(() => patchState(store, deleteCertification(id))),
              catchError((err) => {
                patchState(store, setError(err.message || 'Delete failed'));
                return EMPTY
              }),
              finalize(() => patchState(store, deactivateLoading))
            )
          )
        )
      )
    };
  }),

  withHooks({
    onInit(store) {
      effect(() => {
        const req = store.queryRequest();
        store.queryCertifications(req);
      });
    },
  })
);


