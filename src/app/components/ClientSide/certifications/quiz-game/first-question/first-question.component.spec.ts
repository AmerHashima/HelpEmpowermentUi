import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstQuestionComponent } from './first-question.component';

describe('FirstQuestionComponent', () => {
  let component: FirstQuestionComponent;
  let fixture: ComponentFixture<FirstQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
