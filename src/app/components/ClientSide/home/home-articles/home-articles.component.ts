// src\app\components\ClientSide\home\home-articles\home-articles.component.ts
import { Component, inject, input } from '@angular/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { ArticleCardComponent } from '../../../../shared/clientSide/article-card/article-card.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
export interface ArticleItem {
  imgAlt: string;
  date: string;
  publishTime: string;
  title: string;
  description: string;
}

export const articles: ArticleItem[] = [
  {
    imgAlt: 'Article 1 image',
    date: 'articles.published.march_2025',
    publishTime: 'articles.read_time.8_min',
    title: 'articles.article1.title',
    description: 'articles.article1.summary',
  },
  {
    imgAlt: 'Article 2 image',
    date: 'articles.published.february_2025',
    publishTime: 'articles.read_time.6_min',
    title: 'articles.article2.title',
    description: 'articles.article2.summary',
  },
  {
    imgAlt: 'Article 3 image',
    date: 'articles.published.february_2025',
    publishTime: 'articles.read_time.6_min',
    title: 'articles.article3.title',
    description: 'articles.article3.summary',
  },
];
@Component({
  selector: 'app-home-articles',
  standalone:true,
  imports: [ArticleCardComponent,TranslatePipe,TranslateModule],
  templateUrl: './home-articles.component.html',
  styleUrl: './home-articles.component.scss'
})
export class HomeArticlesComponent {
  private shared=inject(Shared);
  isRTL=this.shared.isRtl;
  articlesData = input<ArticleItem[]>(articles);

  // articlesData = toSignal(this.articleService.getArticles(), { initialValue: [] });

  private readonly articleImages = [
    'assets/images/certifications/certfication_1.jpeg',
    'assets/images/certifications/certfication_2.jpeg',
    'assets/images/certifications/certfication_1.jpeg',
  ];

  getImageSrc(index: number): string {
    return this.articleImages[index % this.articleImages.length];
  }

  onArticleClick(article: ArticleItem, index: number) {
    //console.log('Article clicked:', article.title, 'index:', index);
    // this.router.navigate(['/articles', article.slug || index]);
  }
}
