import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiTableQuestionsComponent } from './multi-table-questions.component';

describe('MultiTableQuestionsComponent', () => {
  let component: MultiTableQuestionsComponent;
  let fixture: ComponentFixture<MultiTableQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiTableQuestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiTableQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
