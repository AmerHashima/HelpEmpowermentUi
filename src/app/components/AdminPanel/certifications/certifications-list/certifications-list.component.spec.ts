import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationsListComponent } from './certifications-list.component';

describe('CertificationsListComponent', () => {
  let component: CertificationsListComponent;
  let fixture: ComponentFixture<CertificationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificationsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
