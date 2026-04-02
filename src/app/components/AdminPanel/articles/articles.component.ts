import { Component, effect, inject, signal } from '@angular/core';
import { ArticleCardComponent } from '../../../shared/clientSide/article-card/article-card.component';
import { ArticleFormComponent } from './article-form/article-form.component';
import { ApiArticle, ArticleService } from '../../../Services/article.service';
import { BreadcrumbService } from '../../../Services/breadcrumb.service';
import { RequestBody } from '../../../models/rquest';
import { Shared } from '../../../shared/Services/shared/shared';
import { ButtonComponent } from '../../../shared/button/button.component';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastingMessagesService } from '../../../shared/Services/ToastingMessages/toasting-messages.service';

@Component({
  selector: 'app-articles',
  imports: [ArticleCardComponent,ArticleFormComponent,ButtonComponent,NgFor,
    NgIf,ReactiveFormsModule,FormsModule
  ],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent {
  private articleService = inject(ArticleService);
  private breadcrumbService = inject(BreadcrumbService);
  private toasting = inject(ToastingMessagesService);
  private shared = inject(Shared);
  isRTL=this.shared.isRtl;
  articles = signal<ApiArticle[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  searchText = '';
  isArticlePopupOpen = signal(false);
  editingArticleId = signal<string | null>(null);
  pageIndex = signal(0);
  pageSize = signal(10);
  totalCount = signal(0);

  constructor() {
    effect(() => {
      this.breadcrumbService.setBreadcrumbs([
        { label: 'Admin', url: '/admin' },
        { label: 'Articles', url: '/admin/articles' }
      ]);
    });

    effect(() => {
      const error=this.errorMessage();
       this.toasting.showToast(error,'error');
    });

    this.loadArticles();
  }

  openCreatePopup(): void {
    this.editingArticleId.set(null);
    this.isArticlePopupOpen.set(true);
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Admin', url: '/admin' },
      { label: 'Articles', url: '/admin/articles' },
      { label: 'Add', url: '' }
    ]);
  }

  onSearch(): void {
    this.pageIndex.set(0);
    this.loadArticles();
  }


  nextPage(): void {
    if (!this.canGoNext()) return;
    this.pageIndex.update((value) => value + 1);
    this.loadArticles();
  }

  previousPage(): void {
    if (!this.canGoPrevious()) return;
    this.pageIndex.update((value) => value - 1);
    this.loadArticles();
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const size = Number(target.value);

    if (!Number.isFinite(size) || size <= 0) return;
    this.pageSize.set(size);
    this.pageIndex.set(0);
    this.loadArticles();
  }

  openEditPopup(article:ApiArticle): void {
    const id = article.oid;
    this.editingArticleId.set(id);
    this.isArticlePopupOpen.set(true);
  }

  closeArticlePopup(): void {
    this.isArticlePopupOpen.set(false);
    this.editingArticleId.set(null);
  }

  onArticleSaved(): void {
    this.closeArticlePopup();
    this.loadArticles();
  }



  removeArticle(id: string): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.articleService.deleteArticle(id).subscribe({
      next: () => {
        const currentCount = this.articles().length;
        if (currentCount <= 1 && this.pageIndex() > 0) {
          this.pageIndex.update((value) => value - 1);
        }
        this.loadArticles();
      },
      error: (error: unknown) => {
        const message = error instanceof Error ? error.message : 'Failed to delete article';
        this.errorMessage.set(message);
        this.articles.set([]);

        this.loading.set(false);
      }
    });
  }

  loadArticles(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.articleService.searchArticles(this.buildSearchRequest()).subscribe({
      next: ({ articles, total }) => {
        this.articles.set(articles);
        this.totalCount.set(total);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        const message = error instanceof Error ? error.message : 'Failed to load articles';
        this.errorMessage.set(message);
        this.articles.set([]);
        this.totalCount.set(0);
        this.loading.set(false);
      }
    });
  }

  totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount() / this.pageSize()));
  }

  displayPageNumber(): number {
    return this.pageIndex() + 1;
  }

  canGoPrevious(): boolean {
    return this.pageIndex() > 0;
  }

  canGoNext(): boolean {
    return this.displayPageNumber() < this.totalPages();
  }

  private buildSearchRequest(): RequestBody {
    const hasSearch = this.searchText.trim().length > 0;

    return {
      filters: hasSearch
        ? [
          {
            propertyName: 'title',
            value: this.searchText.trim(),
            operation: 0
          }
        ]
        : [],
      sort: [
        {
          sortBy: 'createdAt',
          sortDirection: 'desc'
        }
      ],
      pagination: {
        getAll: false,
        pageNumber: this.pageIndex(),
        pageSize: this.pageSize()
      },
      columns: ['oid', 'nameEn', 'nameAr', 'email', 'mobile', 'username', 'isActive', 'courses']
    };
  }
}
