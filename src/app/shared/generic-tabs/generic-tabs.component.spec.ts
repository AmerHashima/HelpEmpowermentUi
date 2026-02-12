import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTabsComponent } from './generic-tabs.component';

describe('GenericTabsComponent', () => {
  let component: GenericTabsComponent;
  let fixture: ComponentFixture<GenericTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
