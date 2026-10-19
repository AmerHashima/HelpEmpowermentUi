import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import ApiService from '../shared/Services/ApiService/api.service';
import { ApiResponse, ApiSearchResponse } from '../models/apiResponse';
import { RequestBody } from '../models/rquest';
export type ArticleBlockType = 'main-header' | 'sub-header' | 'details' | 'bullet-list' | 'numbered-list' | 'image';
export interface ArticleBlock { type: ArticleBlockType; textEn?: string; textAr?: string; itemsEn: string[]; itemsAr: string[]; imagePath?: string; altEn?: string; altAr?: string; captionEn?: string; captionAr?: string; orderNo: number; }
export interface Article { oid?: string; category: string; courseCode?: string | null; slug: string; titleEn: string; titleAr: string; summaryEn?: string; summaryAr?: string; coverImagePath?: string; coverImageAltEn?: string; coverImageAltAr?: string; publishedAt?: string | null; readingTimeMinutes: number; status: 'Draft' | 'Published' | 'Archived'; isFeatured: boolean; blocks: ArticleBlock[]; }
export type ApiArticle = Required<Pick<Article, 'oid'>> & Article & { createdAt?: string; updatedAt?: string };
@Injectable({ providedIn: 'root' }) export class ArticleService {
  constructor(private api: ApiService) {}
  searchArticles(body: RequestBody): Observable<{ articles: ApiArticle[]; total: number }> { return this.api.query<ApiSearchResponse<ApiArticle>>('Articles/search', body).pipe(map(response => { if (!response.success) throw new Error(response.message || 'Failed to load articles'); return { articles: response.data ?? [], total: response.totalCount ?? 0 }; })); }
  getArticle(id: string): Observable<ApiArticle> { return this.api.getSingle<ApiResponse<ApiArticle>>('Articles', id).pipe(map(this.unwrap)); }
  getPublicArticle(category: string, slug: string): Observable<ApiArticle> { return this.api.get<ApiResponse<ApiArticle>>(`Articles/by-slug/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`).pipe(map(this.unwrap)); }
  createArticle(body: Article): Observable<ApiArticle> { return this.api.post<ApiResponse<ApiArticle>>('Articles', body, 'Article created successfully').pipe(map(this.unwrap)); }
  updateArticle(id: string, body: Article): Observable<ApiArticle> { return this.api.put<ApiResponse<ApiArticle>>('Articles', id, { ...body, oid: id }, 'Article updated successfully').pipe(map(this.unwrap)); }
  deleteArticle(id: string): Observable<boolean> { return this.api.delete<ApiResponse<boolean>>('Articles', id, 'Article deleted successfully').pipe(map(this.unwrap)); }
  uploadImage(file: File): Observable<string> { return this.api.uploadFile<{ fileName: string }>('Articles/images', file, 'image', '').pipe(map(x => x.fileName)); }
  imageUrl(path?: string): string { return !path ? '' : path.startsWith('assets/') || /^https?:/i.test(path) ? path : this.api.getFileUrl(`Articles/images/${path}`); }
  private unwrap = <T>(response: ApiResponse<T>): T => { if (!response.success || response.data == null) throw new Error(response.errors?.[0] || response.message || 'The request failed'); return response.data; };
}
