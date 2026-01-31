// src\app\components\AdminPanel\create-new-certification\create-new-certification.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewCertificationComponent } from './create-new-certification.component';

describe('CreateNewCertificationComponent', () => {
  let component: CreateNewCertificationComponent;
  let fixture: ComponentFixture<CreateNewCertificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewCertificationComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreateNewCertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
