// src\translate-loader.ts
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslateLoader } from '@ngx-translate/core';

class CustomTranslateLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    private prefix: string = './assets/i18n/',
    private suffix: string = '.json'
  ) { }

  getTranslation(lang: string): Observable<any> {
    return this.http.get(`${this.prefix}${lang}${this.suffix}`);
  }
}

export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return new CustomTranslateLoader(http);
}
