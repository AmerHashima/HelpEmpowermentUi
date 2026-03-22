import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Capmrticle2Component } from './capmrticle2.component';

describe('Capmrticle2Component', () => {
  let component: Capmrticle2Component;
  let fixture: ComponentFixture<Capmrticle2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Capmrticle2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Capmrticle2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
