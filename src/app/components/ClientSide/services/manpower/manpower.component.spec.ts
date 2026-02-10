import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManpowerComponent } from './manpower.component';

describe('ManpowerComponent', () => {
  let component: ManpowerComponent;
  let fixture: ComponentFixture<ManpowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManpowerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManpowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
