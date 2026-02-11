import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTitleComponent } from './service-title.component';

describe('ServiceTitleComponent', () => {
  let component: ServiceTitleComponent;
  let fixture: ComponentFixture<ServiceTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
