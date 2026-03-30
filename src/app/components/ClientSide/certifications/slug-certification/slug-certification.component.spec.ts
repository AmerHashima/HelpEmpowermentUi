import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlugCertificationComponent } from './slug-certification.component';

describe('SlugCertificationComponent', () => {
  let component: SlugCertificationComponent;
  let fixture: ComponentFixture<SlugCertificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlugCertificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlugCertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
