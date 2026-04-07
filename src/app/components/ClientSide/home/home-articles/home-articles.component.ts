// // src\app\components\ClientSide\home\home-articles\home-articles.component.ts

// import { Component, computed, inject, input } from '@angular/core';
// import { Shared } from '../../../../shared/Services/shared/shared';
// import { ArticleCardComponent } from '../../../../shared/clientSide/article-card/article-card.component';
// import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
// import { ActivatedRoute, Router } from '@angular/router';
// export interface ArticleItem {
//   category:string,
//   slug:string,
//   imgAlt: string;
//   imgSrc: string;
//   date: string;
//   publishTime: string;
//   title: string;
//   description: string;
// }

// export const articles: ArticleItem[] = [
//     {
//     category: 'capm',
//     slug: 'capm-study-plan',
//     imgAlt: 'Article 1 image',
//     imgSrc: 'assets/images/homeArticles/article1.jpeg',
//     date: 'articles.published.march_2025',
//     publishTime: 'articles.read_time.8_min',
//     title: 'articles.article4.title',
//     description: 'articles.article4.summary',
//   },
//   {
//     category: 'pmp',
//     slug: 'pmp-study-plan',
//     imgAlt: 'Article 2 image',
//     imgSrc: 'assets/images/homeArticles/article2.jpeg',
//     date: 'articles.published.february_2025',
//     publishTime: 'articles.read_time.6_min',
//     title: 'articles.article2.title',
//     description: 'articles.article2.summary',
//   },
//   {
//     category: 'general',
//     slug: 'digital-transformation-failure',
//     imgAlt: 'Article 3 image',
//     imgSrc: 'assets/images/homeArticles/article3.png',
//     date: 'articles.published.february_2025',
//     publishTime: 'articles.read_time.6_min',
//     title: 'articles.article3.title',
//     description: 'articles.article3.summary',
//   },
//   {
//     category: 'capm',
//     slug: 'capm-application-process',
//     imgAlt: 'Article 1 image',
//     imgSrc: 'assets/images/homeArticles/article1.jpeg',
//     date: 'articles.published.march_2025',
//     publishTime: 'articles.read_time.8_min',
//     title: 'articles.article1.title',
//     description: 'articles.article1.summary',
//   }
// ];
// @Component({
//   selector: 'app-home-articles',
//   standalone: true,
//   imports: [ArticleCardComponent, TranslatePipe, TranslateModule],
//   templateUrl: './home-articles.component.html',
//   styleUrl: './home-articles.component.scss'
// })
// export class HomeArticlesComponent {
//   private shared = inject(Shared);
//   private router=inject(Router);

//   isRTL = this.shared.isRtl;
//   currentCertification = this.shared.currentCertificate;
//   type = input<string>('home');

//   articlesData = computed(() => {
//     let displayedArticles:any=[];
//     if (!this.currentCertification() && this.type()=='home')
//       return articles.slice(0, 3);
//     if (!this.currentCertification() && this.type() != 'home')
//       return articles;
//         else if (this.currentCertification() == 'capm')
//       return articles.filter(article => article.category == 'capm');

//     else if (this.currentCertification() == 'pmp')
//       return  articles.filter(article => article.category == 'pmp');

//     return [];
//   })


//   private readonly articleImages = [
//     'assets/images/homeArticles/article1.jpeg',
//     'assets/images/homeArticles/article2.jpeg',
//     'assets/images/homeArticles/article3.png',
//   ];

//   getImageSrc(index: number): string {
//     return this.articleImages[index % this.articleImages.length];
//   }

//   onArticleClick(article: ArticleItem,index:number) {
//     this.router.navigate([
//       '/',
//       this.shared.lang(),
//       'articles',
//       article.category,
//       article.slug
//     ]);
//   }
// }


