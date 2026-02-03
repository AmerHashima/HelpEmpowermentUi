import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationsFeaturesComponent } from './certifications-features.component';

describe('CertificationsFeaturesComponent', () => {
  let component: CertificationsFeaturesComponent;
  let fixture: ComponentFixture<CertificationsFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificationsFeaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificationsFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
