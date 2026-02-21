import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalSupportPolicyComponent } from './technical-support-policy.component';

describe('TechnicalSupportPolicyComponent', () => {
  let component: TechnicalSupportPolicyComponent;
  let fixture: ComponentFixture<TechnicalSupportPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalSupportPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalSupportPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
