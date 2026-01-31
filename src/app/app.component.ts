// src\app\app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import ApiService from './shared/Services/ApiService/api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Help Empowerment';
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
