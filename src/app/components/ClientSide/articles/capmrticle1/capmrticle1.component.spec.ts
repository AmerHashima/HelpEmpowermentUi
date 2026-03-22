import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Capmrticle1Component } from './capmrticle1.component';

describe('Capmrticle1Component', () => {
  let component: Capmrticle1Component;
  let fixture: ComponentFixture<Capmrticle1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Capmrticle1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Capmrticle1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
