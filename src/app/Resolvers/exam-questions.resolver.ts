import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { QuestionsStore } from '../AdminPanelStores/QuestionStores/questions.store';
import { Shared } from '../shared/Services/shared/shared';
import { Filter } from '../models/rquest';
import { LoadingService } from '../shared/Services/Loading/loading.service';
import { filter, first } from 'rxjs';

export const examQuestionsResolver: ResolveFn<boolean> = () => {

  const store = inject(QuestionsStore);
  const shared = inject(Shared);
  const loadingService = inject(LoadingService);

  const examId = shared.currentExamId();

  if (!examId) return true;

  const filters: Filter[] = [{
    propertyName: "coursesMasterExamOid",
    value: examId,
    operation: 0
  }];

  store.setFilters(filters);

  store.queryQuestions(store.queryRequest());

  return loadingService.loading$.pipe(
    filter(loading => !loading),
    first()
  );
};
