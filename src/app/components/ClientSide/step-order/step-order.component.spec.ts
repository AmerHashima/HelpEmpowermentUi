import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepOrderComponent } from './step-order.component';

describe('StepOrderComponent', () => {
  let component: StepOrderComponent;
  let fixture: ComponentFixture<StepOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
