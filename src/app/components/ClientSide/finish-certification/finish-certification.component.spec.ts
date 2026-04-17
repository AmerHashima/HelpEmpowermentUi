import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishCertificationComponent } from './finish-certification.component';

describe('FinishCertificationComponent', () => {
  let component: FinishCertificationComponent;
  let fixture: ComponentFixture<FinishCertificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinishCertificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishCertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
