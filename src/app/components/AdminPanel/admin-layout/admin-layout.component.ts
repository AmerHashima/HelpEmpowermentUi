// src\app\components\AdminPanel\admin-layout\admin-layout.component.ts
import { Component, OnInit } from '@angular/core';
import ApiService from '../../../shared/Services/ApiService/api.service';
import { Main } from '../../main/main';
import { Navbar } from '../../../shared/Admin Panel/navbar/navbar';
import { SideNav } from '../../../shared/Admin Panel/side-nav/side-nav';

@Component({
  selector: 'app-admin-layout',
  imports: [Main, Navbar, SideNav],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
// export class AdminLayoutComponent implements OnInit {
export class AdminLayoutComponent  {
}
