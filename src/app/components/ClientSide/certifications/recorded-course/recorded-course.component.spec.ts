import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordedCourseComponent } from './recorded-course.component';

describe('RecordedCourseComponent', () => {
  let component: RecordedCourseComponent;
  let fixture: ComponentFixture<RecordedCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordedCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordedCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
