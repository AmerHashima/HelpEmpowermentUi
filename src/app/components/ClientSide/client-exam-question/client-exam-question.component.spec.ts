import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientExamQuestionComponent } from './client-exam-question.component';

describe('ClientExamQuestionComponent', () => {
  let component: ClientExamQuestionComponent;
  let fixture: ComponentFixture<ClientExamQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientExamQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientExamQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
