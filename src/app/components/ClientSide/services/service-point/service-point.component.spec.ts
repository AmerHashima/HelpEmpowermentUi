import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePointComponent } from './service-point.component';

describe('ServicePointComponent', () => {
  let component: ServicePointComponent;
  let fixture: ComponentFixture<ServicePointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicePointComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
