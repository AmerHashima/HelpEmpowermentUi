import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationOutlinesComponent } from './certification-outlines.component';

describe('CertificationOutlinesComponent', () => {
  let component: CertificationOutlinesComponent;
  let fixture: ComponentFixture<CertificationOutlinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificationOutlinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificationOutlinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
