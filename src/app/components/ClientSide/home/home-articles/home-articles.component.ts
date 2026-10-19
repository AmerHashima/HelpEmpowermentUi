import { isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, input, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { ArticleService, ApiArticle } from '../../../../Services/article.service';
import { Shared } from '../../../../shared/Services/shared/shared';
import { ArticleCardComponent } from '../../../../shared/clientSide/article-card/article-card.component';

@Component({ selector: 'app-home-articles', standalone: true, imports: [ArticleCardComponent, TranslatePipe, TranslateModule], templateUrl: './home-articles.component.html', styleUrl: './home-articles.component.scss' })
export class HomeArticlesComponent implements OnInit, OnDestroy {
  private shared = inject(Shared); private router = inject(Router); private service = inject(ArticleService); private platformId = inject(PLATFORM_ID);
  type = input<string>('home'); isRTL = this.shared.isRtl; currentCertification = this.shared.currentCertificate;
  articles = signal<ApiArticle[]>([]); startIndex = signal(0); visibleCount = signal(3); private interval?: ReturnType<typeof setInterval>;
  articlesData = computed(() => { const course = this.currentCertification()?.toUpperCase(); const source = this.articles(); const scoped = course ? source.filter(x => x.courseCode?.toUpperCase() === course || x.category.toUpperCase() === course) : source; return this.type() === 'home' && !course ? scoped.slice(0, 6) : scoped; });
  visibleArticles = computed(() => this.articlesData().slice(this.startIndex(), this.startIndex() + this.visibleCount()));
  canGoPrev = computed(() => this.startIndex() > 0); canGoNext = computed(() => this.startIndex() < this.articlesData().length - this.visibleCount());
  ngOnInit() { this.service.searchArticles({ filters: [], sort: [{ sortBy: 'publishedAt', sortDirection: 'desc' }], pagination: { getAll: true, pageNumber: 1, pageSize: 100 }, columns: [] }).subscribe({ next: x => { this.articles.set(x.articles); this.startAutoSlide(); } }); }
  image(article: ApiArticle) { return this.service.imageUrl(article.coverImagePath); }
  title(article: ApiArticle) { return this.isRTL() ? article.titleAr : article.titleEn; }
  summary(article: ApiArticle) { return this.isRTL() ? article.summaryAr || '' : article.summaryEn || ''; }
  alt(article: ApiArticle) { return this.isRTL() ? article.coverImageAltAr || article.titleAr : article.coverImageAltEn || article.titleEn; }
  date(article: ApiArticle) { const value = article.publishedAt || article.createdAt; return value ? new Intl.DateTimeFormat(this.isRTL() ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value)) : ''; }
  onArticleClick(article: ApiArticle) { this.router.navigate(['/', this.shared.lang(), 'articles', article.category, article.slug]); }
  next() { this.stopAutoSlide(); if (this.canGoNext()) this.startIndex.update(x => x + 1); } prev() { this.stopAutoSlide(); if (this.canGoPrev()) this.startIndex.update(x => x - 1); }
  startAutoSlide() { if (!isPlatformBrowser(this.platformId) || this.interval) return; this.interval = setInterval(() => { const max = this.articlesData().length - this.visibleCount(); this.startIndex.update(x => x >= max ? 0 : x + 1); }, 4000); }
  stopAutoSlide() { if (this.interval) clearInterval(this.interval); this.interval = undefined; }
  ngOnDestroy() { this.stopAutoSlide(); }
}
