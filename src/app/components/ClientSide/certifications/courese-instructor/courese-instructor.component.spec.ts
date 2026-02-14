import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoureseInstructorComponent } from './courese-instructor.component';

describe('CoureseInstructorComponent', () => {
  let component: CoureseInstructorComponent;
  let fixture: ComponentFixture<CoureseInstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoureseInstructorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoureseInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
