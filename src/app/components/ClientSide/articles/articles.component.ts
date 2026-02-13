// src\app\components\articles\articles.component.ts
import { Component } from '@angular/core';
import { HomeArticlesComponent } from '../home/home-articles/home-articles.component';

@Component({
  selector: 'app-articles',
  imports: [HomeArticlesComponent],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent {

}
