import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { HomeArticlesComponent } from '../../home/home-articles/home-articles.component';

@Component({
  selector: 'app-certification-articles',
  imports: [TranslatePipe,HomeArticlesComponent],
  templateUrl: './certification-articles.component.html',
  styleUrl: './certification-articles.component.scss'
})
export class CertificationArticlesComponent {

}
