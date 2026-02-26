import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizGameQuestionComponent } from './quiz-game-question.component';

describe('QuizGameQuestionComponent', () => {
  let component: QuizGameQuestionComponent;
  let fixture: ComponentFixture<QuizGameQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizGameQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizGameQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
