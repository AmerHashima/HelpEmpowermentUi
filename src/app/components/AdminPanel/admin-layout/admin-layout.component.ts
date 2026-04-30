// src\app\components\AdminPanel\admin-layout\admin-layout.component.ts
import { Component, inject, OnInit } from '@angular/core';
import ApiService from '../../../shared/Services/ApiService/api.service';
import { Main } from '../../main/main';
import { Navbar } from '../../../shared/Admin Panel/navbar/navbar';
import { SideNav } from '../../../shared/Admin Panel/side-nav/side-nav';
import { AuthService } from '../../../Services/auth.service';
import ApiStatusService from '../../../shared/Services/ApiService/api-status.service';
import { NetworkStatusComponent } from '../../ClentSide/shared/network-status/network-status.component';

@Component({
  selector: 'app-admin-layout',
  imports: [Main, Navbar, SideNav,NetworkStatusComponent],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
// export class AdminLayoutComponent implements OnInit {
export class AdminLayoutComponent  {
  private auth=inject(AuthService);
  apiStatus=inject(ApiStatusService);
  adminToken=this.auth.adminToken;

}
