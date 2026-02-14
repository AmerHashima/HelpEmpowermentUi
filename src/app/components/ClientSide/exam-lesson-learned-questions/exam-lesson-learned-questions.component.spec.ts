import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamLessonLearnedQuestionsComponent } from './exam-lesson-learned-questions.component';

describe('ExamLessonLearnedQuestionsComponent', () => {
  let component: ExamLessonLearnedQuestionsComponent;
  let fixture: ComponentFixture<ExamLessonLearnedQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamLessonLearnedQuestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamLessonLearnedQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
