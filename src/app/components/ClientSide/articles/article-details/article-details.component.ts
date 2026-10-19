import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleBlock, ApiArticle, ArticleService } from '../../../../Services/article.service';
import { Shared } from '../../../../shared/Services/shared/shared';
@Component({ selector: 'app-article-details', imports: [NgFor, NgIf, DatePipe], templateUrl: './article-details.component.html', styleUrl: './article-details.component.scss' })
export class ArticleDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute); private router = inject(Router); private service = inject(ArticleService); private shared = inject(Shared);
  article?: ApiArticle; currentLang = this.shared.lang;
  ngOnInit() { const category = this.route.snapshot.paramMap.get('category'); const slug = this.route.snapshot.paramMap.get('slug'); if (!category || !slug) return; this.service.getPublicArticle(category, slug).subscribe({ next: x => this.article = x, error: () => this.router.navigate(['/', this.shared.lang(), 'articles']) }); }
  text(block: ArticleBlock) { return this.currentLang() === 'ar' ? block.textAr : block.textEn; }
  items(block: ArticleBlock) { return this.currentLang() === 'ar' ? block.itemsAr : block.itemsEn; }
  image(path?: string) { return this.service.imageUrl(path); }
}
