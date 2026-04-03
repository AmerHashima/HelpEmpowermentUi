import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordOTPComponent } from './reset-password-otp.component';

describe('ResetPasswordOTPComponent', () => {
  let component: ResetPasswordOTPComponent;
  let fixture: ComponentFixture<ResetPasswordOTPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordOTPComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPasswordOTPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
