import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewExamComponent } from './create-new-exam.component';

describe('CreateNewExamComponent', () => {
  let component: CreateNewExamComponent;
  let fixture: ComponentFixture<CreateNewExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
