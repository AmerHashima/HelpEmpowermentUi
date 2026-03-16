// src\app\app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
// export class AppComponent implements OnInit {
export class AppComponent {

  title = 'Help Empowerment';
  // loading$;

  // constructor(private loadingService: LoadingService) {
  //   this.loading$ = this.loadingService.loading$;
  // }


}
