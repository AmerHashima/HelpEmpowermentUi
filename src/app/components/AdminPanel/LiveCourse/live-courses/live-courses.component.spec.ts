import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveCoursesComponent } from './live-courses.component';

describe('LiveCoursesComponent', () => {
  let component: LiveCoursesComponent;
  let fixture: ComponentFixture<LiveCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveCoursesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
