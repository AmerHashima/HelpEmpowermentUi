import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmoComponent } from './pmo.component';

describe('PmoComponent', () => {
  let component: PmoComponent;
  let fixture: ComponentFixture<PmoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PmoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
