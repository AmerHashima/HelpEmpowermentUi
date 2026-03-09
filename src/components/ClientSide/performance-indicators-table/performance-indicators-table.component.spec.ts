import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceIndicatorsTableComponent } from './performance-indicators-table.component';

describe('PerformanceIndicatorsTableComponent', () => {
  let component: PerformanceIndicatorsTableComponent;
  let fixture: ComponentFixture<PerformanceIndicatorsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceIndicatorsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceIndicatorsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
