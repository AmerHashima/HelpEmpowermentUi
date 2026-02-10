import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampComponent } from './camp.component';

describe('CampComponent', () => {
  let component: CampComponent;
  let fixture: ComponentFixture<CampComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
