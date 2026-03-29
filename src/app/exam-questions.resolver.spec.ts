import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { examQuestionsResolver } from './Resolvers/exam-questions.resolver';

describe('examQuestionsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => examQuestionsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
