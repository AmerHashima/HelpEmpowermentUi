// src\app\app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from './shared/Services/Loading/loading.service';
import { SpinnerComponent } from './shared/spinner/spinner.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,SpinnerComponent,AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
// export class AppComponent implements OnInit {
export class AppComponent {

  title = 'Help Empowerment';
  loading$;

  constructor(private loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }


}
