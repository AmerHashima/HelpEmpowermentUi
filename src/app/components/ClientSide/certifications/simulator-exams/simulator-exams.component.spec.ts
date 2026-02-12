import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatorExamsComponent } from './simulator-exams.component';

describe('SimulatorExamsComponent', () => {
  let component: SimulatorExamsComponent;
  let fixture: ComponentFixture<SimulatorExamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulatorExamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulatorExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
