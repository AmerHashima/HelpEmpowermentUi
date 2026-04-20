import { TestBed } from '@angular/core/testing';

import { LiveCourseService } from './live-course.service';

describe('LiveCourseService', () => {
  let service: LiveCourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveCourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
