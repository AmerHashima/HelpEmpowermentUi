import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveCourseFormComponent } from './live-course-form.component';

describe('LiveCourseFormComponent', () => {
  let component: LiveCourseFormComponent;
  let fixture: ComponentFixture<LiveCourseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveCourseFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveCourseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
