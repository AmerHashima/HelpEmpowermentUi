import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoureseFeaturesComponent } from './courese-features.component';

describe('CoureseFeaturesComponent', () => {
  let component: CoureseFeaturesComponent;
  let fixture: ComponentFixture<CoureseFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoureseFeaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoureseFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
