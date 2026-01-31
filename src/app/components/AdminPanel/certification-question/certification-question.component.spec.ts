// src\app\components\AdminPanel\certification-question\certification-question.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationQuestionComponent } from './certification-question.component';

describe('CertificationQuestionComponent', () => {
  let component: CertificationQuestionComponent;
  let fixture: ComponentFixture<CertificationQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificationQuestionComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CertificationQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
