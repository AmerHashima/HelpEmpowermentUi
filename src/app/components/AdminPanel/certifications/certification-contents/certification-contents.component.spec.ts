import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationContentsComponent } from './certification-contents.component';

describe('CertificationContentsComponent', () => {
  let component: CertificationContentsComponent;
  let fixture: ComponentFixture<CertificationContentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificationContentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificationContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
