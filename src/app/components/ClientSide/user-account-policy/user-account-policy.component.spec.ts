import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountPolicyComponent } from './user-account-policy.component';

describe('UserAccountPolicyComponent', () => {
  let component: UserAccountPolicyComponent;
  let fixture: ComponentFixture<UserAccountPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAccountPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAccountPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
