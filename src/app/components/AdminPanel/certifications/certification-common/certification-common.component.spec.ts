import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationCommonComponent } from './certification-common.component';

describe('CertificationCommonComponent', () => {
  let component: CertificationCommonComponent;
  let fixture: ComponentFixture<CertificationCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificationCommonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificationCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
