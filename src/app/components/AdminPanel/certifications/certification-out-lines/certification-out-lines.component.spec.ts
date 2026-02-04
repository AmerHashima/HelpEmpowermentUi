import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationOutLinesComponent } from './certification-out-lines.component';

describe('CertificationOutLinesComponent', () => {
  let component: CertificationOutLinesComponent;
  let fixture: ComponentFixture<CertificationOutLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificationOutLinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificationOutLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
