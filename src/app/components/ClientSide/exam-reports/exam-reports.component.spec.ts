import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamReportsComponent } from './exam-reports.component';

describe('ExamReportsComponent', () => {
  let component: ExamReportsComponent;
  let fixture: ComponentFixture<ExamReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
