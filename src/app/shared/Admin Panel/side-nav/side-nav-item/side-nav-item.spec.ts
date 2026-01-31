// src\app\shared\Admin Panel\side-nav\side-nav-item\side-nav-item.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavItem } from './side-nav-item';

describe('SideNavItem', () => {
  let component: SideNavItem;
  let fixture: ComponentFixture<SideNavItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideNavItem]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SideNavItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
