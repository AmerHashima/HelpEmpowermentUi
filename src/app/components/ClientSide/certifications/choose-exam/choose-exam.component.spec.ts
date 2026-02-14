import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseExamComponent } from './choose-exam.component';

describe('ChooseExamComponent', () => {
  let component: ChooseExamComponent;
  let fixture: ComponentFixture<ChooseExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
