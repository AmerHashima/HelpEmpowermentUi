import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeExamComponent } from './free-exam.component';

describe('FreeExamComponent', () => {
  let component: FreeExamComponent;
  let fixture: ComponentFixture<FreeExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreeExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreeExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
