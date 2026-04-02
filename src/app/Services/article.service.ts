import { Injectable } from '@angular/core';
import ApiService from '../shared/Services/ApiService/api.service';
import { RequestBody } from '../models/rquest';
import { map, Observable } from 'rxjs';
import { ApiResponse, ApiSearchResponse } from '../models/apiResponse';


export interface Article {
  oid?:string,
  category: string;
  imgSrc: string,
  imgAlt: string,
  slug: string;
  description:{
    en: string;
    ar: string;
  }
  title: {
    en: string;
    ar: string;
  };
  publishTime:string,
  createdAt:string,
  sections: ArticleSection[];
}

export interface ApiArticle {
  oid: string,
  imgSrc:string,
  imgAlt: string,
  category: string;
  slug: string;
  description: {
    en: string;
    ar: string;
  };
  title: {
    en: string;
    ar: string;
  };
  publishTime: string,
  createdAt: string,
  sections: ArticleSection[];
}
export interface ArticleSection {
  type: 'content' | 'image' | 'list' | 'title';
  content?: { en: string[]; ar: string[] };
  title?: { en: string; ar: string };
  list?: { en: string[]; ar: string[] };
  image?: string;
  imageAlt?: string;
}
@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private apiService:ApiService) { }

  searchArticles(body: RequestBody): Observable<{ articles: ApiArticle[]; total: number }> {
      return this.apiService
        .query<ApiSearchResponse<ApiArticle>>('Articles/search', body)
        .pipe(
          map((response: ApiSearchResponse<ApiArticle>) => {
            if (!response.success) {
              const msg = response.message || 'API failed to query students';
              throw new Error(msg);
            }
            return {
              articles: response.data ?? [],
              total: response.totalCount ?? 0,
            };
          })
        );
    }

  createArticle(body: Article): Observable<ApiArticle> {
      return this.apiService
        .post<ApiResponse<ApiArticle>>('Articles', body, "article.register.success")
        .pipe(
          map((response: ApiResponse<ApiArticle>) => {
            if (!response.success) {
              const msg = response.errors?.join(', ') || response.message || 'API failed to create article';
              throw new Error(msg);
            }
            return response.data;
          })
        );
    }
  updateArticle(id: string, body: Article): Observable<ApiArticle> {
    const updateBody: Article = {
        ...body,
        oid: id,
      };

      return this.apiService
        .put<ApiResponse<ApiArticle>>('Articles', id, updateBody, 'article.update.success')
        .pipe(
          map((response: ApiResponse<ApiArticle>) => {
            if (!response.success) {
              const msg = response.errors?.join(', ') || response.message || 'API failed to update article';
              throw new Error(msg);
            }
            return response.data;
          })
        );
    }

    deleteArticle(id: string): Observable<boolean> {
      return this.apiService
        .delete<ApiResponse<boolean>>('Articles', id)
        .pipe(
          map((response: ApiResponse<boolean>) => {
            if (!response.success) {
              const msg = response.errors?.join(', ') || response.message || 'API failed to delete article';
              throw new Error(msg);
            }
            return response.data;
          })
        );
    }

  getArticle(id: string): Observable<ApiArticle> {
      return this.apiService
        .getSingle<ApiResponse<ApiArticle>>('Articles', id)
        .pipe(
          map((response: ApiResponse<ApiArticle>) => {
            if (!response.success) {
              const msg = response.errors?.join(', ') || response.message || 'API failed to load article';
              throw new Error(msg);
            }
            return response.data;
          })
        );
    }

}
