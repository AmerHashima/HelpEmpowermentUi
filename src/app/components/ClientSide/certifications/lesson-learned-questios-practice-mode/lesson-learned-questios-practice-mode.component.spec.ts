import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonLearnedQUestiosPracticeModeComponent } from './lesson-learned-questios-practice-mode.component';

describe('LessonLearnedQUestiosPracticeModeComponent', () => {
  let component: LessonLearnedQUestiosPracticeModeComponent;
  let fixture: ComponentFixture<LessonLearnedQUestiosPracticeModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonLearnedQUestiosPracticeModeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonLearnedQUestiosPracticeModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
