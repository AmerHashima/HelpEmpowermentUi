import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollFormComponent } from './enroll-form.component';

describe('EnrollFormComponent', () => {
  let component: EnrollFormComponent;
  let fixture: ComponentFixture<EnrollFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
