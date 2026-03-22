// src\app\components\ClientSide\home\home-articles\home-articles.component.ts

import { Component, computed, inject, input } from '@angular/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { ArticleCardComponent } from '../../../../shared/clientSide/article-card/article-card.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
export interface ArticleItem {
  category:string,
  slug:string,
  imgAlt: string;
  imgSrc: string;
  date: string;
  publishTime: string;
  title: string;
  description: string;
}

export const articles: ArticleItem[] = [
  {
    category: 'capm',
    slug: 'capm-application-process',
    imgAlt: 'Article 1 image',
    imgSrc: 'assets/images/homeArticles/article1.jpeg',
    date: 'articles.published.march_2025',
    publishTime: 'articles.read_time.8_min',
    title: 'articles.article1.title',
    description: 'articles.article1.summary',
  },
  {
    category: 'pmp',
    slug: 'pmp_study_plan',
    imgAlt: 'Article 2 image',
    imgSrc: 'assets/images/homeArticles/article2.jpeg',
    date: 'articles.published.february_2025',
    publishTime: 'articles.read_time.6_min',
    title: 'articles.article2.title',
    description: 'articles.article2.summary',
  },
  {
    category: 'capm',
    slug: 'capm_study_plan',
    imgAlt: 'Article 3 image',
    imgSrc: 'assets/images/homeArticles/article3.png',
    date: 'articles.published.february_2025',
    publishTime: 'articles.read_time.6_min',
    title: 'articles.article3.title',
    description: 'articles.article3.summary',
  },
];
@Component({
  selector: 'app-home-articles',
  standalone: true,
  imports: [ArticleCardComponent, TranslatePipe, TranslateModule],
  templateUrl: './home-articles.component.html',
  styleUrl: './home-articles.component.scss'
})
export class HomeArticlesComponent {
  private shared = inject(Shared);
  private router=inject(Router);

  isRTL = this.shared.isRtl;
  currentCertification = this.shared.currentCertificate;
  type = input<string>('home');

  articlesData = computed(() => {
    let displayedArticles:any=[];
    if (!this.currentCertification())
      return articles;
    else if (this.currentCertification() == 'capm')
      return articles.filter(article => article.category == 'capm');

    else if (this.currentCertification() == 'pmp')
      return  articles.filter(article => article.category == 'pmp');

    return [];
  })


  private readonly articleImages = [
    'assets/images/homeArticles/article1.jpeg',
    'assets/images/homeArticles/article2.jpeg',
    'assets/images/homeArticles/article3.png',
  ];

  getImageSrc(index: number): string {
    return this.articleImages[index % this.articleImages.length];
  }

  onArticleClick(article: ArticleItem,index:number) {
    this.router.navigate([
      '/',
      this.shared.lang(),
      'articles',
      article.category,
      article.slug
    ]);
  }
}
