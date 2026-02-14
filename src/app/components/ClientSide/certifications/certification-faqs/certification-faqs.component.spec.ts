import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationFaqsComponent } from './certification-faqs.component';

describe('CertificationFaqsComponent', () => {
  let component: CertificationFaqsComponent;
  let fixture: ComponentFixture<CertificationFaqsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificationFaqsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificationFaqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
