import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturityAssessmentComponent } from './maturity-assessment.component';

describe('MaturityAssessmentComponent', () => {
  let component: MaturityAssessmentComponent;
  let fixture: ComponentFixture<MaturityAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaturityAssessmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaturityAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
