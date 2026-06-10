import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapmPerformaceTableComponent } from './capm-performace-table.component';

describe('CapmPerformaceTableComponent', () => {
  let component: CapmPerformaceTableComponent;
  let fixture: ComponentFixture<CapmPerformaceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapmPerformaceTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapmPerformaceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
