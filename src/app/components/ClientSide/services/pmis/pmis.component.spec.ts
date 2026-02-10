import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PMISComponent } from './pmis.component';

describe('PMISComponent', () => {
  let component: PMISComponent;
  let fixture: ComponentFixture<PMISComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PMISComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PMISComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
