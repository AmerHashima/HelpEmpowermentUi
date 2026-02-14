import { Component, Input } from '@angular/core';
import {  RouterModule } from '@angular/router';
export interface TabItem {
  header: string;
  icon?: string;
  route: string;
}
@Component({
  selector: 'app-generic-tabs',
  imports: [RouterModule],
  templateUrl: './generic-tabs.component.html',
  styleUrl: './generic-tabs.component.scss'
})
export class GenericTabsComponent {
  @Input() tabs: TabItem[] = [];
}
