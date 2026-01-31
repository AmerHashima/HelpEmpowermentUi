// src\app\shared\Admin Panel\side-nav\side-nav-item\side-nav-item.ts
import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Shared } from '../../../Services/shared/shared';
import { Navitem } from '../../../../models/navitem';

interface parentNavItem {
  isCollapsed: boolean;
  navItemName: string;
  classes: string;
  route: string,
  subItems?: Navitem[];
}

@Component({
  selector: 'app-side-nav-item',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './side-nav-item.html',
  styleUrls: ['./side-nav-item.scss']
})
export class SideNavItem {
  private shared = inject(Shared);
  lang = this.shared.lang;
  NavitemComponentData = input<parentNavItem>({
    isCollapsed: false,
    navItemName: '',
    classes: '',
    route: '',
  });

  showSubnav = false;

  constructor(private __Router: Router) { }

  toggleSubnav() {
    if (this.NavitemComponentData()?.subItems?.length) {
      this.showSubnav = !this.showSubnav;
    }
  }
}
