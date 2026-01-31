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
  styleUrls: ['./admin-layout.component.scss'] // ✅ يجب أن تكون styleUrls
})
export class AdminLayoutComponent implements OnInit {
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadHeaders();
  }

  private loadHeaders(): void {
    const body = {
      filters: [],
      sort: [],
      pagination: {
        getAll: true,
        pageNumber: 1,
        pageSize: 10
      },
      columns: []
    };

    this.apiService.get<any>('WeatherForecast').subscribe({
      next: (response) => console.log('headers search response', response),
      error: (error) => console.error('headers search error', error)
    });
  }
}
