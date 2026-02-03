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
// export class AppComponent implements OnInit {
export class AppComponent {

  title = 'Help Empowerment';
}
