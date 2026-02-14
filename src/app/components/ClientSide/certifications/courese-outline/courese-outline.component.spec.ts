import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoureseOutlineComponent } from './courese-outline.component';

describe('CoureseOutlineComponent', () => {
  let component: CoureseOutlineComponent;
  let fixture: ComponentFixture<CoureseOutlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoureseOutlineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoureseOutlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
