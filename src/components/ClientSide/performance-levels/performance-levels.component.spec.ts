import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceLevelsComponent } from './performance-levels.component';

describe('PerformanceLevelsComponent', () => {
  let component: PerformanceLevelsComponent;
  let fixture: ComponentFixture<PerformanceLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceLevelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