import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID, signal } from '@angular/core';
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
    slug: 'capm-study-plan',
    imgAlt: 'Article 1 image',
    imgSrc: 'assets/images/homeArticles/article1.jpeg',
    date: 'articles.published.march_2025',
    publishTime: 'articles.read_time.8_min',
    title: 'articles.article4.title',
    description: 'articles.article4.summary',
  },
  {
    category: 'pmp',
    slug: 'pmp-study-plan',
    imgAlt: 'Article 2 image',
    imgSrc: 'assets/images/homeArticles/article2.jpeg',
    date: 'articles.published.february_2025',
    publishTime: 'articles.read_time.6_min',
    title: 'articles.article2.title',
    description: 'articles.article2.summary',
  },
  {
    category: 'general',
    slug: 'digital-transformation-failure',
    imgAlt: 'Article 3 image',
    imgSrc: 'assets/images/homeArticles/article3.png',
    date: 'articles.published.february_2025',
    publishTime: 'articles.read_time.6_min',
    title: 'articles.article3.title',
    description: 'articles.article3.summary',
  },
  {
    category: 'capm',
    slug: 'capm-application-process',
    imgAlt: 'Article 1 image',
    imgSrc: 'assets/images/homeArticles/article1.jpeg',
    date: 'articles.published.march_2025',
    publishTime: 'articles.read_time.8_min',
    title: 'articles.article1.title',
    description: 'articles.article1.summary',
  }
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
  private router = inject(Router);

  private autoSlideInterval: any;


  isRTL = this.shared.isRtl;
  currentCertification = this.shared.currentCertificate;
  type = input<string>('home');

  // 👇 slider state
  visibleCount = signal(3);
  startIndex = signal(0);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.updateVisibleCount();
      window.addEventListener('resize', () => this.updateVisibleCount());
    }
  }
  ngOnInit() {
    if (this.type() === 'home' && !this.currentCertification() && isPlatformBrowser(this.platformId)) {
      this.startAutoSlide();
    }
  }


  updateVisibleCount() {
    const width = window.innerWidth;

    if (width < 768) this.visibleCount.set(1);
    else if (width < 992) this.visibleCount.set(2);
    else this.visibleCount.set(3);
  }

  // 👇 original data logic
  articlesData = computed(() => {
    if (!this.currentCertification() && this.type() == 'home')
      return articles;

    if (!this.currentCertification() && this.type() != 'home')
      return articles;

    else if (this.currentCertification() == 'capm')
      return articles.filter(a => a.category == 'capm');

    else if (this.currentCertification() == 'pmp')
      return articles.filter(a => a.category == 'pmp');

    return [];
  });

  // 👇 visible items (carousel)
  visibleArticles = computed(() => {
    const all = this.articlesData();
    const start = this.startIndex();
    const count = this.visibleCount();
    return all.slice(start, start + count);
  });

  canGoPrev = computed(() => this.startIndex() > 0);

  canGoNext = computed(() => {
    return this.startIndex() < this.articlesData().length - this.visibleCount();
  });

  startAutoSlide() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.stopAutoSlide();

    this.autoSlideInterval = setInterval(() => {
      this.nextAuto();
    }, 4000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  // 👇 auto loop (infinite)
  nextAuto() {
    const max = this.articlesData().length;
    const visible = this.visibleCount();

    if (max <= visible) return;

    this.startIndex.update(v => {
      if (v >= max - visible) return 0;
      return v + 1;
    });
  }

  // 👇 لما user يضغط arrows
  next() {
    this.stopAutoSlide();
    if (this.canGoNext()) this.startIndex.update(v => v + 1);
  }

  prev() {
    this.stopAutoSlide();
    if (this.canGoPrev()) this.startIndex.update(v => v - 1);
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }


  // next() {
  //   const max = this.articlesData().length;
  //   this.startIndex.update(v => (v + 1) % max);
  // }

  // prev() {
  //   const max = this.articlesData().length;
  //   this.startIndex.update(v => (v - 1 + max) % max);
  // }

  onArticleClick(article: ArticleItem, index: number) {
    this.router.navigate([
      '/',
      this.shared.lang(),
      'articles',
      article.category,
      article.slug
    ]);
  }
}
