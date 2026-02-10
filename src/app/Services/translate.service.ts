// src\app\Services\translate.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LibreTranslateService {
    private apiUrl = 'https://libretranslate.de/translate';

    constructor(private http: HttpClient) { }

    translateEnToAr(text: string) {
        return this.http.post<any>(this.apiUrl, {
            q: text,
            source: 'en',
            target: 'ar',
            format: 'text'
        });
    }
}
